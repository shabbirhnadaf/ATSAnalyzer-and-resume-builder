import { Request, Response } from "express";
import { success } from "../utils/api";
import ScanHistory from "../models/ScanHistory";
import { scoreResumeAgainstJD } from "../utils/ats";

export const scanResume = async(req: Request, res: Response) => {
    const { resumeId, resumeText, jobDescription, jobTitle, companyName } = req.body;

    const result = scoreResumeAgainstJD(resumeText, jobDescription);

    const history = await ScanHistory.create({
        user: req.user?.id,
        resume: resumeId || undefined,
        jobTitle,
        companyName,
        ...result,
    });

    res.status(201).json(success({ ...result, historyId: history.id }, 'Resume scanned successfully'));
}

export const getScanHistory = async (req: Request, res: Response) => {
    const { resumeId } = req.query;

    const query: Record<string, any> = {
        user: req.user?.id,
    };

    if (resumeId) {
        query.resume = resumeId;
    }

    const scans = await ScanHistory.find(query).sort({ createdAt: -1 });

    res.json(success(scans, 'Scan history fetched successfully'));
}