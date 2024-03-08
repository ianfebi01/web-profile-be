"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skill_1 = require("../../controllers/skill");
const imageUpload_1 = __importDefault(require("../../middlewares/imageUpload"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/skill', imageUpload_1.default, skill_1.postSkill);
exports.default = router;
