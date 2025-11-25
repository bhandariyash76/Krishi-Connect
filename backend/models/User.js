import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["farmer", "buyer", "admin"], required: true },
    pin: { type: String }, // For 4-digit PIN security
    phone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
