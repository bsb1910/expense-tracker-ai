import React from "react";
import {
  ShoppingOutlined,
  CarOutlined,
  HomeOutlined,
  SmileOutlined,
  ToolOutlined,
  HeartOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  CoffeeOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  RiseOutlined,
  DollarOutlined,
  CreditCardOutlined,
  LaptopOutlined,
  GiftOutlined,
  BankOutlined,
  AlertOutlined,
} from "@ant-design/icons";

/**
 * Formats a numeric value to a standard USD currency format.
 * @param {number} value - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) {
    return "$0.00";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

/**
 * Formats a Date object or ISO date string into a readable format.
 * @param {string|Date} dateVal - Date value to format
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
export const formatDate = (dateVal, includeTime = false) => {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "";

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return d.toLocaleDateString("en-US", options);
};

/**
 * Visual metadata mappings for expense categories.
 */
export const CATEGORY_META = {
  Food: {
    color: "#ff7a45", // Deep Orange
    bgColor: "#fff2e8",
    icon: <CoffeeOutlined />,
  },
  Transport: {
    color: "#1890ff", // Sky Blue
    bgColor: "#e6f7ff",
    icon: <CarOutlined />,
  },
  Rent: {
    color: "#722ed1", // Violet
    bgColor: "#f9f0ff",
    icon: <HomeOutlined />,
  },
  Entertainment: {
    color: "#eb2f96", // Pink
    bgColor: "#fff0f6",
    icon: <SmileOutlined />,
  },
  Utilities: {
    color: "#fa8c16", // Orange/Gold
    bgColor: "#fff7e6",
    icon: <ToolOutlined />,
  },
  Healthcare: {
    color: "#52c41a", // Emerald Green
    bgColor: "#f6ffed",
    icon: <HeartOutlined />,
  },
  Shopping: {
    color: "#13c2c2", // Cyan/Teal
    bgColor: "#e6fffb",
    icon: <ShoppingOutlined />,
  },
  Education: {
    color: "#2f54eb", // Royal Blue
    bgColor: "#f0f5ff",
    icon: <BookOutlined />,
  },
  Travel: {
  color: "#1677ff",
  bgColor: "#e6f4ff",
  icon: <RocketOutlined />,
},

Insurance: {
  color: "#13c2c2",
  bgColor: "#e6fffb",
  icon: <SafetyCertificateOutlined />,
},

Investment: {
  color: "#52c41a",
  bgColor: "#f6ffed",
  icon: <RiseOutlined />,
},

Salary: {
  color: "#faad14",
  bgColor: "#fffbe6",
  icon: <DollarOutlined />,
},

"Freelance Income": {
  color: "#73d13d",
  bgColor: "#fcffe6",
  icon: <DollarOutlined />,
},

Subscriptions: {
  color: "#722ed1",
  bgColor: "#f9f0ff",
  icon: <CreditCardOutlined />,
},

"Gym/Fitness": {
  color: "#f5222d",
  bgColor: "#fff1f0",
  icon: <HeartOutlined />,
},

Electronics: {
  color: "#2f54eb",
  bgColor: "#f0f5ff",
  icon: <LaptopOutlined />,
},

"Personal Care": {
  color: "#eb2f96",
  bgColor: "#fff0f6",
  icon: <SmileOutlined />,
},

Gifts: {
  color: "#c41d7f",
  bgColor: "#fff0f6",
  icon: <GiftOutlined />,
},

Taxes: {
  color: "#fa8c16",
  bgColor: "#fff7e6",
  icon: <BookOutlined />,
},

Emergency: {
  color: "#cf1322",
  bgColor: "#fff1f0",
  icon: <AlertOutlined />,
},

Savings: {
  color: "#389e0d",
  bgColor: "#f6ffed",
  icon: <BankOutlined />,
},
  Other: {
    color: "#8c8c8c", // Grey
    bgColor: "#f5f5f5",
    icon: <QuestionCircleOutlined />,
  },
};

/**
 * Retrieves the color, background color, and icon for a given category name.
 * Falls back to 'Other' metadata if the category is not predefined.
 * @param {string} category - Name of the category
 * @returns {object} Object with { color, bgColor, icon }
 */
export const getCategoryStyles = (category) => {
  if (!category) return CATEGORY_META.Other;
  
  // Find match case-insensitively
  const matchKey = Object.keys(CATEGORY_META).find(
    (key) => key.toLowerCase() === category.toLowerCase()
  );

  return matchKey ? CATEGORY_META[matchKey] : {
    color: "#3b82f6", // Default blue for custom user categories
    bgColor: "#eff6ff",
    icon: <QuestionCircleOutlined />,
  };
};

/**
 * Returns a bright palette of colors for dynamic charts
 */
export const CHART_COLORS = [
  "#4f46e5", // Indigo
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#a855f7", // Purple
  "#fa8c16", // Amber/Gold
  "#f43f5e", // Rose
  "#ff7a45", // Orange
  "#13c2c2", // Teal
  "#1890ff", // Blue
  "#722ed1", // Violet
  "#eb2f96", // Pink
  "#8c8c8c", // Grey
];
