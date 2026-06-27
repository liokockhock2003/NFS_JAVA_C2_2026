// Day 4 Exercise 02 - Store Instructors in an Array and Loop Through Them
// In JavaScript we use a normal array with [] (not a fixed-size Java array).

// 1. Create at least 4 instructor objects inside an array
const instructors = [
    { instructorId: "I001", instructorName: "Ignacio de Paul", expertise: "Java and Spring Boot" },
    { instructorId: "I002", instructorName: "Roberto Tan", expertise: "React Development" },
    { instructorId: "I003", instructorName: "Juan Carlos Lee", expertise: "MongoDB" },
    { instructorId: "I004", instructorName: "Carlos Kim", expertise: "Testing" },
];

// 2 + 3. Use a for...of loop to print each instructor in a readable format
console.log("=== Instructor List ===");
for (const instructor of instructors) {
    console.log(
        instructor.instructorId + " - " + instructor.instructorName + " - " + instructor.expertise
    );
}

// 4. Print the total number of instructors using .length
console.log();
console.log("Total instructors: " + instructors.length);
