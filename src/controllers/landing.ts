import createResponseError from "@/utils/createResponseError";
import prisma from "@/utils/prisma";
import { RequestHandler } from "express";
import * as status from "http-status"

export const getLandingData: RequestHandler = async( req, res ) => {
	try {
		const query = req.query
		const { email } = query

		const profile = await prisma.user.findUnique( {
			where : {
				email : email?.toString()
			},
			select : {
				name        : true,
				email       : true,
				personImage : true,
				textBg      : true,
				quote       : true,
				openToWork  : true
			}
		} )
		
		return res.status( status.OK ).json( {
			message : "Success",
			status  : status.OK,
			data    : {
				profile
			}
		} )
	} catch ( error ) {
		createResponseError( res, error )
	}
}