import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected for seeding");

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        console.log("Cleared existing data");

        // Create Users
        const hashedPassword = await bcrypt.hash("password123", 10);

        const farmer1 = new User({
            name: "Ramesh Farmer",
            email: "ramesh@farmer.com",
            password: hashedPassword,
            role: "farmer",
            phone: "9876543210",
            location: "Punjab"
        });

        const farmer2 = new User({
            name: "Suresh Farmer",
            email: "suresh@farmer.com",
            password: hashedPassword,
            role: "farmer",
            phone: "9876543211",
            location: "Haryana"
        });

        const buyer1 = new User({
            name: "Anjali Buyer",
            email: "anjali@buyer.com",
            password: hashedPassword,
            role: "buyer",
            phone: "9123456780",
            location: "Delhi"
        });

        await farmer1.save();
        await farmer2.save();
        await buyer1.save();
        console.log("Users created");

        // Create Products
        const products = [
            {
                name: "Organic Wheat",
                description: "High quality organic wheat from Punjab fields.",
                price: 25,
                unit: "kg",
                quantity: 1000,
                category: "Grains",
                farmer: farmer1._id,
                harvestDate: new Date(),
                freshness: "Fresh",
                origin: "Punjab",
                minOrderQuantity: 10
            },
            {
                name: "Basmati Rice",
                description: "Premium aromatic Basmati rice.",
                price: 80,
                unit: "kg",
                quantity: 500,
                category: "Grains",
                farmer: farmer1._id,
                harvestDate: new Date(),
                freshness: "Fresh",
                origin: "Punjab",
                minOrderQuantity: 5
            },
            {
                name: "Fresh Tomatoes",
                description: "Juicy red tomatoes, farm fresh.",
                price: 40,
                unit: "kg",
                quantity: 200,
                category: "Vegetables",
                farmer: farmer2._id,
                harvestDate: new Date(),
                freshness: "Fresh",
                origin: "Haryana",
                minOrderQuantity: 2
            },
            {
                name: "Potatoes",
                description: "Large size potatoes suitable for chips.",
                price: 20,
                unit: "kg",
                quantity: 800,
                category: "Vegetables",
                farmer: farmer2._id,
                harvestDate: new Date(),
                freshness: "Stored",
                origin: "Haryana",
                minOrderQuantity: 10
            },
            {
                name: "Mustard Oil",
                description: "Pure mustard oil, cold pressed.",
                price: 150,
                unit: "liter",
                quantity: 100,
                category: "Other",
                farmer: farmer2._id,
                harvestDate: new Date(),
                freshness: "Stored",
                origin: "Haryana",
                minOrderQuantity: 1
            }
        ];

        await Product.insertMany(products);
        console.log("Products created");

        console.log("Seeding completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedData();
