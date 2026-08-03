import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import mongoose from "mongoose";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

const seedAIUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ isAI: true });

    if (existing) {
      console.log("AI user already exists!");
      console.log("AI_USER_ID=" + existing._id.toString());
      process.exit(0);
    }

    const aiUser = new User({
      fullName: "ChatWave AI",
      email: "ai-assistant@chatwave.internal",
      password: "not-used-but-required-" + Math.random().toString(36),
      bio: "Your language learning assistant. Ask me anything!",
      profilePic: "https://api.dicebear.com/7.x/bottts/svg?seed=chatwave",
      nativeLanguage: "english",
      learningLanguage: "english",
      location: "The Cloud",
      isOnboarded: true,
      isAI: true,
    });

    await aiUser.save();

    await upsertStreamUser({
      id: aiUser._id.toString(),
      name: "ChatWave AI",
      image: aiUser.profilePic,
    });

    console.log("AI user created successfully!");
    console.log("AI_USER_ID=" + aiUser._id.toString());
    process.exit(0);
  } catch (error) {
    console.error("Error seeding AI user:", error);
    process.exit(1);
  }
};

seedAIUser();