import dotenv from "dotenv";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
dotenv.config();
let server: Server;

const PORT = 5000;
async function main() {
  await mongoose.connect(`${process.env.MONGODB_URI}`);
  console.log("Mongodb connected successfully!");
  try {
    server = app.listen(PORT, () => {
      console.log(`App is listening ar port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
