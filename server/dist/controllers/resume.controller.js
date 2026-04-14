"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateResume = exports.deleteResume = exports.updateResume = exports.getResumeById = exports.getResumes = exports.createResume = void 0;
const Resume_1 = __importDefault(require("../models/Resume"));
const api_1 = require("../utils/api");
const mongoose_1 = __importDefault(require("mongoose"));
const clean = (value) => (typeof value === 'string' ? value.trim() : '');
const cleanStringArray = (value) => Array.isArray(value) ? value.map((item) => clean(item)).filter(Boolean) : [];
const normalizeResumePayload = (body) => ({
    title: clean(body.title),
    template: clean(body.template) || 'modern',
    personalInfo: {
        fullname: clean(body.personalInfo?.fullname),
        email: clean(body.personalInfo?.email),
        phone: clean(body.personalInfo?.phone),
        location: clean(body.personalInfo?.location),
        linkedin: clean(body.personalInfo?.linkedin),
        github: clean(body.personalInfo?.github),
        portfolio: clean(body.personalInfo?.portfolio),
    },
    summary: clean(body.summary),
    skills: cleanStringArray(body.skills),
    experience: Array.isArray(body.experience)
        ? body.experience.map((item) => ({
            company: clean(item?.company),
            role: clean(item?.role),
            startDate: clean(item?.startDate),
            endDate: clean(item?.endDate) || 'Present',
            description: cleanStringArray(item?.description),
        }))
        : [],
    education: Array.isArray(body.education)
        ? body.education.map((item) => ({
            institution: clean(item?.institution),
            degree: clean(item?.degree),
            startDate: clean(item?.startDate),
            endDate: clean(item?.endDate),
            score: clean(item?.score),
        }))
        : [],
    projects: Array.isArray(body.projects)
        ? body.projects.map((item) => ({
            title: clean(item?.title),
            description: cleanStringArray(item?.description),
            link: clean(item?.link),
        }))
        : [],
    certifications: cleanStringArray(body.certifications),
});
const createResume = async (req, res) => {
    try {
        const resume = await Resume_1.default.create({
            ...normalizeResumePayload(req.body),
            user: req.user?.id,
        });
        res.status(201).json((0, api_1.success)(resume, 'Resume created successfully'));
    }
    catch (error) {
        console.error('CREATE RESUME ERROR:', error);
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(400).json((0, api_1.fail)(Object.values(error.errors)
                .map((e) => e.message)
                .join(', ') || 'Validation failed'));
        }
        return res.status(500).json((0, api_1.fail)('Failed to create resume'));
    }
};
exports.createResume = createResume;
const getResumes = async (req, res) => {
    const resumes = await Resume_1.default.find({ user: req.user?.id }).sort({ updatedAt: -1 });
    res.json((0, api_1.success)(resumes, 'Resumes fetched successfully'));
};
exports.getResumes = getResumes;
const getResumeById = async (req, res) => {
    const resume = await Resume_1.default.findOne({ _id: req.params.id, user: req.user?.id });
    if (!resume)
        return res.status(404).json((0, api_1.fail)('Resume not found!'));
    res.json((0, api_1.success)(resume, 'Resume fetched successfully'));
};
exports.getResumeById = getResumeById;
const updateResume = async (req, res) => {
    try {
        const resume = await Resume_1.default.findOneAndUpdate({ _id: req.params.id, user: req.user?.id }, { $set: normalizeResumePayload(req.body) }, { new: true, runValidators: true });
        if (!resume)
            return res.status(404).json((0, api_1.fail)('Resume not found!'));
        res.json((0, api_1.success)(resume, 'Resume updated successfully'));
    }
    catch (error) {
        console.error('UPDATE RESUME ERROR:', error);
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(400).json((0, api_1.fail)(Object.values(error.errors)
                .map((e) => e.message)
                .join(', ') || 'Validation failed'));
        }
        return res.status(500).json((0, api_1.fail)('Failed to update resume'));
    }
};
exports.updateResume = updateResume;
const deleteResume = async (req, res) => {
    const resume = await Resume_1.default.findOneAndDelete({ _id: req.params.id, user: req.user?.id });
    if (!resume)
        return res.status(404).json((0, api_1.fail)('Resume not found!'));
    res.json((0, api_1.success)(resume, 'Resume Deleted successfully'));
};
exports.deleteResume = deleteResume;
const duplicateResume = async (req, res) => {
    const resume = await Resume_1.default.findOne({ _id: req.params.id, user: req.user?.id });
    if (!resume)
        return res.status(404).json((0, api_1.fail)('Resume not found!'));
    const original = resume.toObject();
    const cloned = await Resume_1.default.create({
        ...normalizeResumePayload(original),
        title: `${resume.title} copy`,
        user: req.user?.id,
    });
    res.status(201).json((0, api_1.success)(cloned, 'Resume Duplicated successfully'));
};
exports.duplicateResume = duplicateResume;
