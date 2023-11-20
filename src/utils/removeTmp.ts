import { unlink } from "fs"

const removeTmp = ( path: string ) => {
	unlink( path, ( err ) => {
		if ( err ) throw err
	} )
}

export default removeTmp