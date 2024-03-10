import { IParams } from "@/types/params";

export const  addSkillParams: IParams[] = [
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
	{
		name       : 'image',
		type       : 'text',
		label      : 'Image',
		validation : {
			required : true
		}
	},
]
