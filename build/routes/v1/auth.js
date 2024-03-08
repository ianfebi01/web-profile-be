"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../controllers/auth");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/github-auth', auth_1.githubAuth);
router.get('/auth/refresh', auth_1.refreshToken);
exports.default = router;
