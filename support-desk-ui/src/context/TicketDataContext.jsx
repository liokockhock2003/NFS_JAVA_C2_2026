import { createContext, useCallback, useContext, useMemo, useReducer, useRef } from 'react';
import { fetchPagedTickets, updateTicket } from '../services/api.js';
import { filterTickets } from '../utils/tickets.js';
import { useAuth } from './AuthContext.jsx';

const TicketDataContext = createContext(null);

const initialState = {
  tickets: [],
  selectedTicketId: '',
  loading: false,
  error: '',
  updatingId: '',
  pageInfo: {
    page: 0,
    size: 5,
    sortBy: 'createdAt',
    direction: 'desc',
    totalPages: 0,
    totalElements: 0
  },
  filters: {
    searchText: '',
    statusFilter: 'ALL'
  },
  cache: {},
  cacheMessage: 'No page loaded yet.'
};

function makeCacheKey(params) {
  return `${params.page}|${params.size}|${params.sortBy}|${params.direction}`;
}

function replaceTicket(tickets, updatedTicket) {
  return tickets.map((ticket) => (ticket.id === updatedTicket.id ? updatedTicket : ticket));
}

// Cached pages hold their own copies of the ticket, so they have to be
// patched too or a cache hit would show the pre-update status again.
function replaceTicketInCache(cache, updatedTicket) {
  const nextCache = {};

  Object.entries(cache).forEach(([key, pageData]) => {
    nextCache[key] = {
      ...pageData,
      content: replaceTicket(pageData.content ?? [], updatedTicket)
    };
  });

  return nextCache;
}

function toUpdatePayload(ticket) {
  return {
    title: ticket.title,
    description: ticket.description,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status
  };
}

function toPageInfo(data, params) {
  return {
    page: data.number ?? params.page,
    size: data.size ?? params.size,
    sortBy: params.sortBy,
    direction: params.direction,
    totalPages: data.totalPages ?? 0,
    totalElements: data.totalElements ?? 0
  };
}

function ticketReducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      // Apply the requested params immediately so the controls reflect the
      // pending request. Otherwise a second change reads stale values and
      // overwrites the first one.
      return {
        ...state,
        loading: true,
        error: '',
        pageInfo: { ...state.pageInfo, ...action.params },
        cacheMessage: 'Fetching from backend...'
      };

    case 'LOAD_SUCCESS': {
      const tickets = action.data.content ?? [];
      const selectedStillVisible = tickets.some((ticket) => ticket.id === state.selectedTicketId);
      const selectedTicketId = selectedStillVisible ? state.selectedTicketId : tickets[0]?.id ?? '';

      // A cache hit reuses what is already stored, so only a backend
      // response needs to be written into the cache.
      const cache = action.fromCache
        ? state.cache
        : { ...state.cache, [action.cacheKey]: action.data };

      return {
        ...state,
        tickets,
        selectedTicketId,
        loading: false,
        error: '',
        pageInfo: toPageInfo(action.data, action.params),
        cache,
        cacheMessage: action.fromCache ? 'Loaded from cache' : 'Fetched from backend'
      };
    }

    case 'LOAD_ERROR':
      return {
        ...state,
        loading: false,
        error: action.message,
        cacheMessage: 'Could not load data.'
      };

    case 'OPTIMISTIC_UPDATE':
      return {
        ...state,
        updatingId: action.ticket.id,
        error: '',
        tickets: replaceTicket(state.tickets, action.ticket),
        cache: replaceTicketInCache(state.cache, action.ticket)
      };

    case 'UPDATE_SUCCESS':
      return {
        ...state,
        updatingId: '',
        tickets: replaceTicket(state.tickets, action.ticket),
        cache: replaceTicketInCache(state.cache, action.ticket),
        cacheMessage: 'Optimistic update confirmed by backend'
      };

    case 'ROLLBACK_UPDATE':
      return {
        ...state,
        updatingId: '',
        tickets: replaceTicket(state.tickets, action.ticket),
        cache: replaceTicketInCache(state.cache, action.ticket),
        error: action.message,
        cacheMessage: 'Optimistic update rolled back'
      };

    case 'SET_SEARCH_TEXT':
      return {
        ...state,
        filters: { ...state.filters, searchText: action.value }
      };

    case 'SET_STATUS_FILTER':
      return {
        ...state,
        filters: { ...state.filters, statusFilter: action.value }
      };

    case 'SELECT_TICKET':
      return {
        ...state,
        selectedTicketId: action.ticketId
      };

    default:
      return state;
  }
}

