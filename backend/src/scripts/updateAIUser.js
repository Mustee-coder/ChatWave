import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

const updateAI = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const aiUser = await User.findOneAndUpdate(
      { email: "ai-assistant@chatwave.internal" },
      {
        isAI: true,
      },
      { new: true }
    );

    console.log("AI updated:", aiUser);

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

updateAI();