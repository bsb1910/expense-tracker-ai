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
} from "recharts";
import {
  RiseOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { expenseService } from "../services/api";
import { formatCurrency, getCategoryStyles, CHART_COLORS } from "../utils/helpers";

const { Title, Text } = Typography;

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [timeRange, setTimeRange] = useState("All");

  useEffect(() => {
    fetchExpenses();
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
            background: "rgba(15, 23, 42, 0.95)",
            border: "none",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
          bodyStyle={{ padding: "8px 12px" }}
        >
          <Text style={{ color: "#f8fafc", fontWeight: 600, display: "block" }}>{data.name}</Text>
          <Text style={{ color: "#06b6d4", fontWeight: 700, fontSize: 15 }}>
            {formatCurrency(data.value)}
          </Text>
          <Text style={{ color: "#94a3b8", display: "block", fontSize: 11, marginTop: 2 }}>
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
            background: "rgba(15, 23, 42, 0.95)",
            border: "none",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
          bodyStyle={{ padding: "8px 12px" }}
        >
          <Text style={{ color: "#94a3b8", display: "block", fontSize: 11 }}>{data.payload.month}</Text>
          <Text style={{ color: "#4f46e5", fontWeight: 700, fontSize: 16 }}>
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
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Skeleton active paragraph={{ rows: 12 }} />
      </Space>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Filters & Statistics Summary bar */}
      <Card className="premium-card">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={6}>
            <Space direction="vertical" size={2}>
              <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase" }}>Time Interval</Text>
              <Select
                value={timeRange}
                onChange={setTimeRange}
                style={{ width: "100%", minWidth: 180 }}
                options={[
                  { value: "All", label: "All Time" },
                  { value: "30", label: "Last 30 Days" },
                  { value: "180", label: "Last 6 Months" },
                  { value: "year", label: "This Year" },
                ]}
              />
            </Space>
          </Col>
          <Col xs={24} md={18}>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8}>
                <Statistic
                  title="Period Spend"
                  value={totalSpent}
                  formatter={(val) => <span style={{ fontWeight: 700, fontSize: 20 }}>{formatCurrency(val)}</span>}
                  prefix={<RiseOutlined style={{ color: "#4f46e5", marginRight: 4 }} />}
                />
              </Col>
              <Col xs={12} sm={8}>
                <Statistic
                  title="Average / Log"
                  value={averageSpent}
                  formatter={(val) => <span style={{ fontWeight: 700, fontSize: 20 }}>{formatCurrency(val)}</span>}
                  prefix={<CalendarOutlined style={{ color: "#06b6d4", marginRight: 4 }} />}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Highest Expense"
                  value={maxExpense}
                  formatter={(val) => <span style={{ fontWeight: 700, fontSize: 20 }}>{formatCurrency(val)}</span>}
                  prefix={<ThunderboltOutlined style={{ color: "#ec4899", marginRight: 4 }} />}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Main charts */}
      {filteredData.length === 0 ? (
        <Card className="premium-card" style={{ padding: "40px 0" }}>
          <Empty description="Not enough expense records to plot visualizations. Try logging some transactions first!" />
        </Card>
      ) : (
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
                      formatter={(value, entry) => (
                        <span style={{ fontSize: 12, color: "#475569", fontWeight: 500 }}>
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
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
                        tickFormatter={(v) => `$${v}`}
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
      )}
    </div>
  );
};

export default Analytics;
