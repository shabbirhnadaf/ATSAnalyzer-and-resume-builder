"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
const api_1 = require("../utils/api");
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json((0, api_1.fail)(err.message || 'Internal server error'));
}
