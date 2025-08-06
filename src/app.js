import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";

const app = express();

// Middleware
app.use(cors({
     origin: 'http://localhost:3000',  // ✅ corrected typo from CORS_ORIGN
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/alluser", userRouter);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/posts", postRoutes);
export { app };
