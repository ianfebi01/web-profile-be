import express, { Express, Response, Request } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import createError from 'http-errors'
import { promises as fspromises } from 'node:fs';
import fileUpload from "express-fileupload"
import * as status from "http-status"
import bodyParser = require( 'body-parser' );

dotenv.config()

const app: Express = express()

// app.use( express.json() )
app.use( bodyParser.json( { limit : '10mb' } ) );
app.use( bodyParser.urlencoded( { extended : true, limit : '10mb' } ) );

// Cors
app.use( cors() )

// File Upload
app.use(
	fileUpload( {
		useTempFiles : true,
		tempFileDir  : 'src/tmp/'
	} )
)

// Port
const PORT: string = process.env.PORT ?? "8000"

// Routes
const init = async () => {
	const files = await fspromises.readdir( `${process.cwd()}/routes/v1` );
	const createroute = async ( file: string ) => {
		const route = await import( `./routes/v1/${file}` );
		app.use( "/v1/", route.default );
	};
	await Promise.all( files.map( createroute ) );
}

const errorHandler = ( err: Error, req: Request, res: Response ) => { 
	res.status( status.INTERNAL_SERVER_ERROR ).send( {
		message : err.message,
		status  : status.INTERNAL_SERVER_ERROR,
	} ); 
};

( async() => {

	// Initialize Routes
	await init();

	// handle 404 error
	app.use( ( req: Request, res: Response, next ) => {
		next( createError( 404 ) )
	} )

	app.use( errorHandler ); 
	//  start server
	app.listen( PORT, () => {
		// eslint-disable-next-line no-console
		console.log( 'listening on port', PORT ) 
	} )

} )();
