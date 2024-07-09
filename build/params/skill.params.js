"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSkillParams = void 0;
exports.addSkillParams = [
    {
        name: 'name',
        type: 'text',
        label: 'Name',
        validation: {
            charLength: {
                min: 3,
                max: 30
            },
            required: true
        }
    },
    {
        name: 'description',
        type: 'text',
        label: 'Description',
        validation: {
            charLength: {
                min: 3,
                max: 300
            },
            required: true
        }
    },
    {
        name: 'image',
        type: 'text',
        label: 'Image',
        validation: {
            required: true
        }
    },
];
