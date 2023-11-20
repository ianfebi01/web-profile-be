
import createResponseError from "@/utils/createResponseError"
import removeTmp from "@/utils/removeTmp"
import cloudinary from "cloudinary"
import { Request, RequestHandler, Response } from "express"
import  { FileArray, UploadedFile } from "express-fileupload"

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
