// Day 4 Exercise 06 - Add Search to the Student List

const students = [
    { studentId: "S001", studentName: "Ignacio de Paul", email: "ignacio@example.com", status: "Active" },
    { studentId: "S002", studentName: "Ben Tan", email: "ben@example.com", status: "Inactive" },
    { studentId: "S003", studentName: "Chong Mei", email: "mei@example.com", status: "Active" },
    { studentId: "S004", studentName: "Danish Nawaz", email: "danish@example.com", status: "Active" },
];

const studentList = document.getElementById("student-list");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resetButton = document.getElementById("reset-button");

// Render the given array of students into the student-list div
function renderStudents(studentArray) {
    // Clear whatever is currently shown
    studentList.innerHTML = "";

    // Show a friendly message when there are no matches
    if (studentArray.length === 0) {
        studentList.innerHTML = "<p>No students found</p>";
        return;
    }

    // Otherwise build a card for each student
    studentArray.forEach((student) => {
        const card = document.createElement("div");
        card.className = "student-card";
        card.style.border = "1px solid #ccc";
        card.style.borderRadius = "8px";
        card.style.padding = "12px";
        card.style.margin = "8px 0";

        card.innerHTML =
            "<p><strong>Student ID:</strong> " + student.studentId + "</p>" +
            "<p><strong>Name:</strong> " + student.studentName + "</p>" +
            "<p><strong>Email:</strong> " + student.email + "</p>" +
            "<p><strong>Status:</strong> " + student.status + "</p>";

        studentList.appendChild(card);
    });
}

// Search button: filter students by name
searchButton.addEventListener("click", () => {
    const keyword = searchInput.value.toLowerCase();

    const filteredStudents = students.filter((student) =>
        student.studentName.toLowerCase().includes(keyword)
    );

    renderStudents(filteredStudents);
});

// Reset button: clear the input and show everyone again
resetButton.addEventListener("click", () => {
    searchInput.value = "";
    renderStudents(students);
});

// Show all students when the page first loads
renderStudents(students);
