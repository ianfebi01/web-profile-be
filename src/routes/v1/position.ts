import { getPositions } from "@/controllers/position";
import express, { Router } from "express";

const router: Router = express.Router()

router.get( '/position', getPositions )

export default router as Router