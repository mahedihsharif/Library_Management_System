import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import bookRouter from "./app/controllers/book.controller";
import borrowRouter from "./app/controllers/borrow.controller";

const app: Application = express();
//middleware for received json data
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "https://library-management-app-one-mu.vercel.app",
    ],
  })
);

//routing
app.use("/api", bookRouter);
app.use("/api", borrowRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management System!");
});

//not found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

//global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    error: err,
  });
});
export default app;
