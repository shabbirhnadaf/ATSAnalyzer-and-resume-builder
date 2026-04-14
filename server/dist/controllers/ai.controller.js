"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.improveSummaryController = improveSummaryController;
exports.improveExperienceController = improveExperienceController;
exports.generateProjectController = generateProjectController;
exports.tailorResumeController = tailorResumeController;
exports.buildResumeController = buildResumeController;
exports.atsAnalysisController = atsAnalysisController;
exports.skillGapController = skillGapController;
const ai_1 = require("../utils/ai");
async function improveSummaryController(req, res) {
    const data = await (0, ai_1.improveSummaryAI)(req.body);
    return res.status(200).json({
        success: true,
        message: 'Summary improved successfully',
        data,
    });
}
async function improveExperienceController(req, res) {
    const data = await (0, ai_1.improveExperienceAI)(req.body);
    return res.status(200).json({
        success: true,
        message: 'Experience improved successfully',
        data,
    });
}
async function generateProjectController(req, res) {
    const data = await (0, ai_1.generateProjectAI)(req.body);
    return res.status(200).json({
        success: true,
        message: 'Project suggestions generated successfully',
        data,
    });
}
async function tailorResumeController(req, res) {
    const data = await (0, ai_1.tailorResumeAI)(req.body);
    return res.status(200).json({
        success: true,
        message: 'Resume tailored successfully',
        data,
    });
}
async function buildResumeController(req, res) {
    const data = await (0, ai_1.buildResumeAI)(req.body);
    return res.status(200).json({
        success: true,
        message: 'AI resume generated successfully',
        data,
    });
}
async function atsAnalysisController(req, res) {
    const data = await (0, ai_1.atsAnalysisAI)(req.body);
    return res.status(200).json({
        success: true,
        message: 'ATS analysis completed successfully',
        data,
    });
}
async function skillGapController(req, res) {
    const data = await (0, ai_1.skillGapAI)(req.body);
    return res.status(200).json({
        success: true,
        message: 'Skill gap analysis completed successfully',
        data,
    });
}
