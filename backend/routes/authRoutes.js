import express from "express";
import { login, register, setPin, updateRole, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", register);
router.post("/set-pin", setPin);
router.post("/update-role", updateRole);
router.post("/logout", logout);

export default router;
