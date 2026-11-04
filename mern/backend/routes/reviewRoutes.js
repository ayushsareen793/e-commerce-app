import { Router } from "express";
import { createReview, getReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.route("/:productId").get(getReviews).post(protect, createReview);
export default router;
