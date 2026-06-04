const Expense = require("../models/Expense");

const getSummary = async (req, res) => {
  try {
    const expenses = await Expense.find();

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const totalRecords = expenses.length;

    const averageExpense =
      totalRecords > 0 ? totalExpenses / totalRecords : 0;

    const amounts = expenses.map(expense => expense.amount);

    const highestExpense =
      amounts.length > 0 ? Math.max(...amounts) : 0;

    const lowestExpense =
      amounts.length > 0 ? Math.min(...amounts) : 0;

    res.json({
      totalExpenses,
      averageExpense,
      highestExpense,
      lowestExpense,
      totalRecords,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSummary,
};

const getCategoryAnalysis = async (req, res) => {
  try {
    const expenses = await Expense.find();

    const categoryTotals = {};

    expenses.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }

      categoryTotals[expense.category] += expense.amount;
    });

    let topCategory = "";
    let topCategoryAmount = 0;

    for (const category in categoryTotals) {
      if (categoryTotals[category] > topCategoryAmount) {
        topCategoryAmount = categoryTotals[category];
        topCategory = category;
      }
    }

    res.json({
      categoryTotals,
      topCategory,
      topCategoryAmount,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const expenses = await Expense.find();

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const categoryTotals = {};

    expenses.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }

      categoryTotals[expense.category] += expense.amount;
    });

    const recommendations = [];

    for (const category in categoryTotals) {
      const percentage =
        (categoryTotals[category] / totalExpenses) * 100;

      if (category === "Food" && percentage > 35) {
        recommendations.push(
          "Food spending is high. Consider cooking more meals at home."
        );
      }

      if (category === "Electronics" && percentage > 20) {
        recommendations.push(
          "Electronics spending is significant. Delay non-essential purchases."
        );
      }

      if (category === "Entertainment" && percentage > 15) {
        recommendations.push(
          "Entertainment spending is above average. Consider setting a monthly limit."
        );
      }
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "Your spending pattern looks balanced. Keep tracking expenses regularly."
      );
    }

    res.json({
      totalExpenses,
      recommendations,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const expenses = await Expense.find();

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const totalRecords = expenses.length;

    const averageExpense =
      totalRecords > 0 ? totalExpenses / totalRecords : 0;

    const categoryTotals = {};

    expenses.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }

      categoryTotals[expense.category] += expense.amount;
    });

    let topCategory = "";
    let topCategoryAmount = 0;

    for (const category in categoryTotals) {
      if (categoryTotals[category] > topCategoryAmount) {
        topCategoryAmount = categoryTotals[category];
        topCategory = category;
      }
    }

    const recommendations = [];

    if ((categoryTotals["Food"] || 0) > totalExpenses * 0.35) {
      recommendations.push(
        "Food spending is high. Consider cooking more meals at home."
      );
    }

    if ((categoryTotals["Electronics"] || 0) > totalExpenses * 0.20) {
      recommendations.push(
        "Electronics spending is significant. Delay non-essential purchases."
      );
    }

    res.json({
      month: new Date().toLocaleString("default", {
        month: "long",
      }),
      totalExpenses,
      averageExpense,
      totalRecords,
      topCategory,
      topCategoryAmount,
      recommendations,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getSummary,
  getCategoryAnalysis,
  getRecommendations,
  getMonthlyReport,
};