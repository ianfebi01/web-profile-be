
import { getPortofolio, postPortofolio } from "@/controllers/portofolio";
import { verifyAccessToken } from "@/utils/verifyAccessToken";
import express, { Router } from "express";

const router: Router = express.Router()

router.get( '/portofolio', getPortofolio )
router.post( '/portofolio', verifyAccessToken, postPortofolio )

export default router as Router