
import { getPortofolio, postPortofolio } from "@/controllers/portofolio";
import express, { Router } from "express";

const router: Router = express.Router()

router.get( '/portofolio', getPortofolio )
router.post( '/portofolio', postPortofolio )

export default router as Router