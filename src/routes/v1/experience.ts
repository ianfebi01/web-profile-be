
import { getExperiences } from "@/controllers/experience";
import { verifyAccessToken } from "@/utils/verifyAccessToken";
import express, { Router } from "express";

const router: Router = express.Router()

router.get( '/experience', verifyAccessToken, getExperiences )

export default router as Router