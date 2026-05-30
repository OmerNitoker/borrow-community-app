import mongoose from "mongoose";
import { ITEM_CATEGORIES } from "../constants/categories.js";
import { ITEM_CONDITIONS } from "../constants/itemConditions.js";

const itemImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      default: ""
    }
  },
  { _id: false }
);

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    notes: {
      type: String,
      default: "",
      trim: true
    },
    condition: {
      type: String,
      enum: ITEM_CONDITIONS,
      required: true
    },
    category: {
      type: String,
      enum: ITEM_CATEGORIES,
      required: true
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    images: {
      type: [itemImageSchema],
      default: [],
      validate: {
        validator(images) {
          return images.length <= 3;
        },
        message: "An item can have up to 3 images."
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    hiddenByAdmin: {
      type: Boolean,
      default: false
    },
    hiddenAt: {
      type: Date,
      default: null
    },
    hiddenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    hiddenReason: {
      type: String,
      default: "",
      trim: true
    },
    isDemoItem: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Item = mongoose.model("Item", itemSchema);
