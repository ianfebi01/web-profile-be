import { Request } from "express";

export interface IPaginationParams{
    page?: number;
    limit?: number;
    q?: string;
}
export interface IResponse<T = never>{
    message: string;
    status: number;
    data?: T
}

export interface TypedRequestBody<T> extends Request {
    body: T
}
export interface TypedRequestParams<T> extends Request {
    params: T
}
export interface TypedRequestQuery<T = void> extends Request {
    query: IPaginationParams & T
}