import express from "express";
import { getProducts, createProduct, getProductById, getProductsByFarmer, updateProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/farmer/:farmerId", getProductsByFarmer);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);

export default router;
