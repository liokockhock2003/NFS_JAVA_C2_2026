import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { fetchTickets } from '../services/api.js';
import { filterTickets } from '../utils/tickets.js';
import { useAuth } from './AuthContext.jsx';

const TicketDataContext = createContext(null);

const initialState = {
  tickets: [],
  selectedTicketId: '',
  loading: false,
  error: '',
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
  }
};

function ticketReducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        loading: true,
        error: ''
      };

    case 'LOAD_SUCCESS': {
      const tickets = action.tickets ?? [];
      const selectedStillVisible = tickets.some((ticket) => ticket.id === state.selectedTicketId);
      const selectedTicketId = selectedStillVisible ? state.selectedTicketId : tickets[0]?.id ?? '';

      return {
        ...state,
        tickets,
        selectedTicketId,
        loading: false,
        error: '',
        pageInfo: {
          ...state.pageInfo,
          totalElements: tickets.length
        }
      };
    }

    case 'LOAD_ERROR':
      return {
        ...state,
        loading: false,
        error: action.message
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

  const loadTickets = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });

    try {
      const tickets = await fetchTickets(token);
      dispatch({ type: 'LOAD_SUCCESS', tickets });
    } catch (error) {
      dispatch({
        type: 'LOAD_ERROR',
        message: error.message || 'Could not load protected ticket data.'
      });
    }
  }, [token]);

  const setSearchText = useCallback((value) => {
    dispatch({ type: 'SET_SEARCH_TEXT', value });
  }, []);

  const setStatusFilter = useCallback((value) => {
    dispatch({ type: 'SET_STATUS_FILTER', value });
  }, []);

  const selectTicket = useCallback((ticketId) => {
    dispatch({ type: 'SELECT_TICKET', ticketId });
  }, []);

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
      loadTickets,
      setSearchText,
      setStatusFilter,
      selectTicket
    }),
    [state, visibleTickets, selectedTicket, loadTickets, setSearchText, setStatusFilter, selectTicket]
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
