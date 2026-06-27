// Day 4 Exercise 03 - Functions and Arrow Functions for Student Data

// One student object
const student = {
    studentId: "S001",
    studentName: "Aina Rahman",
    email: "aina@example.com",
    status: "Active",
};

// 1. Normal function - returns a formatted string like "S001 - Aina Rahman (Active)"
function formatStudent(student) {
    return student.studentId + " - " + student.studentName + " (" + student.status + ")";
}

// 2. Arrow function (with body + return) - returns the student email
const getStudentEmail = (student) => {
    return student.email;
};

// 3. Short arrow function - implicit return of the status
const getStudentStatus = (student) => student.status;

// Print the required output
console.log(formatStudent(student));
console.log(getStudentEmail(student));
console.log(getStudentStatus(student));
