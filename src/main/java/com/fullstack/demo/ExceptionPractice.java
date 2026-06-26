package com.fullstack.demo;

import com.fullstack.demo.exception.CourseNotFoundException;
import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;

/**
 * Day 3 Assignment 03 - Exception Practice with CourseService.
 *
 * The service does NOT print errors. When a course is missing it THROWS a
 * CourseNotFoundException. This demo class (the caller) decides how to display
 * that error in a friendly way. A web API or frontend could handle the same
 * exception differently.
 */
public class ExceptionPractice {

    public static void main(String[] args) {

        // ---- Task A: Set up CourseService ----
        CourseRepository courseRepository = new InMemoryCourseRepository();
        CourseService courseService = new CourseService(courseRepository);

        // ---- Task B: Add two courses through the service ----
        courseService.createCourse(new Course("C001", "Java Fundamentals", 14, "Beginner"));
        courseService.createCourse(new Course("C002", "React Frontend Development", 21, "Intermediate"));

        // ---- Task C: Find an existing course (works normally) ----
        System.out.println("=== Existing Course ===");
        Course course = courseService.getCourseById("C001");
        course.printSummary();

        // ---- Task D: Find a missing course (C999) and catch the exception ----
        System.out.println();
        System.out.println("=== Missing Course: C999 ===");
        try {
            Course missingCourse = courseService.getCourseById("C999");
            missingCourse.printSummary();
        } catch (CourseNotFoundException e) {
            System.out.println("Friendly message for user: " + e.getMessage());
        }

        // ---- Task E: One more try/catch with a different friendly message ----
        System.out.println();
        System.out.println("=== Missing Course: C888 ===");
        try {
            Course anotherMissing = courseService.getCourseById("C888");
            anotherMissing.printSummary();
        } catch (CourseNotFoundException e) {
            System.out.println("Cannot display course details because the course does not exist.");
        }

        System.out.println();
        System.out.println("Program finished without crashing.");
    }
}
