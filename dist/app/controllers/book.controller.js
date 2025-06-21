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
const bookRouter = express_1.default.Router();
//create a new book
bookRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const newBook = yield book_model_1.default.create(body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: newBook,
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
//get books based on filter
bookRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy, sort, limit } = req.query;
        //filter match based on genre
        const matchQuery = {};
        if (typeof filter === "string") {
            matchQuery.genre = filter;
        }
        //sort by createdAt and sorting by asc or dsc
        const sortField = typeof sortBy === "string" ? sortBy : "createdAt";
        const sortOrder = sort === "asc" ? 1 : -1;
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
            const books = yield book_model_1.default.find(matchQuery)
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
            const books = yield book_model_1.default.find();
            return res.status(200).json({
                success: true,
                message: "Books retrieved successfully",
                data: books,
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
//get a single user
bookRouter.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const book = yield book_model_1.default.findById(bookId);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            error,
        });
    }
}));
//update a note
bookRouter.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const existingBook = yield book_model_1.default.findById(bookId);
        if (!existingBook) {
            return res.status(404).json({
                message: "Book not found to update",
            });
        }
        const updatedBook = yield book_model_1.default.findByIdAndUpdate(bookId, req.body, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook,
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
//update a user
bookRouter.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const existingBook = yield book_model_1.default.findById(bookId);
        if (!existingBook) {
            return res.status(404).json({
                message: "Book not found to delete",
            });
        }
        yield book_model_1.default.findOneAndDelete({ _id: bookId });
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
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
exports.default = bookRouter;
