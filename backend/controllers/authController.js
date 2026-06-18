const crypto     = require("crypto");
const nodemailer = require("nodemailer");
const User       = require("../models/User");
const { generateToken } = require("../config/jwt");

// ── Helpers ────────────────────────────────────────────
const emailConfigured = () => {
  const p = process.env.EMAIL_PASS;
  return p && p !== "your_16char_app_password_here" && p !== "your_gmail_app_password_here" && p.length >= 8;
};

const sendResetEmail = async (toEmail, toName, resetURL) => {
  // Always print to terminal so you can test without email
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║        🔐 PASSWORD RESET LINK            ║");
  console.log("╠══════════════════════════════════════════╣");
  console.log(`║  To   : ${toEmail.padEnd(33)}║`);
  console.log(`║  Name : ${toName.padEnd(33)}║`);
  console.log("╠══════════════════════════════════════════╣");
  console.log("║  LINK (copy & open in browser):          ║");
  console.log(`║  ${resetURL.slice(0, 40)}  ║`);
  console.log("╚══════════════════════════════════════════╝");
  console.log("Full link:", resetURL, "\n");

  if (!emailConfigured()) {
    console.warn("⚠️  EMAIL_PASS not set — email not sent. Use the link above.\n");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0"
  style="background:#1a1a1a;border-radius:10px;border:1px solid #2a2a2a;overflow:hidden;">

  <tr>
    <td style="background:linear-gradient(135deg,#0a3d62,#16213e);padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:1.3rem;">🔐 PASSWORD RESET</h1>
      <p style="margin:6px 0 0;color:#99c5e5;font-size:0.82rem;">Fikru Portfolio · AI Assistant</p>
    </td>
  </tr>

  <tr>
    <td style="padding:32px;">
      <p style="color:#ccc;margin:0 0 14px;">Hi <strong style="color:#fff">${toName}</strong>,</p>
      <p style="color:#888;line-height:1.8;margin:0 0 28px;">
        We received a request to reset your password.<br>
        Click the button below — this link expires in
        <strong style="color:#00bcd4">1 hour</strong>.
      </p>

      <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="background:#00bcd4;border-radius:6px;">
            <a href="${resetURL}"
              style="display:inline-block;padding:14px 32px;color:#111;
                     font-weight:700;text-decoration:none;font-size:0.92rem;
                     letter-spacing:1px;text-transform:uppercase;">
              Reset My Password
            </a>
          </td>
        </tr>
      </table>

      <p style="color:#555;font-size:0.8rem;line-height:1.7;margin:0 0 20px;">
        If you didn't request this, you can safely ignore this email.
      </p>
      <hr style="border:none;border-top:1px solid #2a2a2a;margin:20px 0;">
      <p style="color:#444;font-size:0.76rem;margin:0;">
        Or copy this link:<br>
        <a href="${resetURL}" style="color:#00bcd4;word-break:break-all;">${resetURL}</a>
      </p>
    </td>
  </tr>

  <tr>
    <td style="background:#111;padding:18px 32px;border-top:1px solid #222;text-align:center;">
      <p style="color:#333;font-size:0.72rem;margin:0;">
        © ${new Date().getFullYear()} Fikru Gemechu Tadese · Addis Ababa, Ethiopia
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to:      toEmail,
    subject: "🔐 Reset Your Password — Fikru Portfolio",
    html,
  });

  console.log(`✅ Reset email sent to: ${toEmail}\n`);
};

// ── Register ───────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Please fill all fields" });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password });
    console.log(`✅ Registered: ${email}`);

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Login ──────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Please fill all fields" });

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      console.log(`✅ Login: ${email}`);
      res.json({
        _id: user._id, name: user.name, email: user.email,
        role: user.role, token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Get current user ───────────────────────────────────
const getMe = async (req, res) => {
  const { _id, name, email, role } = req.user;
  res.json({ _id, name, email, role });
};

// ── Forgot Password ────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const successMsg = "If that email is registered, a reset link has been sent.";
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.log(`⚠️  Forgot password: ${email} not in DB`);
      return res.json({ message: successMsg });
    }

    // Generate token
    const rawToken    = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken   = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_URL || "https://fikrugemechu.netlify.app"}/reset-password/${rawToken}`;

    try {
      await sendResetEmail(user.email, user.name, resetURL);
    } catch (emailErr) {
      // Email failed but link is printed in terminal — don't block the user
      console.error("❌ Email error:", emailErr.message);
      console.log("👆 Use the terminal link above to reset password.\n");
    }

    res.json({ message: successMsg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Reset Password ─────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { token }    = req.params;
    const { password } = req.body;

    if (!password || password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken:   hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Reset link is invalid or has expired" });

    user.password             = password;
    user.resetPasswordToken   = null;
    user.resetPasswordExpires = null;
    await user.save();

    console.log(`✅ Password reset for: ${user.email}`);
    res.json({
      message: "Password reset successful. You can now log in.",
      token: generateToken(user._id),
      _id: user._id, name: user.name, email: user.email, role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Verify reset token ─────────────────────────────────
const verifyResetToken = async (req, res) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken:   hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ valid: false, message: "Link is invalid or expired" });
    res.json({ valid: true, email: user.email });
  } catch (err) {
    res.status(500).json({ valid: false, message: err.message });
  }
};

module.exports = { registerUser, loginUser, getMe, forgotPassword, resetPassword, verifyResetToken };
