"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const portofolio_1 = require("../../controllers/portofolio");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/portofolio', portofolio_1.getPortofolio);
// router.post( '/position', postPosition )
exports.default = router;
