import React, { useState, useEffect, useRef } from "react";
import { Card, Input, Button, Avatar, Space, Typography, Tag } from "antd";
import { SendOutlined, RobotOutlined, UserOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  expenseService,
  assistantService,
} from "../services/api";

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

  const handleSend = async (textToSend) => {
  const text = textToSend || inputText;

  if (!text.trim()) return;

  const userMsg = {
    id: `user-${Date.now()}`,
    sender: "user",
    text: text.trim(),
    time: new Date(),
  };

  setMessages((prev) => [...prev, userMsg]);
  setInputText("");
  setTyping(true);

  try {
    const response = await assistantService.chat(text.trim());

    const aiMsg = {
      id: `ai-${Date.now()}`,
      sender: "ai",
      text: response.data.reply,
      time: new Date(),
    };

    setMessages((prev) => [...prev, aiMsg]);
  } catch (error) {
    console.error("AI Assistant Error:", error);

    const aiMsg = {
      id: `ai-${Date.now()}`,
      sender: "ai",
      text: "Unable to contact AI assistant.",
      time: new Date(),
    };

    setMessages((prev) => [...prev, aiMsg]);
  } finally {
    setTyping(false);
  }
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
