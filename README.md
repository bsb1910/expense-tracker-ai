# AI-Powered Expense Tracker with Smart Financial Assistant

## Overview

AI-Powered Expense Tracker is a full-stack MERN application that helps users manage expenses, analyze spending patterns, visualize financial data, and receive AI-powered financial insights.

The application combines traditional expense tracking with Artificial Intelligence to provide personalized spending analysis, savings recommendations, financial reports, and category-wise insights based on real expense data stored in MongoDB.

Developed as part of an AI Engineering Internship (June 2026).

---

## Key Highlights

### Expense Management

* Add, Edit, Delete, and View Expenses
* Real-time Expense Tracking
* Category-Based Organization
* Expense Search & Filtering
* Form Validation
* Pagination Support

### Advanced Analytics

* Spending Statistics Dashboard
* Category-wise Expense Analysis
* Interactive Pie Charts
* Category Comparison Bar Charts
* Highest & Lowest Expense Tracking
* Average Expense Analysis
* Monthly Spending Overview

### AI-Powered Financial Assistant

* OpenRouter LLM Integration
* Expense-Aware Responses
* Spending Pattern Analysis
* Financial Health Reports
* Savings Recommendations
* Personalized Financial Insights
* Monthly Expense Reports
* Structured Markdown-Based AI Responses

### Modern User Experience

* Professional SaaS-style UI
* Dark Mode Support
* Light/Dark Theme Persistence
* Indian Currency Formatting (₹)
* Responsive Design
* Interactive Charts & Visualizations

---

## Features

### Expense Management

* Add Expense
* View Expenses
* Edit Expense
* Delete Expense
* Search Expenses
* Category Filtering
* Expense Validation
* Pagination Support

### Category Management

* Dynamic Category System
* 20+ Expense Categories
* Category Statistics
* Category-wise Tracking
* Category Themes & Icons

Supported Categories:

* Food
* Transport
* Travel
* Rent
* Entertainment
* Utilities
* Healthcare
* Shopping
* Education
* Insurance
* Investment
* Salary
* Freelance Income
* Subscriptions
* Gym/Fitness
* Electronics
* Personal Care
* Gifts
* Taxes
* Emergency
* Savings
* Other

---

## Dashboard

The Dashboard provides a quick overview of financial activity.

### Features

* Total Spending Summary
* Average Expense Statistics
* Highest Expense Tracking
* Total Transaction Count
* Active Categories Count
* Recent Expense Activity
* Quick Navigation Actions
* KPI Statistics Cards

---

## Analytics Module

Provides detailed spending insights and visualizations.

### Features

* Category-wise Expense Distribution
* Interactive Pie Charts
* Category Comparison Bar Charts
* Total Spending Statistics
* Average Expense Analysis
* Highest & Lowest Expense Tracking
* Spending Trend Visualization
* Backend Analytics APIs

### Visualizations

* Pie Chart for Expense Distribution
* Bar Chart for Category Comparison
* Financial KPI Cards
* Category Performance Indicators

---

## AI Financial Assistant

The AI Assistant is connected to MongoDB expense data and generates personalized financial insights.

### Current Capabilities

* Analyze Spending Habits
* Generate Financial Health Reports
* Provide Savings Recommendations
* Category-wise Expense Analysis
* Monthly Financial Reports
* Budget Suggestions
* Financial Advisor Style Responses
* Expense-Aware Question Answering

### Example Questions

* Analyze my spending habits
* How can I save more money?
* Which category do I spend the most on?
* Generate a financial health report
* Create a budget plan for me
* Give me a summary of my expenses
* What are my biggest spending categories?

### Example AI Output

# Spending Analysis

## Overall Summary

* Total Expenses: ₹3,999
* Transactions: 12
* Average Expense: ₹333.25

## Category Breakdown

1. Food — ₹1,600
2. Electronics — ₹1,050
3. Gym/Fitness — ₹1,000

## Recommendations

✓ Reduce restaurant spending

✓ Delay non-essential electronics purchases

✓ Create monthly category budgets

---

## Backend APIs

### Expense CRUD APIs

