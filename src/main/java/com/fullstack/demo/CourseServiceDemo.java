package com.fullstack.demo;

import com.fullstack.demo.exception.CourseNotFoundException;
import com.fullstack.demo.exception.DuplicateCourseException;
import com.fullstack.demo.exception.InvalidCourseException;
import com.fullstack.demo.model.Course;
import com.fullstack.demo.model.Instructor;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;

import java.util.List;

public class CourseServiceDemo {

    public static void main(String[] args) {

        CourseRepository courseRepository = new InMemoryCourseRepository();
        CourseService courseService = new CourseService(courseRepository);

        // --- Happy path: create / read / search / filter / assign instructor ---
        try {
            System.out.println("=== 1. Create Courses ===");

            Course javaCourse = new Course("C001", "Java Fundamentals", 14, "Beginner");
            Course reactCourse = new Course("C002", "React Frontend Development", 21, "Intermediate");
            Course mongoCourse = new Course("C003", "MongoDB Basics", 10, "Beginner");

            courseService.createCourse(javaCourse);
            courseService.createCourse(reactCourse);
            courseService.createCourse(mongoCourse);

            printCourses(courseService.getAllCourses());

            System.out.println("\n=== 2. Find Course by ID ===");
            Course foundCourse = courseService.getCourseById("C001");
            foundCourse.printSummary();

            System.out.println("\n=== 3. Search by Title ===");
            List<Course> javaResults = courseService.searchByTitle("java");
            printCourses(javaResults);

            System.out.println("\n=== 4. Filter by Level ===");
            List<Course> beginnerCourses = courseService.filterByLevel("Beginner");
            printCourses(beginnerCourses);

            System.out.println("\n=== 5. Assign Instructor ===");
            Instructor instructor = new Instructor("I001", "Aina Rahman", "Backend Development");
            Course assignedCourse = courseService.assignInstructor("C001", instructor);
            assignedCourse.printSummary();

            System.out.println("\n=== 6. Search by Instructor Name ===");
            List<Course> instructorResults = courseService.searchByInstructorName("Aina");
            printCourses(instructorResults);

        } catch (InvalidCourseException e) {
            System.out.println("Validation error: " + e.getMessage());
        } catch (DuplicateCourseException e) {
            System.out.println("Duplicate course error: " + e.getMessage());
        } catch (CourseNotFoundException e) {
            System.out.println("Course not found error: " + e.getMessage());
        }

        // --- Assignment 03.6: Update and Delete ---

        System.out.println("\n=== Update Duration ===");
        Course durationUpdated = courseService.updateDuration("C001", 20);
        System.out.println(durationUpdated.getCourseId() + " duration updated to "
                + durationUpdated.getDurationHours() + " hours");

        System.out.println("\n=== Delete Course ===");
        courseService.deleteCourse("C003");
        System.out.println("C003 deleted successfully");

        System.out.println("\n=== Remaining Courses ===");
        for (Course course : courseService.getAllCourses()) {
            System.out.println(course.getCourseId() + " - " + course.getTitle());
        }

        // Try to find the deleted course (expected: CourseNotFoundException)
        System.out.println("\n=== Find Deleted Course ===");
        try {
            courseService.getCourseById("C003");
        } catch (CourseNotFoundException e) {
            System.out.println("Course not found error: " + e.getMessage());
        }

        // Try to update a course with an invalid duration (expected: InvalidCourseException)
        System.out.println("\n=== Invalid Duration Test ===");
        try {
            courseService.updateDuration("C001", 0);
        } catch (InvalidCourseException e) {
            System.out.println("Validation error: " + e.getMessage());
        }
    }

    private static void printCourses(List<Course> courses) {
        if (courses.isEmpty()) {
            System.out.println("No courses found.");
            return;
        }

        for (Course course : courses) {
            course.printSummary();
        }
    }
}
