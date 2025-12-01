import express from "express";
import { getProducts, createProduct, getProductById, getProductsByFarmer, updateProduct, deleteProduct } from "../controllers/productController.js";

import multer from "multer";
import path from "path";
import fs from "fs";

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", getProducts);
router.post("/", upload.array('images', 5), createProduct);
router.get("/farmer/:farmerId", getProductsByFarmer);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
