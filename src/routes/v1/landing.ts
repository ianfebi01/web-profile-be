import { getLandingData } from "@/controllers/landing";
import express, { Router } from "express";

const router: Router = express.Router()

router.get( '/landing', getLandingData )
export default router as Router