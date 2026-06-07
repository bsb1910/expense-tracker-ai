import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Table, Tag, Space, Button, Alert, Skeleton, Typography } from "antd";
import {
  DollarCircleOutlined,
  TagsOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  LineChartOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { expenseService, categoryService } from "../services/api";
import { formatCurrency, formatDate, getCategoryStyles } from "../utils/helpers";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [metrics, setMetrics] = useState({
    total: 0,
    currentMonthTotal: 0,
    prevMonthTotal: 0,
    percentChange: 0,
  });
  const [stats, setStats] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  try {
    setLoading(true);
    setError(null);

   const [expenseRes, statsRes, categoryList] = await Promise.all([
  expenseService.getExpenses(),
  expenseService.getStats(),
  categoryService.getCategories(),
]);



    const fetchedExpenses = expenseRes.data || [];

    setExpenses(fetchedExpenses);
    setCategoriesCount(categoryList.length);

    // Store backend stats
    setStats(statsRes.data);

    // Existing dashboard calculations
    computeStats(fetchedExpenses);
  } catch (err) {
    console.error("Dashboard loading error:", err);

    setError(
      "Failed to load dashboard metrics. Please check if backend server is running."
    );
  } finally {
    setLoading(false);
  }
};

  const computeStats = (items) => {
    const total = items.reduce((acc, curr) => acc + curr.amount, 0);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    let currentMonthTotal = 0;
    let prevMonthTotal = 0;

    items.forEach((item) => {
      const expDate = new Date(item.expenseDate);
      if (isNaN(expDate.getTime())) return;

      const y = expDate.getFullYear();
      const m = expDate.getMonth();

      if (y === currentYear && m === currentMonth) {
        currentMonthTotal += item.amount;
      } else if (y === prevMonthYear && m === prevMonth) {
        prevMonthTotal += item.amount;
      }
    });

    let percentChange = 0;
    if (prevMonthTotal > 0) {
      percentChange = ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100;
    } else if (currentMonthTotal > 0) {
      percentChange = 100; // 100% increase from 0
    }

    setMetrics({
      total,
      currentMonthTotal,
      prevMonthTotal,
      percentChange,
    });
  };

  // Recent 5 expenses table setup
  const sortedExpenses = [...expenses]
    .sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate))
    .slice(0, 5);

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <Text strong style={{ color: "inherit" }}>{text}</Text>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => {
        const meta = getCategoryStyles(category);
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 20,
              backgroundColor: meta.bgColor,
              color: meta.color,
              fontSize: 12,
              fontWeight: 600,
              border: `1px solid ${meta.color}25`,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: meta.color }} />
            <span style={{ display: "flex", alignItems: "center" }}>{meta.icon}</span>
            <span style={{ marginLeft: 2 }}>{category}</span>
          </span>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "expenseDate",
      key: "expenseDate",
      render: (date) => <Text style={{ color: "inherit" }}>{formatDate(date)}</Text>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (val) => (
        <span style={{ fontWeight: 600, color: "inherit" }}>
          {formatCurrency(val)}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}><Skeleton active paragraph={{ rows: 2 }} /></Col>
          <Col xs={24} sm={12} lg={8}><Skeleton active paragraph={{ rows: 2 }} /></Col>
          <Col xs={24} sm={24} lg={8}><Skeleton active paragraph={{ rows: 2 }} /></Col>
        </Row>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Space>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {error && (
        <Alert
          message="Server Offline Alert"
          description={error}
          type="warning"
          showIcon
          closable
          action={
            <Button size="small" type="primary" onClick={fetchDashboardData}>
              Retry Connection
            </Button>
          }
        />
      )}

      {/* KPI Cards section */}
      <Row gutter={[24, 24]}>
        {/* Total Expenses Card */}
        <Col xs={24} sm={12} lg={8}>
          <Card className="premium-card metric-card-total" variant="borderless" styles={{ body: { padding: "24px" } }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <Space orientation="vertical" size={2}>
                <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>
                  Cumulative Spending
                </Text>
                <div style={{ marginTop: 4 }}>
                  <span className="heading-font gradient-text" style={{ fontSize: 30, fontWeight: 700, display: "block" }}>
                    {formatCurrency(stats?.totalExpenses || 0)}
                  </span>
                </div>
              </Space>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(79, 70, 229, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DollarCircleOutlined style={{ color: "#4f46e5", fontSize: 20 }} />
              </div>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Aggregate sum of all logged transactions
              </Text>
            </div>
          </Card>
        </Col>

        {/* Total Categories Card */}
        <Col xs={24} sm={12} lg={8}>
          <Card className="premium-card metric-card-categories" variant="borderless" styles={{ body: { padding: "24px" } }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <Space orientation="vertical" size={2}>
                <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>
                  Active Categories
                </Text>
                <div style={{ marginTop: 4 }}>
                  <span className="heading-font" style={{ fontSize: 30, fontWeight: 700, color: "#0891b2", display: "block" }}>
                    {categoriesCount}
                  </span>
                </div>
              </Space>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(6, 182, 212, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TagsOutlined style={{ color: "#06b6d4", fontSize: 20 }} />
              </div>
            </div>
            <div>
              <Button type="link" size="small" onClick={() => navigate("/categories")} style={{ padding: 0, height: "auto", color: "#0891b2", fontSize: 12, fontWeight: 500 }}>
                Manage budgeting tags &rarr;
              </Button>
            </div>
          </Card>
        </Col>

        {/* Monthly Summary Card */}
        <Col xs={24} sm={24} lg={8}>
          <Card className="premium-card metric-card-summary" variant="borderless" styles={{ body: { padding: "24px" } }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <Space orientation="vertical" size={2}>
                <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>
                  This Month's Outflow
                </Text>
                <div style={{ marginTop: 4 }}>
                  <span className="heading-font" style={{ fontSize: 30, fontWeight: 700, color: "#10b981", display: "block" }}>
                    {formatCurrency(metrics.currentMonthTotal)}
                  </span>
                </div>
              </Space>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CalendarOutlined style={{ color: "#10b981", fontSize: 20 }} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {metrics.percentChange >= 0 ? (
                <Tag color="#fee2e2" style={{ color: "#ef4444", border: "none", fontWeight: 600, borderRadius: 12, padding: "2px 8px" }}>
                  <ArrowUpOutlined /> {metrics.percentChange.toFixed(1)}%
                </Tag>
              ) : (
                <Tag color="#d1fae5" style={{ color: "#10b981", border: "none", fontWeight: 600, borderRadius: 12, padding: "2px 8px" }}>
                  <ArrowDownOutlined /> {Math.abs(metrics.percentChange).toFixed(1)}%
                </Tag>
              )}
              <Text type="secondary" style={{ fontSize: 12 }}>
                vs last month ({formatCurrency(metrics.prevMonthTotal)})
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions Shortcuts Panel Dock */}
      <Card className="premium-card" styles={{ body: { padding: "20px 24px" } }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <Title level={5} className="heading-font" style={{ margin: 0, fontSize: 16 }}>
              Quick Workspace Shortcuts
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Launch typical logging operations or consult data projections immediately.
            </Text>
          </div>
          <Space size="middle" wrap>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/expenses?action=add")}
              style={{ borderRadius: 8, height: 38 }}
            >
              Log New Expense
            </Button>
            <Button
              type="default"
              icon={<LineChartOutlined />}
              onClick={() => navigate("/analytics")}
              style={{ borderRadius: 8, height: 38, fontWeight: 500 }}
              className="quick-action-btn"
            >
              View Analytics Reports
            </Button>
            <Button
              className="ai-glow"
              style={{
                background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                border: "none",
                color: "#ffffff",
                fontWeight: 600,
                borderRadius: 8,
                height: 38
              }}
              icon={<RobotOutlined />}
              onClick={() => navigate("/ai-assistant")}
            >
              Consult Assistant
            </Button>
          </Space>
        </div>
      </Card>

      {/* Recent Ledger table */}
      <Card
        title={
          <span className="heading-font" style={{ fontWeight: 700, fontSize: 16 }}>
            Recent Activities
          </span>
        }
        extra={
          <Button type="link" onClick={() => navigate("/expenses")}>
            Full Ledger &rarr;
          </Button>
        }
        className="premium-card"
        styles={{ body: { padding: 0 } }}
      >
        <Table
          dataSource={sortedExpenses}
          columns={columns}
          rowKey="_id"
          pagination={false}
          locale={{ emptyText: "No expenses logged yet. Click 'Log New Expense' to start!" }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
