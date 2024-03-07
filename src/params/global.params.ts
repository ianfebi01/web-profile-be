import { IParams } from "@/types/params";

export const  paginatorParams: IParams[] = [
	{
		name       : 'q',
		type       : 'text',
		label      : 'q',
		validation : {
			required : false
		}
	},
	{
		name       : 'limit',
		type       : 'text',
		label      : 'limit',
		validation : {
			required : false,
			numeric  : true
		}
	},
	{
		name       : 'page',
		type       : 'text',
		label      : 'page',
		validation : {
			required : false,
			numeric  : true
		}
	},
]