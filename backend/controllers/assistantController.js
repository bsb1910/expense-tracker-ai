console.log("Using OpenRouter...");
console.log("Key exists:", !!process.env.OPENROUTER_API_KEY);

const axios = require("axios");
const Expense = require("../models/Expense");

const chatWithAssistant = async (req, res) => {
  console.log("=================================");
  console.log("NEW ASSISTANT CONTROLLER EXECUTED");
  console.log("=================================");

  try {
    const { message } = req.body;

    console.log("User Question:");
    console.log(message);

    // Fetch all expenses from MongoDB
    const expenses = await Expense.find();

    // Calculate total expenses
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Calculate category-wise totals
    const categoryTotals = {};

    expenses.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }

      categoryTotals[expense.category] += expense.amount;
    });

    // Find top spending category
    let topCategory = "";
    let topCategoryAmount = 0;

    for (const category in categoryTotals) {
      if (categoryTotals[category] > topCategoryAmount) {
        topCategoryAmount = categoryTotals[category];
        topCategory = category;
      }
    }

    const totalRecords = expenses.length;

    const averageExpense =
      totalRecords > 0
        ? (totalExpenses / totalRecords).toFixed(2)
        : 0;

    // Create financial context
    const financialContext = `
You are an AI Financial Assistant for SmartExpense, a professional SaaS-style expense tracker.

All amounts are in Indian Rupees (₹). Never use the dollar symbol ($) or USD.

Current User Financial Data:
- Total Expenses: ₹${totalExpenses}
- Total Transactions: ${totalRecords}
- Average Expense: ₹${averageExpense}
- Top Spending Category: ${topCategory || "None"} (₹${topCategoryAmount || 0})
- Category Breakdown:
${JSON.stringify(categoryTotals, null, 2)}

Rules for Response Formatting:
1. Always structure your responses in a professional, clean financial-report style.
2. Use markdown headings:
   - Level 1 Heading (#) for the main title of the response (e.g. # Spending Analysis).
   - Level 2 Headings (##) for sections (e.g. ## Overall Summary, ## Category Breakdown, ## Key Insights, ## Recommendations).
3. Use bullet points (•) for key metrics and summaries.
4. Use numbered lists (1., 2.) to rank categories or items.
5. Use checkmarks (✓) for actionable recommendations or positive steps.
6. Use horizontal lines (---) to separate major sections.
7. Use bold text (**) for emphasis, especially for category names and currency values (e.g., **Food**, **₹3,999**).
8. Avoid long, plain paragraphs. Break down information into structured, easy-to-read blocks.
9. Always answer using the user's actual expense data provided above. Mention specific numbers and percentages.
10. If the user asks general questions or questions unrelated to their expenses, maintain the professional, structured style.

Examples:

Question: Analyze my spending habits.
Answer:
# Spending Analysis

## Overall Summary
• **Total Expenses**: ₹3,999
• **Transactions**: 12
• **Average Expense**: ₹333.25

---

## Category Breakdown
1. **Food** — ₹1,600 (40%)
2. **Electronics** — ₹1,050 (26.25%)
3. **Gym/Fitness** — ₹1,000 (25%)

---

## Key Insights
• **Food** is the largest spending category.
• **Electronics** spending is relatively high.
• **Gym/Fitness** expenses indicate active investment in personal health.

---

## Recommendations
✓ Reduce restaurant spending by 10–15%.
✓ Delay non-essential electronics purchases.
✓ Set category-wise monthly budgets.

Question: Which category do I spend the most on?
Answer:
# Category Focus: Top Spending

## Top Category
• **Category Name**: ${topCategory || "None"}
• **Total Outflow**: ₹${topCategoryAmount || 0}
• **Percentage of Total**: ${totalExpenses > 0 ? ((topCategoryAmount / totalExpenses) * 100).toFixed(1) : 0}%

---

## Recommendation
✓ Review transactions in **${topCategory || "None"}** to identify potential cost-saving opportunities.
`;

    console.log("Financial Context:");
    console.log(financialContext);

    // Send context + user question to OpenRouter
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "z-ai/glm-4.5-air:free",
        messages: [
          {
            role: "system",
            content: financialContext,
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    console.log("=================================");
    console.log("AI Reply:");
    console.log(reply);
    console.log("=================================");

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("=================================");
    console.error("AI ERROR:");
    console.error(JSON.stringify(error.response?.data, null, 2));
    console.error(error.response?.data || error.message);
    console.error("=================================");

    res.status(500).json({
      success: false,
      message: "AI Assistant failed",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  chatWithAssistant,
};