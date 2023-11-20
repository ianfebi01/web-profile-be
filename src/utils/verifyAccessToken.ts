import jwt from "jsonwebtoken"
import * as status from "http-status"
import { RequestHandler } from "express"
import prisma from "./prisma"
import createResponseError from "./createResponseError"

export const verifyAccessToken: RequestHandler = async ( req, res, next ) => {
	try {
		const tmp = req.header( 'Authorization' )
		const token = tmp ? tmp.slice( 7, tmp.length ) : ''

		if ( !token ) {
			return res
				.status( status.UNAUTHORIZED )
				.json( { 
					message : 'Please set token headers',
					status  : status.UNAUTHORIZED
				} )
		}

		const userToken = await prisma.userToken.findUnique( {
			where : {
				accessToken : token 
			},
			select : {
				accessToken : true
			}
		} )

		if ( !userToken ){
			return res.status( status.UNAUTHORIZED ).json( {
				message : "Invalid access token",
				status  : status[status.UNAUTHORIZED],
			} )
		}

		jwt.verify( token, process.env.JWT_TOKEN_SECRET as string, ( err ) => {
			if ( err ) {
				return res
					.status( status.UNAUTHORIZED )
					.json( { 
						message : status[status.UNAUTHORIZED],
						status  : status.UNAUTHORIZED
					} )
			}
			next()
		} )
	} catch ( error: unknown ) {
		return createResponseError( res, error )
	}
}
