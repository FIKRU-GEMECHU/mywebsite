const Goal = require("../models/Goals");

// @desc   Get all goals for logged-in user
// @route  GET /api/goals
const getGoals = async (req, res) => {
  const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(goals);
};

// @desc   Create a goal
// @route  POST /api/goals
const createGoal = async (req, res) => {
  const { title, description, targetDate } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const goal = await Goal.create({
    user: req.user._id, title, description, targetDate,
  });
  res.status(201).json(goal);
};

// @desc   Update a goal
// @route  PUT /api/goals/:id
const updateGoal = async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
  if (!goal) return res.status(404).json({ message: "Goal not found" });

  Object.assign(goal, req.body);
  const updated = await goal.save();
  res.json(updated);
};

// @desc   Delete a goal
// @route  DELETE /api/goals/:id
const deleteGoal = async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!goal) return res.status(404).json({ message: "Goal not found" });
  res.json({ message: "Goal deleted" });
};

module.exports = { getGoals, createGoal, updateGoal, deleteGoal };
