package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;

/**
 * Day 3 Assignment 01 - Build and Trace the Code Flow.
 *
 * This demo class shows how one simple action (add a course, then find it)
 * travels through the layers of the project:
 *
 *   CodeFlowPractice (Demo class)
 *     -> CourseService        (business actions + validation)
 *         -> CourseRepository (the contract / interface)
 *             -> InMemoryCourseRepository (the real storage)
 *                 -> LinkedHashMap        (holds the data in memory)
 */
public class CodeFlowPractice {

    public static void main(String[] args) {
        System.out.println("=== Add and Find Course ===");

        // ---- Task A: Create the repository and service ----

        // Why create the repository first?
        // The repository is the part that actually stores and retrieves data.
        // The service cannot do its job without something to store data in,
        // so the storage must exist before the service that uses it.
        CourseRepository courseRepository = new InMemoryCourseRepository();

        // Why does CourseService need CourseRepository?
        // The service handles the business rules (validation, duplicate checks),
        // but it does not store data itself. It delegates saving/finding to the
        // repository. We "inject" the repository so the service knows where to
        // send its save and find requests.
        CourseService courseService = new CourseService(courseRepository);

        // ---- Task B: Create one new course through the service ----

        // Build the Course object with the required details.
        Course newCourse = new Course("C004", "Spring Boot API Development", 18, "Intermediate");

        // Save it using the SERVICE (not the repository directly).
        // The service validates the course, checks for duplicates, and then
        // asks the repository to save it.
        courseService.createCourse(newCourse);

        // ---- Task C: Retrieve the course by ID through the service ----

        // getCourseById asks the repository to find the course and returns the
        // Course object (or throws CourseNotFoundException if it is missing).
        Course foundCourse = courseService.getCourseById("C004");

        // Print the retrieved course details.
        foundCourse.printSummary();

        // ---- Task D: Trace comments (how the request flows) ----
        //
        // 1. This demo class (CodeFlowPractice) calls CourseService.
        // 2. CourseService validates the course (rules, duplicate check).
        // 3. CourseService asks CourseRepository to save or find the course.
        // 4. InMemoryCourseRepository stores/finds the course in a LinkedHashMap (memory).
        // 5. The Course object is returned back up to this demo class.
    }
}
