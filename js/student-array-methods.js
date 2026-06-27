// Day 4 Exercise 04 - Practise JavaScript Array Methods

const students = [
    { studentId: "S001", studentName: "Ignacio de Paul", email: "ignacio@example.com", status: "Active" },
    { studentId: "S002", studentName: "Ben Tan", email: "ben@example.com", status: "Inactive" },
    { studentId: "S003", studentName: "Chong Mei", email: "mei@example.com", status: "Active" },
];

console.log("=== Original Students ===");
console.log(students);

// ===== Part A - methods that read or create a new array =====

// 1. forEach - print all student names
console.log("\n=== All Student Names ===");
students.forEach((student) => {
    console.log(student.studentName);
});

// 2. filter - new array of only Active students
console.log("\n=== Active Students ===");
const activeStudents = students.filter((student) => student.status === "Active");
console.log(activeStudents);

// 3. find - find the student with ID S002
console.log("\n=== Find Student S002 ===");
const foundStudent = students.find((student) => student.studentId === "S002");
console.log(foundStudent);

// 4. map - new array of only the email addresses
console.log("\n=== Student Emails ===");
const studentEmails = students.map((student) => student.email);
console.log(studentEmails);

// ===== Part B - methods that modify the original array =====

// 5. push - add one student to the END (returns the new length)
const newLengthAfterPush = students.push({
    studentId: "S004",
    studentName: "Danish Nawaz",
    email: "danish@example.com",
    status: "Active",
});
console.log("\n=== After push ===");
console.log(students);
console.log("New length after push: " + newLengthAfterPush);

// 6. pop - remove the LAST student (returns the removed item)
const removedLastStudent = students.pop();
console.log("\n=== After pop ===");
console.log(students);
console.log("Removed last student:");
console.log(removedLastStudent);

// 7. unshift - add one student to the BEGINNING (returns the new length)
const newLengthAfterUnshift = students.unshift({
    studentId: "S000",
    studentName: "Ignacio de Paul",
    email: "ignacio@example.com",
    status: "Active",
});
console.log("\n=== After unshift ===");
console.log(students);
console.log("New length after unshift: " + newLengthAfterUnshift);

// 8. shift - remove the FIRST student (returns the removed item)
const removedFirstStudent = students.shift();
console.log("\n=== After shift ===");
console.log(students);
console.log("Removed first student:");
console.log(removedFirstStudent);

console.log("\n=== Final Students Array ===");
console.log(students);
