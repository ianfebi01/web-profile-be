
import { deletePortofolio, getPortofolio, postPortofolio, getDetailPortofolio, updatePortofolio } from "@/controllers/portofolio";
import { verifyAccessToken } from "@/utils/verifyAccessToken";
import express, { Router } from "express";

const router: Router = express.Router()

router.get( '/portofolio', getPortofolio )
router.get( '/portofolio/:id', getDetailPortofolio )
router.post( '/portofolio', verifyAccessToken, postPortofolio )
router.put( '/portofolio/:id', verifyAccessToken, updatePortofolio )
router.delete( '/portofolio/:id', verifyAccessToken, deletePortofolio )

export default router as Router