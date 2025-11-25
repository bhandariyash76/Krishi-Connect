import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// Database Connection
mongoose
    .connect(process.env.MONGODB_URI || "mongodb+srv://bhandariyash76_db_user:lLATtiDmwcjnN6cP@cluster0.kvjy9ez.mongodb.net/krishi_connect?appName=Cluster0")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Routes
app.get("/", (req, res) => {
    res.send("Krishi Connect Backend is running");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
