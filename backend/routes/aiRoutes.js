const express = require("express");
const router = express.Router();

const {
  getSummary,
  getCategoryAnalysis,
  getRecommendations,
  getMonthlyReport,
} = require("../controllers/aiController");

router.get("/summary", getSummary);
router.get("/category-analysis", getCategoryAnalysis);
router.get("/recommendations", getRecommendations);
router.get("/monthly-report", getMonthlyReport);

module.exports = router;