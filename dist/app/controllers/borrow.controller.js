"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_model_1 = __importDefault(require("../models/book.model"));
const borrow_model_1 = __importDefault(require("../models/borrow.model"));
const borrowRouter = express_1.default.Router();
//create a borrow book
borrowRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book, quantity, dueDate } = req.body;
        //check if not found anything like: book, quantity and dueDate..
        if (!book || !quantity || !dueDate) {
            return res.status(400).json({ message: "Missing required fields." });
        }
        //Find the book
        const foundBook = yield book_model_1.default.findById(book);
        if (!foundBook) {
            return res.status(404).json({ message: "Book not found." });
        }
        //Check available copies
        if (foundBook.copies < quantity) {
            return res.status(400).json({ message: "Not enough copies available." });
        }
        //Deduct copies
        foundBook.copies -= quantity;
        //Update availability
        foundBook.updateAvailability();
        //Save book and borrow record
        yield foundBook.save();
        const borrowBook = yield borrow_model_1.default.create({
            book,
            quantity,
            dueDate,
        });
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully.",
            data: borrowBook,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            error,
        });
    }
}));
//get all borrow book
borrowRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.default.aggregate([
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
            res.status(201).json({
                success: true,
                message: "Borrowed books summary retrieved successfully",
                data: summary,
            });
        }
        else {
            res.status(201).json({
                success: true,
                message: "No book found to retrieved",
            });
        }
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            error,
        });
    }
}));
exports.default = borrowRouter;
