package com.fullstack.demo;

public class Course {
    private String courseId;
    private String title;
    private int durationHours;
    private String level;
    private String category; // NEW
    private boolean active; // NEW
    private Instructor instructor;

    public Course(String courseId, String title, int durationHours,
            String level, String category, boolean active) {
        this.courseId = courseId;
        this.title = title;
        this.durationHours = durationHours;
        this.level = level;
        this.category = category; // NEW
        this.active = active; // NEW
    }

    public String getCourseId() {
        return courseId;
    }

    public String getTitle() {
        return title;
    }

    public int getDurationHours() {
        return durationHours;
    }

    public String getLevel() {
        return level;
    }

    public String getCategory() { // NEW
        return category;
    }

    public boolean isActive() { // NEW
        return active;
    }

    public Instructor getInstructor() {
        return instructor;
    }

    public void setInstructor(Instructor instructor) {
        this.instructor = instructor;
    }

    public void printSummary() {
        System.out.println("Course ID: " + courseId);
        System.out.println("Title: " + title);
        System.out.println("Duration: " + durationHours + " hours");
        System.out.println("Level: " + level);
        System.out.println("Category: " + category); // NEW

        // Challenge: print friendly text, not true/false
        String status = active ? "Active" : "Inactive";
        System.out.println("Status: " + status); // NEW

        if (instructor == null) {
            System.out.println("Instructor: Not assigned yet");
        } else {
            System.out.println("Instructor: " + instructor.getInstructorName());
        }
    }
}