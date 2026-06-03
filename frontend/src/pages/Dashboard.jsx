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

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch expenses and categories
      const [expenseRes, categoryList] = await Promise.all([
        expenseService.getExpenses(),
        categoryService.getCategories(),
      ]);

      const fetchedExpenses = expenseRes.data || [];
      setExpenses(fetchedExpenses);
      setCategoriesCount(categoryList.length);

      // Compute statistics
      computeStats(fetchedExpenses);
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError("Failed to load dashboard metrics. Please check if your backend server is running.");
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
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => {
        const meta = getCategoryStyles(category);
        return (
          <Tag icon={meta.icon} color={meta.bgColor} style={{ color: meta.color, border: `1px solid ${meta.color}40`, borderRadius: 6 }}>
            {category}
          </Tag>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "expenseDate",
      key: "expenseDate",
      render: (date) => formatDate(date),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (val) => (
        <span style={{ fontWeight: 600, color: "#0f172a" }}>
          {formatCurrency(val)}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
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
          <Card className="premium-card metric-card-total" bordered={false}>
            <Statistic
              title={
                <Text type="secondary" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Cumulative Spending
                </Text>
              }
              value={metrics.total}
              precision={2}
              formatter={(val) => (
                <span className="heading-font gradient-text" style={{ fontSize: 32, fontWeight: 700 }}>
                  {formatCurrency(val)}
                </span>
              )}
              prefix={<DollarCircleOutlined style={{ color: "#4f46e5", fontSize: 24, marginRight: 8 }} />}
            />
            <div style={{ marginTop: 12 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Across all categories and entries
              </Text>
            </div>
          </Card>
        </Col>

        {/* Total Categories Card */}
        <Col xs={24} sm={12} lg={8}>
          <Card className="premium-card metric-card-categories" bordered={false}>
            <Statistic
              title={
                <Text type="secondary" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Active Categories
                </Text>
              }
              value={categoriesCount}
              formatter={(val) => (
                <span className="heading-font" style={{ fontSize: 32, fontWeight: 700, color: "#0891b2" }}>
                  {val}
                </span>
              )}
              prefix={<TagsOutlined style={{ color: "#06b6d4", fontSize: 24, marginRight: 8 }} />}
            />
            <div style={{ marginTop: 12 }}>
              <Button type="link" size="small" onClick={() => navigate("/categories")} style={{ padding: 0, height: "auto", color: "#0891b2" }}>
                Manage budgeting tags &rarr;
              </Button>
            </div>
          </Card>
        </Col>

        {/* Monthly Summary Card */}
        <Col xs={24} sm={24} lg={8}>
          <Card className="premium-card metric-card-summary" bordered={false}>
            <Statistic
              title={
                <Text type="secondary" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  This Month's Outflow
                </Text>
              }
              value={metrics.currentMonthTotal}
              precision={2}
              formatter={(val) => (
                <span className="heading-font" style={{ fontSize: 32, fontWeight: 700, color: "#059669" }}>
                  {formatCurrency(val)}
                </span>
              )}
              prefix={<CalendarOutlined style={{ color: "#10b981", fontSize: 24, marginRight: 8 }} />}
            />
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
              {metrics.percentChange >= 0 ? (
                <Tag color="#fee2e2" style={{ color: "#ef4444", border: "none", fontWeight: 600 }}>
                  <ArrowUpOutlined /> {metrics.percentChange.toFixed(1)}%
                </Tag>
              ) : (
                <Tag color="#d1fae5" style={{ color: "#10b981", border: "none", fontWeight: 600 }}>
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

      {/* Quick Actions Shortcuts */}
      <Card className="premium-card" style={{ padding: "8px 12px" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6}>
            <Title level={5} className="heading-font" style={{ margin: 0 }}>
              Quick Actions
            </Title>
          </Col>
          <Col xs={24} sm={18}>
            <Space size="middle" wrap>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/expenses?action=add")}
              >
                Log New Expense
              </Button>
              <Button
                type="default"
                icon={<LineChartOutlined />}
                onClick={() => navigate("/analytics")}
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
                }}
                icon={<RobotOutlined />}
                onClick={() => navigate("/ai-assistant")}
              >
                Consult Assistant
              </Button>
            </Space>
          </Col>
        </Row>
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
        bodyStyle={{ padding: 0 }}
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
