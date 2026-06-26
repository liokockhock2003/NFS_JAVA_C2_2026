package com.fullstack.demo.service;

import com.fullstack.demo.exception.CourseNotFoundException;
import com.fullstack.demo.exception.DuplicateCourseException;
import com.fullstack.demo.exception.InvalidCourseException;
import com.fullstack.demo.model.Course;
import com.fullstack.demo.model.Instructor;
import com.fullstack.demo.repository.CourseRepository;

import java.util.ArrayList;
import java.util.List;

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
    // public Course getCourseById(String courseId) {
    //     Optional<Course> optionalCourse = courseRepository.findById(courseId);
    //     if (optionalCourse.isPresent()) {
    //         return optionalCourse.get();
    //     } else {
    //         throw new CourseNotFoundException(courseId);
    //     }
    // }
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> searchByTitle(String keyword) {
        // String safeKeyword;

        // if (keyword == null) {
        //     safeKeyword = "";
        // } else {
        //     safeKeyword = keyword.trim().toLowerCase();
        // }
        String safeKeyword = keyword == null ? "" : keyword.toLowerCase();

        return courseRepository.findAll()   // gets all courses
                .stream()                   // starts processing the list of courses
                .filter(course -> course.getTitle().toLowerCase().contains(safeKeyword))    // keeps only matching results
                .toList();                  // collects the results into a new list
    }
    public List<Course> searchByTitleUsingLoop(String keyword) {
        String safeKeyword = keyword == null ? "" : keyword.trim().toLowerCase();
        List<Course> results = new ArrayList<>();

        for (Course course : courseRepository.findAll()) {
            if (course.getTitle().toLowerCase().contains(safeKeyword)) {
                results.add(course);
            }
        }
        return results;
    }

    public List<Course> filterByLevel(String level) {
        String safeLevel = level == null ? "" : level;

        return courseRepository.findAll()
                .stream()
                .filter(course -> course.getLevel().equalsIgnoreCase(safeLevel))
                .toList();
    }

    public List<Course> searchByInstructorName(String instructorName) {
        String safeInstructorName = instructorName == null ? "" : instructorName.toLowerCase();

        return courseRepository.findAll()
                .stream()
                .filter(course -> course.getInstructor() != null)
                .filter(course -> course.getInstructor()
                        .getInstructorName()
                        .toLowerCase()
                        .contains(safeInstructorName))
                        .toList();
    }

    public Course assignInstructor(String courseId, Instructor instructor) {
        Course course = getCourseById(courseId);
        course.setInstructor(instructor);
        return courseRepository.save(course);
    }

    public Course updateDuration(String courseId, int newDurationHours) {
        Course course = getCourseById(courseId);

        if (newDurationHours <= 0) {
            throw new InvalidCourseException("Course duration must be greater than zero.");
        }

        course.setDurationHours(newDurationHours);
        return courseRepository.save(course);
    }

    public void deleteCourse(String courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new CourseNotFoundException(courseId);
        }

        courseRepository.deleteById(courseId);
    }

    // Day 3 Assignment 05 - Search by level using a normal loop.
    public List<Course> searchByLevelUsingLoop(String level) {
        String safeLevel = level == null ? "" : level.trim();

        List<Course> results = new ArrayList<>();

        for (Course course : courseRepository.findAll()) {
            if (course.getLevel().equalsIgnoreCase(safeLevel)) {
                results.add(course);
            }
        }

        return results;
    }

    // Day 3 Assignment 05 (Task D) - Same search written using a stream.
    public List<Course> searchByLevelUsingStream(String level) {
        String safeLevel = level == null ? "" : level.trim();

        return courseRepository.findAll()
                .stream()
                .filter(course -> course.getLevel().equalsIgnoreCase(safeLevel))
                .toList();
    }

    // Day 3 Assignment 05 (Task E) - Courses with durationHours >= minimumHours, using a loop.
    public List<Course> searchByMinimumDurationUsingLoop(int minimumHours) {
        List<Course> results = new ArrayList<>();

        for (Course course : courseRepository.findAll()) {
            if (course.getDurationHours() >= minimumHours) {
                results.add(course);
            }
        }

        return results;
    }

    // Day 3 Assignment 05 (Task E) - Same duration search written using a stream.
    public List<Course> searchByMinimumDurationUsingStream(int minimumHours) {
        return courseRepository.findAll()
                .stream()
                .filter(course -> course.getDurationHours() >= minimumHours)
                .toList();
    }

    private void validateCourse(Course course) {
        if (course == null) {
            throw new InvalidCourseException("Course cannot be null.");
        }
        if (isBlank(course.getCourseId())) {
            throw new InvalidCourseException("Course ID is required.");
        }
        if (isBlank(course.getTitle())) {
            throw new InvalidCourseException("Course title is required.");
        }
        if (course.getDurationHours() <= 0) {
            throw new InvalidCourseException("Course duration must be greater than zero.");
        }
        if (isBlank(course.getLevel())) {
            throw new InvalidCourseException("Course level is required.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}