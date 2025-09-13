// models/CarouselSlide.js
const mongoose = require("mongoose");

const carouselSlideSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const CarouselSlide =
  mongoose.models.CarouselSlide ||
  mongoose.model("CarouselSlide", carouselSlideSchema);
export default CarouselSlide;
