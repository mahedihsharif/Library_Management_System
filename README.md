Live Link Api: https://library-management-system-six-dusky.vercel.app/

# 📚 Library Management System – Backend API

This is the **backend API** for the Library Management System built using **Node.js**, **Express**, **MongoDB**, and **Mongoose**. It provides RESTful API endpoints for managing books and borrowing functionality.

---

## 🛠️ Tech Stack

| Tech       | Description                         |
| ---------- | ----------------------------------- |
| Node.js    | JavaScript runtime for backend      |
| Express.js | Web framework for API creation      |
| MongoDB    | NoSQL database for storing data     |
| Mongoose   | ODM for MongoDB and schema modeling |
| CORS       | Middleware for enabling CORS        |

---

## 🚀 Features

### 📚 Book Management

- `GET /api/books` – Get all books
- `GET /api/books/:id` – Get a single book by ID
- `POST /api/books` – Create a new book
- `PUT /api/books/:id` – Update an existing book
- `DELETE /api/books/:id` – Delete a book

**Business Logic:**

- When copies = 0 → book is marked as `available: false`
- ISBN must be unique per book

---

### 📦 Borrow Functionality

- `POST /api/borrow` – Borrow a book
  - Validates quantity (must be ≤ available copies)
  - Deducts quantity from `copies`
  - Marks `available = false` if `copies === 0`
- `GET /api/borrow-summary` – Get summary of all borrowed books
  - Aggregates total quantity per book

---

## ⚙️ Installation & Setup

### ✅ Prerequisites

- Node.js (v18 or above)
- MongoDB installed and running locally or a cloud URI (e.g. MongoDB Atlas)

---

### 📦 Setup Instructions

```bash
# 1. Clone the repository
git https://github.com/mahedihsharif/Library_Management_System.git
cd Library_Management_System

# 2. Install dependencies
npm install

# 3. Create a .env file in the root directory and add:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library-management

# 4. Run the server
npm run dev

📁 Folder Structure
.
├── controllers/       # Business logic for routes
├── models/            # Mongoose schemas
├── routes/            # Route handlers
├── middleware/        # Custom middlewares (if any)
├── config/            # DB connection config
├── app.js             # Express app setup
├── server.js          # App entry point
└── .env               # Environment variables
```
