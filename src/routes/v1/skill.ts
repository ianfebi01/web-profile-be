import { deleteSkill, getSkills, postSkill, updateSkill } from "@/controllers/skill";
import express, { Router } from "express";

const router: Router = express.Router()

router.post( '/skill', postSkill )
router.get( '/skill', getSkills )
router.put( '/skill/:id', updateSkill )
router.delete( '/skill/:id', deleteSkill )

export default router as Router