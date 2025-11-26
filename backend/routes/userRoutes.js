import express from "express";
import {
    getUserProfile,
    updateUserProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    getAddresses,
    addToWishlist,
    removeFromWishlist,
    getWishlist
} from "../controllers/userController.js";

const router = express.Router();

// Profile routes
router.get("/:id", getUserProfile);
router.put("/:id", updateUserProfile);

// Address routes
router.get("/:userId/addresses", getAddresses);
router.post("/:userId/addresses", addAddress);
router.put("/:userId/addresses/:addressId", updateAddress);
router.delete("/:userId/addresses/:addressId", deleteAddress);

// Wishlist routes
router.get("/:userId/wishlist", getWishlist);
router.post("/:userId/wishlist/:productId", addToWishlist);
router.delete("/:userId/wishlist/:productId", removeFromWishlist);

export default router;
