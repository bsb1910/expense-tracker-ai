import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Input,
  Select,
  Popconfirm,
  Drawer,
  Form,
  InputNumber,
  DatePicker,
  Tag,
  Typography,
  message,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { expenseService, categoryService } from "../services/api";
import { formatCurrency, formatDate, getCategoryStyles } from "../utils/helpers";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Expenses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter and Search States
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Form & Drawer States
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExpensesAndCategories();
  }, []);

  // Check for ?action=add query param
  useEffect(() => {
    if (searchParams.get("action") === "add" && categories.length > 0) {
      handleAddClick();
      // Remove query param so it doesn't reopen on refresh
      setSearchParams({});
    }
  }, [searchParams, categories]);

  const fetchExpensesAndCategories = async () => {
    try {
      setLoading(true);
      const [expenseRes, categoryList] = await Promise.all([
        expenseService.getExpenses(),
        categoryService.getCategories(),
      ]);
      setExpenses(expenseRes.data || []);
      setCategories(categoryList);
    } catch (err) {
      console.error(err);
      message.error("Failed to load expenses or categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingExpense(null);
    form.resetFields();
    form.setFieldsValue({ expenseDate: dayjs() });
    setDrawerVisible(true);
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    form.setFieldsValue({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      expenseDate: dayjs(expense.expenseDate),
    });
    setDrawerVisible(true);
  };

  const handleDeleteConfirm = async (id) => {
    try {
      setLoading(true);
      await expenseService.deleteExpense(id);
      message.success("Expense deleted successfully");
      // Refetch
      const expenseRes = await expenseService.getExpenses();
      setExpenses(expenseRes.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to delete expense");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      setSubmitting(true);
      const payload = {
        amount: values.amount,
        category: values.category,
        description: values.description,
        expenseDate: values.expenseDate.toDate(),
      };

      if (editingExpense) {
        await expenseService.updateExpense(editingExpense._id, payload);
        message.success("Expense updated successfully");
      } else {
        await expenseService.addExpense(payload);
        message.success("Expense added successfully");
      }

      setDrawerVisible(false);
      form.resetFields();
      
      // Refetch updated list
      const expenseRes = await expenseService.getExpenses();
      setExpenses(expenseRes.data || []);
    } catch (err) {
      console.error(err);
      message.error(editingExpense ? "Failed to update expense" : "Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered expenses computing logic
  const filteredExpenses = expenses
    .filter((item) => {
      const matchSearch =
        item.description.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase());
      const matchCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate));

  const columns = [
    {
      title: "Date",
      dataIndex: "expenseDate",
      key: "expenseDate",
      width: 140,
      sorter: (a, b) => new Date(a.expenseDate) - new Date(b.expenseDate),
      render: (date) => formatDate(date),
    },
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
      width: 180,
      sorter: (a, b) => a.category.localeCompare(b.category),
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
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      width: 150,
      sorter: (a, b) => a.amount - b.amount,
      render: (val) => (
        <span style={{ fontWeight: 600, color: "#0f172a" }}>
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit entry">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#4f46e5" }} />}
              onClick={() => handleEditClick(record)}
            />
          </Tooltip>
          <Tooltip title="Delete entry">
            <Popconfirm
              title="Delete Expense"
              description="Are you sure you want to delete this expense record?"
              onConfirm={() => handleDeleteConfirm(record._id)}
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
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Search & Filter Header card */}
      <Card className="premium-card">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={16}>
            <Space size="middle" wrap style={{ width: "100%" }}>
              {/* Search bar */}
              <Input
                placeholder="Search description or category..."
                prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 280, borderRadius: 8 }}
                allowClear
              />
              {/* Category select filter */}
              <Space>
                <FilterOutlined style={{ color: "#94a3b8" }} />
                <Select
                  value={selectedCategory}
                  onChange={(val) => setSelectedCategory(val)}
                  style={{ width: 180 }}
                  options={[
                    { value: "All", label: "All Categories" },
                    ...categories.map((c) => ({ value: c, label: c })),
                  ]}
                />
              </Space>
            </Space>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddClick}
              size="large"
              style={{ borderRadius: 8 }}
            >
              Log Expense
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Main ledger list card */}
      <Card className="premium-card" bodyStyle={{ padding: 0 }}>
        <Table
          dataSource={filteredExpenses}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} entries`,
          }}
          locale={{ emptyText: "No matching expense records found" }}
        />
      </Card>

      {/* Sliding Form Drawer */}
      <Drawer
        title={
          <span className="heading-font" style={{ fontWeight: 700 }}>
            {editingExpense ? "Edit Expense Log" : "Log New Expense"}
          </span>
        }
        width={isMobileDrawer() ? "100%" : 480}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          requiredMark="optional"
        >
          {/* Amount */}
          <Form.Item
            name="amount"
            label="Transaction Amount"
            rules={[
              { required: true, message: "Please input the expense amount" },
              { type: "number", min: 0.01, message: "Amount must be greater than 0" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
              placeholder="0.00"
              precision={2}
              size="large"
            />
          </Form.Item>

          {/* Category selection */}
          <Form.Item
            name="category"
            label="Spending Category"
            rules={[{ required: true, message: "Please select an expense category" }]}
          >
            <Select
              placeholder="Select a category"
              size="large"
              options={categories.map((c) => ({ value: c, label: c }))}
            />
          </Form.Item>

          {/* Expense Date */}
          <Form.Item
            name="expenseDate"
            label="Expense Date"
            rules={[{ required: true, message: "Please pick the transaction date" }]}
          >
            <DatePicker style={{ width: "100%" }} size="large" format="YYYY-MM-DD" />
          </Form.Item>

          {/* Description */}
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please provide a short description" },
              { max: 100, message: "Description cannot exceed 100 characters" },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="E.g., Groceries, Uber ride, Electric bill"
              maxLength={100}
              showCount
            />
          </Form.Item>

          {/* Drawer Form Actions */}
          <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
            <Space style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
              <Button onClick={() => setDrawerVisible(false)} size="large">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                size="large"
              >
                {editingExpense ? "Save Changes" : "Submit"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

// Simple helper to decide drawer sizing based on screen width
const isMobileDrawer = () => {
  return window.innerWidth < 576;
};



export default Expenses;
