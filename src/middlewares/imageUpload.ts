import removeTmp from "@/utils/removeTmp"
import { RequestHandler } from "express"
import * as status from "http-status"
import createHttpError from 'http-errors'
import createResponseError from "@/utils/createResponseError"

const imageUpload: RequestHandler = async( req, res, next ) => {
	try {
		if ( !req.files || Object.values( req.files ).flat().length === 0 ) {
			throw createHttpError( status.BAD_REQUEST, 'No files selected.' ) 
		}
		const files = Object.values( req.files ).flat()
		files.forEach( ( file ) => {
			if (
				file.mimetype !== 'image/jpeg' &&
                file.mimetype !== 'image/png' &&
                file.mimetype !== 'image/gif' &&
                file.mimetype !== 'image/svg+xml' &&
                file.mimetype !== 'image/webp'
			) {
				removeTmp( file.tempFilePath )

				throw createHttpError( status.BAD_REQUEST, 'Unsupported format.' ) 
			}
			if ( file.size > 1024 * 1024 * 4 ) {
				removeTmp( file.tempFilePath )

				throw createHttpError( status.BAD_REQUEST, 'File size is too large.' ) 
			}
		} )
		next()
	} catch ( error: unknown ) {
		createResponseError( res, error )
	}
}

export default imageUpload