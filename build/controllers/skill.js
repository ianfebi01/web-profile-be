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
exports.postSkill = void 0;
const status = __importStar(require("http-status"));
const uploadImage_1 = require("./uploadImage");
const prisma_1 = __importDefault(require("../utils/prisma"));
const createResponseError_1 = __importDefault(require("../utils/createResponseError"));
const generateImageArray_1 = __importDefault(require("../utils/generateImageArray"));
const postSkill = async (req, res) => {
    try {
        const body = req.body;
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
        const files = Object.values(req?.files).flat();
        const images = [];
        let imageUrl = '';
        if (files?.length === 1) {
            const imageData = await (0, uploadImage_1.uploadToCloudinary)(files[0], 'web-profile');
            imageUrl = imageData?.secure_url;
            const compressedImages = (0, generateImageArray_1.default)(imageData?.secure_url);
            compressedImages?.map((item) => {
                images.push(item);
            });
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
                images
            }
        });
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.postSkill = postSkill;
