const AIReport = require("../models/AIReport");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ── Lazy Gemini client ─────────────────────────────────
let genAI = null;
const getGenAI = () => {
  if (
    !genAI &&
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== "your_gemini_api_key_here"
  ) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

// ── System context for Fikru's assistant ──────────────
const SYSTEM_CONTEXT = `You are a smart, professional AI assistant for Fikru Gemechu Tadese.

Background:
- Computer Science graduate from Ethiopia
- Junior IT Officer & Network Administrator at Habesha Cement S.C.
- Skills: Networking, DHCP/DNS, Windows Server, Ubuntu Linux, React.js, Node.js, MongoDB, JavaScript
- Building a Personal AI Life & Business Assistant platform
- Located in Addis Ababa / Holeta, Ethiopia
- Goals: Become a Full-Stack Developer, launch an AI platform, advance in IT career

Your role:
- Give practical, actionable, and specific advice
- Consider the Ethiopian tech landscape and market when relevant
- For career advice: be specific to IT/networking/software development
- For business ideas: consider Ethiopian market context
- Format responses clearly with bullet points or numbered lists when helpful
- Be encouraging but realistic
- Keep responses focused and useful (not overly long unless detailed plan is requested)`;

// ── Build type-specific prompt ─────────────────────────
const buildPrompt = (userPrompt, type) => {
  switch (type) {
    case "business":
      return `${SYSTEM_CONTEXT}\n\nThe user wants a business plan analysis for:\n"${userPrompt}"\n\nProvide strategic insights, market analysis, and key recommendations.`;
    case "analysis":
      return `${SYSTEM_CONTEXT}\n\nThe user is requesting an analysis:\n"${userPrompt}"\n\nProvide a thorough, structured analysis with clear insights.`;
    case "career":
      return `${SYSTEM_CONTEXT}\n\nCareer question:\n"${userPrompt}"\n\nProvide specific, actionable career guidance.`;
    default:
      return `${SYSTEM_CONTEXT}\n\nUser message:\n"${userPrompt}"`;
  }
};

// ── Call Gemini API ────────────────────────────────────
const generateAIResponse = async (prompt, type) => {
  const client = getGenAI();

  if (!client) {
    return [
      `⚠️  AI key not configured yet.`,
      ``,
      `To enable real AI responses:`,
      `1. Visit https://aistudio.google.com/app/apikey`,
      `2. Sign in with Google and create a free API key`,
      `3. Open backend/.env and set:`,
      `   GEMINI_API_KEY=your_actual_key_here`,
      `4. Save the file — the server will restart automatically`,
      ``,
      `Once set up, you'll get real AI-powered responses from Google Gemini 1.5 Flash.`,
    ].join("\n");
  }

  const model  = client.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(buildPrompt(prompt, type));
  return result.response.text();
};

// ── Controllers ────────────────────────────────────────

// @desc   Get all AI reports for logged-in user
// @route  GET /api/ai
const getReports = async (req, res) => {
  try {
    const reports = await AIReport.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Send a prompt and get an AI response
// @route  POST /api/ai/chat
const chat = async (req, res) => {
  const { prompt, type } = req.body;
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  try {
    console.log(`\n🤖 AI Request [${type || "chat"}]: "${prompt.slice(0, 80)}…"`);
    const response = await generateAIResponse(prompt.trim(), type || "chat");
    console.log(`   ✅ AI responded (${response.length} chars)`);

    const report = await AIReport.create({
      user: req.user._id,
      prompt: prompt.trim(),
      response,
      type: type || "chat",
    });

    res.status(201).json(report);
  } catch (err) {
    console.error("❌ AI Error:", err.message);
    res.status(500).json({ message: "AI generation failed: " + err.message });
  }
};

// @desc   Delete an AI report
// @route  DELETE /api/ai/:id
const deleteReport = async (req, res) => {
  try {
    const report = await AIReport.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json({ message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get AI usage stats for logged-in user
// @route  GET /api/ai/stats
const getStats = async (req, res) => {
  try {
    const total    = await AIReport.countDocuments({ user: req.user._id });
    const byType   = await AIReport.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);
    const latest   = await AIReport.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ total, byType, lastUsed: latest?.createdAt || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getReports, chat, deleteReport, getStats };
