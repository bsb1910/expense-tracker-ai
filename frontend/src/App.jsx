import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider, theme, App as AntdApp } from "antd";

import { ThemeProvider, useTheme } from "./utils/ThemeContext";

// Layout & Pages
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Categories from "./pages/Categories";
import Analytics from "./pages/Analytics";
import AIAssistant from "./pages/AIAssistant";

function AppContent() {
  const { isDarkMode } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#4f46e5", // Deep indigo
          colorInfo: "#06b6d4", // Cyan
          colorSuccess: "#10b981", // Emerald
          colorWarning: "#f59e0b", // Amber
          colorError: "#f43f5e", // Rose
          colorTextBase: isDarkMode ? "#f8fafc" : "#0f172a", // Slate 50 / Slate 900
          colorBgBase: isDarkMode ? "#0f172a" : "#ffffff", // Slate 900 / white
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          borderRadius: 12,
        },
        components: {
          Card: {
            boxShadowTertiary: isDarkMode
              ? "0 4px 20px -2px rgba(0, 0, 0, 0.3)"
              : "0 4px 20px -2px rgba(148, 163, 184, 0.08)",
          },
          Table: {
            headerBg: isDarkMode ? "#1e293b" : "#f1f5f9",
            headerColor: isDarkMode ? "#94a3b8" : "#475569",
            headerBorderRadius: 12,
          },
        },
      }}
    >
      <AntdApp>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
            </Routes>
          </MainLayout>
        </Router>
      </AntdApp>
    </ConfigProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
