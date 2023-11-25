
import { githubAuth, refreshToken } from "@/controllers/auth";
import express, { Router } from "express";

const router: Router = express.Router()

router.get( '/github-auth', githubAuth )
router.get( '/auth/refresh', refreshToken )

export default router as Router