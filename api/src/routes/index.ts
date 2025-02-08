import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import movieRoutes from "./movie.routes";
import collectionRoutes from "./collection.routes";

const router: Router = Router();

//Routes
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/movie", movieRoutes);
router.use("/collection", collectionRoutes);

export default router;
