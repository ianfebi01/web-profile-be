import { IApiImage } from "@/types/uploadImage";
import createResponseError from "@/utils/createResponseError";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { FileArray, UploadedFile } from "express-fileupload";
import * as status from "http-status";
import { uploadToCloudinary } from "./uploadImage";
import { IDecoded } from "@/types/decode";
import decode from "@/utils/decode";

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

export const postPortofolio = async ( req: Request, res: Response ) => {
	try {
		const decoded = decode( req ) as IDecoded
		const body  = req.body
		const { name, description, year } = body
        
		const isAlreadyExists = await prisma.portofolio.findUnique( {
			where : {
				name
			},
			select : {
				name : true
			}
		} )
		
		if( isAlreadyExists ) return res.status( status.BAD_REQUEST ).json( {
			message : "Portofolio already exists",
			status  : status.BAD_REQUEST
		} )
		
		let files: UploadedFile[] = []
		if ( req.files ){
			files = Object.values( req?.files as FileArray ).flat()
		}

		let imageUrl: string = ''

		if ( files?.length === 1 ){

			const imageData: IApiImage = await uploadToCloudinary( files[0], 'web-profile' ) as IApiImage;
			imageUrl = imageData?.secure_url
		}

		const results = await prisma.portofolio.create( {
			data : {
				name, description, image : imageUrl, year, userId : decoded.id
			}
		} )

		return res.status( status.CREATED ).json( {
			message : "Portofolio created",
			status  : status.CREATED,
			data    : results
		} )

	} catch ( error: unknown ) {
		createResponseError( res, error )
	}
}