import { getPositions, postPosition } from "@/controllers/position";
import { verifyAccessToken } from "@/utils/verifyAccessToken";
import express, { Router } from "express";

const router: Router = express.Router()

router.get( '/position', verifyAccessToken, getPositions )
router.post( '/position', verifyAccessToken, postPosition )

export default router as Router