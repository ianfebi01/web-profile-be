export interface IPaginationParams{
    page?: number;
    limit?: number;
}
export interface IResponse<T = never>{
    message: string;
    status: number;
    data?: T
}