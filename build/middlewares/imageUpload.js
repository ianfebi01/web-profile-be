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
exports.validateImageBase64 = void 0;
const removeTmp_1 = __importDefault(require("../utils/removeTmp"));
const status = __importStar(require("http-status"));
const createResponseError_1 = __importDefault(require("../utils/createResponseError"));
const imageUpload = async (req, res, next) => {
    try {
        if (!req.files || Object.values(req.files).flat().length === 0) {
            // throw createHttpError( status.BAD_REQUEST, 'No files selected' ) 
            return res.status(status.BAD_REQUEST).json({
                message: "No files selected",
                status: status.BAD_REQUEST
            });
        }
        const files = Object.values(req.files).flat();
        files.forEach((file) => {
            if (file.mimetype !== 'image/jpeg' &&
                file.mimetype !== 'image/png' &&
                file.mimetype !== 'image/gif' &&
                file.mimetype !== 'image/webp' &&
                file.mimetype !== 'image/svg+xml') {
                (0, removeTmp_1.default)(file.tempFilePath);
                return res.status(status.BAD_REQUEST).json({
                    message: "Unsupported format",
                    status: status.BAD_REQUEST
                });
            }
            if (file.size > 1024 * 1024 * 4) {
                (0, removeTmp_1.default)(file.tempFilePath);
                // throw createHttpError( status.BAD_REQUEST, 'File size is too large' ) 
                return res.status(status.BAD_REQUEST).json({
                    message: "File size is too large",
                    status: status.BAD_REQUEST
                });
            }
        });
        if (!res.headersSent) {
            next();
        }
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
const validateImageBase64 = async (req, res, next) => {
    try {
        const { image } = req.body;
        if (!image) {
            // throw createHttpError( status.BAD_REQUEST, 'No files selected' ) 
            return res.status(status.BAD_REQUEST).json({
                message: "No files selected",
                status: status.BAD_REQUEST
            });
        }
        const mimeType = image.substring("data:".length, image.indexOf(";base64"));
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
        const fileSize = Buffer.from(image.substring(image.indexOf(',') + 1), 'base64')?.length;
        if (fileSize > 1024 * 1024 * 4) {
            // throw createHttpError( status.BAD_REQUEST, 'File size is too large' ) 
            return res.status(status.BAD_REQUEST).json({
                message: "File size is too large",
                status: status.BAD_REQUEST
            });
        }
        if (!res.headersSent) {
            next();
        }
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.validateImageBase64 = validateImageBase64;
exports.default = imageUpload;
