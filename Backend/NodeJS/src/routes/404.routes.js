import { Router} from "express";

const router = Router();

router.use((req, res, next) => {
    res.status(404).json({ status: false, message: "Invalid URL" });
});

export default router;