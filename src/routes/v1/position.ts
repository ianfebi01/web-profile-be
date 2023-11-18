import { getPositions, postPosition } from "@/controllers/position";
import express, { Router } from "express";

const router: Router = express.Router()

router.get( '/position', getPositions )
router.post( '/position', postPosition )

export default router as Router