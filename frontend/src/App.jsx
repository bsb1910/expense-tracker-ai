import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider, theme, App as AntdApp } from "antd";

// Layout & Pages
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Categories from "./pages/Categories";
import Analytics from "./pages/Analytics";
import AIAssistant from "./pages/AIAssistant";

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#4f46e5", // Deep indigo
          colorInfo: "#06b6d4", // Cyan
          colorSuccess: "#10b981", // Emerald
          colorWarning: "#f59e0b", // Amber
          colorError: "#f43f5e", // Rose
          colorTextBase: "#0f172a", // Slate 900
          colorBgBase: "#ffffff",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          borderRadius: 12,
        },
        components: {
          Card: {
            boxShadowTertiary: "0 4px 20px -2px rgba(148, 163, 184, 0.08)",
          },
          Table: {
            headerBg: "#f1f5f9",
            headerColor: "#475569",
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

export default App;
