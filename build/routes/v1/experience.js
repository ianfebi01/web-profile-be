"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const experience_1 = require("../../controllers/experience");
const verifyAccessToken_1 = require("../../utils/verifyAccessToken");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/experience', verifyAccessToken_1.verifyAccessToken, experience_1.getExperiences);
exports.default = router;
