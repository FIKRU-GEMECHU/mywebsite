const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    progress:    { type: Number, min: 0, max: 100, default: 0 },
    completed:   { type: Boolean, default: false },
    targetDate:  { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);
