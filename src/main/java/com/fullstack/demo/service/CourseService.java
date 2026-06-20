package com.fullstack.demo.service;

import java.util.List;
import java.util.Optional;

import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.exception.CourseNotFoundException;
import com.fullstack.demo.exception.DuplicateCourseException;
import com.fullstack.demo.exception.InvalidCourseException;
import com.fullstack.demo.model.Course;
import com.fullstack.demo.model.Instructor;

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
    // Optional<Course> optionalCourse = courseRepository.findById(courseId);
    // if (optionalCourse.isPresent()) {
    // return optionalCourse.get();
    // } else {
    // throw new CourseNotFoundException(courseId);
    // }
    // }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> searchByTitle(String keyword) {
        String safeKeyword = keyword == null ? "" : keyword.toLowerCase();
        return courseRepository.findAll().stream()
                .filter(course -> course.getTitle().toLowerCase().contains(safeKeyword))
                .toList();
    }

    public List<Course> filterByLevel(String level) {
        String safeLevel = level == null ? "" : level.toLowerCase();
        return courseRepository.findAll().stream()
                .filter(course -> course.getLevel().toLowerCase().equals(safeLevel))
                .toList();
    }

    public Course assignInstructor(String courseId, Instructor instructor) {
        Course course = getCourseById(courseId);
        course.setInstructor(instructor);
        return courseRepository.save(course);
    }

    public List<Course> searchByInstructorName(String instructorName) {
        String safeInstructorName = instructorName == null ? "" : instructorName.toLowerCase();
        return courseRepository.findAll().stream()
                .filter(course -> course.getInstructor() != null)
                .filter(course -> course.getInstructor().getInstructorName().toLowerCase().contains(safeInstructorName))
                .toList();
    }

    public Course updateDuration(String courseId, int newDuration) {
        if (newDuration <= 0) {
            throw new InvalidCourseException("Duration must be more than 0.");
        } else if (!courseRepository.existsById(courseId)) {
            throw new CourseNotFoundException(courseId);
        }
        Course course = getCourseById(courseId);
        course.setDurationHours(newDuration);
        return courseRepository.save(course);
    }

    public void deleteCourse(String courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new CourseNotFoundException(courseId);
        }
        courseRepository.deleteById(courseId);
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
