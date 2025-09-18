import mongoose from "mongoose";

interface ProductTrue {
  _id: string;
  imageUrl: string[];
  name: string;
  description: string;
  category: string;
  price: number;
  sold: number;
  stock: number;
  displayHome: boolean;
  displaySolde: boolean;
  newProduct: boolean; // Nouveau champ
  exploreProduct: boolean; // Nouveau champ
  discount: number;
}

const productTrueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sold: {
      type: Number,
      required: true,
      default: 0,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    displayHome: {
      type: Boolean,
      default: false,
    },
    displaySolde: {
      type: Boolean,
      default: false,
    },

    newProduct: {
      type: Boolean,
      default: false,
    },
    exploreProduct: {
      type: Boolean,
      default: false,
    },

    discount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

productTrueSchema.index({
  name: "text",
  category: "text",
});

const ProductTrue =
  mongoose.models.ProductTrue ||
  mongoose.model("ProductTrue", productTrueSchema);
export default ProductTrue;
