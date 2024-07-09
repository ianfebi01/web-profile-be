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
exports.getDetailPortofolio = exports.deletePortofolio = exports.postPortofolio = exports.updatePortofolio = exports.getPortofolio = void 0;
const createResponseError_1 = __importDefault(require("../utils/createResponseError"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const status = __importStar(require("http-status"));
const uploadImage_1 = require("./uploadImage");
const decode_1 = __importDefault(require("../utils/decode"));
const generateValidationSchema_1 = require("../utils/generateValidationSchema");
const global_params_1 = require("../params/global.params");
const portofolio_params_1 = require("../params/portofolio.params");
const getPortofolio = async (req, res) => {
    try {
        const q = req.query.q || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const validationSchema = (0, generateValidationSchema_1.generateValidationSchema)(global_params_1.paginatorParams);
        validationSchema.validateSync({ q, page, limit }, { abortEarly: false, stripUnknown: true });
        const where = {
            name: {
                contains: q,
                mode: 'insensitive',
            },
        };
        const [results, total] = await Promise.all([
            prisma_1.default.portofolio.findMany({
                where: where,
                skip,
                take: limit + 1,
                include: {
                    skills: true,
                },
            }),
            prisma_1.default.portofolio.count({
                where: where,
            }),
        ]);
        const totalPage = Math.ceil(total / limit);
        let hasNextPage = false;
        if (results.length > limit) {
            // if got an extra result
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
            hasNextPage,
            total,
            totalPage,
        });
        // eslint-disable-next-line
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.getPortofolio = getPortofolio;
const updatePortofolio = async (req, res) => {
    try {
        const body = req.body;
        const { skills } = body;
        const validationSchema = (0, generateValidationSchema_1.generateValidationSchema)(portofolio_params_1.addPortofolioParams);
        validationSchema.validateSync(body, { abortEarly: false, stripUnknown: true });
        const isAlreadyExists = await prisma_1.default.portofolio.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
            select: {
                id: true,
            },
        });
        if (!isAlreadyExists)
            return res.status(status.BAD_REQUEST).json({
                message: 'Portofolio not exists',
                status: status.BAD_REQUEST,
            });
        let imageUrl = '';
        // validate Image
        const urlPattern = new RegExp(/^(https?:\/\/)+.*/);
        if (body.image && !urlPattern.test(body.image)) {
            const mimeType = body.image.substring('data:'.length, body.image.indexOf(';base64'));
            if (mimeType !== 'image/jpeg' &&
                mimeType !== 'image/png' &&
                mimeType !== 'image/gif' &&
                mimeType !== 'image/webp' &&
                mimeType !== 'image/svg+xml') {
                return res.status(status.BAD_REQUEST).json({
                    message: 'Unsupported format',
                    status: status.BAD_REQUEST,
                });
            }
            const fileSize = Buffer.from(body.image.substring(body.image.indexOf(',') + 1), 'base64')?.length;
            if (fileSize > 1024 * 1024 * 4) {
                // throw createHttpError( status.BAD_REQUEST, 'File size is too large' )
                return res.status(status.BAD_REQUEST).json({
                    message: 'File size is too large',
                    status: status.BAD_REQUEST,
                });
            }
            const imageData = await (0, uploadImage_1.uploadToCloudinaryBase64)(body.image, 'web-profile');
            if (imageData?.status === 500) {
                return res.status(status.INTERNAL_SERVER_ERROR).json({
                    ...imageData,
                });
            }
            else if (imageData?.status === 200 && imageData?.data?.secure_url)
                imageUrl = imageData?.data?.secure_url;
        }
        const payload = () => {
            if (imageUrl !== '') {
                return {
                    ...body,
                    image: imageUrl,
                };
            }
            else {
                return {
                    ...body,
                };
            }
        };
        const currentData = await prisma_1.default.portofolio.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            select: {
                skills: true
            }
        });
        const deletedSkills = currentData?.skills.filter(item => !skills.includes(item.id));
        const results = await prisma_1.default.portofolio.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                ...payload(),
                skills: {
                    disconnect: deletedSkills?.map((item) => ({
                        id: item.id
                    })),
                    connect: skills.map((item) => ({
                        id: item,
                    })),
                },
            },
            include: {
                skills: true,
            },
        });
        return res.status(status.CREATED).json({
            message: 'Portofolio created',
            status: status.CREATED,
            data: results,
        });
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.updatePortofolio = updatePortofolio;
const postPortofolio = async (req, res) => {
    try {
        const decoded = (0, decode_1.default)(req);
        const body = req.body;
        const { name, description, year, skills } = body;
        const validationSchema = (0, generateValidationSchema_1.generateValidationSchema)(portofolio_params_1.addPortofolioParams);
        validationSchema.validateSync(body, { abortEarly: false, stripUnknown: true });
        const isAlreadyExists = await prisma_1.default.portofolio.findUnique({
            where: {
                name,
            },
            select: {
                name: true,
            },
        });
        if (isAlreadyExists)
            return res.status(status.BAD_REQUEST).json({
                message: 'Portofolio already exists',
                status: status.BAD_REQUEST,
            });
        let imageUrl = '';
        // validate Image
        if (body.image) {
            const mimeType = body.image.substring('data:'.length, body.image.indexOf(';base64'));
            if (mimeType !== 'image/jpeg' &&
                mimeType !== 'image/png' &&
                mimeType !== 'image/gif' &&
                mimeType !== 'image/webp' &&
                mimeType !== 'image/svg+xml') {
                return res.status(status.BAD_REQUEST).json({
                    message: 'Unsupported format',
                    status: status.BAD_REQUEST,
                });
            }
            const fileSize = Buffer.from(body.image.substring(body.image.indexOf(',') + 1), 'base64')?.length;
            if (fileSize > 1024 * 1024 * 4) {
                // throw createHttpError( status.BAD_REQUEST, 'File size is too large' )
                return res.status(status.BAD_REQUEST).json({
                    message: 'File size is too large',
                    status: status.BAD_REQUEST,
                });
            }
            const imageData = await (0, uploadImage_1.uploadToCloudinaryBase64)(body.image, 'web-profile');
            if (imageData?.status === 500) {
                return res.status(status.INTERNAL_SERVER_ERROR).json({
                    ...imageData,
                });
            }
            else if (imageData?.status === 200 && imageData?.data?.secure_url)
                imageUrl = imageData?.data?.secure_url;
        }
        const results = await prisma_1.default.portofolio.create({
            data: {
                name,
                description,
                image: imageUrl,
                year,
                userId: decoded.id,
                skills: {
                    connect: skills.map((item) => ({
                        id: item,
                    })),
                },
            },
            include: {
                skills: true,
            },
        });
        return res.status(status.CREATED).json({
            message: 'Portofolio created',
            status: status.CREATED,
            data: results,
        });
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.postPortofolio = postPortofolio;
const deletePortofolio = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await prisma_1.default.portofolio.delete({
            where: {
                id: Number(id),
            },
        });
        return res.status(status.OK).json({
            message: 'Portofolio deleted successfully',
            status: status.OK,
            data: {
                ...results,
            },
        });
        // eslint-disable-next-line
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.deletePortofolio = deletePortofolio;
const getDetailPortofolio = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await prisma_1.default.portofolio.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                skills: true,
            },
        });
        return res.status(status.OK).json({
            message: 'Success',
            status: status.OK,
            data: {
                ...results,
            },
        });
        // eslint-disable-next-line
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.getDetailPortofolio = getDetailPortofolio;
