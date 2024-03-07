
import { IResponse } from "@/types"
import createResponseError from "@/utils/createResponseError"
import removeTmp from "@/utils/removeTmp"
import cloudinary, { UploadApiResponse } from "cloudinary"
import { Request, RequestHandler, Response } from "express"
import  { FileArray, UploadedFile } from "express-fileupload"
import * as status from "http-status"

// cloudinary.config( {
// 	cloud_name : process.env.CLOUD_NAME,
// 	api_key    : process.env.CLOUD_API_KEY,
// 	api_secret : process.env.CLOUD_API_SECRET,
// } );

export const uploadImage = async ( req: Request, res: Response ) => {
	try {
		const { path } = req.body

		const files = Object.values( req.files as FileArray ).flat()
		if ( files?.length === 1 ){

			const url = await uploadToCloudinary( files[0], path );
			
			return res.json( url );
		}
		const images = []
		for ( const file of files ) {
			const url = await uploadToCloudinary( file as typeof file, path );
			images.push( url );
			removeTmp( file.tempFilePath );
		}
		
		return res.json( images );
	} catch ( error: unknown ) {
		createResponseError( res, error )
	}
}
export const uploadImageBase64 = async ( req: Request, res: Response ) => {
	try {
		const { path, image } = req.body

		const result = await uploadToCloudinaryBase64( image, path );
		
		return res.json( result );
	} catch ( error: unknown ) {
		createResponseError( res, error )
	}
}

export const deleteImage: RequestHandler = async ( req, res ) => {
	try {
		const { publicId } = req.body;
		const delImg = await cloudinary.v2.uploader.destroy( publicId, {
			resource_type : "image",
		} );
		res.json( delImg );
	} catch ( error: unknown ) {
		createResponseError( res, error )
	}
};

export const uploadToCloudinary = async ( file: UploadedFile, path: string ) => {
	try {
		const results =  await cloudinary.v2.uploader.upload(
			file.tempFilePath,
			{ folder : path, tags : "basic_sample" },
		);

		removeTmp( file.tempFilePath )
		
		return results
	} catch ( error: unknown ) {
		return error
	}
};
export const uploadToCloudinaryBase64 = async ( base64: string, path: string ): Promise<IResponse<UploadApiResponse>> => {
	try {
		const results =  await cloudinary.v2.uploader.upload(
			base64,
			{ folder : path, tags : "basic_sample", overwrite : true, },
		);
		
		return {
			message : "Success",
			status  : status.OK,
			data    : results
		}
	} catch ( error: unknown ) {
		if ( typeof error === "string" ) {
			return {
				message : error,
				status  : status.INTERNAL_SERVER_ERROR,
			}
		} else if ( error instanceof Error ) {
			return {
				message : error.message,
				status  : status.INTERNAL_SERVER_ERROR,
			} 
		} else {		
			
			return {
				message : ( error as Error ).message,
				status  : status.INTERNAL_SERVER_ERROR,
			}
		}
	}
};
