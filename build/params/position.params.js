"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPositionParams = void 0;
exports.addPositionParams = [
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
];
