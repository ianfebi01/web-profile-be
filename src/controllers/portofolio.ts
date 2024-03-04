import createResponseError from "@/utils/createResponseError";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import * as status from "http-status";

export const getPortofolio = async ( req: Request, res: Response ) => {
	try {
		const q = req.query.q || ''
		const page = Number( req.query.page ) || 1;
		const limit = Number( req.query.limit ) || 10;
		const skip = ( page - 1 ) * limit;
		const where: Prisma.PortofolioWhereInput = {
			name : {
				contains : q as string,
				mode     : 'insensitive',
			}
		}

		const [results, total] = await Promise.all( [
			prisma.portofolio.findMany( {
				where : where,
				skip,
				take  : limit + 1
			} ),
			prisma.portofolio.count( {
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