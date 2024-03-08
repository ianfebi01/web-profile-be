"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const removeTmp = (path) => {
    (0, fs_1.unlink)(path, (err) => {
        if (err)
            throw err;
    });
};
exports.default = removeTmp;
