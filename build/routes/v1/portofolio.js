"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const portofolio_1 = require("../../controllers/portofolio");
const verifyAccessToken_1 = require("../../utils/verifyAccessToken");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/portofolio', portofolio_1.getPortofolio);
router.get('/portofolio/:id', portofolio_1.getDetailPortofolio);
router.post('/portofolio', verifyAccessToken_1.verifyAccessToken, portofolio_1.postPortofolio);
router.put('/portofolio/:id', verifyAccessToken_1.verifyAccessToken, portofolio_1.updatePortofolio);
router.delete('/portofolio/:id', verifyAccessToken_1.verifyAccessToken, portofolio_1.deletePortofolio);
exports.default = router;
