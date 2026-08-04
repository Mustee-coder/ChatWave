import { GoogleGenerativeAI } from "@google/generative-ai";
import streamClient from "../lib/stream.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION =
  "You are ChatWave AI, a friendly language-learning assistant inside a language exchange app. " +
  "Help users practice languages, answer questions, translate short phrases, and correct grammar. " +
  "Keep replies concise and encouraging. Respond in the same language the user wrote in, unless asked to translate.";

export async function sendAIMessage(req, res) {
  try {
    const { channelId, message } = req.body;
    const aiUserId = process.env.AI_USER_ID;

    if (!channelId || !message) {
      return res.status(400).json({ message: "channelId and message are required" });
    }

    if (!aiUserId) {
      return res.status(500).json({ message: "AI assistant is not configured" });
    }

    const channel = streamClient.channel("messaging", channelId);

    // Let the frontend know the AI is "typing"
    await channel.sendEvent({
      type: "typing.start",
      user_id: aiUserId,
    });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const result = await model.generateContent(message);
    const aiText = result.response.text();

    // Stop the typing indicator, then post the reply
    await channel.sendEvent({
      type: "typing.stop",
      user_id: aiUserId,
    });

    await channel.sendMessage({
      text: aiText,
      user_id: aiUserId,
    });

    res.status(200).json({ success: true, reply: aiText });
  } catch (error) {
    console.error("Error in sendAIMessage controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}