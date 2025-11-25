import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password -pin");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, address, bio, profileImage } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, phone, address, bio, profileImage },
            { new: true }
        ).select("-password -pin");

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
