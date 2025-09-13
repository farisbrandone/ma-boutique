import mongoose from "mongoose";

export type productType = {
  _id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  brand: number;
  countInStock: number;
  description: string;
  rating: number;

  ratings: number[];
  totalRatings: number;

  numReviews: number;

  reviews: string[];

  isFeatured: Boolean;

  banner: string;
};

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    ratings: [
      {
        type: Number,
        required: true,
        default: 0,
      },
    ],
    totalRatings: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: [
      {
        type: String,
        required: true,
      },
    ],
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    banner: String,
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
