import express, {Express, Response, Request } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import createError from 'http-errors'
import { promises as fspromises } from 'fs';

dotenv.config()


const app:Express = express()

app.use( express.json() )

// Cors
app.use( cors() )

// Port
const PORT: string = process.env.PORT ?? "8000"


// Routes
const init = async () => {
	const files = await fspromises.readdir( `${__dirname}/routes` );
	const createroute = async ( file:string ) => {
		const route = await import( `./routes/${file}` );
		app.use( "/", route.default );
	};
	await Promise.all( files.map( createroute ) );
}

( async() => {

	// Initialize Routes
	await init();

	// handle 404 error
	app.use( ( req: Request, res: Response, next ) => {
		next( createError( 404 ) )
	} )

	//  start server
	app.listen( PORT, () => {
		console.log( 'listening on port', PORT ) 
	} )

} )();
