import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("farmer", "name email");
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const productData = req.body;

        // Handle Image Upload
        if (req.files && req.files.length > 0) {
            productData.images = req.files.map(file => `/uploads/${file.filename}`);
        } else if (req.file) {
            // Fallback for single file if needed, though route is array now
            productData.images = [`/uploads/${req.file.filename}`];
        }

        const newProduct = new Product(productData);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(409).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate("farmer", "name email");
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getProductsByFarmer = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const products = await Product.find({ farmer: farmerId });
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { price, quantity, name, unit, description, harvestDate, minOrderQuantity, origin, freshness } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { price, quantity, name, unit, description, harvestDate, minOrderQuantity, origin, freshness },
            { new: true }
        );

        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
