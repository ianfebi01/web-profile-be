"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../controllers/user");
const verifyAccessToken_1 = require("../../utils/verifyAccessToken");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/user', verifyAccessToken_1.verifyAccessToken, user_1.getUsers);
router.post('/user', verifyAccessToken_1.verifyAccessToken, user_1.postUser);
router.get('/profile', verifyAccessToken_1.verifyAccessToken, user_1.getProfile);
router.put('/profile', verifyAccessToken_1.verifyAccessToken, user_1.updateProfile);
exports.default = router;
