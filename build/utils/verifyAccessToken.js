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
exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const status = __importStar(require("http-status"));
const prisma_1 = __importDefault(require("./prisma"));
const createResponseError_1 = __importDefault(require("./createResponseError"));
const verifyAccessToken = async (req, res, next) => {
    try {
        const tmp = req.header('Authorization');
        const token = tmp ? tmp.slice(7, tmp.length) : '';
        if (!token) {
            return res
                .status(status.UNAUTHORIZED)
                .json({
                message: 'Please set token headers',
                status: status.UNAUTHORIZED
            });
        }
        const userToken = await prisma_1.default.userToken.findUnique({
            where: {
                accessToken: token
            },
            select: {
                accessToken: true
            }
        });
        if (!userToken) {
            return res.status(status.UNAUTHORIZED).json({
                message: "Invalid access token",
                status: status[status.UNAUTHORIZED],
            });
        }
        jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN_SECRET, (err) => {
            if (err) {
                const error = err;
                return res
                    .status(status.UNAUTHORIZED)
                    .json({
                    message: error.message,
                    status: status.UNAUTHORIZED
                });
            }
            next();
        });
    }
    catch (error) {
        return (0, createResponseError_1.default)(res, error);
    }
};
exports.verifyAccessToken = verifyAccessToken;
