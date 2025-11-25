import Order from "../models/Order.js";

import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
    try {
        const { buyer, farmer, items, totalAmount } = req.body;

        // Check stock and deduct inventory
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
            }
            product.quantity -= item.quantity;
            await product.save();
        }

        const newOrder = new Order({
            buyer,
            farmer,
            items,
            totalAmount,
            status: 'pending'
        });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const getOrdersByFarmer = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const orders = await Order.find({ farmer: farmerId })
            .populate("buyer", "name email phone")
            .populate("items.product", "name unit")
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getOrdersByBuyer = async (req, res) => {
    try {
        const { buyerId } = req.params;
        const orders = await Order.find({ buyer: buyerId })
            .populate("farmer", "name email phone")
            .populate("items.product", "name unit")
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
