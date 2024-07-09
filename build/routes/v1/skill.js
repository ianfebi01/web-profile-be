"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skill_1 = require("../../controllers/skill");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/skill', skill_1.postSkill);
router.get('/skill', skill_1.getSkills);
router.get('/skill/:id', skill_1.getSkill);
router.put('/skill/:id', skill_1.updateSkill);
router.delete('/skill/:id', skill_1.deleteSkill);
router.get('/skill-list', skill_1.getSkillList);
exports.default = router;
