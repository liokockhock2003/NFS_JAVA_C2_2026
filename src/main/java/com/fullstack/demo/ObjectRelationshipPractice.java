package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.model.CourseOffering;
import com.fullstack.demo.model.Instructor;

/**
 * Day 3 Assignment 04 - Object Relationships and Composition.
 *
 * Composition means "one object HAS another object":
 *   Course          HAS an Instructor
 *   CourseOffering  HAS a Course and HAS an Instructor
 *
 * This demo builds instructors, courses, and offerings, then links them together.
 */
public class ObjectRelationshipPractice {

    public static void main(String[] args) {

        // ---- Task A: Create two instructors ----
        Instructor mike = new Instructor("I001", "Mike Rahman", "Java and Spring Boot");
        Instructor marcus = new Instructor("I002", "Marcus Lee", "React and Frontend Development");

        // ---- Task B: Create two courses ----
        Course javaCourse = new Course("C001", "Java Fundamentals", 14, "Beginner");
        Course reactCourse = new Course("C002", "React Frontend Development", 21, "Intermediate");

        // ---- Task C: Assign instructors to courses (Course HAS an Instructor) ----
        javaCourse.setInstructor(mike);
        reactCourse.setInstructor(marcus);

        System.out.println("=== Courses ===");
        javaCourse.printSummary();
        System.out.println();
        reactCourse.printSummary();

        // ---- Task D + F: Create course offerings ----
        // CourseOffering uses composition because it HAS a Course and HAS an
        // Instructor. It does not copy their text fields; it holds the real
        // Course and Instructor objects instead.
        CourseOffering offering1 = new CourseOffering(
                "OFF001", "Java Fundamentals June Intake",
                javaCourse, mike,
                "2026-06-29", "2026-06-30", 25, "Physical");

        CourseOffering offering2 = new CourseOffering(
                "OFF002", "React Frontend July Intake",
                reactCourse, marcus,
                "2026-07-01", "2026-07-03", 20, "Hybrid");

        // ---- Extension: a third offering that REUSES the same Java course
        // with different dates. This shows a Course and a CourseOffering are
        // not the same thing - one course can have many offerings. ----
        CourseOffering offering3 = new CourseOffering(
                "OFF003", "Java Fundamentals July Weekend Intake",
                javaCourse, mike,
                "2026-07-11", "2026-07-12", 15, "Online");

        // ---- Task E: Print the course offerings ----
        System.out.println();
        System.out.println("=== Course Offerings ===");
        offering1.printSummary();
        System.out.println();
        offering2.printSummary();
        System.out.println();
        offering3.printSummary();
    }
}
