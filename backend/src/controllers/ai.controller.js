import { GoogleGenerativeAI } from "@google/generative-ai";
import { streamClient } from "../lib/stream.js";

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
      return res.status(400).json({
        message: "channelId and message are required",
      });
    }

    if (!aiUserId) {
      return res.status(500).json({
        message: "AI assistant is not configured",
      });
    }


    const channel = streamClient.channel(
      "messaging",
      channelId
    );


    // Start typing indicator
    await channel.sendEvent({
      type: "typing.start",
      user_id: aiUserId,
    });


    // Get previous messages from Stream
    const response = await channel.query({
      messages: {
        limit: 10,
      },
    });


    const history = response.messages
      .filter((msg) => msg.text)
      .map((msg) => ({
        role: msg.user_id === aiUserId ? "model" : "user",
        parts: [
          {
            text: msg.text,
          },
        ],
      }));


    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });


    // Create Gemini chat with history
    const chat = model.startChat({
      history,
    });


    const result = await chat.sendMessage(message);

    const aiText = result.response.text();


    // Stop typing indicator
    await channel.sendEvent({
      type: "typing.stop",
      user_id: aiUserId,
    });


    // Send AI response to Stream
    await channel.sendMessage({
      text: aiText,
      user_id: aiUserId,
    });


    res.status(200).json({
      success: true,
      reply: aiText,
    });


  } catch (error) {

    console.error(
      "Error in sendAIMessage controller:",
      error.message
    );


    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}