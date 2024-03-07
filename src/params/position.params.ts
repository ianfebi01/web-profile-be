import { IParams } from "@/types/params";

export const  addPositionParams: IParams[] = [
	{
		name       : 'name',
		type       : 'text',
		label      : 'Name',
		validation : {
			charLength : {
				min : 3,
				max : 30
			},
			required : true
		}
	},
	{
		name       : 'description',
		type       : 'text',
		label      : 'Description',
		validation : {
			charLength : {
				min : 3,
				max : 300
			},
			required : true
		}
	},
]
export const  getPositionParams: IParams[] = [
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