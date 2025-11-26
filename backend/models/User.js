import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    type: { type: String, enum: ["home", "work", "other"], default: "home" },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
    isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["farmer", "buyer", "admin"], required: true },
    pin: { type: String }, // For 4-digit PIN security
    phone: { type: String, required: true },
    address: { type: String }, // Legacy field, kept for backward compatibility
    addresses: [addressSchema], // New: Multiple addresses for buyers
    bio: { type: String },
    profileImage: { type: String },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // New: Wishlist for buyers
    cart: [{ // New: Shopping cart for buyers
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
    }],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
