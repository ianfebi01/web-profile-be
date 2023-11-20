import jwt from "jsonwebtoken"

interface IPayload{
    id: number
}
export const generateToken = ( payload: IPayload, expired: string ) => {
	return jwt.sign( payload, process.env.JWT_TOKEN_SECRET as string, {
		expiresIn : expired,
	} );
};
