import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
        });

        const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET || "test", {
            expiresIn: "24h",
        });

        res.status(200).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(404).json({ message: "User not found" });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET || "test", {
            expiresIn: "24h",
        });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const setPin = async (req, res) => {
    try {
        const { userId, pin } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.pin = pin;
        await user.save();

        res.status(200).json({ message: "PIN set successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const updateRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = role;
        await user.save();

        res.status(200).json({ message: "Role updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const logout = async (req, res) => {
    try {
        // Since JWT is stateless, we just send a success response
        // The client will remove the token from storage
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

