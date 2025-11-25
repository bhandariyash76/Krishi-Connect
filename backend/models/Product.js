import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }, // e.g., kg, ton
    images: [{ type: String }],
    category: { type: String },
    harvestDate: { type: Date },
    minOrderQuantity: { type: Number, default: 1 },
    origin: { type: String },
    freshness: { type: String, enum: ['Fresh', 'Stored', 'Processed'], default: 'Fresh' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
