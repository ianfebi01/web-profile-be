import prisma from "@/utils/prisma";
import { Request, Response } from "express";
import * as status from "http-status";

export const getPositions = async( req: Request, res: Response )=>{
	try {
		const q = req.query.q || ''
		const results = await prisma.position.findMany( {
			where : {
				name : {
					contains : q as string
				}
			}
		} )

		return res.status( status.OK ).json( {
			message : "Success",
			status  : status.OK,
			data    : results
		} )
		// eslint-disable-next-line
	} catch ( error: unknown ) {
		return res.status( status.INTERNAL_SERVER_ERROR ).json( {
			message : status[status.INTERNAL_SERVER_ERROR],
			status  : status.INTERNAL_SERVER_ERROR,
			data    : error
		} )
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
		return res.status( status.INTERNAL_SERVER_ERROR ).json( {
			message : status[status.INTERNAL_SERVER_ERROR],
			status  : status.INTERNAL_SERVER_ERROR,
			data    : error
		} )
	}
}