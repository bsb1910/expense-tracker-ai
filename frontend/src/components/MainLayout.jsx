import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Drawer, Typography, Space, Badge } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  DollarOutlined,
  TagsOutlined,
  PieChartOutlined,
  RobotOutlined,
  MenuOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../utils/ThemeContext";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

const MainLayout = ({ children }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Handle responsive design check
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileVisible(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/expenses",
      icon: <DollarOutlined />,
      label: "Expenses",
    },
    {
      key: "/categories",
      icon: <TagsOutlined />,
      label: "Categories",
    },
    {
      key: "/analytics",
      icon: <PieChartOutlined />,
      label: "Analytics",
    },
    {
      key: "/ai-assistant",
      icon: <RobotOutlined />,
      label: (
        <Space>
          AI Assistant
          <Badge
            status="processing"
            color="#4f46e5"
            size="small"
            style={{ marginLeft: 4 }}
          />
        </Space>
      ),
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setMobileVisible(false);
  };

  const getActiveKey = () => {
    const path = location.pathname;
    if (path === "/") return "/";
    if (path.startsWith("/expenses")) return "/expenses";
    if (path.startsWith("/categories")) return "/categories";
    if (path.startsWith("/analytics")) return "/analytics";
    if (path.startsWith("/ai-assistant")) return "/ai-assistant";
    return "/";
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Financial Overview";
    if (path.startsWith("/expenses")) return "Expense Ledger";
    if (path.startsWith("/categories")) return "Category Metrics";
    if (path.startsWith("/analytics")) return "Spending Analytics";
    if (path.startsWith("/ai-assistant")) return "AI Smart Assistant";
    return "Dashboard";
  };

  const SidebarContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: isDarkMode ? "#1e293b" : "#ffffff" }}>
      {/* Brand Logo / Title */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          paddingLeft: collapsed ? 24 : 24,
          borderBottom: isDarkMode ? "1px solid #334155" : "1px solid #f1f5f9",
          transition: "all 0.2s",
        }}
      >
        <Space size="middle">
          <div
            className="quick-action-btn"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(79, 70, 229, 0.25)",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <span style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>₹</span>
          </div>
          {!collapsed && (
            <Title
              level={5}
              className="heading-font gradient-text"
              style={{ margin: 0, letterSpacing: "-0.5px", cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              SmartExpense
            </Title>
          )}
        </Space>
      </div>

      {/* Navigation Menu */}
      <Menu
        theme={isDarkMode ? "dark" : "light"}
        mode="inline"
        selectedKeys={[getActiveKey()]}
        onClick={handleMenuClick}
        items={menuItems}
        style={{ borderRight: 0, paddingTop: 16, flexGrow: 1, backgroundColor: isDarkMode ? "#1e293b" : "#ffffff" }}
      />

      {/* Sidebar Footer info */}
      {!collapsed && (
        <div
          style={{
            padding: "16px 24px",
            borderTop: isDarkMode ? "1px solid #334155" : "1px solid #f1f5f9",
            textAlign: "left",
          }}
        >
          <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
            AI Engine v1.0
          </Text>
          <Badge status="successful" color="#10b981" text="Cloud Sync Active" style={{ fontSize: 11 }} />
        </div>
      )}
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Sider */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={240}
          theme={isDarkMode ? "dark" : "light"}
          style={{
            boxShadow: isDarkMode ? "2px 0 8px rgba(0, 0, 0, 0.2)" : "2px 0 8px rgba(148, 163, 184, 0.05)",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
            borderRight: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
            background: isDarkMode ? "#1e293b" : "#ffffff",
          }}
        >
          {SidebarContent}
        </Sider>
      )}

      {/* Drawer Menu for Mobile */}
      {isMobile && (
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setMobileVisible(false)}
          open={mobileVisible}
          width={240}
          className="mobile-sider-drawer"
        >
          {SidebarContent}
        </Drawer>
      )}

      {/* Layout Content wrapper */}
      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 240,
          transition: "margin-left 0.2s",
        }}
      >
        {/* Top Header Navbar */}
        <Header
          style={{
            padding: "0 24px",
            background: isDarkMode ? "#1e293b" : "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: isDarkMode ? "0 2px 8px rgba(0, 0, 0, 0.2)" : "0 2px 8px rgba(148, 163, 184, 0.04)",
            borderBottom: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
            position: "sticky",
            top: 0,
            zIndex: 90,
            height: 64,
          }}
        >
          <Space size="middle">
            {/* Toggle buttons */}
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuOutlined style={{ color: isDarkMode ? "#94a3b8" : "inherit" }} />}
                onClick={() => setMobileVisible(true)}
                style={{ fontSize: 16, width: 40, height: 40 }}
              />
            ) : (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined style={{ color: isDarkMode ? "#94a3b8" : "inherit" }} /> : <MenuFoldOutlined style={{ color: isDarkMode ? "#94a3b8" : "inherit" }} />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: 16, width: 40, height: 40 }}
              />
            )}

            {/* Dynamic Page Header */}
            <Title
              level={4}
              className="heading-font"
              style={{ margin: 0, fontWeight: 700, color: isDarkMode ? "#ffffff" : "inherit" }}
            >
              {getPageTitle()}
            </Title>
          </Space>

          {/* User profile / Internship tag */}
          <Space size="middle">
            <Button
              type="text"
              className="quick-action-btn"
              icon={isDarkMode ? <SunOutlined style={{ color: "#fbbf24", fontSize: 18 }} /> : <MoonOutlined style={{ color: "#475569", fontSize: 18 }} />}
              onClick={toggleDarkMode}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isDarkMode ? "rgba(251, 191, 36, 0.15)" : "#f1f5f9",
                boxShadow: isDarkMode ? "0 2px 8px rgba(251, 191, 36, 0.1)" : "0 2px 8px rgba(148, 163, 184, 0.08)",
                border: isDarkMode ? "1px solid rgba(251, 191, 36, 0.2)" : "1px solid #e2e8f0",
              }}
            />
            <Badge
              count="AI Internship"
              style={{
                backgroundColor: isDarkMode ? "#312e81" : "#e0e7ff",
                color: isDarkMode ? "#c7d2fe" : "#4f46e5",
                borderColor: isDarkMode ? "#4338ca" : "#c7d2fe",
                fontWeight: 600,
                padding: "0 8px",
              }}
            />
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: 14,
                boxShadow: "0 2px 8px rgba(236, 72, 153, 0.2)",
              }}
            >
              AI
            </div>
          </Space>
        </Header>

        {/* Content Box */}
        <Content
          style={{
            margin: "24px 24px 0 24px",
            minHeight: 280,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="page-animate" style={{ flexGrow: 1 }}>
            {children}
          </div>
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: "center", color: "#64748b", padding: "20px 0" }}>
          Smart Expense Tracker &copy; {new Date().getFullYear()} - Developed for AI Engineering Internship Portfolio.
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
