package com.example.assettracker.service;

import com.example.assettracker.dto.CreateTicketRequest;
import com.example.assettracker.dto.TicketResponse;
import com.example.assettracker.dto.UpdateTicketRequest;
import com.example.assettracker.exception.ResourceNotFoundException;
import com.example.assettracker.model.Ticket;
import com.example.assettracker.repository.TicketRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TicketService {

    private static final Logger logger = LoggerFactory.getLogger(TicketService.class);

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public List<TicketResponse> getTickets(String status, String priority, String category) {
        logger.info("Fetching tickets with status={}, priority={}, category={}", status, priority, category);

        List<Ticket> tickets;

        if (status != null) {
            tickets = ticketRepository.findByStatusIgnoreCase(status);
        } else if (priority != null) {
            tickets = ticketRepository.findByPriorityIgnoreCase(priority);
        } else if (category != null) {
            tickets = ticketRepository.findByCategoryIgnoreCase(category);
        } else {
            tickets = ticketRepository.findAll();
        }

        logger.info("Found {} ticket(s)", tickets.size());

        return tickets.stream()
                .map(this::toResponse)
                .toList();
    }

    public Page<TicketResponse> getPagedTickets(int page, int size, String sortBy, String direction) {
        logger.info("Fetching paged tickets page={}, size={}, sortBy={}, direction={}", page, size, sortBy, direction);

        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        return ticketRepository.findAll(pageable)
                .map(this::toResponse);
    }

    public TicketResponse getTicketById(String id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket " + id + " was not found"));

        return toResponse(ticket);
    }

    public TicketResponse createTicket(CreateTicketRequest request) {
        Ticket ticket = new Ticket(
                request.getTitle().trim(),
                request.getDescription().trim(),
                request.getCategory().trim(),
                request.getPriority().trim(),
                "OPEN",
                request.getCreatedBy().trim(),
                LocalDate.now().toString()
        );

        Ticket savedTicket = ticketRepository.save(ticket);
        logger.info("Created ticket id={}, category={}, priority={}", savedTicket.getId(), savedTicket.getCategory(), savedTicket.getPriority());

        return toResponse(savedTicket);
    }

    public TicketResponse updateTicket(String id, UpdateTicketRequest request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket " + id + " was not found"));

        ticket.setTitle(request.getTitle().trim());
        ticket.setDescription(request.getDescription().trim());
        ticket.setCategory(request.getCategory().trim());
        ticket.setPriority(request.getPriority().trim());
        ticket.setStatus(request.getStatus().trim());

        Ticket updatedTicket = ticketRepository.save(ticket);
        logger.info("Updated ticket id={}, status={}, priority={}", updatedTicket.getId(), updatedTicket.getStatus(), updatedTicket.getPriority());

        return toResponse(updatedTicket);
    }

    private TicketResponse toResponse(Ticket ticket) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getCreatedBy(),
                ticket.getCreatedAt()
        );
    }
}
