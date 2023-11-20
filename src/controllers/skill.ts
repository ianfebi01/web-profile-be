import { IApiImage, IImages } from '@/types/uploadImage'
import { RequestHandler } from 'express'
import { FileArray } from 'express-fileupload'
import * as status from 'http-status'
import { uploadToCloudinary } from './uploadImage'
import prisma from '@/utils/prisma'
import createResponseError from '@/utils/createResponseError'
import generateImageArray from '@/utils/generateImageArray'

export const postSkill: RequestHandler = async ( req, res ) => {
	try {
		const body  = req.body
		const { name, description } = body
        
		const isAlreadyExists = await prisma.skill.findUnique( {
			where : {
				name
			},
			select : {
				name : true
			}
		} )
		
		if( isAlreadyExists ) return res.status( status.BAD_REQUEST ).json( {
			message : "Skill already exists",
			status  : status.BAD_REQUEST
		} )

		const files = Object.values( req?.files as FileArray ).flat()

		const images: IImages[] = []
		let imageUrl: string = ''

		if ( files?.length === 1 ){

			const imageData: IApiImage = await uploadToCloudinary( files[0], 'web-profile' ) as IApiImage;
			imageUrl = imageData?.secure_url

			const compressedImages: IImages[] = generateImageArray( imageData )
			compressedImages?.map( ( item: IImages ) => {
				images.push( item )
			} )
		}

		const results = await prisma.skill.create( {
			data : {
				name, 
				description, 
				image : imageUrl
			}
		} )

		return res.status( status.CREATED ).json( {
			message : "Skill created",
			status  : status.CREATED,
			data    : {
				...results,
				images
			}
		} )

	} catch ( error: unknown ) {
		createResponseError( res, error )
	}
}