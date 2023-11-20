
import { uploadImage } from '@/controllers/uploadImage';
import imageUpload from '@/middlewares/imageUpload';
import express, { Router } from 'express';

const router: Router = express.Router()

router.post( '/uploadImage', imageUpload, uploadImage )

export default router as Router