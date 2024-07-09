"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const decode = (req) => {
    const tmp = req.header("Authorization");
    const token = tmp ? tmp.slice(7, tmp.length) : "";
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN_SECRET);
    return decoded;
};
exports.default = decode;
const decodeToken = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN_SECRET);
    return decoded;
};
exports.decodeToken = decodeToken;
