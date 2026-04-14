import mongoose, { Document, Schema, Types } from "mongoose";

export interface IScanHistory extends Document {
    user: Types.ObjectId;
    resume?: Types.ObjectId;
    jobTitle?: string;
    companyName?: string;
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    warnings: string[];
    suggestions: string[];
}

const scanHistorySchema = new Schema<IScanHistory>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    resume: { type: Schema.Types.ObjectId, ref: 'Resume'},
    jobTitle: String,
    companyName: String,
    score: { type: Number, required: true},
    matchedKeywords: [{ type: String}],
    missingKeywords: [{ type: String }],
    warnings: [{ type: String}],
    suggestions: [{ type: String }],
    },
    { timestamps: true }
)

export default mongoose.models.ScanHistory || mongoose.model<IScanHistory>('ScanHistory', scanHistorySchema);