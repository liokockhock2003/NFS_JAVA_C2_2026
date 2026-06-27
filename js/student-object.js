// Day 4 Exercise 01 - Create a JavaScript Student Object
// In Java we needed a Student class. In JavaScript, simple data can be
// represented with an object literal using { }.

// 1. Create the object using { }
const student = {
    studentId: "S001",
    studentName: "Ignacio de Paul",
    email: "ignacio@example.com",
    status: "Active",
};

// 2. Print the whole object
console.log("=== Student Object ===");
console.log(student);
console.log();

// 3. Print each property one by one
// 4. Dot notation (used here for studentId, studentName, email)
console.log("Student ID: " + student.studentId);
console.log("Name: " + student.studentName);
console.log("Email: " + student.email);

// 5. Bracket notation (used here at least once, for status)
console.log("Status: " + student["status"]);
