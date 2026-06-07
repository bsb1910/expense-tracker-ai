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
    const expenses = await Expense.find().sort({ expenseDate: 1 });

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

    // Build transaction history for AI
    const expenseHistory =
      expenses.length > 0
        ? expenses
            .map((expense, index) => {
              const date = new Date(
                expense.expenseDate
              ).toLocaleDateString("en-IN");

              return `${index + 1}. ${
                expense.description
              } | ₹${expense.amount} | ${
                expense.category
              } | ${date}`;
            })
            .join("\n")
        : "No expenses available.";

    // Create financial context
    const financialContext = `
You are an AI Financial Assistant for SmartExpense, a professional SaaS-style expense tracker.

All amounts are in Indian Rupees (₹).
Never use the dollar symbol ($) or USD.

Current User Financial Data:

- Total Expenses: ₹${totalExpenses}
- Total Transactions: ${totalRecords}
- Average Expense: ₹${averageExpense}
- Top Spending Category: ${topCategory || "None"} (₹${
      topCategoryAmount || 0
    })

Category Breakdown:
${JSON.stringify(categoryTotals, null, 2)}

Expense Transaction History:
${expenseHistory}

Rules for Response Formatting:

1. Always structure responses as professional financial reports.
2. Use markdown headings (#, ##).
3. Use bullet points for summaries.
4. Use numbered lists for rankings.
5. Use ✓ for recommendations.
6. Use horizontal separators (---).
7. Use bold text for important values.
8. Always answer using the provided expense data.
9. Use category totals for category analysis.
10. Use transaction history for date-based analysis.
11. Use transaction history for monthly analysis.
12. If asked about a month, calculate using expense dates.
13. If asked about highest spending month, analyze transaction dates.
14. If asked about expenses in a month, list matching expenses.
15. If asked about latest expenses, use transaction history.
16. Mention exact amounts whenever possible.
17. Never say you don't have enough information if the answer can be derived from the transaction history.
18. Always use ₹ and never use $.
19. Provide actionable recommendations whenever useful.
20. Keep answers detailed, structured, and professional.

Example:

Question:
Which month has the highest spending?

Answer:

# Monthly Spending Analysis

## Highest Spending Month

• Month: June
• Total Spending: ₹3999

---

## Expenses

1. Lunch — ₹250
2. Gym Membership — ₹1000
3. Headphones — ₹1050

---

## Insight

✓ Most spending occurred during June.

Question:
Show all expenses from June.

Answer:

# June Expense Report

## Transactions

1. Lunch — ₹250
2. Bus Ticket — ₹99
3. Gym Membership — ₹1000

---

## Summary

• Total Transactions: 3
• Total Spending: ₹1349
`;

    console.log("Financial Context:");
    console.log(financialContext);

    // Send to OpenRouter
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