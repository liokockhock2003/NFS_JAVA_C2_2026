package com.fullstack.demo.repository;

import com.fullstack.demo.model.Student;

import java.util.List;
import java.util.Optional;

// The interface only says WHAT actions are available - no storage logic here.
public interface StudentRepository {
    Student save(Student student);
    Optional<Student> findById(String studentId);
    List<Student> findAll();
    boolean existsById(String studentId);
}
