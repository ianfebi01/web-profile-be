
import { getPortofolio } from "@/controllers/portofolio";
import express, { Router } from "express";

const router: Router = express.Router()

router.get( '/portofolio', getPortofolio )
// router.post( '/position', postPosition )

export default router as Router