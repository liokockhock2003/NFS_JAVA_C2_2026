package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;

import java.util.List;

/**
 * Day 3 Assignment 05 - Write Search Using Loop, Then Compare with Stream.
 *
 * Demonstrates the loop-based search first, then the stream version that
 * returns the same result, plus the optional search-by-duration method.
 */
public class SearchPractice {

    public static void main(String[] args) {

        CourseRepository courseRepository = new InMemoryCourseRepository();
        CourseService courseService = new CourseService(courseRepository);

        // Add four courses.
        courseService.createCourse(new Course("C001", "Java Fundamentals", 14, "Beginner"));
        courseService.createCourse(new Course("C002", "React Frontend Development", 21, "Intermediate"));
        courseService.createCourse(new Course("C003", "MongoDB Basics", 10, "Beginner"));
        courseService.createCourse(new Course("C004", "Spring Boot API Development", 18, "Intermediate"));

        // ---- Task C: loop version ----
        System.out.println("=== Beginner Courses (loop) ===");
        List<Course> beginnerCourses = courseService.searchByLevelUsingLoop("Beginner");
        for (Course course : beginnerCourses) {
            System.out.println(course.getCourseId() + " - " + course.getTitle());
        }

        // ---- Task D: stream version (same result) ----
        System.out.println();
        System.out.println("=== Beginner Courses (stream) ===");
        List<Course> beginnerCoursesStream = courseService.searchByLevelUsingStream("Beginner");
        for (Course course : beginnerCoursesStream) {
            System.out.println(course.getCourseId() + " - " + course.getTitle());
        }

        // ---- Task E: search by minimum duration (loop) ----
        System.out.println();
        System.out.println("=== Courses with duration >= 15 hours (loop) ===");
        List<Course> longCourses = courseService.searchByMinimumDurationUsingLoop(15);
        for (Course course : longCourses) {
            System.out.println(
                    course.getCourseId() + " - " + course.getTitle() + " (" + course.getDurationHours() + "h)");
        }

        // ---- Task E: search by minimum duration (stream, same result) ----
        System.out.println();
        System.out.println("=== Courses with duration >= 15 hours (stream) ===");
        List<Course> longCoursesStream = courseService.searchByMinimumDurationUsingStream(15);
        for (Course course : longCoursesStream) {
            System.out.println(
                    course.getCourseId() + " - " + course.getTitle() + " (" + course.getDurationHours() + "h)");
        }
    }
}

                    