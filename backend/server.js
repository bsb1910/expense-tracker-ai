const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const assistantRoutes = require("./routes/assistantRoutes");
const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Add this line here
app.use("/api/expenses", expenseRoutes);

console.log("assistantRoutes =", assistantRoutes);
console.log("type =", typeof assistantRoutes);

app.use("/api/assistant", assistantRoutes);

// Health Check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    application: "SmartExpense Tracker",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("AI Expense Tracker Backend Running 🚀");
});

console.log("Expense Route Registered");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});