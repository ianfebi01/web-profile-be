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
exports.uploadToCloudinaryBase64 = exports.uploadToCloudinary = exports.deleteImage = exports.uploadImageBase64 = exports.uploadImage = void 0;
const createResponseError_1 = __importDefault(require("../utils/createResponseError"));
const removeTmp_1 = __importDefault(require("../utils/removeTmp"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const status = __importStar(require("http-status"));
// cloudinary.config( {
// 	cloud_name : process.env.CLOUD_NAME,
// 	api_key    : process.env.CLOUD_API_KEY,
// 	api_secret : process.env.CLOUD_API_SECRET,
// } );
const uploadImage = async (req, res) => {
    try {
        const { path } = req.body;
        const files = Object.values(req.files).flat();
        if (files?.length === 1) {
            const url = await (0, exports.uploadToCloudinary)(files[0], path);
            return res.json(url);
        }
        const images = [];
        for (const file of files) {
            const url = await (0, exports.uploadToCloudinary)(file, path);
            images.push(url);
            (0, removeTmp_1.default)(file.tempFilePath);
        }
        return res.json(images);
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.uploadImage = uploadImage;
const uploadImageBase64 = async (req, res) => {
    try {
        const { path, image } = req.body;
        const result = await (0, exports.uploadToCloudinaryBase64)(image, path);
        return res.json(result);
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.uploadImageBase64 = uploadImageBase64;
const deleteImage = async (req, res) => {
    try {
        const { publicId } = req.body;
        const delImg = await cloudinary_1.default.v2.uploader.destroy(publicId, {
            resource_type: "image",
        });
        res.json(delImg);
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.deleteImage = deleteImage;
const uploadToCloudinary = async (file, path) => {
    try {
        const results = await cloudinary_1.default.v2.uploader.upload(file.tempFilePath, { folder: path, tags: "basic_sample" });
        (0, removeTmp_1.default)(file.tempFilePath);
        return results;
    }
    catch (error) {
        return error;
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
const uploadToCloudinaryBase64 = async (base64, path) => {
    try {
        const results = await cloudinary_1.default.v2.uploader.upload(base64, { folder: path, tags: "basic_sample", overwrite: true, });
        return {
            message: "Success",
            status: status.OK,
            data: results
        };
    }
    catch (error) {
        if (typeof error === "string") {
            return {
                message: error,
                status: status.INTERNAL_SERVER_ERROR,
            };
        }
        else if (error instanceof Error) {
            return {
                message: error.message,
                status: status.INTERNAL_SERVER_ERROR,
            };
        }
        else {
            return {
                message: error.message,
                status: status.INTERNAL_SERVER_ERROR,
            };
        }
    }
};
exports.uploadToCloudinaryBase64 = uploadToCloudinaryBase64;
