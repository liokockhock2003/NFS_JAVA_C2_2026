package com.fullstack.demo.exception;

public class DuplicateStudentException extends RuntimeException {
    public DuplicateStudentException(String studentId) {
        super("Duplicate student found with ID: " + studentId);
    }

}
