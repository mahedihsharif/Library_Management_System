import { Model, model, Schema } from "mongoose";
import { BookInstanceMethods, IBook } from "../interfaces/book.interface";
import Borrow from "./borrow.model";

//dynamic generate ISBN
const generateISBN = () => {
  return "978" + Math.floor(1000000000 + Math.random() * 9000000000);
};

const bookSchema = new Schema<IBook, Model<IBook>, BookInstanceMethods>(
  {
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
        validator: function (value: any) {
          return typeof value === "number" && Number.isInteger(value);
        },
        message: "Copies must be a valid integer number.",
      },
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

//instance method
bookSchema.method("updateAvailability", async function () {
  this.available = this.copies > 0;
});

//pre hooks
bookSchema.pre("save", function (next) {
  if (!this.isbn) {
    this.isbn = generateISBN();
  }
  next();
});

//post hooks
bookSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) {
    await Borrow.deleteMany({ book: doc._id });
  }
  next();
});

const Book = model("Book", bookSchema);

export default Book;
