console.log("Using OpenRouter...");
console.log("Key exists:", !!process.env.OPENROUTER_API_KEY);
const axios = require("axios");

const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
     model: "z-ai/glm-4.5-air:free",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply =
      response.data.choices[0].message.content;

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(JSON.stringify(error.response?.data, null, 2));
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "AI Assistant failed",
      error:
        error.response?.data ||
        error.message,
    });
  }
};

module.exports = {
  chatWithAssistant,
};