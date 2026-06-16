const mongoose = require("mongoose");

const businessPlanSchema = new mongoose.Schema(
  {
    user:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    idea:          { type: String, required: true, trim: true },
    generatedPlan: { type: String, default: "" },
    status:        { type: String, enum: ["draft", "active", "archived"], default: "draft" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BusinessPlan", businessPlanSchema);
