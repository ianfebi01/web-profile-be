export interface IDynamicForm{
    name: string,
    label: string,
    type: string,
    validation?: IValidation
}

interface IValidation{
    charLength?: {
        max?: number,
        min?: number,
    }
    date?: {
        min?: Date,
        max?: Date,
    },
    inputRule?: RegExp[],
    numeric?: boolean,
    required?: boolean
}