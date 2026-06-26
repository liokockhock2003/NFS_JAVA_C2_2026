package com.fullstack.demo.service;

import com.fullstack.demo.exception.DuplicateStudentException;
import com.fullstack.demo.exception.StudentNotFoundException;
import com.fullstack.demo.model.Student;
import com.fullstack.demo.repository.StudentRepository;

import java.util.ArrayList;
import java.util.List;

/**
 * StudentService follows the exact same pattern as CourseService:
 * it holds business logic and delegates storage to a StudentRepository.
 */
public class StudentService {
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student registerStudent(Student student) {
        if (student == null) {
            throw new IllegalArgumentException("Student cannot be null.");
        }

        if (studentRepository.existsById(student.getStudentId())) {
            // Extension: throw a custom exception instead of IllegalArgumentException.
            throw new DuplicateStudentException(student.getStudentId());
        }

        return studentRepository.save(student);
    }

    public Student getStudentById(String studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException(studentId));
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Student> searchByNameUsingLoop(String keyword) {
        String safeKeyword = keyword == null ? "" : keyword.toLowerCase();

        List<Student> results = new ArrayList<>();

        for (Student student : studentRepository.findAll()) {
            if (student.getStudentName().toLowerCase().contains(safeKeyword)) {
                results.add(student);
            }
        }

        return results;
    }

    // Extension: same search written using a stream.
    public List<Student> searchByNameUsingStream(String keyword) {
        String safeKeyword = keyword == null ? "" : keyword.toLowerCase();

        return studentRepository.findAll()
                .stream()
                .filter(student -> student.getStudentName().toLowerCase().contains(safeKeyword))
                .toList();
    }
}
