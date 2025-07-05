import express, { Request, Response } from "express";
import Book from "../models/book.model";

const bookRouter = express.Router();

//create a new book
bookRouter.post("/create-book", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const newBook = await Book.create(body);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: newBook,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

//get books based on filter
bookRouter.get("/books", async (req: Request, res: Response): Promise<any> => {
  try {
    const { filter, sortBy, sort, limit } = req.query;
    //filter match based on genre
    const matchQuery: Record<string, any> = {};
    if (typeof filter === "string") {
      matchQuery.genre = filter;
    }

    //sort by createdAt and sorting by asc or dsc
    const sortField = typeof sortBy === "string" ? sortBy : "createdAt";
    const sortOrder: 1 | -1 = sort === "asc" ? 1 : -1;

    //parse limit value
    let limitNumber = 10;
    if (typeof limit === "string") {
      const parsed = parseInt(limit, 10);
      if (!isNaN(parsed) && parsed > 0) {
        limitNumber = parsed;
      }
    }

    //check condition for query values if any of this query available it works.
    if (filter || sortBy || sort || limit) {
      const books = await Book.find(matchQuery)
        .sort({ [sortField]: sortOrder })
        .limit(limitNumber);
      return res.status(200).json({
        success: true,
        message: "Books retrieved successfully",
        data: books,
      });
    }
    //if no query available so all data will retrieved.
    else {
      const books = await Book.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        message: "Books retrieved successfully",
        data: books,
      });
    }
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

//get a single book
bookRouter.get(
  "/books/:id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const book = await Book.findById(id);
      //if not found this book
      if (!book) {
        res.status(404).json({
          message: "Book not found!",
        });
      }
      //if found this book
      res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        data: book,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        error,
      });
    }
  }
);

//update a note
bookRouter.put(
  "/edit-book/:id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const updatedBookData = req.body;

      const existingBook = await Book.findById(id);
      if (!existingBook) {
        return res.status(404).json({
          message: "Book not found to update",
        });
      }

      if (!updatedBookData) {
        return res.status(200).json({
          success: false,
          message: "Book Data Not Found to Update Book",
          data: null,
        });
      }

      const updatedBook = await Book.findByIdAndUpdate(id, updatedBookData, {
        new: true,
      });
      if (updatedBook && updatedBook.copies > 0) {
        updatedBook.updateAvailability();
        updatedBook.save();
      }

      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        error,
      });
    }
  }
);

//update a user
bookRouter.delete(
  "/books/:bookId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { bookId } = req.params;
      const existingBook = await Book.findById(bookId);
      if (!existingBook) {
        return res.status(404).json({
          message: "Book not found to delete",
        });
      }
      await Book.findOneAndDelete({ _id: bookId });

      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: null,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        error,
      });
    }
  }
);

export default bookRouter;
