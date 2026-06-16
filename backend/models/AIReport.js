const mongoose = require("mongoose");

const aiReportSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    prompt:   { type: String, required: true },
    response: { type: String, default: "" },
    type:     { type: String, enum: ["chat", "analysis", "business"], default: "chat" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AIReport", aiReportSchema);
