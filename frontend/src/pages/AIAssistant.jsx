import React, { useState, useEffect, useRef } from "react";
import { Card, Input, Button, Avatar, Space, Typography, Tag } from "antd";
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  ThunderboltOutlined,
  CoffeeOutlined,
  LineChartOutlined
} from "@ant-design/icons";
import { marked } from "marked";
import {
  expenseService,
  assistantService,
} from "../services/api";

const { Text, Title, Paragraph } = Typography;

// Helper to parse markdown
const parseMarkdown = (text) => {
  try {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    return marked.parse(text || "");
  } catch (err) {
    console.error("Markdown parsing error:", err);
    return text || "";
  }
};

const AIAssistant = () => {
  const [expenses, setExpenses] = useState([]);
  const [inputText, setInputText] = useState("");
  const defaultMessage = [
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I am your Smart Expense Assistant. I've analyzed your transaction ledger. Ask me any question about your spending, or click one of the suggested prompts below!",
      time: new Date(),
    },
  ];

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("smartexpense_chat");

    if (saved) {
      return JSON.parse(saved).map((msg) => ({
        ...msg,
        time: new Date(msg.time),
      }));
    }

    return defaultMessage;
  });
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Suggested Prompts for inline tags (shown when chatting)
  const suggestionPrompts = [
    "What is my total spent?",
    "What was my highest expense?",
    "How much did I spend on Food?",
    "What is my average expense size?",
  ];

  // Rich Template Cards for the Initial Welcome Screen
  const suggestionCards = [
    {
      prompt: "What is my total spent?",
      title: "Analyze Cumulative Outflow",
      desc: "Retrieve the absolute sum of all expenditures in your transaction records.",
      icon: <DollarCircleOutlined style={{ color: "#4f46e5", fontSize: 18 }} />
    },
    {
      prompt: "What was my highest expense?",
      title: "Identify Peak Transactions",
      desc: "Spot your single largest transaction entry and its category context.",
      icon: <ThunderboltOutlined style={{ color: "#fa8c16", fontSize: 18 }} />
    },
    {
      prompt: "How much did I spend on Food?",
      title: "Review Food & Grocery Outflow",
      desc: "Check your aggregate expenditures specifically linked to dining and foods.",
      icon: <CoffeeOutlined style={{ color: "#ff7a45", fontSize: 18 }} />
    },
    {
      prompt: "What is my average expense size?",
      title: "Calculate Average Ticket Size",
      desc: "Compute the average size of your transaction logs to benchmark ticket sizes.",
      icon: <LineChartOutlined style={{ color: "#10b981", fontSize: 18 }} />
    }
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "smartexpense_chat",
      JSON.stringify(messages)
    );
    scrollToBottom();
  }, [messages]);

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
      setTimeout(scrollToBottom, 50);
    }
  };

  const isInitialWelcome = messages.length === 1 && messages[0].id === "welcome";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 170px)", minHeight: 520, gap: 16 }}>
      {/* Header Info Banner */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "transparent",
          padding: "4px 8px"
        }}
      >
        <Space size="middle">
          <Avatar
            style={{
              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
              boxShadow: "0 4px 12px rgba(236, 72, 153, 0.25)",
            }}
            icon={<RobotOutlined />}
            size="large"
          />
          <div>
            <Title level={5} className="heading-font" style={{ margin: 0, fontSize: 16 }}>
              SmartExpense Analyst
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Consult your ledger records and spending insights using natural language.
            </Text>
          </div>
        </Space>

        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => {
            localStorage.removeItem("smartexpense_chat");
            window.location.reload();
          }}
          className="quick-action-btn"
          style={{ fontWeight: 500, borderRadius: 8 }}
        >
          Clear Chat
        </Button>
      </div>

      {/* Main Chat Area Card */}
      <Card
        className="premium-card"
        style={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
        styles={{
          body: {
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }
        }}
      >
        {/* Scrollable message box */}
        <div style={{ flexGrow: 1, overflowY: "auto", marginBottom: 16, paddingRight: 8, paddingLeft: 8 }}>
          
          {isInitialWelcome ? (
            /* Centered Welcome Hero Dashboard */
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "32px auto", textAlign: "center", maxWidth: 640 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(236, 72, 153, 0.35)",
                  marginBottom: 20
                }}
                className="ai-glow"
              >
                <RobotOutlined style={{ fontSize: 28, color: "#ffffff" }} />
              </div>
              
              <Title level={3} className="heading-font" style={{ margin: "0 0 8px 0", letterSpacing: "-0.5px", fontWeight: 700 }}>
                How can I help you today?
              </Title>
              <Text type="secondary" style={{ fontSize: 14, display: "block", marginBottom: 36, maxWidth: 500 }}>
                I am your financial assistant, synced with your transaction histories. Select a template topic below or type your customized query:
              </Text>

              {/* Responsive Cards Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, width: "100%", textAlign: "left" }}>
                {suggestionCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="welcome-card-widget"
                    onClick={() => handleSend(card.prompt)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, background: "rgba(79, 70, 229, 0.08)" }}>
                        {card.icon}
                      </span>
                      <Text strong style={{ fontSize: 13, color: "#4f46e5" }}>{card.title}</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.4, display: "block" }}>{card.desc}</Text>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Centered Conversation Area */
            <div className="chat-container-centered" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
                      maxWidth: msg.sender === "user" ? "80%" : "90%",
                    }}
                  >
                    <Avatar
                      style={{
                        backgroundColor: msg.sender === "user" ? "#4f46e5" : "#e2e8f0",
                        color: msg.sender === "user" ? "#fff" : "#4f46e5",
                        marginTop: 4,
                        border: msg.sender === "user" ? "none" : "1px solid #cbd5e1"
                      }}
                      icon={msg.sender === "user" ? <UserOutlined /> : <RobotOutlined />}
                    />
                    <div
                      className={msg.sender === "user" ? "chat-bubble-user" : "chat-bubble-ai"}
                      style={{
                        padding: msg.sender === "user" ? "12px 18px" : "16px 20px",
                      }}
                    >
                      {msg.sender === "user" ? (
                        <Paragraph style={{ margin: 0, color: "inherit", whiteSpace: "pre-line", fontSize: 14.5 }}>{msg.text}</Paragraph>
                      ) : (
                        <div
                          style={{ margin: 0, color: "inherit" }}
                          dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                        />
                      )}
                      
                      {/* Message Timestamp */}
                      <div
                        style={{
                          textAlign: "right",
                          fontSize: 9,
                          marginTop: 6,
                          opacity: 0.55,
                          color: "inherit"
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
                    <Avatar style={{ backgroundColor: "#e2e8f0", color: "#4f46e5", border: "1px solid #cbd5e1" }} icon={<RobotOutlined />} />
                    <div
                      className="chat-bubble-ai"
                      style={{
                        padding: "16px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "#94a3b8",
                          animation: "bounce 1s infinite 0s",
                        }}
                      />
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "#94a3b8",
                          animation: "bounce 1s infinite 0.2s",
                        }}
                      />
                      <div
                        style={{
                          width: 8,
                          height: 8,
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
            </div>
          )}
        </div>

        {/* Suggestion Chips - only show when conversation starts */}
        {!isInitialWelcome && (
          <div className="chat-container-centered" style={{ marginBottom: 12, paddingLeft: 8 }}>
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
        )}

        {/* TextInput controls - Centered pill wrapper */}
        <div className="chat-container-centered" style={{ paddingLeft: 8, paddingRight: 8 }}>
          <div className="chat-input-pill">
            <Input
              placeholder="Ask me about your expenses..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPressEnter={() => handleSend()}
              variant="borderless"
              style={{
                padding: 0,
                fontSize: 14.5,
                background: "transparent",
                border: "none",
                outline: "none",
                boxShadow: "none"
              }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined style={{ fontSize: 13 }} />}
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              style={{
                width: 36,
                height: 36,
                minWidth: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant;
