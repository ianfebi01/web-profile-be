import { postSkill } from "@/controllers/skill";
import imageUpload from "@/middlewares/imageUpload";
import express, { Router } from "express";

const router: Router = express.Router()

router.post( '/skill', imageUpload, postSkill )

export default router as Router