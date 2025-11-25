import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const getSystemStats = async (req, res) => {
    try {
        const totalFarmers = await User.countDocuments({ role: 'farmer' });
        const totalBuyers = await User.countDocuments({ role: 'buyer' });
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();

        // Calculate total transaction volume
        const orders = await Order.find();
        const totalVolume = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        res.status(200).json({
            totalFarmers,
            totalBuyers,
            totalOrders,
            totalProducts,
            totalVolume
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("buyer", "name email")
            .populate("farmer", "name email")
            .populate("items.product", "name")
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
