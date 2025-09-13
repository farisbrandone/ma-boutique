// lib/dbConnect.ts
import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://fpamod:VEbwsTe0VHs9JSrV@cluster0.tyidtgu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; /* process.env.MONGODB_URI!; */
console.log({ MONGODB_URI });
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose || { conn: null, promise: null };
async function dbConnect() {
  /*  let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
} */

  console.log("t1d1");

  if (cached.conn) {
    console.log("t2d2");

    return cached.conn;
  }
  console.log("t66d66");
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    console.log("t3d3");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
    console.log("t4d4");
  }
  try {
    console.log("t77d77");
    cached.conn = await cached.promise;
    console.log("t5d5");

    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.log(error);
    throw error;
  }
}

export async function disconnect() {
  if (cached.conn) {
    /*   if (process.env.NODE_ENV === "production") { */
    await mongoose.disconnect();
    cached.promise = null;
    cached.conn = null;
    /*  } else {
      console.log("not disconnected");
    } */
  }
}

export default dbConnect;

export function convertDocToObj<T>(doc: any) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc as T;
}
