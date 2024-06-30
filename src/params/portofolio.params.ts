import { IParams } from "@/types/params";

export const  addPortofolioParams: IParams[]  = [
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
			},
			required : true
		}
	},
	{
		name       : 'image',
		type       : 'image',
		label      : 'Icon',
		validation : {
			required : true,
			image    : {
				maxSize : 1000
			}
		}
	},
	{
		name   : 'skills',
		type   : 'array',
		label  : 'Skills',
		select : {
			isMulti : true,
		},
		validation : {
			required : true
		}
	},
	{
		name       : 'year',
		type       : 'year',
		label      : 'Year',
		validation : {
			required : true
		}
	},
]
