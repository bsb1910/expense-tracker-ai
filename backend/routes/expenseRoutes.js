const express = require("express");

const router = express.Router();

const {
  addExpense,
  getExpenses,
  getExpenseStats,
  getCategorySummary,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

router.post("/", addExpense);
router.get("/", getExpenses);
router.get("/stats", getExpenseStats);
router.get("/category-summary", getCategorySummary);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;