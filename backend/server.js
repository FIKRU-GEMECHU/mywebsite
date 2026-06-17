const express = require("express");
const cors    = require("cors");
const dotenv  = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ── Request / Response Logger ──────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  const time  = new Date().toLocaleTimeString();

  // Log incoming request
  console.log(`\n📨 [${time}] ${req.method} ${req.url}`);

  // Log request body (hide passwords)
  if (req.body && Object.keys(req.body).length > 0) {
    const safe = { ...req.body };
    if (safe.password) safe.password = "***";
    console.log("   Body :", JSON.stringify(safe));
  }
  

  // Log token owner if Authorization header present
  if (req.headers.authorization) {
    console.log("   Auth : Bearer token present");
  }
app.get("/favicon.ico", (req, res) => res.status(204));
app.use(express.static("public"));
  // Intercept res.json to log the response
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    const ms     = Date.now() - start;
    const status = res.statusCode;
    const icon   = status >= 400 ? "❌" : "✅";
    console.log(`   ${icon}  ${status} — ${ms}ms`);

    // Show response data (truncate long strings)
    const preview = JSON.stringify(data);
    console.log("   Res  :", preview.length > 200 ? preview.slice(0, 200) + "…" : preview);
    return originalJson(data);
  };

  next();
});

// ── API Routes ─────────────────────────────────────────
app.use("/api/auth",       require("./routes/authRoutes"));
app.use("/api/users",      require("./routes/userRoutes"));
app.use("/api/challenges", require("./routes/challengeRoutes"));
app.use("/api/goals",      require("./routes/goalRoutes"));
app.use("/api/business",   require("./routes/businessRoutes"));
app.use("/api/ai",         require("./routes/aiRoutes"));

app.get("/", (req, res) => res.json({ message: "✅ Backend Running Successfully" }));

// ── Test email route (remove in production) ────────────
app.get("/test-email", async (req, res) => {
  const nodemailer = require("nodemailer");
  const pass = process.env.EMAIL_PASS;

  if (!pass || pass.includes("your_")) {
    return res.status(400).json({
      ok: false,
      message: "EMAIL_PASS not set in .env",
      fix: "Go to https://myaccount.google.com/apppasswords → generate App Password → paste in .env as EMAIL_PASS=yourpassword",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass },
    });

    await transporter.sendMail({
      from:    process.env.EMAIL_USER,
      to:      process.env.EMAIL_USER,
      subject: "✅ Test Email — Backend Working",
      text:    "Your email configuration is working correctly!",
    });

    res.json({ ok: true, message: `✅ Test email sent to ${process.env.EMAIL_USER}` });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message,
      tip: "If error says 'Invalid login': use an App Password, not your regular Gmail password. See https://myaccount.google.com/apppasswords"
    });
  }
});

// ── API Info ───────────────────────────────────────────
app.get("/api", (req, res) => {
  res.json({
    message: "✅ Fikru Portfolio API is running",
    version: "1.0.0",
    endpoints: {
      auth:       ["POST /api/auth/register", "POST /api/auth/login", "GET /api/auth/me"],
      users:      ["GET /api/users", "PUT /api/users/profile", "DELETE /api/users/:id"],
      challenges: ["GET /api/challenges", "POST /api/challenges", "PUT /api/challenges/:id", "DELETE /api/challenges/:id"],
      goals:      ["GET /api/goals", "POST /api/goals", "PUT /api/goals/:id", "DELETE /api/goals/:id"],
      business:   ["GET /api/business", "POST /api/business", "PUT /api/business/:id", "DELETE /api/business/:id"],
      ai:         ["GET /api/ai", "POST /api/ai/chat", "DELETE /api/ai/:id"],
    },
  });
});

// ── Error Handling ─────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("\n╔═══════════════════════════════════════════╗");
  console.log("║     🌐 FIKRU PORTFOLIO BACKEND SERVER     ║");
  console.log("╠═══════════════════════════════════════════╣");
  console.log(`║  🚀 Status  : Running                     ║`);
  console.log(`║  🔌 Port    : ${PORT}                          ║`);
  console.log(`║  📡 API     : http://localhost:${PORT}/api    ║`);
  console.log(`║  🗄️  Database: MongoDB Connected            ║`);
  console.log(`║  🕐 Time    : ${new Date().toLocaleTimeString()}                  ║`);
  console.log("╠═══════════════════════════════════════════╣");
  console.log("║  📌 Routes:                               ║");
  console.log("║     POST  /api/auth/register              ║");
  console.log("║     POST  /api/auth/login                 ║");
  console.log("║     GET   /api/auth/me                    ║");
  console.log("║     GET   /api/challenges                 ║");
  console.log("║     GET   /api/goals                      ║");
  console.log("║     GET   /api/business                   ║");
  console.log("║     POST  /api/ai/chat                    ║");
  console.log("╠═══════════════════════════════════════════╣");
  console.log("║  ✅ Ready to receive requests...          ║");
  console.log("╚═══════════════════════════════════════════╝\n");
});
