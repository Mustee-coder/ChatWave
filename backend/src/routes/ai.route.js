import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { sendAIMessage } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/message", protectRoute, sendAIMessage);

export default router;