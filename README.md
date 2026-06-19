# NFS_JAVA_C2_2026 | Full-Stack Development with Java, React & MongoDB



## Programme Description



This 20-day programme is designed to help participants build a complete full-stack web application using Java, Spring Boot, React, and MongoDB.



The programme takes learners from programming and web fundamentals to backend API development, frontend interface design, database modelling, authentication, testing, performance improvement, and final capstone presentation.



Throughout the programme, participants will work on practical exercises and gradually build a small but production-like web application. The final outcome is a working capstone project that demonstrates the use of a React frontend, Spring Boot backend, MongoDB database, secure authentication, API documentation, testing practices, and deployment-readiness basics.



AI tools such as Gemini are used as learning accelerators to help scaffold examples, suggest refactoring ideas, draft tests, generate sample data, and support MongoDB query or aggregation design. However, participants are expected to review, verify, understand, and take ownership of all generated code.



---



## Programme Duration



* Duration: 20 training days

* Daily Duration: 7 hours per day

* Total Training Hours: 140 hours

* Mode: Instructor-led training with guided labs, team build activities, review sessions, quizzes, and capstone development



---



## Programme Objectives



By the end of this programme, participants will be able to:



* Understand web fundamentals, HTTP, REST, and JSON.

* Write basic to intermediate Java and JavaScript code.

* Build REST APIs using Spring Boot.

* Apply validation, authentication, authorisation, and error-handling practices.

* Model data effectively using MongoDB.

* Use MongoDB indexes, queries, pagination, and aggregation pipelines.

* Build accessible React user interfaces with routing, forms, state, and data fetching.

* Apply testing practices for backend and frontend development.

* Use AI coding assistants responsibly for learning, refactoring, testing, and documentation.

* Design, build, document, and present a full-stack capstone project.



---





---



## AI-Assisted Learning Guidelines



Participants may use AI tools to:



* Generate README drafts and documentation sections.

* Create API call examples and JSON payload samples.

* Suggest method signatures and edge cases.

* Propose refactoring options.

* Draft test scenarios for backend and frontend features.

* Suggest MongoDB document structures, queries, indexes, and aggregation pipelines.

* Improve demo scripts and presentation notes.



Participants must always review, verify, test, and understand any AI-generated output. No passwords, API keys, tokens, private keys, or confidential data should be placed into AI prompts.



---



## Day 1 Exercise 01 - Code Explanation

### 1. What is the purpose of `Course.java`?
`Course` is a blueprint (class) that models a single course. It holds the
course's data — `courseId`, `title`, `durationHours`, `level`, and the
`Instructor` assigned to it — and provides methods to read that data
(getters), assign an instructor (`setInstructor`), and print a formatted
summary (`printSummary`). It also demonstrates an object relationship: a
`Course` *has an* `Instructor`.

### 2. What is the purpose of `Instructor.java`?
`Instructor` models a person who teaches. It stores `instructorId`,
`instructorName`, and `expertise`, exposes getters for them, and has a
`printProfile()` method to display the instructor's details. A `Course`
object holds a reference to an `Instructor` object.

### 3. What is the purpose of `Student.java`?
`Student` models a learner. It stores `studentId`, `studentName`, and
`email`, exposes getters, and has a `printProfile()` method that prints the
student's details followed by a separator line.

### 4. What does the constructor do?
The constructor is the special method called when you create an object with
`new`. It receives the starting values as parameters and copies them into the
object's fields. For example:

```java
public Course(String courseId, String title, int durationHours, String level) {
    this.courseId = courseId;
    this.title = title;
    this.durationHours = durationHours;
    this.level = level;
}
```

`this.courseId` refers to the object's own field, while `courseId` refers to
the parameter passed in — so the constructor guarantees every `Course` starts
out fully initialised.

### 5. Why are the fields marked as `private`?
`private` means the fields can only be accessed from inside their own class.
This is **encapsulation**: outside code cannot read or change the data
directly, only through the public methods (getters/setters). This protects
the object's internal state, lets the class validate or change how data is
stored later, and keeps a clear, controlled public interface.

### 6. What does `course1.assignInstructor(instructor1);` mean?
It links an `Instructor` object to a `Course` object — after this call,
`course1` knows which instructor teaches it, so `printSummary()` can show the
instructor's name instead of "Not assigned yet".

