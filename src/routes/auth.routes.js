import { Router } from "express";
import { login } from "../controllers/auth.controller";

const route = Router();

router.post('/login', login);

export default router;