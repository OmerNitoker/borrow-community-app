import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member"
    }
  },
  { timestamps: true }
);

membershipSchema.index({ user: 1, community: 1 }, { unique: true });

export const Membership = mongoose.model("Membership", membershipSchema);
