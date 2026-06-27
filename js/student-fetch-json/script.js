// Day 4 Exercise 07 - Load Students from a JSON File Using Fetch

// 1. Select the HTML elements
const statusMessage = document.getElementById("status-message");
const studentList = document.getElementById("student-list");

// 2. Render the given array of students into the page
function renderStudents(students) {
    // Clear whatever is currently shown
    studentList.innerHTML = "";

    students.forEach((student) => {
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

// 3. Async function that loads the data
async function loadStudents() {
    try {
        // 4. Show a loading message before fetching
        statusMessage.textContent = "Loading students...";

        // 5. Fetch the JSON file (name must match exactly)
        const response = await fetch("students.json");

        if (!response.ok) {
            throw new Error("Failed to load student data.");
        }

        // 6. Convert the JSON into a JavaScript array of objects
        const students = await response.json();

        // 7. Clear the status and render the students
        statusMessage.textContent = "";
        renderStudents(students);
    } catch (error) {
        // 8. Show a useful error message if anything went wrong
        statusMessage.textContent = "Error: " + error.message;
    }
}

// 9. Actually start the loading process
loadStudents();
