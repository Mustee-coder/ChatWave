import { GoogleGenerativeAI } from "@google/generative-ai";
import { streamClient } from "../lib/stream.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION =
  "You are ChatWave AI, a friendly language-learning assistant inside a language exchange app. " +
  "Help users practice languages, answer questions, translate short phrases, and correct grammar. " +
  "Keep replies concise and encouraging. Respond in the same language the user wrote in.";

export async function sendAIMessage(req, res) {
  try {
    const { channelId, message } = req.body;
    const aiUserId = process.env.AI_USER_ID;

    console.log("AI Request:", { channelId, message });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    console.log("Sending to Gemini...");

    const result = await model.generateContent(message);

    console.log("Gemini done");

    const aiText = result.response.text();

    console.log("Sending to Stream...");

    const channel = streamClient.channel("messaging", channelId);

    await channel.sendMessage({
      text: aiText,
      user_id: aiUserId,
    });

    console.log("Stream message sent");

    res.status(200).json({
      success: true,
      reply: aiText,
    });

  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
}