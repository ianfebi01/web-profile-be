import prisma from "@/utils/prisma";
import { Request, Response } from "express";
import * as status from "http-status";
import createResponseError from "@/utils/createResponseError";
import { Prisma } from "@prisma/client";

export const getPositions = async( req: Request, res: Response ) => {
	try {
		const q = req.query.q || ''
		const page = Number( req.query.page ) || 1;
		const limit = Number( req.query.limit ) || 10;
		const skip = ( page - 1 ) * limit;
		const where: Prisma.PositionWhereInput = {
			name : {
				contains : q as string,
				mode     : 'insensitive',
			}
		}

		const [results, total] = await Promise.all( [
			prisma.position.findMany( {
				where : where,
				skip,
				take  : limit + 1
			} ),
			prisma.position.count( {
				where : where
			} )
		] )

		const totalPage = Math.ceil( total / limit );

		let hasNextPage: boolean = false;
		if ( results.length > limit ) { // if got an extra result
			hasNextPage = true; // has a next page of results
			results.pop(); // remove extra result
		}

		return res.status( status.OK ).json( {
			message   : "Success",
			status    : status.OK,
			data      : results,
			page,
			limit,
			itemCount : results?.length,
			hasNextPage,
			total, 
			totalPage
		} )
		// eslint-disable-next-line
	} catch ( error: unknown ) {
		createResponseError( res, error )
	}
}

export const postPosition = async ( req: Request, res: Response ) => {
	try {
		const body  = req.body
		const { name, description } = body
        
		const isAlreadyExists = await prisma.position.findUnique( {
			where : {
				name
			},
			select : {
				name : true
			}
		} )
		
		if( isAlreadyExists ) return res.status( status.BAD_REQUEST ).json( {
			message : "Position already exists",
			status  : status.BAD_REQUEST
		} )

		const results = await prisma.position.create( {
			data : {
				name, description
			}
		} )

		return res.status( status.CREATED ).json( {
			message : "Position created",
			status  : status.CREATED,
			data    : results
		} )

	} catch ( error: unknown ) {
		createResponseError( res, error )
	}
}