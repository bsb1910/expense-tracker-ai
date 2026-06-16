# AI-Powered Expense Tracker with Smart Financial Assistant

A production-ready full-stack MERN application that combines expense management, financial analytics, and AI-powered financial insights into a single platform.

SmartExpense helps users track expenses, analyze spending habits, visualize financial trends, and receive personalized recommendations from an AI-powered financial assistant.

---

# Live Demo

### Frontend (Vercel)

https://expense-tracker-ai-blond-tau.vercel.app/

### Backend API (Render)

https://expense-tracker-ai-2kwz.onrender.com

### Database

MongoDB Atlas (Cloud Hosted)

### AI Model

DeepSeek V3 via OpenRouter

---

# Project Highlights

* Full-Stack MERN Application
* AI-Powered Financial Assistant
* DeepSeek V3 Integration via OpenRouter
* MongoDB Atlas Cloud Database
* Cloud Deployment using Vercel & Render
* Expense Analytics Dashboard
* Interactive Pie & Bar Charts
* Category-Based Budget Tracking
* Persistent AI Chat History
* Dark Mode Support
* Responsive SaaS-Style UI
* RESTful API Architecture
* Financial Reports & Recommendations
* Environment-Based Configuration
* Automated GitHub Deployment Workflow

---

# Key Achievements

* Developed and deployed a full-stack MERN application.
* Integrated DeepSeek V3 AI through OpenRouter.
* Built 10+ REST APIs using Express.js.
* Connected MongoDB Atlas cloud database.
* Designed interactive financial analytics dashboards.
* Implemented AI-powered expense analysis and recommendations.
* Deployed frontend on Vercel and backend on Render.
* Configured secure environment variables for production.
* Achieved successful cloud deployment architecture.

---

# Application Preview

| Dashboard                                | Analytics                                |
| ---------------------------------------- | ---------------------------------------- |
| ![](./project-screenshots/dashboard.png) | ![](./project-screenshots/analytics.png) |

| Categories                                | Expense Ledger                                |
| ----------------------------------------- | --------------------------------------------- |
| ![](./project-screenshots/categories.png) | ![](./project-screenshots/expense-ledger.png) |

| AI Assistant                                     | AI Insights                                          |
| ------------------------------------------------ | ---------------------------------------------------- |
| ![](./project-screenshots/ai-assistant-home.png) | ![](./project-screenshots/ai-assistant-insights.png) |

---

# System Architecture

```text
┌──────────────────────────────────────────────┐
│             Vercel Frontend                  │
│       React + Vite + Ant Design UI           │
└──────────────────────┬───────────────────────┘
                       │
                       │ HTTPS API Requests
                       ▼
┌──────────────────────────────────────────────┐
│             Render Backend                   │
│          Node.js + Express APIs              │
└───────────────┬───────────────────┬──────────┘
                │                   │
                ▼                   ▼

        MongoDB Atlas       OpenRouter + DeepSeek V3

        Expense Data        Financial Analysis Engine
        Analytics Data      AI Recommendations
```

---

# Application Screenshots

## Dashboard – Financial Overview

![Dashboard](./project-screenshots/dashboard.png)

Provides a centralized overview of spending metrics, active categories, recent transactions, KPI cards, and quick actions.

---

## Expense Ledger Management

![Expense Ledger](./project-screenshots/expense-ledger.png)

Manage financial transactions with search, filtering, editing, deletion, and category-based organization.

---

## Category Management System

![Categories](./project-screenshots/categories.png)

Track category-wise spending and monitor budget distribution percentages.

---

## Spending Analytics Dashboard

![Analytics](./project-screenshots/analytics.png)

Interactive analytics powered by Recharts, including category comparisons, spending trends, KPI cards, and visual insights.

---

## AI Assistant Welcome Interface

![AI Assistant Home](./project-screenshots/ai-assistant-home.png)

ChatGPT-style financial assistant with predefined financial analysis prompts.

---

## AI Assistant Interactive Conversation

![AI Assistant Chat](./project-screenshots/ai-assistant-chat.png)

Expense-aware conversational AI capable of answering questions using real transaction data.

---

## AI Generated Financial Summary

![AI Summary](./project-screenshots/ai-assistant-summary.png)

Automatically generated spending reports and category breakdowns.

---

## AI Insights & Recommendations

![AI Insights](./project-screenshots/ai-assistant-insights.png)

AI-powered savings recommendations, financial health analysis, budgeting suggestions, and expense optimization strategies.

---

# Features

## Expense Management

* Add Expenses
* Edit Expenses
* Delete Expenses
* Search & Filter Expenses
* Category-Based Organization
* Form Validation
* Pagination Support

