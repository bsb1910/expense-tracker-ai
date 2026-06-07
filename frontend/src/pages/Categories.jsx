import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Card,
  Progress,
  Tag,
  Popconfirm,
  Typography,
  message,
  Skeleton,
} from "antd";
import { PlusOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { categoryService, expenseService } from "../services/api";
import { formatCurrency, getCategoryStyles } from "../utils/helpers";
import { useTheme } from "../utils/ThemeContext";

const { Title, Text } = Typography;

const Categories = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoryList, expenseRes] = await Promise.all([
        categoryService.getCategories(),
        expenseService.getExpenses(),
      ]);
      setCategories(categoryList);
      setExpenses(expenseRes.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load category statistics.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (values) => {
    try {
      setSubmitting(true);
      const newCategory = values.categoryName.trim();
      await categoryService.addCategory(newCategory);
      message.success(`Category "${newCategory}" added successfully!`);
      setModalVisible(false);
      form.resetFields();
      
      // Refresh statistics
      fetchData();
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to add category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    try {
      setLoading(true);
      await categoryService.deleteCategory(categoryName);
      message.success(`Category "${categoryName}" deleted successfully.`);
      fetchData();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete category.");
    } finally {
      setLoading(false);
    }
  };

  // Compute stats for each category
  const totalSpendingSum = expenses.reduce((sum, item) => sum + item.amount, 0);

  const categoryStatsData = categories.map((category) => {
    const matchedExpenses = expenses.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
    const count = matchedExpenses.length;
    const spent = matchedExpenses.reduce((sum, item) => sum + item.amount, 0);
    const percentage = totalSpendingSum > 0 ? (spent / totalSpendingSum) * 100 : 0;

    return {
      key: category,
      categoryName: category,
      count,
      spent,
      percentage,
    };
  });

  const columns = [
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
      render: (category) => {
        const meta = getCategoryStyles(category);
        return (
          <Space>
            <span
              style={{
                color: meta.color,
                background: meta.bgColor,
                width: 32,
                height: 32,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              {meta.icon}
            </span>
            <Text strong style={{ fontSize: 15 }}>
              {category}
            </Text>
          </Space>
        );
      },
    },
    {
      title: "Logged Expenses",
      dataIndex: "count",
      key: "count",
      align: "center",
      width: 160,
      sorter: (a, b) => a.count - b.count,
      render: (count) => (
        <Tag color={count > 0 ? "blue" : "default"} style={{ borderRadius: 6, fontWeight: 500 }}>
          {count} {count === 1 ? "expense" : "expenses"}
        </Tag>
      ),
    },
    {
      title: "Total Outflow",
      dataIndex: "spent",
      key: "spent",
      align: "right",
      width: 180,
      sorter: (a, b) => a.spent - b.spent,
      render: (spent) => (
        <span style={{ fontWeight: 600, color: "inherit", fontSize: 15 }}>
          {formatCurrency(spent)}
        </span>
      ),
    },
    {
      title: "Share of Budget",
      dataIndex: "percentage",
      key: "percentage",
      width: 240,
      sorter: (a, b) => a.percentage - b.percentage,
      render: (pct) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Progress
            percent={parseFloat(pct.toFixed(1))}
            strokeColor={{
              "0%": "#4f46e5",
              "100%": "#06b6d4",
            }}
            railColor={isDarkMode ? "#334155" : "#e2e8f0"}
            size="small"
            style={{ flexGrow: 1 }}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: 100,
      render: (_, record) => {
        // Warning description if there are active transactions linked to it
        const hasExpenses = record.count > 0;
        const confirmTitle = hasExpenses ? "Active Expenses Warning!" : "Delete Category";
        const confirmDesc = hasExpenses
          ? `This category is linked to ${record.count} active expense records. Deleting it will leave those records categorized as "${record.categoryName}" but it will be removed from your filter options. Continue?`
          : `Are you sure you want to delete the "${record.categoryName}" category?`;

        return (
          <Popconfirm
            title={confirmTitle}
            description={confirmDesc}
            icon={hasExpenses ? <InfoCircleOutlined style={{ color: "#ef4444" }} /> : undefined}
            onConfirm={() => handleDeleteCategory(record.categoryName)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        );
      },
    },
  ];

  if (loading && categories.length === 0) {
    return (
      <Card className="premium-card">
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Upper Action card */}
      <Card className="premium-card">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} sm={16}>
            <Text type="secondary" style={{ fontSize: 14 }}>
              Define customized categories to organize your personal transactions. Check your aggregate outflow distributions in real time.
            </Text>
          </Col>
          <Col xs={24} sm={8} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
              size="large"
              style={{ borderRadius: 8 }}
            >
              Add Category
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Categories Ledger table */}
      <Card className="premium-card" styles={{ body: { padding: 0 } }}>
        <Table
          dataSource={categoryStatsData}
          columns={columns}
          loading={loading}
          pagination={false}
        />
      </Card>

      {/* Add Category Modal dialog */}
      <Modal
        title={
          <span className="heading-font" style={{ fontWeight: 700 }}>
            Create New Category
          </span>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddCategory}
          requiredMark="optional"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="categoryName"
            label="Category Name"
            rules={[
              { required: true, message: "Please input a category name" },
              { max: 25, message: "Category name must be 25 characters or less" },
              {
                validator: (_, value) => {
                  if (
                    value &&
                    categories.some((c) => c.toLowerCase() === value.trim().toLowerCase())
                  ) {
                    return Promise.reject(new Error("Category already exists"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="E.g., Travel, Taxes, Subscriptions" size="large" autoFocus />
          </Form.Item>

          <Form.Item style={{ display: "flex", justifyContent: "flex-end", marginBottom: 0, marginTop: 24 }}>
            <Space>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Create Category
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
