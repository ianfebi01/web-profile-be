
import express, { Router } from 'express';

const router:Router = express.Router()

router.get( '/user', ( req, res ) => {
	res.send( 'hehehe' )
} )

export default router as Router