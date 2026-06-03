# AI-Powered Expense Tracker with Smart Assistant

## Overview

AI-Powered Expense Tracker is a full-stack MERN application designed to help users manage expenses, analyze spending patterns, visualize financial data, and prepare for AI-powered financial insights.

The project is being developed as part of an AI Engineering Internship (June 2026) and focuses on full-stack development, backend analytics, and future AI integration.

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
* Category-wise Expense Tracking
* Category Icons and Color Themes

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

Features:

* Total Spending Summary
* Monthly Spending Overview
* Active Categories Count
* Recent Expense Activity
* Quick Navigation Actions

---

## Analytics

Analytics module provides expense insights and visualizations.

Features:

* Category-wise Expense Distribution
* Interactive Pie Charts
* Total Spending Statistics
* Average Expense Calculation
* Highest Expense Tracking
* Time-based Filtering
* Backend Analytics APIs

---

## AI Assistant

Current Features:

* AI Assistant Interface
* Chat Layout
* Suggested Questions
* Message History UI

Planned Features:

* Expense-Based Question Answering
* Spending Pattern Analysis
* Financial Recommendations
* Savings Suggestions
* AI-Powered Insights using LLMs

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
* Total Spending per Category
* Number of Transactions per Category

Built using MongoDB Aggregation Pipelines:

* $group
* $sum
* $project
* $sort

---

## Validation & Error Handling

Implemented Backend Validation:

* Description Required
* Amount Required
* Amount Greater Than Zero
* Category Required
* Expense Date Required

Invalid requests are rejected before reaching the database.

---

## Technology Stack

### Frontend

* React
* Vite
* Ant Design
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

### AI Integration (Planned)

* Google Gemini API
* OpenAI API
* RAG-Based Financial Assistant

---

## Project Structure

```text
expense-tracker-ai
│
├── backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   └── expenseController.js
│   ├── models
│   │   └── Expense.js
│   ├── routes
│   │   └── expenseRoutes.js
│   ├── middleware
│   ├── utils
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── AIAssistant.jsx
│   │   ├── services
│   │   ├── utils
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

## Project Status

### Completed

* Backend Setup ✅
* MongoDB Atlas Integration ✅
* Expense CRUD APIs ✅
* Expense Validation ✅
* Statistics API ✅
* Category Summary API ✅
* Health Check API ✅
* React Frontend Setup ✅
* Dashboard UI ✅
* Expense Management UI ✅
* Categories UI ✅
* Analytics UI ✅
* AI Assistant UI ✅
* Axios Integration ✅
* GitHub Repository Setup ✅

### In Progress

* AI Assistant Logic 🔄
* Frontend Analytics Integration 🔄
* Enhanced Backend Validation 🔄

### Planned

* User Authentication ⏳
* Gemini/OpenAI Integration ⏳
* AI Financial Insights ⏳
* Monthly Reports ⏳
* Spending Pattern Analysis ⏳
* Savings Recommendations ⏳
* RAG-Based Financial Assistant ⏳
* Cloud Deployment ⏳

---

## Current Progress

Estimated Project Completion:

**90% Complete**

Major remaining work involves AI integration, authentication, and deployment.

---

## Author

**Bhagyesh Bhatt**

B.Tech Computer Science Engineering

AI Engineering Internship Project

June 2026
