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
    }
}
