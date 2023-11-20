import { Request, Response } from "express";
import prisma from "@/utils/prisma";
import * as status from "http-status";
import { IPostProfileParams } from "@/types/profile";
import createResponseError from "@/utils/createResponseError";

export const getUsers = async ( req: Request, res: Response ) => {
	try {
		const page = Number( req.query.page ) || 1;
		const limit = Number( req.query.limit ) || 10;
		const skip = ( page - 1 ) * limit;

		const results = await prisma.user.findMany( {	
			skip,
			take : limit + 1
		} )

		let hasNextPage: boolean = false;
		if ( results.length > limit ) { // if got an extra result
			hasNextPage = true; // has a next page of results
			results.pop(); // remove extra result
		}
		
		return res.status( status.OK ).json( {
			message   : 'Success',
			status    : status.OK,
			data      : results,
			page,
			limit,
			itemCount : results?.length,
			hasNextPage
		} )
	} catch ( error: unknown ) {
		createResponseError( res, error )
	}
}
	
export const postUser = async ( req: Request, res: Response ) => {
	try {
		const body = req.body
		const { email, name, quote }: IPostProfileParams = body

		const isAlreadyExists = await prisma.user.findUnique( {
			where : {
				email
			},
			select : {
				email : true
			}
		} )
		
		if( isAlreadyExists ) return res.status( status.BAD_REQUEST ).json( {
			message : "User already exists",
			status  : status.BAD_REQUEST
		} )
		const results = await prisma.user.create( {
			data : {
				email, name, quote
			}
		} )
		
		return res.status( status.CREATED ).json( {
			message : "User created",
			status  : status.CREATED,
			data    : results
		} )
	} catch ( error: unknown ) {
		createResponseError( res, error )
	}
}