export function TicketDataProvider({ children }) {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(ticketReducer, initialState);
  const requestIdRef = useRef(0);

  const loadTicketsPage = useCallback(async (overrides = {}) => {
    const params = {
      page: overrides.page ?? state.pageInfo.page,
      size: overrides.size ?? state.pageInfo.size,
      sortBy: overrides.sortBy ?? state.pageInfo.sortBy,
      direction: overrides.direction ?? state.pageInfo.direction
    };

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const cacheKey = makeCacheKey(params);
    const cachedPage = state.cache[cacheKey];

    if (cachedPage && !overrides.force) {
      dispatch({
        type: 'LOAD_SUCCESS',
        data: cachedPage,
        params,
        cacheKey,
        fromCache: true
      });
      return;
    }

    dispatch({ type: 'LOAD_START', params });

    try {
      const data = await fetchPagedTickets(token, params);

      // Ignore a slow response that a newer request has already superseded.
      if (requestId !== requestIdRef.current) {
        return;
      }

      dispatch({ type: 'LOAD_SUCCESS', data, params, cacheKey, fromCache: false });
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      dispatch({
        type: 'LOAD_ERROR',
        message: error.message || 'Could not load protected ticket data.'
      });
    }
  }, [state.cache, state.pageInfo, token]);

  const refreshTickets = useCallback(() => {
    return loadTicketsPage({ force: true });
  }, [loadTicketsPage]);

  const setSearchText = useCallback((value) => {
    dispatch({ type: 'SET_SEARCH_TEXT', value });
  }, []);

  const setStatusFilter = useCallback((value) => {
    dispatch({ type: 'SET_STATUS_FILTER', value });
  }, []);

  const selectTicket = useCallback((ticketId) => {
    dispatch({ type: 'SELECT_TICKET', ticketId });
  }, []);

  const changeTicketStatus = useCallback(async (ticketId, nextStatus) => {
    // 1. Keep the current ticket as the rollback backup.
    const backupTicket = state.tickets.find((ticket) => ticket.id === ticketId);

    if (!backupTicket || backupTicket.status === nextStatus) {
      return;
    }

    // 2. Update the UI immediately.
    const optimisticTicket = { ...backupTicket, status: nextStatus };
    dispatch({ type: 'OPTIMISTIC_UPDATE', ticket: optimisticTicket });

    try {
      // 3. Send the PUT request.
      const savedTicket = await updateTicket(ticketId, token, toUpdatePayload(optimisticTicket));

      // 4. Keep whatever the backend returned.
      dispatch({ type: 'UPDATE_SUCCESS', ticket: savedTicket });
    } catch (error) {
      // 5. Roll back to the backup ticket.
      dispatch({
        type: 'ROLLBACK_UPDATE',
        ticket: backupTicket,
        message: error.message || 'Could not update ticket status. Reverted local change.'
      });
    }
  }, [state.tickets, token]);

  const visibleTickets = useMemo(
    () => filterTickets(state.tickets, state.filters.searchText, state.filters.statusFilter),
    [state.tickets, state.filters]
  );

  const selectedTicket = useMemo(() => {
    return visibleTickets.find((ticket) => ticket.id === state.selectedTicketId) ?? visibleTickets[0] ?? null;
  }, [state.selectedTicketId, visibleTickets]);

  const value = useMemo(
    () => ({
      ...state,
      visibleTickets,
      selectedTicket,
      loadTicketsPage,
      refreshTickets,
      setSearchText,
      setStatusFilter,
      selectTicket,
      changeTicketStatus
    }),
    [state, visibleTickets, selectedTicket, loadTicketsPage, refreshTickets, setSearchText, setStatusFilter, selectTicket, changeTicketStatus]
  );

  return <TicketDataContext.Provider value={value}>{children}</TicketDataContext.Provider>;
}

export function useTicketData() {
  const value = useContext(TicketDataContext);

  if (!value) {
    throw new Error('useTicketData must be used inside TicketDataProvider');
  }

  return value;
}
