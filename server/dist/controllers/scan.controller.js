"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScanHistory = exports.scanResume = void 0;
const api_1 = require("../utils/api");
const ScanHistory_1 = __importDefault(require("../models/ScanHistory"));
const ats_1 = require("../utils/ats");
const scanResume = async (req, res) => {
    const { resumeId, resumeText, jobDescription, jobTitle, companyName } = req.body;
    const result = (0, ats_1.scoreResumeAgainstJD)(resumeText, jobDescription);
    const history = await ScanHistory_1.default.create({
        user: req.user?.id,
        resume: resumeId || undefined,
        jobTitle,
        companyName,
        ...result,
    });
    res.status(201).json((0, api_1.success)({ ...result, historyId: history.id }, 'Resume scanned successfully'));
};
exports.scanResume = scanResume;
const getScanHistory = async (req, res) => {
    const { resumeId } = req.query;
    const query = {
        user: req.user?.id,
    };
    if (resumeId) {
        query.resume = resumeId;
    }
    const scans = await ScanHistory_1.default.find(query).sort({ createdAt: -1 });
    res.json((0, api_1.success)(scans, 'Scan history fetched successfully'));
};
exports.getScanHistory = getScanHistory;
