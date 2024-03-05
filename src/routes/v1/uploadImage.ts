
import { uploadImage, uploadImageBase64 } from '@/controllers/uploadImage';
import imageUpload, { validateImageBase64 } from '@/middlewares/imageUpload';
import express, { Router } from 'express';

const router: Router = express.Router()

router.post( '/uploadImage', imageUpload, uploadImage )
router.post( '/uploadImageBase64', validateImageBase64, uploadImageBase64 )

export default router as Router