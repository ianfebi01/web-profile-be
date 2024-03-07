
import createResponseError from "@/utils/createResponseError";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import * as status from "http-status";
import { uploadToCloudinaryBase64 } from "./uploadImage";
import { IDecoded } from "@/types/decode";
import decode from "@/utils/decode";
import { generateValidationSchema } from "@/utils/generateValidationSchema";
import { paginatorParams } from "@/params/global.params";
import { IResponse } from "@/types";
import { UploadApiResponse } from "cloudinary";

export const getPortofolio = async ( req: Request, res: Response ) => {
	try {
		const q = req.query.q || ''
		const page = Number( req.query.page ) || 1;
		const limit = Number( req.query.limit ) || 10;
		const skip = ( page - 1 ) * limit;

		const validationSchema = generateValidationSchema( paginatorParams )
		validationSchema.validateSync( { q, page, limit }, { abortEarly : false, stripUnknown : true } );

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
		
		let imageUrl: string = ''

		// validate Image
		if ( body.image ){
			const mimeType = body.image.substring( "data:".length, body.image.indexOf( ";base64" ) )
			if (
				mimeType !== 'image/jpeg' &&
					mimeType !== 'image/png' &&
					mimeType !== 'image/gif' &&
					mimeType !== 'image/webp' &&
					mimeType !== 'image/svg+xml'
			) {
				return res.status( status.BAD_REQUEST ).json( {
					message : "Unsupported format",
					status  : status.BAD_REQUEST
				} )
			}
			const fileSize = Buffer.from( body.image.substring( body.image.indexOf( ',' ) + 1 ), 'base64' )?.length
			if ( fileSize > 1024 * 1024 * 4 ) {
				// throw createHttpError( status.BAD_REQUEST, 'File size is too large' ) 
				return res.status( status.BAD_REQUEST ).json( {
					message : "File size is too large",
					status  : status.BAD_REQUEST
				} )
			}
		
			const imageData: IResponse<UploadApiResponse> = await uploadToCloudinaryBase64( body.image, 'web-profile' );
			if ( imageData?.status === 500 ){
				return res.status( status.INTERNAL_SERVER_ERROR ).json( {
					...imageData
				} )
			} else if( imageData?.status === 200 && imageData?.data?.secure_url )imageUrl = imageData?.data?.secure_url
		
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