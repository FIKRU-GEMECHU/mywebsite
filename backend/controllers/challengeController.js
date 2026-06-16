const Challenge = require("../models/Challenge");

// @desc   Get all challenges for logged-in user
// @route  GET /api/challenges
const getChallenges = async (req, res) => {
  const challenges = await Challenge.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(challenges);
};

// @desc   Create a challenge
// @route  POST /api/challenges
const createChallenge = async (req, res) => {
  const { title, description, dueDate } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const challenge = await Challenge.create({
    user: req.user._id, title, description, dueDate,
  });
  res.status(201).json(challenge);
};

// @desc   Update a challenge
// @route  PUT /api/challenges/:id
const updateChallenge = async (req, res) => {
  const challenge = await Challenge.findOne({ _id: req.params.id, user: req.user._id });
  if (!challenge) return res.status(404).json({ message: "Challenge not found" });

  Object.assign(challenge, req.body);
  const updated = await challenge.save();
  res.json(updated);
};

// @desc   Delete a challenge
// @route  DELETE /api/challenges/:id
const deleteChallenge = async (req, res) => {
  const challenge = await Challenge.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!challenge) return res.status(404).json({ message: "Challenge not found" });
  res.json({ message: "Challenge deleted" });
};

module.exports = { getChallenges, createChallenge, updateChallenge, deleteChallenge };
