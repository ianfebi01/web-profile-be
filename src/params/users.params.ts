import { IParams } from "@/types/params";

export const updateProfileParams: IParams[] = [
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
		name       : 'email',
		type       : 'email',
		label      : 'Email',
		validation : {
			charLength : {
				min : 3,
				max : 30
			},
			required : true
		}
	},
	{
		name       : 'textBg',
		type       : 'text',
		label      : 'Text on BG',
		validation : {
			charLength : {
				min : 3,
				max : 30
			},
			required : false
		}
	},
	{
		name       : 'quote',
		type       : 'text',
		label      : 'Quote',
		validation : {
			charLength : {
				min : 3,
				max : 300
			},
			required : false
		}
	},
	{
		name       : 'openToWork',
		type       : 'text',
		label      : 'Open to work',
		validation : {
			required : false
		}
	},
	{
		name  : 'personImage',
		type  : 'text',
		label : 'Person Image',
	},
]