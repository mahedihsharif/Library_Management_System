"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = __importDefault(require("./app/controllers/book.controller"));
const borrow_controller_1 = __importDefault(require("./app/controllers/borrow.controller"));
const app = (0, express_1.default)();
//middleware for received json data
app.use(express_1.default.json());
//routing
app.use("/api/books", book_controller_1.default);
app.use("/api/borrow", borrow_controller_1.default);
//not found route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
    });
});
app.get("/", (req, res) => {
    res.send("Welcome to Library Management System!");
});
//global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    res.status(statusCode).json({
        success: false,
        message,
        error: err,
    });
});
exports.default = app;
