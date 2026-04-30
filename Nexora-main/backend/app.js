import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.routes.js";
import playlistRouter from "./routes/playlist.route.js";
import commentRouter from "./routes/comment.route.js";
import subscriptionRouter from "./routes/subscription.route.js";

const app = express();

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
  "https://nexora-gfbk.vercel.app",
].filter(Boolean));

console.log("✅ Allowed origins:", Array.from(allowedOrigins));

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests and known frontend origins.
      const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin || "");
      if (!origin || allowedOrigins.has(origin) || isLocalhost) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/videos", videoRouter);
app.use("/api/playlists", playlistRouter);
app.use("/api/comments", commentRouter);
app.use("/api/subscriptions", subscriptionRouter);

export default app;
