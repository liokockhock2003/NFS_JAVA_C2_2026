// Day 4 Exercise 05 - Render Student Cards in HTML

// Array of at least 4 students
const students = [
    { studentId: "S001", studentName: "Ignacio de Paul", email: "ignacio@example.com", status: "Active" },
    { studentId: "S002", studentName: "Ben Tan", email: "ben@example.com", status: "Inactive" },
    { studentId: "S003", studentName: "Chong Mei", email: "mei@example.com", status: "Active" },
    { studentId: "S004", studentName: "Danish Nawaz", email: "danish@example.com", status: "Active" },
];

// 1. Select the student-list div
const studentList = document.getElementById("student-list");

// 2. Loop through the students using forEach
students.forEach((student) => {
    // 3. Create a card element for each student
    const card = document.createElement("div");
    card.className = "student-card";

    // A little inline styling so each card is visible and separated
    card.style.border = "1px solid #ccc";
    card.style.borderRadius = "8px";
    card.style.padding = "12px";
    card.style.margin = "8px 0";

    // 4. Use innerHTML to place the student details inside the card
    card.innerHTML =
        "<p><strong>Student ID:</strong> " + student.studentId + "</p>" +
        "<p><strong>Name:</strong> " + student.studentName + "</p>" +
        "<p><strong>Email:</strong> " + student.email + "</p>" +
        "<p><strong>Status:</strong> " + student.status + "</p>";

    // 5. Use appendChild to add the card to the page
    studentList.appendChild(card);
});
