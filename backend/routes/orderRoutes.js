import express from "express";
import { createOrder, getOrdersByFarmer, getOrdersByBuyer, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/farmer/:farmerId", getOrdersByFarmer);
router.get("/buyer/:buyerId", getOrdersByBuyer);
router.patch("/:id/status", updateOrderStatus);
router.put("/:id", updateOrderStatus); // Allow PUT as well for easier frontend integration if needed

export default router;
