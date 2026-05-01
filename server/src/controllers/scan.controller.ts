import { Request, Response } from "express";
import { success } from "../utils/api";
import ScanHistory from "../models/ScanHistory";
import { scoreResumeAgainstJD } from "../utils/ats";

function formatScan(scan: {
    id?: string;
    _id?: unknown;
    resume?: unknown;
    jobTitle?: string;
    companyName?: string;
    score: number;
    matchedKeywords?: string[];
    missingKeywords?: string[];
    strengths?: string[];
    priorityFixes?: string[];
    roleFitSummary?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}) {
    return {
        _id: scan.id || String(scan._id || ''),
        resume: scan.resume,
        jobTitle: scan.jobTitle || '',
        companyName: scan.companyName || '',
        score: scan.score,
        matchedKeywords: Array.isArray(scan.matchedKeywords) ? scan.matchedKeywords : [],
        missingKeywords: Array.isArray(scan.missingKeywords) ? scan.missingKeywords : [],
        strengths: Array.isArray(scan.strengths) ? scan.strengths : [],
        priorityFixes: Array.isArray(scan.priorityFixes) ? scan.priorityFixes : [],
        roleFitSummary: scan.roleFitSummary || '',
        createdAt: scan.createdAt,
        updatedAt: scan.updatedAt,
    };
}

export const scanResume = async(req: Request, res: Response) => {
    const { resumeId, resumeText, jobDescription, jobTitle, companyName } = req.body;

    const result = scoreResumeAgainstJD(resumeText, jobDescription, jobTitle);

    const history = await ScanHistory.create({
        user: req.user?.id,
        resume: resumeId || undefined,
        jobTitle,
        companyName,
        ...result,
    });

    res.status(201).json(success({ ...formatScan(history.toObject()), historyId: history.id }, 'Resume scanned successfully'));
}

export const getScanHistory = async (req: Request, res: Response) => {
    const resumeId =
        typeof req.params.resumeId === 'string' && req.params.resumeId
            ? req.params.resumeId
            : typeof req.query.resumeId === 'string'
            ? req.query.resumeId
            : '';

    const query: Record<string, unknown> = {
        user: req.user?.id,
    };

    if (resumeId) {
        query.resume = resumeId;
    }

    const scans = await ScanHistory.find(query).sort({ createdAt: -1 });

    res.json(success(scans.map((scan) => formatScan(scan.toObject())), 'Scan history fetched successfully'));
}
