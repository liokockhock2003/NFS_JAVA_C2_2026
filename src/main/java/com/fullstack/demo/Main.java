package com.fullstack.demo;

public class Main {
    public static void main(String[] args) {
        // Create an instructor
        Instructor instructor1 = new Instructor("I001", "Dr. Aisha Khan", "Java & Spring Boot");

        // Create a course
        Course course1 = new Course("C101", "Java Basics", 40, "Beginner", "Programming", true);

        // Create a student
        Student student1 = new Student("S001", "Lio Kock", "liokockhock@gmail.com");

        // Assign the instructor to the course (object relationship)
        course1.setInstructor(instructor1);

        // Print everything
        System.out.println("===== INSTRUCTOR PROFILE =====");
        instructor1.printProfile();

        System.out.println();
        System.out.println("===== COURSE SUMMARY =====");
        course1.printSummary();

        System.out.println();
        System.out.println("===== STUDENT PROFILE =====");
        student1.printProfile();

        // ----- Exercise 03: Course Offerings -----

        // A second course and instructor
        Instructor instructor2 = new Instructor("I002", "Aina Rahman", "React & Frontend");
        Course course2 = new Course("C201", "React Fundamentals", 32, "Intermediate", "Frontend", true);
        course2.setInstructor(instructor2);

        // First offering: a scheduled run of course1 (Java Basics)
        CourseOffering offering1 = new CourseOffering(
                "OFF001",
                "Java Basics - June 2026 Intake",
                course1,
                instructor1,
                "2026-06-19",
                "2026-06-20",
                25,
                "Physical");

        // Second offering: a scheduled run of course2 (React Fundamentals)
        CourseOffering offering2 = new CourseOffering(
                "OFF002",
                "React Fundamentals - July 2026 Intake",
                course2,
                instructor2,
                "2026-07-01",
                "2026-07-03",
                30,
                "Online");

        System.out.println();
        System.out.println("===== COURSE OFFERING 1 =====");
        offering1.printOfferingSummary();

        System.out.println();
        System.out.println("===== COURSE OFFERING 2 =====");
        offering2.printOfferingSummary();
    }
}
