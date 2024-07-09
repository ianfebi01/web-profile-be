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
exports.getSkillList = exports.getSkill = exports.deleteSkill = exports.getSkills = exports.updateSkill = exports.postSkill = void 0;
const status = __importStar(require("http-status"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const createResponseError_1 = __importDefault(require("../utils/createResponseError"));
const uploadImage_1 = require("./uploadImage");
const generateValidationSchema_1 = require("../utils/generateValidationSchema");
const skill_params_1 = require("../params/skill.params");
const global_params_1 = require("../params/global.params");
const postSkill = async (req, res) => {
    try {
        const body = req.body;
        const validationSchema = (0, generateValidationSchema_1.generateValidationSchema)(skill_params_1.addSkillParams);
        validationSchema.validateSync(body, { abortEarly: false, stripUnknown: true });
        const { name, description } = body;
        const isAlreadyExists = await prisma_1.default.skill.findUnique({
            where: {
                name
            },
            select: {
                name: true
            }
        });
        if (isAlreadyExists)
            return res.status(status.BAD_REQUEST).json({
                message: "Skill already exists",
                status: status.BAD_REQUEST
            });
        let imageUrl = '';
        // validate Image
        if (body.image) {
            const mimeType = body.image.substring("data:".length, body.image.indexOf(";base64"));
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
            const fileSize = Buffer.from(body.image.substring(body.image.indexOf(',') + 1), 'base64')?.length;
            if (fileSize > 1024 * 1024 * 4) {
                // throw createHttpError( status.BAD_REQUEST, 'File size is too large' ) 
                return res.status(status.BAD_REQUEST).json({
                    message: "File size is too large",
                    status: status.BAD_REQUEST
                });
            }
            const imageData = await (0, uploadImage_1.uploadToCloudinaryBase64)(body.image, 'web-profile');
            if (imageData?.status === 500) {
                return res.status(status.INTERNAL_SERVER_ERROR).json({
                    ...imageData
                });
            }
            else if (imageData?.status === 200 && imageData?.data?.secure_url)
                imageUrl = imageData?.data?.secure_url;
        }
        const results = await prisma_1.default.skill.create({
            data: {
                name,
                description,
                image: imageUrl
            }
        });
        return res.status(status.CREATED).json({
            message: "Skill created",
            status: status.CREATED,
            data: {
                ...results,
            }
        });
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.postSkill = postSkill;
const updateSkill = async (req, res) => {
    try {
        const body = req.body;
        const validationSchema = (0, generateValidationSchema_1.generateValidationSchema)(skill_params_1.addSkillParams);
        validationSchema.validateSync(body, { abortEarly: false, stripUnknown: true });
        let imageUrl = '';
        // validate Image
        const urlPattern = new RegExp(/^(https?:\/\/)+.*/);
        if (body.image && !urlPattern.test(body.image)) {
            const mimeType = body.image.substring("data:".length, body.image.indexOf(";base64"));
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
            const fileSize = Buffer.from(body.image.substring(body.image.indexOf(',') + 1), 'base64')?.length;
            if (fileSize > 1024 * 1024 * 4) {
                // throw createHttpError( status.BAD_REQUEST, 'File size is too large' ) 
                return res.status(status.BAD_REQUEST).json({
                    message: "File size is too large",
                    status: status.BAD_REQUEST
                });
            }
            const imageData = await (0, uploadImage_1.uploadToCloudinaryBase64)(body.image, 'web-profile');
            if (imageData?.status === 500) {
                return res.status(status.INTERNAL_SERVER_ERROR).json({
                    ...imageData
                });
            }
            else if (imageData?.status === 200 && imageData?.data?.secure_url)
                imageUrl = imageData?.data?.secure_url;
        }
        const payload = () => {
            if (imageUrl !== '') {
                return {
                    ...body,
                    image: imageUrl
                };
            }
            else {
                return {
                    ...body,
                };
            }
        };
        const results = await prisma_1.default.skill.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                ...payload()
            },
        });
        return res.status(status.CREATED).json({
            message: "Skill created",
            status: status.CREATED,
            data: {
                ...results,
            }
        });
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.updateSkill = updateSkill;
const getSkills = async (req, res) => {
    try {
        const q = req.query.q || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const validationSchema = (0, generateValidationSchema_1.generateValidationSchema)(global_params_1.paginatorParams);
        validationSchema.validateSync({ q, page, limit }, { abortEarly: false, stripUnknown: true });
        const where = {
            name: {
                contains: q.trim(),
                mode: 'insensitive',
            }
        };
        const [results, total] = await Promise.all([
            prisma_1.default.skill.findMany({
                where: where,
                skip,
                take: limit + 1
            }),
            prisma_1.default.skill.count({
                where: where
            })
        ]);
        const totalPage = Math.ceil(total / limit);
        let hasNextPage = false;
        if (results.length > limit) { // if got an extra result
            hasNextPage = true; // has a next page of results
            results.pop(); // remove extra result
        }
        return res.status(status.OK).json({
            message: "Success",
            status: status.OK,
            data: results,
            page,
            limit,
            itemCount: results?.length,
            hasNextPage,
            total,
            totalPage
        });
        // eslint-disable-next-line
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.getSkills = getSkills;
const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await prisma_1.default.skill.delete({
            where: {
                id: Number(id),
            }
        });
        return res.status(status.OK).json({
            message: "Skill deleted successfully",
            status: status.OK,
            data: {
                ...results,
            }
        });
        // eslint-disable-next-line
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.deleteSkill = deleteSkill;
const getSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await prisma_1.default.skill.findUnique({
            where: {
                id: Number(id),
            }
        });
        return res.status(status.OK).json({
            message: "Success",
            status: status.OK,
            data: {
                ...results,
            }
        });
        // eslint-disable-next-line
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.getSkill = getSkill;
const getSkillList = async (req, res) => {
    try {
        const results = await prisma_1.default.skill.findMany({
            select: {
                name: true,
                id: true
            }
        });
        return res.status(status.OK).json({
            message: "Success",
            status: status.OK,
            data: results
        });
        // eslint-disable-next-line
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.getSkillList = getSkillList;
