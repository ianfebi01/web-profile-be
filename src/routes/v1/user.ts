
import { getProfile, getUsers, postUser, updateProfile } from '@/controllers/user';
import { verifyAccessToken } from '@/utils/verifyAccessToken';
import express, { Router } from 'express';

const router: Router = express.Router()

router.get( '/user', verifyAccessToken, getUsers )
router.post( '/user', verifyAccessToken, postUser )
router.get( '/profile', verifyAccessToken, getProfile )
router.put( '/profile', verifyAccessToken, updateProfile )

export default router as Router