import dbConnect from "@/app/lib/mongodb";
import { models } from "mongoose";
//import mongoose from "mongoose";
import { Schema, model, Document, Model } from "mongoose";

/*await dbConnect();*/

export interface userType {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  /* createdAt: Date;
  updatedAt: Date; */
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}
interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.statics.findByEmail = async function (email: string) {
  await dbConnect();
  return this.findOne({ email });
};

const User: Model<IUser> = models.User || model<IUser>("User", userSchema);
export default User;
