
import { getUsers, postUser } from '@/controllers/user';
import express, { Router } from 'express';

const router: Router = express.Router()

router.get( '/user', getUsers )
router.post( '/user', postUser )

export default router as Router