"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatorParams = void 0;
exports.paginatorParams = [
    {
        name: 'q',
        type: 'text',
        label: 'q',
        validation: {
            required: false
        }
    },
    {
        name: 'limit',
        type: 'text',
        label: 'limit',
        validation: {
            required: false,
            numeric: true
        }
    },
    {
        name: 'page',
        type: 'text',
        label: 'page',
        validation: {
            required: false,
            numeric: true
        }
    },
];
