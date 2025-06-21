**Library Management System API**

The **Library Management System API** is a robust RESTful service built using Node.js**, **Express**, **Mongoose**, and **TypeScript**. It enables users to manage a collection of books, borrow books, and track borrowing records with real-time updates to inventory. This backend system is for educational use.

---
**Installation & Setup**

To run this project locally, follow the steps below:

**Prerequisites**

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (local or cloud, like MongoDB Atlas)

**Clone the Repository**

`git clone https://github.com/your-username/library-management-system.git` <br> 
`cd library-management-system`

**Install Dependencies** <br> 
`npm install`

**Start Development Server** <br> 
`npm run dev`

**Project Structure**
├── src/
│   ├── controllers/        
│   ├── models/             
│   ├── interfaces/                          
│   ├── app.ts              
│   └── server.ts          
├── package.json
└── tsconfig.json

*Models* <br> 
**Book Model** <br> 
1. title (string) – Required
2. author (string) – Required
3. genre (enum) – One of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY
4. isbn (string) – Required, unique (auto-generated if not provided)
5. description (string) – Optional
6. copies (number) – Required, must be a non-negative integer
7. available (boolean) – Automatically updated based on copies

**Borrow Model** <br> 
1. book (ObjectId) – Reference to the Book
2. quantity (number) – Number of copies borrowed
3. dueDate (Date) – Expected return date

**Features** <br> 
**Book Management (CRUD)** <br> 
1. Create a book: Add a new book to the collection with all required fields. ISBN is auto-generated if not supplied.
2. Read (Get) books: Retrieve books using filters, sorting and limit via query parameters.
3. Update book: Modify book details like title, author, description, or available copies.
4. Delete book: Remove a book permanently from the system.

**Borrowing System** <br> 
1. Borrow a book: Users can borrow books if the number of available copies is sufficient.
2. Automatic inventory update: The system decreases the number of copies when a book is borrowed.
3. Auto set availability: If a book’s copies reach 0, it is automatically marked as available: false using a Mongoose instance method.
4. Validation: Prevents over-borrowing if requested quantity exceeds available stock.


**Borrow Summary Endpoint** <br> 
Displays the total borrowed quantity of each book. <br> 
***Example Output:*** <br> 
`[
  {
    "book": {
      "title": "The Theory of Everything",
      "isbn": "9780553380163"
    },
    "totalQuantity": 5
  },
  {
    "book": {
      "title": "1984",
      "isbn": "9780451524935"
    },
    "totalQuantity": 3
  }
]`

**Technologies Used** <br> 
1. Node.js – JavaScript runtime
2. Express.js – Backend web framework
3. MongoDB – NoSQL database
4. Mongoose – MongoDB ODM for schema validation
5. TypeScript – For strong typing and developer tooling

** Error Handling** <br> 
The project includes a centralized global error handler, which captures and formats all runtime, validation, and custom errors in a consistent JSON format. <br> 
**Example Error Response** <br> 
`{ 
  "success": false,
  "message": "Book validation failed: copies must be a non-negative integer",
  "error": {
    "name": "ValidationError",
    "path": "copies"
  }
}`

**Future Enhancements (Ideas)** <br> 
* JWT-based user authentication
* Admin/user roles for managing books vs borrowing
* Overdue fine calculations
* PDF or CSV borrow reports


