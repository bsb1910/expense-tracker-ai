const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// Add this line
const expenseRoutes = require("./routes/expenseRoutes");

dotenv.config();

console.log(process.env.MONGO_URI);

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Add this line here
app.use("/api/expenses", expenseRoutes);

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