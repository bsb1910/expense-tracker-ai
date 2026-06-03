const Expense = require("../models/Expense");

const addExpense = async (req, res) => {
  try {
   const { description, amount, category, expenseDate } = req.body || {};
    // Validation 1: Title Required
   if (!description || description.trim() === "") {
  return res.status(400).json({
    success: false,
    message: "Description is required",
  });
}

    // Validation 2: Amount Required
    if (amount === undefined || amount === null) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    // Validation 3: Amount > 0
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero",
      });
    }

    // Validation 4: Category Required
    if (!category || category.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // Validation 5: Expense Date Required
    if (!expenseDate) {
      return res.status(400).json({
        success: false,
        message: "Expense date is required",
      });
    }

    const expense = await Expense.create(req.body);

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getExpenseStats = async (req, res) => {
  try {
    const expenses = await Expense.find();

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const totalTransactions = expenses.length;

    const highestExpense =
      expenses.length > 0
        ? Math.max(...expenses.map((expense) => expense.amount))
        : 0;

    const lowestExpense =
      expenses.length > 0
        ? Math.min(...expenses.map((expense) => expense.amount))
        : 0;

    const totalCategories = new Set(
      expenses.map((expense) => expense.category)
    ).size;

    const averageExpense =
      totalTransactions > 0
        ? totalExpenses / totalTransactions
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalExpenses,
        totalTransactions,
        highestExpense,
        lowestExpense,
        totalCategories,
        averageExpense: Number(averageExpense.toFixed(2)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCategorySummary = async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      {
        $group: {
          _id: "$category",
          totalAmount: {
            $sum: "$amount",
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
          count: 1,
        },
      },
      {
        $sort: {
          totalAmount: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateExpense = async (req, res) => {
  console.log("PUT BODY:", req.body);

  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  getExpenseStats,
  updateExpense,
  deleteExpense,
  getCategorySummary,
};