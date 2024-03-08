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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateValidationSchema = void 0;
const yup = __importStar(require("yup"));
const generateValidationSchema = (fields) => {
    const validationsGroup = {};
    for (const field of fields) {
        let validations = yup;
        validations = validations.string();
        if (field.validation?.required)
            validations = validations = validations.required();
        if (field.type === 'email')
            validations = validations.email();
        if (field.validation?.numeric)
            validations = validations.matches(/^\d*$/, ({ label }) => `${label} must be number only`);
        if (field.type === 'phone')
            validations = validations.matches(/^[0-9]\d*$/, 'Phone number is not valid');
        if (field.validation?.charLength) {
            if (field.validation?.charLength.min)
                validations = validations.min(field.validation.charLength.min);
            if (field.validation?.charLength.max)
                validations = validations.max(field.validation.charLength.max);
        }
        validationsGroup[field.name] = validations.label(field.label);
    }
    return yup.object({
        ...validationsGroup
    });
};
exports.generateValidationSchema = generateValidationSchema;
