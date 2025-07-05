"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const book_controller_1 = __importDefault(require("./app/controllers/book.controller"));
const borrow_controller_1 = __importDefault(require("./app/controllers/borrow.controller"));
const app = (0, express_1.default)();
//middleware for received json data
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://library-management-app-one-mu.vercel.app",
    ],
}));
//routing
app.use("/api", book_controller_1.default);
app.use("/api", borrow_controller_1.default);
app.get("/", (req, res) => {
    res.send("Welcome to Library Management System!");
});
//not found route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
    });
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
