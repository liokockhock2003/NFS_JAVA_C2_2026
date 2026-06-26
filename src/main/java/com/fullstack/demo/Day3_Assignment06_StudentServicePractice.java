package com.fullstack.demo;

import com.fullstack.demo.exception.StudentNotFoundException;
import com.fullstack.demo.model.Student;
import com.fullstack.demo.repository.InMemoryStudentRepository;
import com.fullstack.demo.repository.StudentRepository;
import com.fullstack.demo.service.StudentService;

import java.util.List;

/**
 * Day 3 Assignment 06 - Build StudentService using the same pattern as CourseService.
 */
public class Day3_Assignment06_StudentServicePractice {

    public static void main(String[] args) {

        // 1. Create repository and service (same pattern as CourseService).
        StudentRepository studentRepository = new InMemoryStudentRepository();
        StudentService studentService = new StudentService(studentRepository);

        // 2. Register three students.
        System.out.println("=== Register Students ===");
        studentService.registerStudent(new Student("S001", "Roberto Chan", "roberto@example.com"));
        studentService.registerStudent(new Student("S002", "Priya Nair", "priya@example.com"));
        studentService.registerStudent(new Student("S003", "Lee Salazae", "lee@example.com"));
        System.out.println("Registered 3 students.");

        // 3. Print all students.
        System.out.println();
        System.out.println("=== All Students ===");
        List<Student> allStudents = studentService.getAllStudents();
        for (Student student : allStudents) {
            student.printProfile();
        }

        // 4. Find one student by ID.
        System.out.println("=== Find Student By ID ===");
        Student found = studentService.getStudentById("S002");
        found.printProfile();

        // 5. Search students by name.
        System.out.println("=== Search Student By Name ===");
        List<Student> matches = studentService.searchByNameUsingLoop("lee");
        for (Student student : matches) {
            student.printProfile();
        }

        // 6 + 7. Try to find a missing student and catch the exception.
        System.out.println("=== Missing Student Test ===");
        try {
            studentService.getStudentById("S999");
        } catch (StudentNotFoundException e) {
            System.out.println(e.getMessage());
        }
    }
}
