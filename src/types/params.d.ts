export interface IParams{
    name: string,
    label: string,
    type: string,
    validation?: IValidation
    select?: {
        isMulti?: boolean
    }
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
    image?: IImageValidation
}
interface IImageValidation {
    maxSize?: number
  }
  
export interface IOptions{
    value: string | number
    label: string
  }