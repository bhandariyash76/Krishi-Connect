import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
            .select("-password -pin")
            .populate('wishlist')
            .populate('cart.product');
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

// Address Management
export const addAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        const addressData = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // If this is set as default, unset other default addresses
        if (addressData.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push(addressData);
        await user.save();

        res.status(200).json({ message: "Address added successfully", addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;
        const addressData = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const address = user.addresses.id(addressId);
        if (!address) return res.status(404).json({ message: "Address not found" });

        // If this is set as default, unset other default addresses
        if (addressData.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        Object.assign(address, addressData);
        await user.save();

        res.status(200).json({ message: "Address updated successfully", addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.addresses.pull(addressId);
        await user.save();

        res.status(200).json({ message: "Address deleted successfully", addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getAddresses = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('addresses');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Wishlist Management
export const addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }

        res.status(200).json({ message: "Added to wishlist", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.wishlist.pull(productId);
        await user.save();

        res.status(200).json({ message: "Removed from wishlist", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('wishlist');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
