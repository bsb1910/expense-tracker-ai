import React, { useState, useEffect, useRef } from "react";
import { Card, Input, Button, Avatar, Space, Typography, Tag, message } from "antd";
import { SendOutlined, RobotOutlined, UserOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { expenseService } from "../services/api";
import { formatCurrency, formatDate } from "../utils/helpers";

const { Text, Title, Paragraph } = Typography;

const AIAssistant = () => {
  const [expenses, setExpenses] = useState([]);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I am your Smart Expense Assistant. I've analyzed your transaction ledger. Ask me any question about your spending, or click one of the suggested prompts below!",
      time: new Date(),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Suggested Prompts
  const suggestionPrompts = [
    "What is my total spent?",
    "What was my highest expense?",
    "How much did I spend on Food?",
    "What is my average expense size?",
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const fetchExpenses = async () => {
    try {
      const res = await expenseService.getExpenses();
      setExpenses(res.data || []);
    } catch (err) {
      console.error("AI Assistant data fetch error:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiReply = generateMockResponse(text.trim());
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiReply,
        time: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 1200);
  };

  /**
   * Mock Analytical Engine: Reads current database state to reply
   */
  const generateMockResponse = (query) => {
    const q = query.toLowerCase();
    
    if (expenses.length === 0) {
      return "It looks like you don't have any expense records yet. Please log some expenses first so I can analyze them!";
    }

    // 1. Total Cumulative Spending query
    if (q.includes("total") || q.includes("sum") || q.includes("how much did i spend in total")) {
      const total = expenses.reduce((sum, item) => sum + item.amount, 0);
      return `Your total cumulative spending across all categories is ${formatCurrency(total)} based on ${expenses.length} transaction entries.`;
    }

    // 2. Highest / Largest expense query
    if (q.includes("highest") || q.includes("largest") || q.includes("biggest") || q.includes("most")) {
      const maxExpense = [...expenses].sort((a, b) => b.amount - a.amount)[0];
      return `Your highest single expense is "${maxExpense.description}" under the category "${maxExpense.category}", amounting to ${formatCurrency(maxExpense.amount)} on ${formatDate(maxExpense.expenseDate)}.`;
    }

    // 3. Average size query
    if (q.includes("average") || q.includes("avg") || q.includes("mean")) {
      const total = expenses.reduce((sum, item) => sum + item.amount, 0);
      const avg = total / expenses.length;
      return `Your average transaction size is ${formatCurrency(avg)} across your ${expenses.length} logged items.`;
    }

    // 4. Counts of logs query
    if (q.includes("count") || q.includes("how many") || q.includes("number of")) {
      return `You have recorded exactly ${expenses.length} transactions in your ledger.`;
    }

    // 5. Category-wise query (Food, Transport, Rent, Utilities, Healthcare, Shopping, Education, Other)
    const matchingCategories = expenses.map(e => e.category.toLowerCase());
    const matchedCategory = matchingCategories.find(cat => q.includes(cat));

    if (matchedCategory) {
      // Find the proper-cased category name
      const properCat = expenses.find(e => e.category.toLowerCase() === matchedCategory).category;
      const catExpenses = expenses.filter(e => e.category.toLowerCase() === matchedCategory);
      const catTotal = catExpenses.reduce((sum, item) => sum + item.amount, 0);
      
      return `You have spent a total of ${formatCurrency(catTotal)} on ${properCat} across ${catExpenses.length} entries. This represents ${((catTotal / expenses.reduce((s,i) => s + i.amount, 0)) * 100).toFixed(1)}% of your overall spending.`;
    }

    // FALLBACK
    /*
     * DEVELOPER ARCHITECTURE NOTE:
     * To integrate a real LLM (like Google Gemini API via a backend route /api/ai/chat):
     * Replace this entire local logic with:
     * 
     * try {
     *   const res = await axios.post("/api/ai/chat", { prompt: query, currentLedger: expenses });
     *   return res.data.response;
     * } catch(err) {
     *   return "Sorry, I couldn't reach the AI brain server.";
     * }
     */
    return "I am your Smart Finance Assistant. I can analyze your transaction ledger in real-time. Try asking me:\n\n• 'What is my total spent?'\n• 'What was my highest expense?'\n• 'How much did I spend on Food?'\n• 'What is my average transaction size?'";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)", minHeight: 480 }}>
      {/* Header Info Banner */}
      <Card
        className="premium-card"
        bodyStyle={{ padding: "12px 24px" }}
        style={{ marginBottom: 16 }}
      >
        <Space size="middle">
          <Avatar
            style={{
              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
              boxShadow: "0 2px 8px rgba(236, 72, 153, 0.3)",
            }}
            icon={<RobotOutlined />}
            size="large"
          />
          <div>
            <Title level={5} className="heading-font" style={{ margin: 0 }}>
              SmartExpense Analyst
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Ask questions about your transactions using natural language commands.
            </Text>
          </div>
        </Space>
      </Card>

      {/* Main Chat Area */}
      <Card
        className="premium-card"
        style={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
        bodyStyle={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Scrollable message box */}
        <div style={{ flexGrow: 1, overflowY: "auto", marginBottom: 16, paddingRight: 8 }}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  width: "100%",
                }}
              >
                <Space
                  align="start"
                  size="middle"
                  style={{
                    flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                    maxWidth: "85%",
                  }}
                >
                  <Avatar
                    style={{
                      backgroundColor: msg.sender === "user" ? "#4f46e5" : "#e2e8f0",
                      color: msg.sender === "user" ? "#fff" : "#4f46e5",
                      marginTop: 4,
                    }}
                    icon={msg.sender === "user" ? <UserOutlined /> : <RobotOutlined />}
                  />
                  <div
                    className={msg.sender === "user" ? "chat-bubble-user" : "chat-bubble-ai"}
                    style={{
                      padding: "12px 18px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    <Paragraph style={{ margin: 0, color: "inherit" }}>{msg.text}</Paragraph>
                    <div
                      style={{
                        textAlign: "right",
                        fontSize: 9,
                        marginTop: 4,
                        opacity: 0.65,
                      }}
                    >
                      {msg.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </Space>
              </div>
            ))}

            {/* Loading / Typing Status indicator */}
            {typing && (
              <div style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
                <Space align="start" size="middle">
                  <Avatar style={{ backgroundColor: "#e2e8f0", color: "#4f46e5" }} icon={<RobotOutlined />} />
                  <div
                    className="chat-bubble-ai"
                    style={{
                      padding: "14px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {/* Jumping dot typing design */}
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#94a3b8",
                        animation: "bounce 1s infinite 0s",
                      }}
                    />
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#94a3b8",
                        animation: "bounce 1s infinite 0.2s",
                      }}
                    />
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#94a3b8",
                        animation: "bounce 1s infinite 0.4s",
                      }}
                    />
                    <style>{`
                      @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-5px); }
                      }
                    `}</style>
                  </div>
                </Space>
              </div>
            )}
            <div ref={messagesEndRef} />
          </Space>
        </div>

        {/* Suggestion Chips */}
        <div style={{ marginBottom: 12 }}>
          <Space size="small" wrap>
            <QuestionCircleOutlined style={{ color: "#94a3b8" }} />
            {suggestionPrompts.map((p, idx) => (
              <Tag
                key={idx}
                color="purple"
                onClick={() => handleSend(p)}
                style={{
                  cursor: "pointer",
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  transition: "all 0.2s",
                  border: "1px solid #e9d5ff",
                }}
                className="quick-action-btn"
              >
                {p}
              </Tag>
            ))}
          </Space>
        </div>

        {/* TextInput controls */}
        <div style={{ display: "flex", gap: 12 }}>
          <Input
            placeholder="Type your spending analysis question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onPressEnter={() => handleSend()}
            size="large"
            style={{ borderRadius: 12 }}
            suffix={
              <Button
                type="text"
                icon={<SendOutlined style={{ color: inputText.trim() ? "#4f46e5" : "#cbd5e1" }} />}
                onClick={() => handleSend()}
                disabled={!inputText.trim()}
              />
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant;
