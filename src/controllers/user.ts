import { Request, RequestHandler, Response } from "express";
import prisma from "@/utils/prisma";
import * as status from "http-status";
import { IPostProfileParams } from "@/types/profile";
import createResponseError from "@/utils/createResponseError";
import decode from "@/utils/decode";
import { IDecoded } from "@/types/decode";
import {  uploadToCloudinaryBase64 } from "./uploadImage";
import { IResponse } from "@/types";
import { UploadApiResponse } from "cloudinary";
// import { FileArray, UploadedFile } from "express-fileupload";

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

export const getProfile: RequestHandler = async ( req, res ) => {
	try {
		const decoded = decode( req ) as IDecoded

		const resulst = await prisma.user.findUnique( {
			where : {
				id : decoded.id
			}
		} )
		
		return res.status( status.OK ).json( {
			message : "Success",
			status  : status.OK,
			data    : resulst
		} )
	} catch ( error ) {
		createResponseError( res, error )
	}
}
export const updateProfile: RequestHandler = async ( req, res ) => {
	try {
		const decoded = decode( req ) as IDecoded
		const body = req.body
		let imageUrl: string = ''

		if ( body.personImage ){
			const mimeType = body.personImage.substring( "data:".length, body.personImage.indexOf( ";base64" ) )
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
			const fileSize = Buffer.from( body.personImage.substring( body.personImage.indexOf( ',' ) + 1 ), 'base64' )?.length
			if ( fileSize > 1024 * 1024 * 4 ) {
				// throw createHttpError( status.BAD_REQUEST, 'File size is too large' ) 
				return res.status( status.BAD_REQUEST ).json( {
					message : "File size is too large",
					status  : status.BAD_REQUEST
				} )
			}
	
			const imageData: IResponse<UploadApiResponse> = await uploadToCloudinaryBase64( body.personImage, 'web-profile' );
			if ( imageData?.status === 500 ){
				return res.status( status.INTERNAL_SERVER_ERROR ).json( {
					...imageData
				} )
			} else if( imageData?.status === 200 && imageData?.data?.secure_url )imageUrl = imageData?.data?.secure_url
	
		}
		const payload = () => {
			const openToWork = body.openToWork === 'true' ? true : false
			if( imageUrl !== '' ){
				return {
					...body,
					openToWork  : openToWork,
					personImage : imageUrl
				}
			}else{
				return{
					...body,
					openToWork : openToWork,
				}
			}
		}

		const results = await prisma.user.update( {
			where : {
				id : decoded.id
			},
			data : {
				...payload()
			},
		} )
		
		return res.status( status.OK ).json( {
			message : "Success",
			status  : status.OK,
			data    : {
				...results
			}
		} )
	} catch ( error ) {
		createResponseError( res, error )
	}
}