## Category Management

* 20+ Expense Categories
* Category Statistics
* Category-Wise Tracking
* Budget Distribution Monitoring
* Category Icons & Themes

## Analytics Dashboard

* KPI Statistics Cards
* Spending Overview
* Category Analysis
* Pie Charts
* Bar Charts
* Trend Visualization
* Average Expense Analysis
* Highest & Lowest Expense Tracking

## AI Financial Assistant

* DeepSeek V3 Integration
* OpenRouter API Integration
* Expense-Aware Responses
* Spending Pattern Analysis
* Savings Recommendations
* Financial Health Reports
* Monthly Expense Reports
* Financial Health Scoring
* Budget Suggestions
* Personalized Financial Insights
* Professional Financial Report Generation

## User Experience

* Modern SaaS UI
* Dark Mode Support
* Theme Persistence
* Responsive Design
* Indian Currency Formatting (₹)
* Persistent Chat History
* Interactive Visualizations

---

# Technology Stack

## Frontend

* React
* Vite
* Ant Design
* Axios
* React Router
* Recharts
* Marked

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

## AI & Analytics

* DeepSeek V3
* OpenRouter API
* Prompt Engineering
* Financial Analytics Engine
* Expense Context Injection

## Cloud & DevOps

* Vercel
* Render
* MongoDB Atlas
* GitHub
* Environment Variables

## Development Tools

* VS Code
* Git
* GitHub
* Postman

---

# Deployment

## Frontend

* Hosted on Vercel
* Automatic deployments from GitHub
* Production environment variable configuration

## Backend

* Hosted on Render
* Automatic deployments from GitHub
* Secure API key management

## Database

* MongoDB Atlas Cloud Database

## AI Infrastructure

* OpenRouter API
* DeepSeek V3 Model
* Expense Context Injection
* Financial Analyst Prompt Engineering

---

# Backend APIs

## Expense APIs

```http
POST   /api/expenses
GET    /api/expenses
PUT    /api/expenses/:id
DELETE /api/expenses/:id
```

## Analytics APIs

```http
GET /api/expenses/stats
GET /api/expenses/category-summary
```

## AI APIs

```http
POST /api/assistant/chat
```

## Monitoring

```http
GET /api/health
```

---

# Resume-Worthy Features

## Software Engineering

* Developed a full-stack MERN application.
* Built scalable REST APIs using Express.js.
* Integrated MongoDB Atlas cloud database.
* Applied modular backend architecture.
* Implemented reusable React components.

## Artificial Intelligence

* Integrated DeepSeek V3 via OpenRouter.
* Built an expense-aware financial assistant.
* Engineered prompts for contextual financial analysis.
* Generated personalized financial reports and recommendations.

## Data Analytics

* Developed financial KPI dashboards.
* Implemented category-wise analytics pipelines.
* Created interactive data visualizations.
* Generated spending trend reports and insights.

## Cloud & DevOps

* Deployed frontend using Vercel.
* Deployed backend using Render.
* Configured MongoDB Atlas cloud database.
* Managed production environment variables.
* Built cloud-hosted full-stack architecture.

## UI/UX Engineering

* Designed a modern SaaS-inspired interface.
* Implemented Dark Mode and theme persistence.
* Built responsive layouts for multiple screen sizes.
* Created a ChatGPT-style AI assistant experience.

---

# Project Metrics

## Backend

* 10+ REST APIs
* MongoDB Atlas Integration
* Analytics Engine
* AI Service Layer

## Frontend

* 5 Major Application Pages
* 20+ Reusable Components
* Responsive UI Design
* Theme Persistence System

## AI Features

* Financial Summary Generation
* Category Analysis
* Savings Recommendations
* Financial Health Reports
* Conversational Financial Assistant

---

# Project Structure

```text
expense-tracker-ai
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── project-screenshots
│
├── README.md
└── .gitignore
```

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/bsb1910/expense-tracker-ai.git
```

## Backend Setup

```bash
cd backend
npm install
npm start
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING

OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY

OPENROUTER_MODEL=deepseek/deepseek-chat-v3-0324
```

---

# Future Enhancements

* User Authentication & Authorization
* JWT Security
* Multi-User Expense Isolation
* Persistent AI Conversation History
* PDF Financial Report Generation
* Expense Forecasting using AI
* Budget Planning Assistant
* RAG-Based Financial Knowledge Base
* Docker Containerization
* CI/CD Pipeline Enhancements

---

# Author

**Bhagyesh Bhatt**

B.Tech Computer Science Engineering

GitHub: https://github.com/bsb1910

Project: AI-Powered Expense Tracker with Smart Financial Assistant

2025–2026