> Note: in this project the method is actually named **`setInstructor`**, so
> the real call is `course1.setInstructor(instructor1);`. It does exactly what
> the question describes — it stores `instructor1` in the course's
> `instructor` field via `this.instructor = instructor;`.

### 7. What does `student1.printProfile();` do?
It calls the `printProfile()` method on the `student1` object, printing that
student's ID, name, and email to the console, followed by a dashed separator
line:

```text
Student ID: ...
Name: ...
Email: ...
----------------------------
```

### AI-Assisted Task

**Prompt used:** "Explain this Java class to someone who already knows
TypeScript or C#."

**1. One explanation from AI that helped me**
The AI compared Java's getters/`private` fields to C# properties and
TypeScript classes: a Java `private String title;` with a `getTitle()` method
is the manual version of a C# `public string Title { get; }` or a TS
`private title: string` with an accessor. Seeing that Java just writes the
getter out by hand made the boilerplate click.

**2. One part I still needed the trainer / my own reading to understand**
The difference between `this.courseId` and the parameter `courseId` inside the
constructor — why both can share the same name and how `this` disambiguates
the field from the parameter. Reading the actual constructor line by line was
what made it clear.



---



## Day 1 Exercise 02 - Improve the Course Class

### What Changed in `Course.java`

1. **Added two new fields** — `category` (e.g. `Programming`, `Frontend`,
   `Database`, `Project`) and `active` (a `boolean`).
2. **Updated the constructor** to accept and set those two fields, so every
   `Course` now has a category and an active status from the moment it is
   created.
3. **Updated `printSummary()`** to print the category and a friendly status.
   Instead of printing the raw `true`/`false`, it converts the boolean into
   `Active` / `Inactive` text (the challenge).

### Updated `Course.java`

```java
package com.fullstack.demo;

public class Course {
    private String courseId;
    private String title;
    private int durationHours;
    private String level;
    private String category;   // NEW
    private boolean active;     // NEW
    private Instructor instructor;

    public Course(String courseId, String title, int durationHours,
                  String level, String category, boolean active) {
        this.courseId = courseId;
        this.title = title;
        this.durationHours = durationHours;
        this.level = level;
        this.category = category;   // NEW
        this.active = active;       // NEW
    }

    public String getCourseId() {
        return courseId;
    }

    public String getTitle() {
        return title;
    }

    public int getDurationHours() {
        return durationHours;
    }

    public String getLevel() {
        return level;
    }

    public String getCategory() {   // NEW
        return category;
    }

    public boolean isActive() {     // NEW
        return active;
    }

    public Instructor getInstructor() {
        return instructor;
    }

    public void setInstructor(Instructor instructor) {
        this.instructor = instructor;
    }

    public void printSummary() {
        System.out.println("Course ID: " + courseId);
        System.out.println("Title: " + title);
        System.out.println("Duration: " + durationHours + " hours");
        System.out.println("Level: " + level);
        System.out.println("Category: " + category);            // NEW

        // Challenge: print friendly text, not true/false
        String status = active ? "Active" : "Inactive";
        System.out.println("Status: " + status);                // NEW

        if (instructor == null) {
            System.out.println("Instructor: Not assigned yet");
        } else {
            System.out.println("Instructor: " + instructor.getInstructorName());
        }
    }
}
```

### Example: Creating a Course

Because the constructor changed, update where courses are created to pass the
two new arguments:

```java
Course course1 = new Course("C101", "Java Basics", 40, "Beginner",
                            "Programming", true);
course1.printSummary();
```

### Example Output

```text
Course ID: C101
Title: Java Basics
Duration: 40 hours
Level: Beginner
Category: Programming
Status: Active
Instructor: Not assigned yet
```

For an inactive course (`active = false`) the status line reads:

```text
Status: Inactive
```

### Screenshot of Updated Course Output

![Exercise 02 - updated course output](screenshots/Screenshot%202026-06-19%20163237.png)

### Key Point (the Challenge)

The boolean is never printed directly. The ternary expression
`active ? "Active" : "Inactive"` converts `true`/`false` into friendly,
human-readable text before printing.

