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
exports.getLandingData = void 0;
const createResponseError_1 = __importDefault(require("../utils/createResponseError"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const status = __importStar(require("http-status"));
const getLandingData = async (req, res) => {
    try {
        const query = req.query;
        const { email } = query;
        const profile = await prisma_1.default.user.findUnique({
            where: {
                email: email?.toString()
            },
            select: {
                name: true,
                email: true,
                personImage: true,
                textBg: true,
                quote: true,
                openToWork: true
            }
        });
        return res.status(status.OK).json({
            message: "Success",
            status: status.OK,
            data: {
                profile
            }
        });
    }
    catch (error) {
        (0, createResponseError_1.default)(res, error);
    }
};
exports.getLandingData = getLandingData;
