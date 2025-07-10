import express, { Request, Response } from "express";
import Book from "../models/book.model";
import Borrow from "../models/borrow.model";
const borrowRouter = express.Router();

//create a borrow book with params id
borrowRouter.post(
  "/borrow/:bookId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { bookId } = req.params;
      const { quantity, dueDate } = req.body;
      //check if not found anything like: book, quantity and dueDate..
      if (!bookId || !quantity || !dueDate) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      //Find the book
      const foundBook = await Book.findById(bookId);
      if (!foundBook) {
        return res.status(404).json({ message: "Book not found." });
      }

      //Check available copies
      if (foundBook.copies < quantity) {
        return res
          .status(400)
          .json({ message: "Not enough copies available." });
      }

      //Deduct copies
      foundBook.copies -= quantity;

      //Update availability
      foundBook.updateAvailability();

      //Save book and borrow record
      await foundBook.save();

      const borrowBookData = {
        book: bookId,
        quantity: quantity,
        dueDate: dueDate,
      };
      const borrowBook = await Borrow.create(borrowBookData);

      res.status(201).json({
        success: true,
        message: "Book borrowed successfully.",
        data: borrowBook,
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

//create a borrow book without params id
// borrowRouter.post(
//   "/borrow",
//   async (req: Request, res: Response): Promise<any> => {
//     try {
//       const { book, quantity, dueDate } = req.body;

//       //check if not found anything like: book, quantity and dueDate..
//       if (!book || !quantity || !dueDate) {
//         return res.status(400).json({ message: "Missing required fields." });
//       }

//       //Find the book
//       const foundBook = await Book.findById(book);
//       if (!foundBook) {
//         return res.status(404).json({ message: "Book not found." });
//       }

//       //Check available copies
//       if (foundBook.copies < quantity) {
//         return res
//           .status(400)
//           .json({ message: "Not enough copies available." });
//       }

//       //Deduct copies
//       foundBook.copies -= quantity;

//       //Update availability
//       foundBook.updateAvailability();

//       //Save book and borrow record
//       await foundBook.save();

//       const borrowBook = await Borrow.create({
//         book,
//         quantity,
//         dueDate,
//       });

//       res.status(201).json({
//         success: true,
//         message: "Book borrowed successfully.",
//         data: borrowBook,
//       });
//     } catch (error: any) {
//       res.status(400).json({
//         success: false,
//         message: error.message,
//         error,
//       });
//     }
//   }
// );

//get all borrow book
borrowRouter.get(
  "/borrow-summary",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const summary = await Borrow.aggregate([
        {
          $group: { _id: "$book", totalQuantity: { $sum: "$quantity" } },
        },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "_id",
            as: "bookInfo",
          },
        },
        {
          $unwind: "$bookInfo",
        },
        {
          $project: {
            _id: 0,
            book: {
              title: "$bookInfo.title",
              isbn: "$bookInfo.isbn",
            },
            totalQuantity: 1,
          },
        },
      ]);

      if (summary.length > 0) {
        return res.status(201).json({
          success: true,
          message: "Borrowed books summary retrieved successfully",
          data: summary,
        });
      } else {
        return res.status(404).json({
          success: true,
          message: "No book found to retrieved",
        });
      }
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        error,
      });
    }
  }
);

export default borrowRouter;
