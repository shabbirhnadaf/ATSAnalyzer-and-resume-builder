"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scan = void 0;
const mongoose_1 = require("mongoose");
const scanSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    resume: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Resume',
        required: true,
        index: true,
    },
    jobTitle: {
        type: String,
        default: '',
        trim: true,
    },
    company: {
        type: String,
        default: '',
        trim: true,
    },
    jobDescription: {
        type: String,
        required: true,
        trim: true,
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    matchedKeywords: {
        type: [String],
        default: [],
    },
    missingKeywords: {
        type: [String],
        default: [],
    },
    suggestions: {
        type: [String],
        default: [],
    },
}, { timestamps: true });
exports.Scan = (0, mongoose_1.model)('Scan', scanSchema);
