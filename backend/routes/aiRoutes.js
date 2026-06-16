const express = require("express");
const router  = express.Router();
const { getReports, chat, deleteReport, getStats } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.get("/",        protect, getReports);
router.get("/stats",   protect, getStats);
router.post("/chat",   protect, chat);
router.delete("/:id",  protect, deleteReport);

module.exports = router;
