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



## Day 4 Exercise 01 - JavaScript Student Object Reflection



**Question:** What is one difference between a Java object and a JavaScript object?



A Java object must be created from a **class** that is defined ahead of time. Before you can make a `Student`, you need a `Student.java` class with declared fields and types (e.g. `private String studentId;`), and every object follows that fixed blueprint. Java is also **statically typed**, so each field has a type the compiler checks.



A JavaScript object needs **no class at all** - you can create one directly as an object literal with `{ }`, listing properties on the spot (`const student = { studentId: "S001", ... }`). It is **dynamically typed**, so properties have no declared types, and you can even **add or remove properties at runtime** (e.g. `student.age = 20;`) - something you cannot do to a Java object, whose shape is fixed by its class.



In short: a Java object is built from a predefined, type-checked class blueprint, while a JavaScript object can be created on the fly with no class and changed freely while the program runs.



---



## Day 4 Exercise 02 - JavaScript Array vs Java ArrayList Reflection



**Question:** How is a JavaScript array similar to a Java `ArrayList`?



A JavaScript array (`const instructors = []`) and a Java `ArrayList` are similar because both are **resizable, ordered lists** rather than fixed-size arrays:



* **They grow and shrink dynamically** - you do not set a size up front. JavaScript uses `push()`/`pop()`, while `ArrayList` uses `add()`/`remove()`.

* **They keep insertion order** and let you access elements **by index** (`instructors[0]` in JS, `list.get(0)` in Java).

* **They track their own size** - JavaScript uses the `.length` property and `ArrayList` uses the `.size()` method.

* **Both can be looped the same way** - `for...of` in JavaScript is like the enhanced `for (Instructor i : list)` loop in Java.



The main difference is typing: a Java `ArrayList<Instructor>` can only hold `Instructor` objects (checked by the compiler), while a JavaScript array is untyped and can hold values of any type mixed together. But in everyday use - a dynamic, ordered, index-accessible collection you can loop over and count - they play the same role.



---



## Day 4 Exercise 03 - Arrow Functions Reflection



**Question:** Why are arrow functions important before learning React?



Arrow functions are everywhere in React, so being comfortable with them first makes React far easier to read and write:



* **Event handlers** are usually written as arrow functions: `onClick={() => handleClick(id)}`. You constantly pass short inline functions like this in JSX.

* **Array methods that render lists** rely on arrow callbacks: `items.map((item) => <li>{item.name}</li>)`, plus `filter()` and `reduce()`. React builds UI from arrays using exactly this pattern.

* **Hooks take functions as arguments**: `useEffect(() => { ... }, [])` and state updaters like `setCount((c) => c + 1)` are arrow functions.

* **They are short and readable**, which keeps JSX clean - the implicit-return form (`(s) => s.status`) lets you write one-line callbacks without `function`, `{ }`, or `return`.

* **They keep `this` from the surrounding scope** instead of creating their own. In React this avoids the classic bug where a normal function loses `this`, which is why older class components had to bind handlers manually.



In short, React code is full of small functions passed as props, callbacks, and hook arguments - and arrow functions are the natural, concise way to write them. Learning them first means the React syntax will already feel familiar.



---



## Day 4 Exercise 04 - JavaScript Array Methods Reflection



**1. What is the difference between `filter`, `find`, and `map`?**



All three read the original array without changing it, but they return different things:



* **`filter`** keeps every item that passes a test and returns a **new array** of all the matches (e.g. all Active students). It can return many items, or an empty array.

* **`find`** returns the **first single item** that passes a test (one object), or `undefined` if nothing matches. It stops at the first hit.

* **`map`** transforms **every** item and returns a **new array of the same length**, where each element has been changed (e.g. turning student objects into just their email strings).



Quick way to remember: `filter` = "give me the matching items", `find` = "give me the first matching item", `map` = "give me a changed version of every item".



**2. Which four array methods change the original array?**



`push`, `pop`, `shift`, and `unshift`. (By contrast `forEach`, `filter`, `find`, and `map` do not change the original array.)



**3. What does `push` return?**



The **new length** of the array after the item is added to the end (a number).



**4. What does `pop` return?**



