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
const mongoose_1 = require("mongoose");
const borrow_model_1 = __importDefault(require("./borrow.model"));
//dynamic generate ISBN
const generateISBN = () => {
    return "978" + Math.floor(1000000000 + Math.random() * 9000000000);
};
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Book title is required."],
        trim: true,
    },
    author: {
        type: String,
        required: [true, "Author name is required."],
        trim: true,
    },
    genre: {
        type: String,
        required: [true, "Genre is required."],
        enum: [
            "FICTION",
            "NON_FICTION",
            "SCIENCE",
            "HISTORY",
            "BIOGRAPHY",
            "FANTASY",
        ],
    },
    isbn: {
        type: String,
        required: [true, "isbn is required."],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    copies: {
        type: Number,
        required: [true, "Copies count is required."],
        min: [0, "Copies cannot be negative."],
        validate: {
            validator: function (value) {
                return typeof value === "number" && Number.isInteger(value);
            },
            message: "Copies must be a valid integer number.",
        },
    },
    available: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true, versionKey: false });
//instance method
bookSchema.method("updateAvailability", function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.available = this.copies > 0;
    });
});
//pre hooks
bookSchema.pre("save", function (next) {
    if (!this.isbn) {
        this.isbn = generateISBN();
    }
    next();
});
//post hooks
bookSchema.post("findOneAndDelete", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            yield borrow_model_1.default.deleteMany({ book: doc._id });
        }
        next();
    });
});
const Book = (0, mongoose_1.model)("Book", bookSchema);
exports.default = Book;
