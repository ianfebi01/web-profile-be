import { IDynamicForm } from '@/types/form'
import * as yup from 'yup'

type Valid = Record<string, | yup.NumberSchema<number | undefined, yup.AnyObject, undefined, ''>
| yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>>

export const generateValidationSchema = ( fields: IDynamicForm[] ) => {
	const validationsGroup: Valid = {}
	for ( const field of fields ) {
		let validations: any = yup

		validations = validations.string()
		if ( field.validation?.required ) validations = validations = validations.required()
		if ( field.type === 'email' ) validations = validations.email()
		if ( field.validation?.numeric ) validations = validations.matches( /^\d*$/, ( { label }: { label: string } ) => `${label} must be number only` )
		if ( field.type === 'phone' ) validations = validations.matches( /^[0-9]\d*$/, 'Phone number is not valid' )
		if ( field.validation?.charLength ) {
			if ( field.validation?.charLength.min ) validations = validations.min( field.validation.charLength.min )
			if ( field.validation?.charLength.max ) validations = validations.max( field.validation.charLength.max )
		}

		validationsGroup[field.name] = validations.label( field.label )
	}
	
	return yup.object( {
		...validationsGroup
	} )
}
