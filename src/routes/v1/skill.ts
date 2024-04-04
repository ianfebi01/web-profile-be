import { deleteSkill, getSkill, getSkillList, getSkills, postSkill, updateSkill } from "@/controllers/skill";
import express, { Router } from "express";

const router: Router = express.Router()

router.post( '/skill', postSkill )
router.get( '/skill', getSkills )
router.get( '/skill/:id', getSkill )
router.put( '/skill/:id', updateSkill )
router.delete( '/skill/:id', deleteSkill )
router.get( '/skill-list', getSkillList )

export default router as Router