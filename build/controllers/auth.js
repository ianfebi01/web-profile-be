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
exports.refreshToken = exports.githubAuth = void 0;
const token_1 = require("../helpers/token");
const createResponseError_1 = __importDefault(require("../utils/createResponseError"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const axios_1 = __importDefault(require("axios"));
const status = __importStar(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const githubAuth = async (req, res) => {
    try {
        const tmp = req.header("Authorization");
        const token = tmp ? tmp.slice(7, tmp.length) : "";
        const profile = await axios_1.default.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const email = await axios_1.default.get('https://api.github.com/user/emails', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const profileUser = {
            ...profile.data,
            email: email.data[0].email
        };
        const isAlreadyExists = await prisma_1.default.user.findUnique({
            where: {
                email: profileUser.email,
                id: profileUser.id
            },
        });
        if (isAlreadyExists) {
            const accessToken = (0, token_1.generateToken)({ id: isAlreadyExists.id }, "5m");
            const refreshToken = (0, token_1.generateToken)({ id: isAlreadyExists.id }, "7d");
            const isTokenEexist = await prisma_1.default.userToken.findUnique({
                where: {
                    userId: isAlreadyExists.id,
                },
                select: {
                    userId: true
                }
            });
            if (isTokenEexist) {
                await prisma_1.default.userToken.delete({
                    where: {
                        userId: isTokenEexist.userId
                    }
                });
            }
            const userToken = await prisma_1.default.userToken.create({
                data: {
                    userId: isAlreadyExists.id,
                    accessToken,
                    refreshToken
                }
            });
            return res.status(status.OK).json({
                message: "Success",
                status: status.OK,
                data: {
                    ...isAlreadyExists,
                    accessToken: userToken.accessToken,
                    refreshToken: userToken.refreshToken
                }
            });
        }
        const results = await prisma_1.default.user.create({
            data: {
                id: profileUser.id,
                name: profileUser.name,
                email: profileUser.email,
                avatar: profileUser.avatar_url,
            }
        });
        const accessToken = (0, token_1.generateToken)({ id: results.id }, "5m");
        const refreshToken = (0, token_1.generateToken)({ id: results.id }, "7d");
        const isTokenEexist = await prisma_1.default.userToken.findUnique({
            where: {
                userId: results.id,
            },
            select: {
                userId: true
            }
        });
        if (isTokenEexist) {
            await prisma_1.default.userToken.delete({
                where: {
                    userId: isTokenEexist.userId
                }
            });
        }
        const userToken = await prisma_1.default.userToken.create({
            data: {
                userId: results.id,
                accessToken,
                refreshToken
            }
        });
        return res.status(status.OK).json({
            message: "Success",
            status: status.OK,
            data: {
                ...results,
                accessToken: userToken.accessToken,
                refreshToken: userToken.refreshToken
            }
        });
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.githubAuth = githubAuth;
const refreshToken = async (req, res) => {
    try {
        const tmp = req.header("Authorization");
        const token = tmp ? tmp.slice(7, tmp.length) : "";
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
                refreshToken: token
            },
            select: {
                refreshToken: true,
                userId: true,
            }
        });
        if (!userToken) {
            return res.status(status.UNAUTHORIZED).json({
                message: "Invalid access token",
                status: status[status.UNAUTHORIZED],
            });
        }
        jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN_SECRET, async (err) => {
            if (err) {
                return res
                    .status(status.UNAUTHORIZED)
                    .json({
                    message: status[status.UNAUTHORIZED],
                    status: status.UNAUTHORIZED
                });
            }
            const accessToken = (0, token_1.generateToken)({ id: userToken.userId }, "5m");
            const updateToken = await prisma_1.default.userToken.update({
                where: {
                    userId: userToken.userId
                },
                data: {
                    accessToken: accessToken,
                },
            });
            return res.status(status.OK).json({
                message: "Updated token",
                status: status.OK,
                data: updateToken
            });
        });
    }
    catch (error) {
        return (0, createResponseError_1.default)(res, error);
    }
};
exports.refreshToken = refreshToken;
