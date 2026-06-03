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
    return response.data; // Expected format: { success: true, count: X, data: [...] }
  },

  // Add a new expense
  addExpense: async (expenseData) => {
    const response = await apiClient.post("/expenses", expenseData);
    return response.data; // Expected format: { success: true, data: {...} }
  },

  // Update an existing expense
  updateExpense: async (id, expenseData) => {
    const response = await apiClient.put(`/expenses/${id}`, expenseData);
    return response.data; // Expected format: { success: true, data: {...} }
  },

  // Delete an expense
  deleteExpense: async (id) => {
    const response = await apiClient.delete(`/expenses/${id}`);
    return response.data; // Expected format: { success: true, message: "..." }
  },
};

// ==========================================
// CATEGORY SERVICE (Modular & LocalStorage for now)
// ==========================================

// Seed default categories if they don't exist
const DEFAULT_CATEGORIES = [
  "Food",
  "Transport",
  "Rent",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Education",
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
