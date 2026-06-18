const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB();

const app = express();

/* ── CORS ── */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://fikrugemechu.netlify.app",
    "https://fikrugemechu.netlify.app/"
  ],
  credentials: true
}));

app.use(express.json());

/* ── Logger ── */
app.use((req, res, next) => {
  const start = Date.now();

  const originalJson = res.json.bind(res);
  res.json = (data) => {
    console.log(`${req.method} ${req.url} → ${res.statusCode} (${Date.now() - start}ms)`);
    return originalJson(data);
  };

  next();
});

/* ── Routes ── */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/challenges", require("./routes/challengeRoutes"));
app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/business", require("./routes/businessRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

/* ── Test Routes ── */
app.get("/", (req, res) => {
  res.json({ message: "Backend Running Successfully 🚀" });
});

app.get("/api", (req, res) => {
  res.json({ message: "Fikru Portfolio API is LIVE 🚀" });
});

/* ── Error Handling ── */
app.use(notFound);
app.use(errorHandler);

/* ── START SERVER (PROPER LOCAL + LIVE FIX) ── */
const PORT = process.env.PORT || 5000;

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://mywebsite-7.onrender.com"
    : `http://localhost:${PORT}`;

app.listen(PORT, "0.0.0.0", () => {
  console.log("\n╔═══════════════════════════════════════════╗");
  console.log("║     🌐 FIKRU PORTFOLIO BACKEND SERVER     ║");
  console.log("╠═══════════════════════════════════════════╣");
  console.log(`║  🚀 Status  : ${process.env.NODE_ENV === "production" ? "LIVE" : "LOCAL"}        ║`);
  console.log(`║  🔌 Port    : ${PORT}                          ║`);
  console.log(`║  📡 API     : ${BASE_URL}/api              ║`);
  console.log("╠═══════════════════════════════════════════╣");
  console.log(`║  🕐 Time    : ${new Date().toLocaleTimeString()}                  ║`);
  console.log("╚═══════════════════════════════════════════╝\n");
});