package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;

import java.util.List;
import java.util.Optional;

/**
 * Day 3 Assignment 02 - Interface and Repository Storage Practice.
 *
 * This demo talks to the repository DIRECTLY (no service layer) so we can see
 * where data is actually stored.
 *
 *   CourseRepository           = the interface (WHAT actions are available)
 *   InMemoryCourseRepository   = the implementation (HOW they work today, using a LinkedHashMap)
 */
public class RepositoryPractice {

    public static void main(String[] args) {

        // ---- Task A: Create the repository using the interface type ----

        // The variable type is CourseRepository (the interface), but the actual
        // object is InMemoryCourseRepository (the implementation). Coding to the
        // interface means we can swap the implementation later (e.g. MongoDB)
        // without changing the code that uses it.
        CourseRepository courseRepository = new InMemoryCourseRepository();

        // ---- Task B: Save three courses directly through the repository ----

        Course apiCourse = new Course("C005", "API Documentation", 7, "Beginner");
        Course collectionsCourse = new Course("C006", "Java Collections Practice", 12, "Beginner");
        Course cleanCodeCourse = new Course("C007", "Clean Code Basics", 8, "Intermediate");

        courseRepository.save(apiCourse);
        courseRepository.save(collectionsCourse);
        courseRepository.save(cleanCodeCourse);

        // ---- Task C: Print all courses ----

        System.out.println("=== All Courses ===");
        List<Course> courses = courseRepository.findAll();
        for (Course course : courses) {
            course.printSummary();
            System.out.println();
        }

        // ---- Task D: Find one course using Optional ----

        System.out.println("=== Find C006 ===");
        Optional<Course> optionalCourse = courseRepository.findById("C006");
        if (optionalCourse.isPresent()) {
            Course foundCourse = optionalCourse.get();
            foundCourse.printSummary();
        } else {
            System.out.println("Course not found.");
        }

        // ---- Task E: Check if a course exists ----

        System.out.println();
        System.out.println("=== Exists Check ===");
        System.out.println("C007 exists: " + courseRepository.existsById("C007"));
    }
}
