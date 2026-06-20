package com.fullstack.demo.service;

import java.util.List;
import java.util.Optional;

import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.exception.CourseNotFoundException;
import com.fullstack.demo.exception.DuplicateCourseException;
import com.fullstack.demo.exception.InvalidCourseException;
import com.fullstack.demo.model.Course;

public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Course createCourse(Course course) {
        validateCourse(course);
        if (courseRepository.existsById(course.getCourseId())) {
            throw new DuplicateCourseException(course.getCourseId());
        }
        return courseRepository.save(course);

    }

    public Course getCourseById(String courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));
    }
    // public Course getCourseById(String courseId) {
    //     Optional<Course> optionalCourse = courseRepository.findById(courseId);
    //     if (optionalCourse.isPresent()) {
    //         return optionalCourse.get();
    //     } else {
    //         throw new CourseNotFoundException(courseId);
    //     }
    // }
    

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    private void validateCourse(Course course) {
        if (course == null) {
            throw new InvalidCourseException("Course must not be null.");
        }
        if (course.getCourseId() == null || course.getCourseId().isBlank()) {
            throw new InvalidCourseException("Course ID is required.");
        }
        if (course.getTitle() == null || course.getTitle().isBlank()) {
            throw new InvalidCourseException("Course title is required.");
        }
        if (course.getDurationHours() <= 0) {
            throw new InvalidCourseException("Duration must be more than 0.");
        }
        if (course.getLevel() == null || course.getLevel().isBlank()) {
            throw new InvalidCourseException("Course level is required.");
        }
    }
}

