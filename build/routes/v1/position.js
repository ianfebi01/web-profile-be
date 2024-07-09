"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const position_1 = require("../../controllers/position");
const verifyAccessToken_1 = require("../../utils/verifyAccessToken");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/position', verifyAccessToken_1.verifyAccessToken, position_1.getPositions);
router.post('/position', verifyAccessToken_1.verifyAccessToken, position_1.postPosition);
exports.default = router;
