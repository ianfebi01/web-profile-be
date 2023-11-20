
import { getUsers, postUser } from '@/controllers/user';
import { verifyAccessToken } from '@/utils/verifyAccessToken';
import express, { Router } from 'express';

const router: Router = express.Router()

router.get( '/user', verifyAccessToken, getUsers )
router.post( '/user', postUser )

export default router as Router