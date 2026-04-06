import { Router } from "express";
import { getAllUsers, createUser } from "../controllers/Users.controller.js";

const router = Router();

router.get("/users", getAllUsers);
router.post("/users", createUser);

export default router;
