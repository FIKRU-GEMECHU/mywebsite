const express = require ("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB();

const app = express();

/* ── CORS (LIVE SAFE) ── */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://fikrugemechu.netlify.app"
  ],
  credentials: true
}));
app.use(cors({
  origin: process.env.FRONTEND_URL,
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

/* ── Health Check ── */
app.get("/", (req, res) => {
  res.json({ message: "Backend Running Successfully 🚀" });
});

app.get("/api", (req, res) => {
  res.json({ message: "Fikru Portfolio API is LIVE 🚀" });
});

/* ── Error Handling ── */
app.use(notFound);
app.use(errorHandler);

/* ── START SERVER (RENDER READY) ── */
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  const BASE_URL = "https://mywebsite-7.onrender.com";

  console.log("\n╔═══════════════════════════════════════════╗");
  console.log("║     🌐 FIKRU PORTFOLIO BACKEND SERVER     ║");
  console.log("╠═══════════════════════════════════════════╣");
  console.log(`║  🚀 Status  : LIVE                        ║`);
  console.log(`║  🔌 Port    : ${PORT}                          ║`);
  console.log(`║  📡 API     : ${BASE_URL}/api              ║`);
  console.log("╚═══════════════════════════════════════════╝\n");
});
app.use("/api", require("./routes/authRoutes"));