The **item that was removed** from the end of the array (the removed object itself), not the length.



**5. What is the difference between `shift` and `unshift`?**



They both work at the **beginning** of the array but do opposite things:



* **`shift`** **removes** the first item and returns that **removed item**.

* **`unshift`** **adds** one or more items to the front and returns the **new length** of the array.



---



## Day 4 Exercise 05 - DOM Rendering Reflection



**Question:** What does the DOM allow JavaScript to do?



The **DOM (Document Object Model)** is a live, in-memory representation of the HTML page, structured as a tree of objects (one object per element). It is the bridge between JavaScript and what the user sees in the browser, and it lets JavaScript:



* **Find/select elements** on the page - for example `document.getElementById("student-list")` grabs the `<div>` so we can work with it.

* **Create new elements** - `document.createElement("div")` builds a brand-new card that did not exist in the original HTML.

* **Change content and attributes** - setting `card.innerHTML = "..."` fills the card with the student's details, and we can also change styles, classes, and text.

* **Add or remove elements from the page** - `appendChild()` inserts each card into the page so it actually appears; elements can also be removed.

* **Respond to user actions** - JavaScript can attach event listeners (clicks, typing, etc.) to DOM elements to make the page interactive.



In short, the DOM lets JavaScript **read and change a web page while it is running**, so a page can be built and updated dynamically from data (like turning a `students` array into a list of cards) instead of being fixed, static HTML. This same idea - data driving what appears on screen - is exactly what React builds on later.



---



## Day 4 Exercise 06 - Search Filter UI Reflection



**Question:** How is JavaScript `filter` used in a search feature?



`filter` powers a search by producing a **new array containing only the items that match what the user typed**, while leaving the original full list untouched. In this exercise the flow is:



1. Read the text the user typed into the search box and lowercase it (`searchInput.value.toLowerCase()`), so the search is case-insensitive.

2. Call `filter` on the full `students` array. For each student, the test checks whether the student's name **contains** the keyword: `student.studentName.toLowerCase().includes(keyword)`.

3. `filter` keeps only the students that return `true` and returns them as a brand-new array (`filteredStudents`).

4. That filtered array is passed to `renderStudents()`, which redraws the page showing only the matches (or "No students found" if the array is empty).



Because `filter` does not modify the original `students` array, the **Reset** button can simply re-render the complete list again. So `filter` is the engine of the search: it turns the user's keyword into the subset of data that should be displayed, and the DOM code just renders whatever array `filter` hands back.



---



## Day 4 Exercise 07 - Fetch Local JSON Reflection



**1. What does `async` mean?**



`async` marks a function as one that contains work which may take time to finish (like loading a file or calling an API). It lets the function pause and wait without freezing the rest of the page, and it allows the use of `await` inside it. An `async` function always returns a Promise.



**2. What does `await` do?**



`await` tells JavaScript to **pause inside the async function until a task finishes**, then continue with the result. For example `const response = await fetch("students.json")` waits for the file to come back before moving to the next line, so we never try to use the data before it has actually arrived.



**3. What does `fetch` do?**



`fetch` **requests data** from a file or a URL and returns a Promise that resolves to a `Response` object. In this exercise `fetch("students.json")` requests the local JSON file; we then call `response.json()` to turn the raw JSON text into a real JavaScript array of objects.



**4. Why do we use `fetch` before connecting to a real backend API?**



Because the code is almost identical either way. Loading a local file with `fetch("students.json")` uses the same `async`/`await`/`try`-`catch` pattern we will later use for `fetch("http://localhost:8080/api/students")`. Practising on a local JSON file lets us learn how requesting, awaiting, converting, and rendering data works **without needing a running server or database yet** - so when the Spring Boot backend is ready, only the URL changes.



**5. Why should this exercise be run using Live Server?**



Because `fetch` needs the page to be served over **HTTP**. Live Server runs a small local web server (e.g. `http://127.0.0.1:5500`), so the browser is allowed to request `students.json`. If you instead double-click the HTML file, it opens with a `file://` path, and browsers block `fetch` of local files for security reasons - so the request would fail with a CORS/blocked-file error and no students would load.