```http
POST /api/expenses
GET /api/expenses
PUT /api/expenses/:id
DELETE /api/expenses/:id
```

### Analytics APIs

```http
GET /api/expenses/stats
GET /api/expenses/category-summary
```

### AI APIs

```http
GET /api/ai/summary
GET /api/ai/category-analysis
GET /api/ai/recommendations
GET /api/ai/monthly-report
POST /api/assistant/chat
```

### Monitoring API

```http
GET /api/health
```

---

## API Features

### Expense Statistics API

Returns:

* Total Expenses
* Total Transactions
* Highest Expense
* Lowest Expense
* Average Expense
* Total Categories

### Category Summary API

Returns:

* Category Name
* Total Spending
* Transaction Count

### Financial Summary API

Returns:

* Total Expenses
* Average Expense
* Highest Expense
* Lowest Expense
* Total Records

### Category Analysis API

Returns:

* Category Totals
* Top Spending Category
* Category Breakdown

### Recommendations API

Returns:

* Savings Suggestions
* Spending Recommendations
* Financial Insights

### Monthly Report API

Returns:

* Monthly Summary
* Top Spending Category
* Spending Statistics
* Recommendations

### AI Chat API

Provides:

* Expense-Aware Responses
* Financial Analysis
* Spending Insights
* Personalized Recommendations

---

## Validation & Error Handling

### Backend Validation

* Description Required
* Amount Required
* Amount > 0
* Category Required
* Expense Date Required

### Error Handling

* Invalid Request Handling
* API Error Responses
* Database Validation
* Frontend Error Notifications

---

## Technology Stack

### Frontend

* React
* Vite
* Ant Design
* Axios
* React Router
* Recharts
* Marked (Markdown Rendering)

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

### AI & Analytics

* OpenRouter API
* LLM-Based Financial Assistant
* Prompt Engineering
* Expense Context Injection
* Financial Analytics Engine

### Development Tools

* Git
* GitHub
* VS Code
* Postman

---

## Project Structure

```text
expense-tracker-ai
│
├── backend
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── expenseController.js
│   │   ├── assistantController.js
│   │   └── aiController.js
│   │
│   ├── models
│   │   └── Expense.js
│   │
│   ├── routes
│   │   ├── expenseRoutes.js
│   │   ├── assistantRoutes.js
│   │   └── aiRoutes.js
│   │
│   ├── middleware
│   ├── utils
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   └── MainLayout.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── AIAssistant.jsx
│   │   │
│   │   ├── services
│   │   │   └── api.js
│   │   │
│   │   ├── utils
│   │   │   ├── helpers.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

## Current Project Status

### Completed

* Backend Setup ✅
* MongoDB Atlas Integration ✅
* Expense CRUD APIs ✅
* Expense Validation ✅
* Statistics API ✅
* Category Summary API ✅
* Financial Summary API ✅
* Category Analysis API ✅
* Savings Recommendation Engine ✅
* Monthly Report API ✅
* OpenRouter Integration ✅
* Expense-Aware AI Assistant ✅
* Spending Pattern Analysis ✅
* Financial Insights Engine ✅
* React Frontend Setup ✅
* Dashboard UI ✅
* Expense Management UI ✅
* Categories UI ✅
* Analytics Dashboard ✅
* Interactive Charts ✅
* Dark Mode System ✅
* Indian Currency Formatting (₹) ✅
* Markdown AI Reports ✅
* GitHub Repository Setup ✅

### Currently Developing

* RAG-Based AI Assistant 🔄
* Advanced Financial Forecasting 🔄

### Planned

* User Authentication
* PDF Report Generation
* Expense Forecasting
* Cloud Deployment
* Knowledge Base Assistant

---

## Current Progress

Estimated Completion:

### 95% Complete

Core Expense Tracking System: ✅ Complete

AI Financial Assistant: ✅ Complete

Advanced Analytics Dashboard: ✅ Complete

Remaining Work:

* RAG-Based Assistant
* Authentication
* Deployment

---

## Author

Bhagyesh Bhatt

B.Tech Computer Science Engineering

AI Engineering Internship Project

June 2026
