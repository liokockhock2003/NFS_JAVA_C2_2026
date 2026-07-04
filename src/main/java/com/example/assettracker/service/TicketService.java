package com.example.assettracker.service;

import java.util.ArrayList;
import java.util.List;

import com.example.assettracker.dto.CreateTicketRequest;
import com.example.assettracker.dto.TicketResponse;
import com.example.assettracker.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class TicketService {
    private final List<TicketResponse> tickets = new ArrayList<>();

    public TicketService() {
        tickets.add(new TicketResponse(
                "T001",
                "Cannot access email",
                "User cannot login to company email account.",
                "Email",
                "HIGH",
                "OPEN",
                "amir@example.com",
                "2026-07-03"));

        tickets.add(new TicketResponse(
                "T002",
                "Laptop is slow",
                "Laptop takes a long time to boot up and open applications.",
                "Hardware",
                "MEDIUM",
                "OPEN",
                "siti@example.com",
                "2026-07-02"));

        tickets.add(new TicketResponse(
                "T003",
                "VPN connection not working",
                "User is unable to connect to the company VPN from home.",
                "Network",
                "HIGH",
                "IN_PROGRESS",
                "raj@example.com",
                "2026-07-01"));
    }

    public List<TicketResponse> getAllTickets() {
        return tickets;
    }

    public TicketResponse getTicketById(String id) {
        return tickets.stream()
                .filter(ticket -> ticket.getId().equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Ticket " + id + " was not found"));
    }

    public TicketResponse createTicket(CreateTicketRequest request) {
        // Generate next ticket ID
        String nextId = generateNextTicketId();

        // Create new ticket with OPEN status and today's date
        TicketResponse newTicket = new TicketResponse(
                nextId,
                request.getTitle(),
                request.getDescription(),
                request.getCategory(),
                request.getPriority(),
                "OPEN",
                request.getCreatedBy(),
                "2026-07-04");

        // Add to the list
        tickets.add(newTicket);

        return newTicket;
    }

    private String generateNextTicketId() {
        // Find the highest ticket number and increment it
        int maxNumber = tickets.stream()
                .map(ticket -> ticket.getId())
                .mapToInt(id -> {
                    try {
                        return Integer.parseInt(id.substring(1)); // Remove 'T' and parse number
                    } catch (NumberFormatException e) {
                        return 0;
                    }
                })
                .max()
                .orElse(0);

        return "T" + String.format("%03d", maxNumber + 1);
    }
}
