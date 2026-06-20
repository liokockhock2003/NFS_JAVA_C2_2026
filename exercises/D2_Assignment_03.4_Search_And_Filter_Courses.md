# Day 2 Assignment 03.4 - Search and Filter Courses

## Goal

Add search and filter methods to `CourseService`.

This exercise introduces simple data processing using Java Stream API.

## Starting Point

Your `CourseService` should already support:

```java
createCourse(Course course)
getCourseById(String courseId)
getAllCourses()
```

## Methods to Add

Add these methods:

```java
public List<Course> searchByTitle(String keyword)
```

```java
public List<Course> filterByLevel(String level)
```

## Behaviour

### searchByTitle

The method should:

1. Accept a search keyword
2. Treat `null` keyword as an empty string
3. Search all courses
4. Return courses where the title contains the keyword
5. Ignore uppercase/lowercase differences

Example:

```text
Search keyword: java

Should match:
Java Fundamentals
Advanced Java Backend
```

### filterByLevel

The method should:

1. Accept a level
2. Treat `null` level as an empty string
3. Search all courses
4. Return courses where the level matches
5. Ignore uppercase/lowercase differences

Example:

```text
Filter level: Beginner

Should match:
Java Fundamentals
MongoDB Basics
```

## Main Demo Task

Update `CourseServiceDemo.java`.

Create at least four courses.

Example data:

```text
C001 - Java Fundamentals - Beginner
C002 - React Frontend Development - Intermediate
C003 - MongoDB Basics - Beginner
C004 - Advanced Java Backend - Advanced
```

Test:

1. Search by title using `"java"`
2. Search by title using `"react"`
3. Filter by level using `"Beginner"`
4. Filter by level using `"Advanced"`

## Suggested Demo Flow

```text
=== Search by Title: java ===
C001 - Java Fundamentals
C004 - Advanced Java Backend

=== Filter by Level: Beginner ===
C001 - Java Fundamentals
C003 - MongoDB Basics
```

## Learning Focus

By completing this exercise, you should understand:

- How to search objects in a list
- How to filter objects based on one field
- How to use `stream()`
- How to use `filter()`
- How to use `toList()`
- How to handle null search input safely

## Checkpoint

Your search and filter methods should not crash if the input is `null`.

## Submission

Submit:

1. Updated `CourseService.java`
2. Updated `CourseServiceDemo.java`
3. Screenshot of search output
4. Screenshot of filter output
5. GitHub commit link or screenshot
