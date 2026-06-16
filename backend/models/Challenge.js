const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status:      { type: String, enum: ["pending", "in-progress", "done"], default: "pending" },
    dueDate:     { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Challenge", challengeSchema);
