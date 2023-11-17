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
	} catch ( error:any ) {
		return res.status( status.INTERNAL_SERVER_ERROR ).json( {
			message : status[status.INTERNAL_SERVER_ERROR],
			status  : status.INTERNAL_SERVER_ERROR,
			data    : error
		} )
	}
}