
import { githubAuth } from "@/controllers/auth";
import express, { Router } from "express";

const router: Router = express.Router()

router.get( '/github-auth', githubAuth )

export default router as Router