import mongoose from "mongoose";

interface connectionType {
  isConnected?: number;
}

const connection: connectionType = {};

async function connect() {
  if (connection.isConnected) {
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.MONGODB_URI as string);
  connection.isConnected = db.connections[0].readyState;
}

async function disconnect() {
  if (connection.isConnected === 1) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = 0;
    } else {
      console.log("not disconnected");
    }
  }
}

function convertDocToObj(doc: any) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

const db = { connect, disconnect, convertDocToObj };
export default db;
