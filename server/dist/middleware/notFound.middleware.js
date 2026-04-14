"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = notFound;
const api_1 = require("../utils/api");
function notFound(req, res) {
    res.status(404).json((0, api_1.fail)(`Route not found: ${req.originalUrl}`));
}
