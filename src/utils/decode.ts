
import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'

const decode = ( req: Request ): JwtPayload | string  => {
	const tmp = req.header( "Authorization" );
	const token = tmp ? tmp.slice( 7, tmp.length ) : "";
	const decoded = jwt.verify( token, process.env.JWT_TOKEN_SECRET as string );
	
	return decoded;
};

export default decode

export const decodeToken = ( token: string ): JwtPayload | string => {
	const decoded = jwt.verify( token, process.env.JWT_TOKEN_SECRET as string );
	
	return decoded

}