"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.postUser = exports.getUsers = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const status = __importStar(require("http-status"));
const createResponseError_1 = __importDefault(require("../utils/createResponseError"));
const decode_1 = __importDefault(require("../utils/decode"));
const uploadImage_1 = require("./uploadImage");
const generateValidationSchema_1 = require("../utils/generateValidationSchema");
const users_params_1 = require("../params/users.params");
// import { FileArray, UploadedFile } from "express-fileupload";
const getUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const results = await prisma_1.default.user.findMany({
            skip,
            take: limit + 1
        });
        let hasNextPage = false;
        if (results.length > limit) { // if got an extra result
            hasNextPage = true; // has a next page of results
            results.pop(); // remove extra result
        }
        return res.status(status.OK).json({
            message: 'Success',
            status: status.OK,
            data: results,
            page,
            limit,
            itemCount: results?.length,
            hasNextPage
        });
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.getUsers = getUsers;
const postUser = async (req, res) => {
    try {
        const body = req.body;
        const { email, name, quote } = body;
        const isAlreadyExists = await prisma_1.default.user.findUnique({
            where: {
                email
            },
            select: {
                email: true
            }
        });
        if (isAlreadyExists)
            return res.status(status.BAD_REQUEST).json({
                message: "User already exists",
                status: status.BAD_REQUEST
            });
        const results = await prisma_1.default.user.create({
            data: {
                email, name, quote
            }
        });
        return res.status(status.CREATED).json({
            message: "User created",
            status: status.CREATED,
            data: results
        });
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.postUser = postUser;
const getProfile = async (req, res) => {
    try {
        const decoded = (0, decode_1.default)(req);
        const resulst = await prisma_1.default.user.findUnique({
            where: {
                id: decoded.id
            }
        });
        return res.status(status.OK).json({
            message: "Success",
            status: status.OK,
            data: resulst
        });
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const body = req.body;
        const validationSchema = (0, generateValidationSchema_1.generateValidationSchema)(users_params_1.updateProfileParams);
        validationSchema.validateSync(body, { abortEarly: false, stripUnknown: true });
        const decoded = (0, decode_1.default)(req);
        let imageUrl = '';
        // validate Image
        if (body.personImage) {
            const mimeType = body.personImage.substring("data:".length, body.personImage.indexOf(";base64"));
            if (mimeType !== 'image/jpeg' &&
                mimeType !== 'image/png' &&
                mimeType !== 'image/gif' &&
                mimeType !== 'image/webp' &&
                mimeType !== 'image/svg+xml') {
                return res.status(status.BAD_REQUEST).json({
                    message: "Unsupported format",
                    status: status.BAD_REQUEST
                });
            }
            const fileSize = Buffer.from(body.personImage.substring(body.personImage.indexOf(',') + 1), 'base64')?.length;
            if (fileSize > 1024 * 1024 * 4) {
                // throw createHttpError( status.BAD_REQUEST, 'File size is too large' ) 
                return res.status(status.BAD_REQUEST).json({
                    message: "File size is too large",
                    status: status.BAD_REQUEST
                });
            }
            const imageData = await (0, uploadImage_1.uploadToCloudinaryBase64)(body.personImage, 'web-profile');
            if (imageData?.status === 500) {
                return res.status(status.INTERNAL_SERVER_ERROR).json({
                    ...imageData
                });
            }
            else if (imageData?.status === 200 && imageData?.data?.secure_url)
                imageUrl = imageData?.data?.secure_url;
        }
        const payload = () => {
            const openToWork = body.openToWork === 'true' ? true : false;
            if (imageUrl !== '') {
                return {
                    ...body,
                    openToWork: openToWork,
                    personImage: imageUrl
                };
            }
            else {
                return {
                    ...body,
                    openToWork: openToWork,
                };
            }
        };
        const results = await prisma_1.default.user.update({
            where: {
                id: decoded.id
            },
            data: {
                ...payload()
            },
        });
        return res.status(status.OK).json({
            message: "Success",
            status: status.OK,
            data: {
                ...results
            }
        });
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.updateProfile = updateProfile;
