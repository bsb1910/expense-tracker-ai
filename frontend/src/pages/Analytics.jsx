import React, { useState, useEffect } from "react";
import { Row, Col, Card, Select, Space, Statistic, Typography, Skeleton, Empty } from "antd";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ChartTooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  RiseOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { expenseService } from "../services/api";
import { formatCurrency, getCategoryStyles, CHART_COLORS } from "../utils/helpers";
import { useTheme } from "../utils/ThemeContext";

const { Title, Text } = Typography;

const Analytics = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [timeRange, setTimeRange] = useState("All");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetchExpenses();
    const timer = setTimeout(() => setMounted(true), 350);
    return () => clearTimeout(timer);
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await expenseService.getExpenses();
      setExpenses(res.data || []);
    } catch (err) {
      console.error("Failed to fetch analytics data", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter expenses based on selected range
  const getFilteredExpenses = () => {
    if (timeRange === "All") return expenses;

    const now = new Date();
    let cutoffDate = new Date();

    if (timeRange === "30") {
      cutoffDate.setDate(now.getDate() - 30);
    } else if (timeRange === "180") {
      cutoffDate.setMonth(now.getMonth() - 6);
    } else if (timeRange === "year") {
      cutoffDate = new Date(now.getFullYear(), 0, 1); // Jan 1st of current year
    }

    return expenses.filter((item) => new Date(item.expenseDate) >= cutoffDate);
  };

  const filteredData = getFilteredExpenses();

  // Process Category Spending data
  const processCategoryData = () => {
    const map = {};
    filteredData.forEach((item) => {
      const cat = item.category;
      map[cat] = (map[cat] || 0) + item.amount;
    });

    return Object.keys(map)
      .map((name) => ({
        name,
        value: parseFloat(map[name].toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);
  };

  // Process Monthly Spending trend data
  const processMonthlyData = () => {
    const map = {};
    
    expenses.forEach((item) => {
      const date = new Date(item.expenseDate);
      if (isNaN(date.getTime())) return;

      const year = date.getFullYear();
      const month = date.getMonth(); // 0-11
      
      const key = `${year}-${String(month + 1).padStart(2, "0")}`; // YYYY-MM for sorting
      const label = date.toLocaleString("default", { month: "short", year: "2-digit" }); // e.g., "Jun 26"

      if (!map[key]) {
        map[key] = { key, label, amount: 0 };
      }
      map[key].amount += item.amount;
    });

    // Sort chronologically
    return Object.keys(map)
      .sort()
      .map((key) => ({
        month: map[key].label,
        amount: parseFloat(map[key].amount.toFixed(2)),
      }));
  };

  const categoryData = processCategoryData();
  const monthlyData = processMonthlyData();

  // Custom tooltips for Recharts
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = categoryData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <Card
          size="small"
          style={{
            background: isDarkMode ? "rgba(30, 41, 59, 0.85)" : "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(8px)",
            border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
          styles={{ body: { padding: "10px 14px" } }}
        >
          <Text style={{ color: isDarkMode ? "#f8fafc" : "#0f172a", fontWeight: 600, display: "block", fontSize: 13 }}>{data.name}</Text>
          <Text style={{ color: "#06b6d4", fontWeight: 700, fontSize: 16, display: "block", marginTop: 2 }}>
            {formatCurrency(data.value)}
          </Text>
          <Text style={{ color: "#94a3b8", display: "block", fontSize: 11, marginTop: 4, fontWeight: 500 }}>
            Share: {percentage}%
          </Text>
        </Card>
      );
    }
    return null;
  };

  const CustomTrendTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <Card
          size="small"
          style={{
            background: isDarkMode ? "rgba(30, 41, 59, 0.85)" : "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(8px)",
            border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
          styles={{ body: { padding: "10px 14px" } }}
        >
          <Text style={{ color: "#94a3b8", display: "block", fontSize: 11, fontWeight: 500, marginBottom: 2 }}>{data.payload.month}</Text>
          <Text style={{ color: "#4f46e5", fontWeight: 700, fontSize: 16 }}>
            {formatCurrency(data.value)}
          </Text>
        </Card>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <Card
          size="small"
          style={{
            background: isDarkMode ? "rgba(30, 41, 59, 0.85)" : "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(8px)",
            border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
          styles={{ body: { padding: "10px 14px" } }}
        >
          <Text style={{ color: isDarkMode ? "#f8fafc" : "#0f172a", fontWeight: 600, display: "block", fontSize: 13 }}>{data.payload.name}</Text>
          <Text style={{ color: "#10b981", fontWeight: 700, fontSize: 16, display: "block", marginTop: 2 }}>
            {formatCurrency(data.value)}
          </Text>
        </Card>
      );
    }
    return null;
  };

  // Stats computation
  const totalSpent = filteredData.reduce((sum, item) => sum + item.amount, 0);
  const averageSpent = filteredData.length > 0 ? totalSpent / filteredData.length : 0;
  const maxExpense = filteredData.length > 0
    ? Math.max(...filteredData.map((o) => o.amount))
    : 0;

  if (loading) {
    return (
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        <Skeleton active paragraph={{ rows: 12 }} />
      </Space>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Filters & Title bar */}
      <Card className="premium-card">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} sm={12}>
            <Title level={4} className="heading-font" style={{ margin: 0, color: isDarkMode ? "#ffffff" : "#0f172a" }}>
              Spending Analytics
            </Title>
            <Text type="secondary">Explore visual trends and patterns of your expenditures.</Text>
          </Col>
          <Col xs={24} sm={12} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Space orientation="vertical" size={2} style={{ width: "100%", maxWidth: 240 }}>
              <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}>Time Interval</Text>
              <Select
                value={timeRange}
                onChange={setTimeRange}
                style={{ width: "100%" }}
                options={[
                  { value: "All", label: "All Time" },
                  { value: "30", label: "Last 30 Days" },
                  { value: "180", label: "Last 6 Months" },
                  { value: "year", label: "This Year" },
                ]}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* KPI Cards section */}
      <Row gutter={[24, 24]}>
        {/* Cumulative Outflow */}
        <Col xs={24} sm={8}>
          <Card className="premium-card metric-card-total" variant="borderless" styles={{ body: { padding: "24px" } }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <Space orientation="vertical" size={2}>
                <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  Cumulative Outflow
                </Text>
                <div style={{ marginTop: 4 }}>
                  <span className="heading-font gradient-text" style={{ fontSize: 30, fontWeight: 700, display: "block" }}>
                    {formatCurrency(totalSpent)}
                  </span>
                </div>
              </Space>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(79, 70, 229, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <RiseOutlined style={{ color: "#4f46e5", fontSize: 20 }} />
              </div>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Sum total across selected range
              </Text>
            </div>
          </Card>
        </Col>

        {/* Average per Entry */}
        <Col xs={24} sm={8}>
          <Card className="premium-card metric-card-categories" variant="borderless" styles={{ body: { padding: "24px" } }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <Space orientation="vertical" size={2}>
                <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  Average / Entry
                </Text>
                <div style={{ marginTop: 4 }}>
                  <span className="heading-font" style={{ fontSize: 30, fontWeight: 700, color: "#0891b2", display: "block" }}>
                    {formatCurrency(averageSpent)}
                  </span>
                </div>
              </Space>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(6, 182, 212, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CalendarOutlined style={{ color: "#06b6d4", fontSize: 20 }} />
              </div>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Average ticket size of transactions
              </Text>
            </div>
          </Card>
        </Col>

        {/* Peak Transaction */}
        <Col xs={24} sm={8}>
          <Card className="premium-card metric-card-summary" variant="borderless" styles={{ body: { padding: "24px" } }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <Space orientation="vertical" size={2}>
                <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  Peak Transaction
                </Text>
                <div style={{ marginTop: 4 }}>
                  <span className="heading-font" style={{ fontSize: 30, fontWeight: 700, color: "#10b981", display: "block" }}>
                    {formatCurrency(maxExpense)}
                  </span>
                </div>
              </Space>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ThunderboltOutlined style={{ color: "#10b981", fontSize: 20 }} />
              </div>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Single largest ledger transaction
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main charts */}
      {filteredData.length === 0 ? (
        <Card className="premium-card" style={{ padding: "40px 0" }}>
          <Empty description="Not enough expense records to plot visualizations. Try logging some transactions first!" />
        </Card>
      ) : (
        mounted && (
          <>
            <Row gutter={[24, 24]}>
            {/* Category distribution Pie/Donut Chart */}
            <Col xs={24} lg={10}>
              <Card
                title={
                  <span className="heading-font" style={{ fontWeight: 700, fontSize: 16 }}>
                    Category Allocations
                  </span>
                }
                className="premium-card"
                style={{ height: "100%" }}
              >
                <div style={{ height: 320, display: "flex", justifyContent: "center" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => {
                          const style = getCategoryStyles(entry.name);
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={style.color || CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          );
                        })}
                      </Pie>
                      <ChartTooltip content={<CustomPieTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                          <span style={{ fontSize: 12, color: isDarkMode ? "#94a3b8" : "#475569", fontWeight: 500 }}>
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

            {/* Monthly Spending Trend Chart */}
            <Col xs={24} lg={14}>
              <Card
                title={
                  <span className="heading-font" style={{ fontWeight: 700, fontSize: 16 }}>
                    Monthly Cash Trend
                  </span>
                }
                className="premium-card"
                style={{ height: "100%" }}
              >
                <div style={{ height: 320 }}>
                  {monthlyData.length < 2 ? (
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        color: "#94a3b8",
                        gap: 8,
                      }}
                    >
                      <PieChartOutlined style={{ fontSize: 32 }} />
                      <Text type="secondary">Accumulate expenses across multiple months to populate trends.</Text>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={monthlyData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#f1f5f9"} />
                        <XAxis
                          dataKey="month"
                          stroke="#94a3b8"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#94a3b8"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => `₹${v}`}
                        />
                        <ChartTooltip content={<CustomTrendTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="amount"
                          stroke="#4f46e5"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorAmount)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>
            </Col>
          </Row>

          {/* Category spending bar chart comparison */}
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24}>
              <Card
                title={
                  <span className="heading-font" style={{ fontWeight: 700, fontSize: 16 }}>
                    Category Spending Comparison
                  </span>
                }
                className="premium-card"
              >
                <div style={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} margin={{ top: 20, right: 30, left: -10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#f1f5f9"} />
                      <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `₹${v}`}
                      />
                      <ChartTooltip content={<CustomBarTooltip />} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                        {categoryData.map((entry, index) => {
                          const style = getCategoryStyles(entry.name);
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={style.color || CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>
        </>
        )
      )}
    </div>
  );
};

export default Analytics;
