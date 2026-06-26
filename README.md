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



## Day 3 Assignment 01 - Code Flow Reflection



**Question:** When `getCourseById("C004")` is called, which file does the request go to first, second, and third?



The request travels through the layers like this:



1. **`CourseService.java`** - The demo class (`CodeFlowPractice`) calls the service first. The service owns the business logic, so every request goes through it before touching storage.



2. **`InMemoryCourseRepository.java`** - The service calls `courseRepository.findById("C004")`. The `CourseRepository` interface defines the contract, but the actual code that runs is its `InMemoryCourseRepository` implementation.



3. **`LinkedHashMap` (inside `InMemoryCourseRepository`)** - The repository looks the course up in its in-memory `LinkedHashMap` and returns it wrapped in an `Optional<Course>`. The service unwraps the `Optional` (or throws `CourseNotFoundException` if it is empty) and hands the `Course` back to the demo class.



---



## Day 3 Assignment 02 - Interface and Repository Storage Reflection



**Question:** Why is `InMemoryCourseRepository` temporary storage? What would probably replace it later when we use MongoDB?



`InMemoryCourseRepository` keeps every course inside a `LinkedHashMap` that lives in the computer's RAM. That memory only exists while the program is running, so as soon as the application stops (or restarts, or crashes) all of the saved courses are gone. There is no file or database behind it, so nothing is persisted. This makes it great for learning and quick testing, but not for real use.



Later, when we use MongoDB, the `CourseRepository` interface stays the same, but the implementation will be replaced by something like a `MongoCourseRepository` (or a Spring Data `MongoRepository`). Instead of a `LinkedHashMap`, it will read and write courses to the MongoDB database, so the data survives restarts and can be shared across users and machines. Because the rest of the code depends on the `CourseRepository` interface (not the concrete class), we can swap in the MongoDB implementation without changing the service or demo code.



---



## Day 3 Assignment 03 - Exception Handling Reflection



**Question:** Why is throwing `CourseNotFoundException` better than printing inside `CourseService`?



If `CourseService` printed `"Course not found"` itself, it would force one fixed reaction on every caller, and the service has no idea who is calling it. The same missing-course situation needs to be shown differently depending on the caller:



* A **console app** wants to print a friendly line to the terminal.

* A **web API** wants to return an HTTP status (such as `404 Not Found`) with a JSON error body.

* A **frontend app** wants to show a styled error message or popup to the user.



By **throwing** `CourseNotFoundException`, the service simply reports "this course does not exist" and stays focused on business logic. The caller then **catches** the exception and decides how to display it. This keeps the service reusable across console, web, and frontend layers, avoids mixing presentation code into the business layer, and means a missing course can never silently slip past - the caller must handle it.



---



## Day 3 Assignment 04 - Object Relationships and Composition Reflection



**Question:** Why is `CourseOffering` a better design than putting start date, end date, and capacity directly inside `Course`?



A `Course` describes the *subject* itself - its title, duration, and level - things that stay the same no matter when it runs. The start date, end date, and capacity belong to a *specific run* of that course, not to the course as a whole. Putting them inside `Course` would mean each course could only ever have one schedule and one class size.



By giving those scheduling details their own class, `CourseOffering`, we can run the same `Course` many times with different dates, instructors, capacities, and delivery modes (for example a June intake and a July weekend intake of "Java Fundamentals"). `CourseOffering` uses a **HAS-A** relationship - it *has a* `Course` and *has an* `Instructor` by holding the real objects rather than copying their text fields, so any update to the course is reflected everywhere it is offered. This keeps each class focused on one responsibility and models the real world correctly: one course, many offerings.



### A note on composition vs aggregation



"Composition" is often used loosely to mean any HAS-A relationship, but there are two stricter flavours that differ by **ownership and lifetime**:



* **Composition (strong HAS-A)** - the whole *owns* the part, creates it internally, and the part dies with the whole. There is no setter and the part is never shared (e.g. a `Course` that builds and solely owns its own `Syllabus`).

* **Aggregation (weak HAS-A)** - the whole only *refers to* a part that is created outside, lives independently, and can be shared by many wholes.



By that stricter definition, our relationships are actually **aggregation, not strong composition**:



* `Course HAS-A Instructor`, `CourseOffering HAS-A Course`, and `CourseOffering HAS-A Instructor` are all aggregation.

* The objects are created outside and passed in (`new Instructor(...)` then `setInstructor(...)` / passed into the `CourseOffering` constructor).

* The same `Instructor` object (Mike) is **shared** across `javaCourse`, `OFF001`, and `OFF003`, and an `Instructor` still exists even if a course or offering is deleted - their lifetimes are independent.



So the design above is best described as **aggregation (weak composition)**: one course can have many offerings, and instructors and courses are shared, independently-living objects rather than parts owned by a single whole.

