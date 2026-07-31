package com.example.assettracker.controller;

import com.example.assettracker.dto.ReportCountResponse;
import com.example.assettracker.service.AssetReportService;
import com.example.assettracker.service.TicketReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final AssetReportService assetReportService;
    private final TicketReportService ticketReportService;

    public ReportController(AssetReportService assetReportService, TicketReportService ticketReportService) {
        this.assetReportService = assetReportService;
        this.ticketReportService = ticketReportService;
    }

    @GetMapping("/assets-by-status")
    public List<ReportCountResponse> getAssetsByStatus() {
        return assetReportService.countAssetsByStatus();
    }

    @GetMapping("/assets-by-category")
    public List<ReportCountResponse> getAssetsByCategory() {
        return assetReportService.countAssetsByCategory();
    }

    @GetMapping("/assets-by-location")
    public List<ReportCountResponse> getAssetsByLocation() {
        return assetReportService.countAssetsByLocation();
    }

    @GetMapping("/tickets-by-status")
    public List<ReportCountResponse> getTicketsByStatus() {
        return ticketReportService.countTicketsByStatus();
    }

    @GetMapping("/tickets-by-priority")
    public List<ReportCountResponse> getTicketsByPriority() {
        return ticketReportService.countTicketsByPriority();
    }
}
