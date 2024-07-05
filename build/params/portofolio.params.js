"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPortofolioParams = void 0;
exports.addPortofolioParams = [
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
            },
            required: true
        }
    },
    {
        name: 'image',
        type: 'image',
        label: 'Icon',
        validation: {
            required: true,
            image: {
                maxSize: 1000
            }
        }
    },
    {
        name: 'skills',
        type: 'array',
        label: 'Skills',
        select: {
            isMulti: true,
        },
        validation: {
            required: true
        }
    },
    {
        name: 'year',
        type: 'year',
        label: 'Year',
        validation: {
            required: true
        }
    },
];
