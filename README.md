# AI-Powered Expense Tracker with Smart Assistant

## Overview

AI-Powered Expense Tracker is a full-stack MERN application designed to help users manage expenses, track spending habits, visualize financial data, and receive AI-driven financial insights.

The project is being developed as part of an AI Engineering Internship (June 2026).

---

## Current Features

### Expense Management

* Add Expense
* View Expenses
* Expense Categories
* Dashboard Navigation
* Analytics Page Structure
* AI Assistant Page Structure

### Backend APIs

* Create Expense
* Fetch Expenses
* Update Expense
* Delete Expense

### Database

* MongoDB Atlas Integration
* Cloud-based Expense Storage
* Mongoose Models

### Frontend

* React + Vite Setup
* Responsive Dashboard Layout
* Expense Management Page
* Categories Page
* Analytics Page
* AI Assistant Page
* Axios API Integration

---

## API Endpoints

### Expenses

```http
POST /api/expenses
GET /api/expenses
PUT /api/expenses/:id
DELETE /api/expenses/:id
```

---

## Technology Stack

### Frontend

* React
* Vite
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
│   │   └── expenseController.js
│   │
│   ├── models
│   │   └── Expense.js
│   │
│   ├── routes
│   │   └── expenseRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── utils
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
* CRUD APIs ✅
* React Frontend Setup ✅
* Dashboard Navigation ✅
* Axios Integration ✅
* GitHub Repository Setup ✅

### In Progress

* Expense Listing 🔄
* Category Management 🔄
* Expense Analytics 🔄

### Planned

* AI Financial Assistant ⏳
* Spending Pattern Analysis ⏳
* Savings Recommendations ⏳
* Monthly Reports ⏳
* Smart Insights using LLMs ⏳

---

## Future Roadmap

### Phase 1

* Complete Expense Management Module
* Category Management
* Expense Analytics Dashboard

### Phase 2

* Charts and Visualizations
* Monthly Reports
* Financial Summaries

### Phase 3

* AI Chat Assistant
* Natural Language Expense Queries
* Personalized Savings Suggestions
* AI Financial Insights

---

## Author

**Bhagyesh Bhatt**

B.Tech CSE Student
AI Engineering Internship Project
June 2026
