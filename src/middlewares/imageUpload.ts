import removeTmp from "@/utils/removeTmp"
import { RequestHandler } from "express"
import * as status from "http-status"
import createResponseError from "@/utils/createResponseError"

const imageUpload: RequestHandler = async( req, res, next ) => {
	try {
		if ( !req.files || Object.values( req.files ).flat().length === 0 ) {
			// throw createHttpError( status.BAD_REQUEST, 'No files selected' ) 
			return res.status( status.BAD_REQUEST ).json( {
				message : "No files selected",
				status  : status.BAD_REQUEST
			} )
		}
		const files = Object.values( req.files ).flat()
		files.forEach( ( file ) => {
			if (
				file.mimetype !== 'image/jpeg' &&
                file.mimetype !== 'image/png' &&
                file.mimetype !== 'image/gif' &&
                file.mimetype !== 'image/webp' &&
                file.mimetype !== 'image/svg+xml'
			) {
				removeTmp( file.tempFilePath )

				return res.status( status.BAD_REQUEST ).json( {
					message : "Unsupported format",
					status  : status.BAD_REQUEST
				} )
			}
			if ( file.size > 1024 * 1024 * 4 ) {
				removeTmp( file.tempFilePath )

				// throw createHttpError( status.BAD_REQUEST, 'File size is too large' ) 
				return res.status( status.BAD_REQUEST ).json( {
					message : "File size is too large",
					status  : status.BAD_REQUEST
				} )
			}
		} )
		if ( ! res.headersSent ) {
			next()
		}
	} catch ( error: unknown ) {
		createResponseError( res, error )
	}
}
export const validateImageBase64: RequestHandler = async( req, res, next ) => {
	try {

		const { image } = req.body
		if ( !image ) {
			// throw createHttpError( status.BAD_REQUEST, 'No files selected' ) 
			return res.status( status.BAD_REQUEST ).json( {
				message : "No files selected",
				status  : status.BAD_REQUEST
			} )
		}
		const mimeType = image.substring( "data:".length, image.indexOf( ";base64" ) )
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
		const fileSize = Buffer.from( image.substring( image.indexOf( ',' ) + 1 ), 'base64' )?.length
		if ( fileSize > 1024 * 1024 * 4 ) {
			// throw createHttpError( status.BAD_REQUEST, 'File size is too large' ) 
			return res.status( status.BAD_REQUEST ).json( {
				message : "File size is too large",
				status  : status.BAD_REQUEST
			} )
		}

		if ( ! res.headersSent ) {
			next()
		}
	} catch ( error: unknown ) {
		createResponseError( res, error )
	}
}

export default imageUpload