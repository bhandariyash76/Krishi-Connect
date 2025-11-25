import express from "express";
import { getSystemStats, getAllUsers, getAllOrders } from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", getSystemStats);
router.get("/users", getAllUsers);
router.get("/orders", getAllOrders);

export default router;
