package com.fullstack.demo;

import java.util.List;

import com.fullstack.demo.exception.InvalidCourseException;
import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;

public class Main {
    public static void main(String[] args) {
        // 1. Create a CourseRepository
        CourseRepository courseRepository = new InMemoryCourseRepository();

        // 2. Create a CourseService (constructor injection)
        CourseService courseService = new CourseService(courseRepository);

        // 3 & 4. Create at least three courses and save them using createCourse
        System.out.println("=== Create Courses ===");
        Course course1 = new Course("C001", "Java Fundamentals", 14, "Beginner");
        Course course2 = new Course("C002", "React Frontend Development", 21, "Intermediate");
        Course course3 = new Course("C003", "MongoDB Basics", 10, "Beginner");

        courseService.createCourse(course1);
        System.out.println("Course saved: " + course1.getCourseId());

        courseService.createCourse(course2);
        System.out.println("Course saved: " + course2.getCourseId());

        courseService.createCourse(course3);
        System.out.println("Course saved: " + course3.getCourseId());

        // 5. Print the result of getAllCourses
        System.out.println("\n=== All Courses ===");
        List<Course> allCourses = courseService.getAllCourses();
        for (Course course : allCourses) {
            System.out.println(course.getCourseId() + " - " + course.getTitle());
        }

        // Checkpoint: try passing null into createCourse
        System.out.println("\n=== Invalid Course (null) ===");
        try {
            courseService.createCourse(null);
        } catch (InvalidCourseException e) {
            System.out.println("Caught InvalidCourseException: " + e.getMessage());
        }
    }
}
