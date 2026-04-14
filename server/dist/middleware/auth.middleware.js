"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
const api_1 = require("../utils/api");
const tokens_1 = require("../utils/tokens");
function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json((0, api_1.fail)('Unauthorized'));
    }
    const token = header.split(' ')[1];
    try {
        const decoded = (0, tokens_1.verifyToken)(token);
        req.user = { id: decoded.id };
        next();
    }
    catch {
        return res.status(401).json((0, api_1.fail)('Invalid or expired token'));
    }
}
