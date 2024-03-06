import { Response } from "express"
import * as status from "http-status"
import { ValidationError } from "yup"

const createResponseError = ( res: Response, error: unknown ) => {
	if ( typeof error === "string" ) {
		return res.status( status.INTERNAL_SERVER_ERROR ).json( {
			message : error,
			status  : status.INTERNAL_SERVER_ERROR,
		} )
	} else if ( error instanceof ValidationError ) {		
		return res.status( status.UNPROCESSABLE_ENTITY ).json( {
			message : "Error validate parameter",
			status  : status.UNPROCESSABLE_ENTITY,
			data    : error.errors
		} )
	} else if ( error instanceof Error ) {
		return res.status( status.INTERNAL_SERVER_ERROR ).json( {
			message : error.message,
			status  : status.INTERNAL_SERVER_ERROR,
		} )
	}
}

export default createResponseError