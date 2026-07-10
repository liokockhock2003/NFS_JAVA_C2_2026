# Day 7 Exercise 1: Install and Secure MongoDB

## Objective

Install MongoDB Community Edition, configure authentication, create the required users, and verify that your MongoDB server is ready for development.

---

## Prerequisites

Install the following software:

- MongoDB Community Server
- MongoDB Compass
- MongoDB Shell (`mongosh`)

---

## Task 1 — Install MongoDB

Install MongoDB on your computer.

Verify that:

- The MongoDB service is running.
- You can connect to the local server using MongoDB Compass.
- You can connect using `mongosh`.

---

## Task 2 — Create a Root Administrator

Using MongoDB Shell:

- Switch to the `admin` database.
- Create a root administrator account.
- Verify that the administrator account was created successfully.

---

## Task 3 — Enable Authentication

Configure MongoDB so that authentication is required.

After enabling authentication:

- Restart MongoDB.
- Verify that anonymous connections are no longer allowed.
- Log in successfully using the administrator account you created.

---

## Task 4 — Create the Application Database

Create a database named:

```text
support_desk_db
```

Inside this database:

- Create an application user.
- Grant only the permissions required for the application to read and write data.
- Verify that the application user can successfully log in.

---

## Task 5 — Create Sample Data

Inside `support_desk_db`:

- Create a `tickets` collection.
- Insert at least one ticket document.
- Verify that the document was saved successfully.

The document should contain fields such as:

- title
- description
- category
- priority
- status
- createdBy
- createdAt

Use your own sample values.

---

## Task 6 — Verify Using MongoDB Compass

Connect to MongoDB Compass using the application user.

Verify that:

- `support_desk_db` exists.
- `tickets` exists.
- Your sample document is visible.

---

## Submission

Submit screenshots showing:

1. MongoDB running successfully.
2. Successful login using the administrator account.
3. Successful login using the application account.
4. MongoDB Compass connected successfully.
5. The `support_desk_db` database.
6. The `tickets` collection.
7. At least one ticket document.

---

## Reflection Questions

1. What is the purpose of the `admin` database?

   The `admin` database is MongoDB's special administrative database. It's where server-wide user credentials live (like the `root` account I created) and where server-wide commands run — things like listing all databases, managing replication, or shutting down the server. It isn't meant to hold application data; it's purely for authentication and cluster/server administration.

2. Why should an application use its own database user instead of the root administrator?

   Least privilege. `support_desk_app` only has `readWrite` on `support_desk_db`, so it can only touch that one database — it can't create/drop other databases, manage users, or read data that belongs to a different application. If the app's credentials ever leaked (e.g. in a log file, a committed `.env`, or a compromised server), the damage is contained to one database instead of the entire MongoDB instance. Root credentials should only ever be used for manual admin tasks, never embedded in application config.

3. What is the difference between authentication and authorization?

   Authentication answers "who are you?" — proving your identity with a username and password (e.g. `mongosh -u support_desk_app -p`). Authorization answers "what are you allowed to do?" — once logged in, MongoDB checks the roles granted to that user to decide whether a specific action is permitted. I saw this directly: logging in as `support_desk_app` succeeds (authentication passes), but running a command outside `support_desk_db` fails with "unauthorized" (authorization fails) because that user's role doesn't grant it.

4. What would happen if authentication was disabled on a production database?

   Anyone who could reach the server's port would be able to connect with no credentials at all and freely read, modify, or delete every database on the server — there'd be no identity check and no way to tell who did what. This is exactly how many real-world MongoDB data breaches and ransomware incidents have happened: attackers scan the internet for MongoDB instances left open without authentication and wipe or exfiltrate the data. It's a critical, not optional, setting for anything beyond local development.
