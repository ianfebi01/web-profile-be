
const generateImageArray = ( url: string ) => {
	if ( url.slice( -3 ) === 'svg' ){
		return [
			{ url : url }
		]
	}else return imageCompress( url )
}

const imageCompress = ( url: string ) => {
	const images = [
		{
			width : 64,
			url   : newStr( url, 64 )
		},
		{
			width : 300,
			url   : newStr( url, 300 )
		},
		{
			width : 640,
			url   : newStr( url, 640 )
		},
	]
	
	return images
}

const newStr = ( str: string, width: number ) => {
	const reg = /upload/
    
	return str.replace( reg, `upload/c_scale,w_${width}` )
}

export default generateImageArray