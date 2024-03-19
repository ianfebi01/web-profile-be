import { deleteSkill, getSkill, getSkills, postSkill, updateSkill } from "@/controllers/skill";
import express, { Router } from "express";

const router: Router = express.Router()

router.post( '/skill', postSkill )
router.get( '/skill', getSkills )
router.get( '/skill/:id', getSkill )
router.put( '/skill/:id', updateSkill )
router.delete( '/skill/:id', deleteSkill )

export default router as Router