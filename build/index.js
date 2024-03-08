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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const http_errors_1 = __importDefault(require("http-errors"));
const node_fs_1 = require("node:fs");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const status = __importStar(require("http-status"));
const bodyParser = require("body-parser");
dotenv_1.default.config();
const app = (0, express_1.default)();
// app.use( express.json() )
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// Cors
app.use((0, cors_1.default)());
// File Upload
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: 'src/tmp/'
}));
// Port
const PORT = process.env.PORT ?? "8000";
// Routes
const init = async () => {
    const routesPath = process.env.NODE_ENV === 'production' ? '/build/routes/v1' : '/routes/v1';
    const files = await node_fs_1.promises.readdir(`${process.cwd()}${routesPath}`);
    const createroute = async (file) => {
        const route = await Promise.resolve(`${`./routes/v1/${file}`}`).then(s => __importStar(require(s)));
        app.use("/v1/", route.default);
    };
    await Promise.all(files.map(createroute));
};
const errorHandler = (err, req, res) => {
    res.status(status.INTERNAL_SERVER_ERROR).send({
        message: err.message,
        status: status.INTERNAL_SERVER_ERROR,
    });
};
(async () => {
    // Initialize Routes
    await init();
    // handle 404 error
    app.use((req, res, next) => {
        next((0, http_errors_1.default)(404));
    });
    app.use(errorHandler);
    //  start server
    app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log('listening on port', PORT);
    });
})();
