"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id, expiresIn) => jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn });
const generateAccessToken = (id) => generateToken(id, process.env.JWT_ACCESS_EXPIRES_IN);
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (id) => generateToken(id, process.env.JWT_REFRESH_EXPIRES_IN);
exports.generateRefreshToken = generateRefreshToken;
const verifyToken = (token) => jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
exports.verifyToken = verifyToken;
