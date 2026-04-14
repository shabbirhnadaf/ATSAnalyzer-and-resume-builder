"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.success = void 0;
const success = (data, message = 'success') => ({
    success: true,
    message,
    data,
});
exports.success = success;
const fail = (message = "Request failed", details) => ({
    success: false,
    message,
    details
});
exports.fail = fail;
