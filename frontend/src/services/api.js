import axios from "axios";

// Create Axios instance
const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// EXPENSE API SERVICE
// ==========================================

export const expenseService = {
  // Fetch all expenses
  getExpenses: async () => {
    const response = await apiClient.get("/expenses");
    return response.data;
  },

  // Fetch dashboard statistics
  getStats: async () => {
    const response = await apiClient.get("/expenses/stats");
    return response.data;
  },

  // Add a new expense
  addExpense: async (expenseData) => {
    const response = await apiClient.post("/expenses", expenseData);
    return response.data;
  },  

  // Update expense
  updateExpense: async (id, expenseData) => {
    const response = await apiClient.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (id) => {
    const response = await apiClient.delete(`/expenses/${id}`);
    return response.data;
  },
};

export const assistantService = {
  chat: async (message) => {
    const response = await apiClient.post("/assistant/chat", {
      message,
    });

    return response;
  },
};
// ==========================================
// CATEGORY SERVICE (Modular & LocalStorage for now)
// ==========================================

// Seed default categories if they don't exist
const DEFAULT_CATEGORIES = [
  "Food",
  "Transport",
  "Travel",
  "Rent",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Education",
  "Insurance",
  "Investment",
  "Salary",
  "Freelance Income",
  "Subscriptions",
  "Gym/Fitness",
  "Electronics",
  "Personal Care",
  "Gifts",
  "Taxes",
  "Emergency",
  "Savings",
  "Other",
];

const initCategories = () => {
  const stored = localStorage.getItem("expense_tracker_categories");
  if (!stored) {
    localStorage.setItem("expense_tracker_categories", JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
  return JSON.parse(stored);
};

export const categoryService = {
  // Fetch all categories (Async to match future API migration)
  getCategories: async () => {
    // Simulate network delay to check loading states
    await new Promise((resolve) => setTimeout(resolve, 300));
    return initCategories();
  },

  // Add a new category
  addCategory: async (categoryName) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    if (!categoryName || typeof categoryName !== "string") {
      throw new Error("Invalid category name");
    }
    
    const trimmedName = categoryName.trim();
    if (!trimmedName) {
      throw new Error("Category name cannot be empty");
    }

    const categories = initCategories();
    
    // Case-insensitive duplicate check
    if (categories.some((c) => c.toLowerCase() === trimmedName.toLowerCase())) {
      throw new Error("Category already exists");
    }

    categories.push(trimmedName);
    localStorage.setItem("expense_tracker_categories", JSON.stringify(categories));
    return trimmedName;
  },

  // Delete a category
  deleteCategory: async (categoryName) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const categories = initCategories();
    const filtered = categories.filter((c) => c !== categoryName);
    
    localStorage.setItem("expense_tracker_categories", JSON.stringify(filtered));
    return { success: true, message: "Category deleted successfully" };
  },
};

export default apiClient;
