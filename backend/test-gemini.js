const { GoogleGenerativeAI } = require("@google/generative-ai");

console.log("Starting test...");

const genAI = new GoogleGenerativeAI("PASTE_YOUR_KEY_HERE");

async function test() {
  try {
    console.log("Creating model...");

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    console.log("Sending request...");

    const result = await model.generateContent("Hello");

    console.log("Received response:");
    console.log(result.response.text());
  } catch (error) {
    console.error("ERROR:");
    console.error(error);
  }
}

test();