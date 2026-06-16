const BusinessPlan = require("../models/BusinessPlan");
const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;
const getGenAI = () => {
  if (!genAI && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

const generatePlan = async (idea) => {
  const client = getGenAI();

  if (!client) {
    // Fallback template if no API key
    return `## Business Plan: ${idea}

### Executive Summary
A focused venture targeting the "${idea}" opportunity in Ethiopia and beyond.

### Problem Statement
Identify the core problem this idea solves and who is most affected.

### Proposed Solution
Describe your product or service. What makes it unique?

### Target Market
- Primary: Define your main audience
- Geography: Local (Ethiopia) / Regional / Global
- Estimated market size

### Revenue Model
- Subscription / SaaS fees
- Transaction / commission fees
- One-time product sales
- Consulting / professional services

### Competitive Advantage
What makes your offering stand out from existing solutions?

### Roadmap
1. Market research & validation (Month 1–2)
2. Build Minimum Viable Product (Month 3–5)
3. Beta launch & gather user feedback (Month 6)
4. Iterate and improve (Month 7–8)
5. Scale marketing & sales (Month 9+)

### Financial Projections
- Startup costs: Estimate initial investment required
- Monthly burn rate: Operating expenses per month
- Revenue target: Break-even timeline

### Next Steps
1. Validate the idea with 10 potential customers
2. Build a simple landing page
3. Apply for startup funding or grants
4. Find a technical co-founder if needed

---
⚠️ Add GEMINI_API_KEY to .env for AI-generated plans.`;
  }

  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `You are a professional business consultant. Create a comprehensive, detailed, and actionable business plan for the following business idea from an entrepreneur in Ethiopia:

Business Idea: ${idea}

Structure the plan with these sections:
1. Executive Summary
2. Problem Statement
3. Proposed Solution
4. Target Market & Customer Segments
5. Revenue Model & Pricing Strategy
6. Competitive Analysis
7. Marketing & Sales Strategy
8. Operations Plan
9. Team Requirements
10. Financial Projections (Year 1–3)
11. Risks & Mitigation
12. Roadmap & Milestones

Be specific, practical, and tailored to the Ethiopian market context where relevant. Use markdown formatting.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

// @desc   Get all business plans for logged-in user
// @route  GET /api/business
const getPlans = async (req, res) => {
  try {
    const plans = await BusinessPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Create / generate a business plan
// @route  POST /api/business
const createPlan = async (req, res) => {
  const { idea } = req.body;
  if (!idea) return res.status(400).json({ message: "Business idea is required" });

  try {
    const generatedPlan = await generatePlan(idea);
    const plan = await BusinessPlan.create({
      user: req.user._id, idea, generatedPlan,
    });
    res.status(201).json(plan);
  } catch (err) {
    console.error("Business plan error:", err.message);
    res.status(500).json({ message: "Plan generation failed: " + err.message });
  }
};

// @desc   Update a business plan
// @route  PUT /api/business/:id
const updatePlan = async (req, res) => {
  try {
    const plan = await BusinessPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    Object.assign(plan, req.body);
    res.json(await plan.save());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Delete a business plan
// @route  DELETE /api/business/:id
const deletePlan = async (req, res) => {
  try {
    const plan = await BusinessPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPlans, createPlan, updatePlan, deletePlan };
