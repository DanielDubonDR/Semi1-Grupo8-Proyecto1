import { Router } from "express";
import { getInfoConnection, ping, pong } from "../controllers/test.controller.js";

const router = Router();

router.get("/ping", ping);
router.post("/pong", pong);
router.get("/connection", getInfoConnection);

export default router;