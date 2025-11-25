import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["farmer", "buyer", "admin"], required: true },
    pin: { type: String }, // For 4-digit PIN security
    phone: { type: String, required: true },
    address: { type: String },
    bio: { type: String },
    profileImage: { type: String },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
