package com.example.assettracker.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateTicketRequest {

    @NotBlank(message = "Title is required and cannot be empty")
    private String title;

    @NotBlank(message = "Description is required and cannot be empty")
    private String description;

    @NotBlank(message = "Category is required and cannot be empty")
    private String category;

    @NotBlank(message = "Priority is required and cannot be empty")
    private String priority;

    @NotBlank(message = "CreatedBy is required and cannot be empty")
    private String createdBy;

    // Default constructor
    public CreateTicketRequest() {
    }

    // Constructor with parameters
    public CreateTicketRequest(String title, String description, String category,
            String priority, String createdBy) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.createdBy = createdBy;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
