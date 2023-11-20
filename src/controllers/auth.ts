import { generateToken } from "@/helpers/token";
import createResponseError from "@/utils/createResponseError";
import prisma from "@/utils/prisma";
import axios from "axios";
import { RequestHandler } from "express";
import * as status from "http-status"

export const githubAuth: RequestHandler = async( req, res ) => {
	try {
		const tmp = req.header( "Authorization" );
		const token = tmp ? tmp.slice( 7, tmp.length ) : "";

		const profile = await axios.get( 'https://api.github.com/user', {
			headers : {
				Authorization : `Bearer ${token}`
			}
		} )

		const email = await axios.get( 'https://api.github.com/user/emails', {
			headers : {
				Authorization : `Bearer ${token}`
			}
		} )

		const profileUser = {
			...profile.data,
			email : email.data[0].email
		}

		const isAlreadyExists = await prisma.user.findUnique( {
			where : {
				email : profileUser.email,
				id    : profileUser.id
			},
		} )
		
		if( isAlreadyExists ) {
			const accessToken = generateToken( { id : isAlreadyExists.id }, "14m" )
			const refreshToken = generateToken( { id : isAlreadyExists.id }, "7d" )
			
			const isTokenEexist = await prisma.userToken.findUnique( {
				where : {
					userId : isAlreadyExists.id,
				},
				select : {
					userId : true
				}
			} )
	
			if ( isTokenEexist ){
				await prisma.userToken.delete( {
					where : {
						userId : isTokenEexist.userId
					}
				} )
			}
	
			const userToken = await prisma.userToken.create( {
				data : {
					userId : isAlreadyExists.id,
					accessToken,
					refreshToken
				}
			} )
			
			return res.status( status.OK ).json( {
				message : "Success",
				status  : status.OK,
				data    : { 
					...isAlreadyExists,
					accessToken  : userToken.accessToken,
					refreshToken : userToken.refreshToken 
				}
			} )
		}

		const results = await prisma.user.create( {
			data : {
				id     : profileUser.id,
				name   : profileUser.name,
				email  : profileUser.email,
				avatar : profileUser.avatar_url,
			}
		} )

		const accessToken = generateToken( { id : results.id }, "14m" )
		const refreshToken = generateToken( { id : results.id }, "7d" )

		const isTokenEexist = await prisma.userToken.findUnique( {
			where : {
				userId : results.id,
			},
			select : {
				userId : true
			}
		} )

		if ( isTokenEexist ){
			await prisma.userToken.delete( {
				where : {
					userId : isTokenEexist.userId
				}
			} )
		}

		const userToken = await prisma.userToken.create( {
			data : {
				userId : results.id,
				accessToken,
				refreshToken
			}
		} )
		
		return res.status( status.OK ).json( {
			message : "Success",
			status  : status.OK,
			data    : { 
				...results, 
				accessToken  : userToken.accessToken,
				refreshToken : userToken.refreshToken 
			}
		} )
	} catch ( error: unknown ) {
		createResponseError( res, error )
	}
}