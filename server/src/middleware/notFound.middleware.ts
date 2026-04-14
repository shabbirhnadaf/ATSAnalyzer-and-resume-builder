import { Request, Response } from "express";
import { fail } from "../utils/api";

export default function notFound(req: Request, res: Response) {
    res.status(404).json(fail(`Route not found: ${req.originalUrl}`))
}