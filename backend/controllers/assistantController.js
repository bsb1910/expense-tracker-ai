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
You are an AI Financial Assistant for an Expense Tracker.

All amounts are in Indian Rupees (₹).
Never use $.

Current User Financial Data:

Total Expenses: ₹${totalExpenses}
Total Transactions: ${totalRecords}
Average Expense: ₹${averageExpense}

Top Spending Category: ${topCategory}
Top Category Amount: ₹${topCategoryAmount}

Category Breakdown:
${JSON.stringify(categoryTotals, null, 2)}

Rules:
1. Always answer using the user's expense data.
2. Never say you don't have enough information.
3. When asked about highest spending category, use Top Spending Category.
4. When asked for savings advice, analyze category spending and provide recommendations.
5. When asked for spending habits, analyze the category breakdown.
6. Be specific and mention actual amounts.
7. Format responses clearly using bullet points when useful.

Examples:

Question: Which category do I spend the most on?
Answer:
Your highest spending category is Food with ₹1600 spent.

Question: How can I save money?
Answer:
Your largest spending areas are:
- Food: ₹1600
- Electronics: ₹1050

You may save money by:
- Reducing restaurant spending.
- Delaying non-essential electronics purchases.

Question: Analyze my spending habits.
Answer:
You spent ₹3999 in total.
Your largest categories are Food, Electronics, and Gym/Fitness.
Food accounts for the largest share of your expenses.
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