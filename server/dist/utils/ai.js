"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.improveSummaryAI = improveSummaryAI;
exports.improveExperienceAI = improveExperienceAI;
exports.generateProjectAI = generateProjectAI;
exports.tailorResumeAI = tailorResumeAI;
exports.buildResumeAI = buildResumeAI;
exports.atsAnalysisAI = atsAnalysisAI;
exports.skillGapAI = skillGapAI;
const ollama_1 = __importDefault(require("ollama"));
function cleanText(input) {
    return input.replace(/```json/gi, '').replace(/```/g, '').trim();
}
function repairJson(input) {
    let text = input.trim();
    const firstBrace = text.indexOf('{');
    const firstBracket = text.indexOf('[');
    let start = -1;
    if (firstBrace === -1)
        start = firstBracket;
    else if (firstBracket === -1)
        start = firstBrace;
    else
        start = Math.min(firstBrace, firstBracket);
    if (start > 0) {
        text = text.slice(start);
    }
    let result = '';
    const stack = [];
    let inString = false;
    let escaped = false;
    for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        result += char;
        if (inString) {
            if (escaped)
                escaped = false;
            else if (char === '\\')
                escaped = true;
            else if (char === '"')
                inString = false;
            continue;
        }
        if (char === '"') {
            inString = true;
            continue;
        }
        if (char === '{') {
            stack.push('}');
            continue;
        }
        if (char === '[') {
            stack.push(']');
            continue;
        }
        if (char === '}' || char === ']') {
            if (stack.length > 0 && stack[stack.length - 1] === char) {
                stack.pop();
            }
        }
    }
    if (inString) {
        result += '"';
    }
    while (stack.length > 0) {
        result += stack.pop();
    }
    return result;
}
function extractJsonBlocks(input) {
    const blocks = [];
    const stack = [];
    let start = -1;
    let inString = false;
    let escaped = false;
    for (let i = 0; i < input.length; i += 1) {
        const char = input[i];
        if (inString) {
            if (escaped)
                escaped = false;
            else if (char === '\\')
                escaped = true;
            else if (char === '"')
                inString = false;
            continue;
        }
        if (char === '"') {
            inString = true;
            continue;
        }
        if (char === '{' || char === '[') {
            if (stack.length === 0) {
                start = i;
            }
            stack.push(char);
            continue;
        }
        if (char === '}' || char === ']') {
            if (stack.length === 0)
                continue;
            const last = stack[stack.length - 1];
            const matches = (last === '{' && char === '}') || (last === '[' && char === ']');
            if (!matches)
                continue;
            stack.pop();
            if (stack.length === 0 && start !== -1) {
                blocks.push(input.slice(start, i + 1));
                start = -1;
            }
        }
    }
    return blocks;
}
function safeParseJson(block) {
    try {
        return JSON.parse(block);
    }
    catch {
        return null;
    }
}
function tryParseWithRepair(input) {
    const direct = safeParseJson(input);
    if (direct !== null)
        return direct;
    const repaired = repairJson(input);
    return safeParseJson(repaired);
}
function extractStringArray(items) {
    return items
        .map((item) => {
        if (typeof item === 'string')
            return item.trim();
        if (item && typeof item === 'object') {
            const obj = item;
            for (const key of ['bullet', 'text', 'content', 'suggestion', 'name', 'title']) {
                if (typeof obj[key] === 'string')
                    return obj[key].trim();
            }
        }
        return '';
    })
        .filter(Boolean);
}
function uniq(items) {
    const seen = new Set();
    const out = [];
    for (const item of items) {
        const key = item.toLowerCase().replace(/\s+/g, ' ').trim();
        if (!key || seen.has(key))
            continue;
        seen.add(key);
        out.push(item.trim());
    }
    return out;
}
function normalizePhrase(value) {
    return value
        .toLowerCase()
        .replace(/\([^)]*\)/g, ' ')
        .replace(/[^a-z0-9+#.\-/ ]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
function containsPhrase(text, phrase) {
    const t = normalizePhrase(text);
    const p = normalizePhrase(phrase);
    if (!p)
        return false;
    if (p.includes('.')) {
        return t.includes(p.replace(/\./g, '')) || t.includes(p);
    }
    return t.includes(p);
}
function extractCandidatePhrases(text) {
    const normalized = text
        .replace(/\n/g, ' ')
        .replace(/[•·▪●]/g, '.')
        .replace(/\s+/g, ' ');
    const rawChunks = normalized
        .split(/[.;:|\u2022\n]+/g)
        .map((s) => s.trim())
        .filter(Boolean);
    const phrases = [];
    for (const chunk of rawChunks) {
        const compact = normalizePhrase(chunk);
        if (!compact)
            continue;
        const wordCount = compact.split(' ').length;
        if (wordCount <= 6) {
            phrases.push(compact);
            continue;
        }
        const tokens = compact.split(' ');
        for (let i = 0; i < tokens.length - 1; i += 1) {
            const span2 = `${tokens[i]} ${tokens[i + 1]}`;
            if (span2.length > 3)
                phrases.push(span2);
        }
        for (let i = 0; i < tokens.length - 2; i += 1) {
            const span3 = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
            if (span3.length > 6)
                phrases.push(span3);
        }
    }
    return uniq(phrases).filter((p) => p.length >= 3).filter((p) => !/^\d+$/.test(p));
}
const HARD_SKILLS = [
    'java', 'python', 'r', 'javascript', 'typescript', 'react', 'react.js', 'node.js', 'express.js',
    'mongodb', 'mysql', 'sql', 'html', 'html5', 'css', 'css3', 'rest api', 'rest apis', 'jwt',
    'authentication', 'authorization', 'database design', 'web application architecture', 'full-stack development',
    'frontend', 'backend', 'data visualization', 'git', 'docker', 'aws', 'spring', 'spring boot'
];
const SOFT_SKILLS = [
    'communication', 'teamwork', 'collaboration', 'problem solving', 'debugging', 'leadership',
    'adaptability', 'critical thinking', 'time management', 'cross-functional', 'stakeholder', 'mentoring'
];
const SUPPORT_PHRASES = [
    'scalable applications', 'scalable web applications', 'responsive design', 'responsive frontend',
    'crud operations', 'role-based access', 'secure authentication', 'real-time', 'restful apis',
    'api development', 'inventory management', 'seat selection', 'payment integration', 'project management'
];
function collectMatches(text, candidates) {
    const found = [];
    for (const item of candidates) {
        if (containsPhrase(text, item))
            found.push(item);
    }
    return uniq(found);
}
function deriveAnalysis(resumeText, jobDescription, targetRole) {
    const resumeLower = normalizePhrase(resumeText);
    const jdLower = normalizePhrase(jobDescription);
    const jdHard = collectMatches(jdLower, HARD_SKILLS);
    const jdSoft = collectMatches(jdLower, SOFT_SKILLS);
    const jdSupport = collectMatches(jdLower, SUPPORT_PHRASES);
    const jdPhrases = extractCandidatePhrases(jobDescription);
    const resumeHard = collectMatches(resumeLower, HARD_SKILLS);
    const resumeSoft = collectMatches(resumeLower, SOFT_SKILLS);
    const resumeSupport = collectMatches(resumeLower, SUPPORT_PHRASES);
    const jdKeywords = uniq([
        ...jdHard,
        ...jdSupport,
        ...jdSoft,
        ...jdPhrases.filter((p) => p.split(' ').length <= 4),
        ...(targetRole ? [targetRole] : []),
    ]);
    const matchedKeywords = uniq(jdKeywords.filter((kw) => containsPhrase(resumeLower, kw)));
    const missingKeywords = uniq(jdKeywords.filter((kw) => !containsPhrase(resumeLower, kw)));
    const hardMatched = jdHard.filter((kw) => containsPhrase(resumeLower, kw)).length;
    const hardTotal = Math.max(1, jdHard.length);
    const supportMatched = jdSupport.filter((kw) => containsPhrase(resumeLower, kw)).length;
    const supportTotal = Math.max(1, jdSupport.length);
    const softMatched = jdSoft.filter((kw) => containsPhrase(resumeLower, kw)).length;
    const softTotal = Math.max(1, jdSoft.length);
    const phraseOverlap = jdPhrases.filter((p) => containsPhrase(resumeLower, p)).length;
    const phraseTotal = Math.max(1, jdPhrases.length);
    const hardRatio = hardMatched / hardTotal;
    const supportRatio = supportMatched / supportTotal;
    const softRatio = softMatched / softTotal;
    const phraseRatio = phraseOverlap / phraseTotal;
    const resumeHasProjects = /project|built|developed|implemented|created|designed/i.test(resumeText);
    const resumeHasEducation = /education|cgpa|percentage|bachelor|degree|college/i.test(resumeText);
    const resumeHasSkills = /skills|technical skills|frontend technologies|backend technologies|databases/i.test(resumeText);
    const resumeHasATSCore = hardMatched >= 5 || supportMatched >= 4;
    let score = hardRatio * 45 +
        supportRatio * 20 +
        softRatio * 10 +
        phraseRatio * 15 +
        (resumeHasProjects ? 5 : 0) +
        (resumeHasEducation ? 2 : 0) +
        (resumeHasSkills ? 3 : 0);
    if (resumeHasATSCore)
        score += 5;
    if (matchedKeywords.length >= 12)
        score += 5;
    if (missingKeywords.length === 0 && jdKeywords.length > 0)
        score += 5;
    if (score < 25 && matchedKeywords.length >= 8)
        score = 35 + matchedKeywords.length;
    if (score < 40 && hardMatched >= 6)
        score = Math.max(score, 52);
    if (score > 100)
        score = 100;
    score = Math.round(score);
    const strengths = [];
    if (hardMatched >= 4)
        strengths.push(`Strong alignment with core technical skills: ${uniq(jdHard.filter((kw) => containsPhrase(resumeLower, kw))).slice(0, 5).join(', ')}.`);
    if (resumeHasProjects)
        strengths.push('Projects provide strong evidence of hands-on implementation and delivery.');
    if (resumeHasEducation)
        strengths.push('Education section is present and clearly structured.');
    if (resumeHasSkills)
        strengths.push('Skills section is well organized for ATS scanning.');
    if (resumeHasATSCore)
        strengths.push('Resume demonstrates the core stack and applied development work expected for the role.');
    const weakSections = [];
    if (missingKeywords.some((k) => /team|collabor|communication|cross-functional|stakeholder/i.test(k)))
        weakSections.push('Soft-skill evidence can be made more explicit with teamwork and collaboration examples.');
    if (missingKeywords.some((k) => /scal|architecture|system|api|testing|deployment/i.test(k)))
        weakSections.push('Add more detail around architecture, scaling, testing, or deployment impact.');
    if (missingKeywords.some((k) => /lead|ownership|impact|metric|result/i.test(k)))
        weakSections.push('Add measurable outcomes, leadership, and impact metrics to experience bullets.');
    if (!weakSections.length)
        weakSections.push('Improve keyword coverage in experience bullets and project descriptions for better ATS match.');
    const actionChecklist = [];
    const prioritySet = [...missingKeywords, ...jdSupport, ...jdHard].filter(Boolean);
    for (const item of prioritySet) {
        if (/java|python|javascript|typescript|react|node|express|mongodb|mysql|sql/i.test(item)) {
            actionChecklist.push(`Mention ${item} in a project or experience bullet with concrete usage.`);
        }
    }
    if (actionChecklist.length < 3) {
        actionChecklist.push('Add one metric-driven bullet under each major project.');
        actionChecklist.push('Mirror the exact keywords from the job description in relevant sections.');
        actionChecklist.push('Keep the skills section focused on the top 10 to 15 most relevant terms.');
    }
    const roleFitSummary = score >= 80
        ? 'Strong fit. The resume covers most core skills, supports them with projects, and shows solid role alignment.'
        : score >= 60
            ? 'Moderate fit. The resume covers several key requirements, but stronger keyword alignment and role-specific evidence would help.'
            : 'Needs improvement. The resume should better mirror the job description keywords, core skills, and role-specific outcomes.';
    const filteredMatched = uniq(matchedKeywords);
    const filteredMissing = uniq(missingKeywords.filter((kw) => !filteredMatched.some((m) => normalizePhrase(m) === normalizePhrase(kw))));
    return {
        score,
        matchedKeywords: filteredMatched,
        missingKeywords: filteredMissing,
        strengths: uniq(strengths),
        weakSections: uniq(weakSections),
        actionChecklist: uniq(actionChecklist),
        roleFitSummary,
    };
}
function normalizeImproveSummary(value) {
    if (typeof value === 'string' && value.trim()) {
        return { suggestion: value.trim() };
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        const obj = value;
        if (typeof obj.suggestion === 'string')
            return { suggestion: obj.suggestion.trim() };
        if (typeof obj.summary === 'string')
            return { suggestion: obj.summary.trim() };
        if (typeof obj.improvedSummary === 'string')
            return { suggestion: obj.improvedSummary.trim() };
    }
    return null;
}
function normalizeSuggestions(value) {
    if (Array.isArray(value)) {
        const suggestions = extractStringArray(value);
        if (suggestions.length > 0)
            return { suggestions };
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        const obj = value;
        for (const key of ['suggestions', 'experience', 'projects', 'bullets']) {
            if (Array.isArray(obj[key])) {
                const suggestions = extractStringArray(obj[key]);
                if (suggestions.length > 0)
                    return { suggestions };
            }
        }
    }
    return null;
}
function normalizeTailorResume(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        return null;
    const obj = value;
    return {
        improvedSummary: typeof obj.improvedSummary === 'string'
            ? obj.improvedSummary.trim()
            : typeof obj.summary === 'string'
                ? obj.summary.trim()
                : '',
        keywordSuggestions: Array.isArray(obj.keywordSuggestions)
            ? extractStringArray(obj.keywordSuggestions)
            : Array.isArray(obj.keywords)
                ? extractStringArray(obj.keywords)
                : [],
        missingSkills: Array.isArray(obj.missingSkills)
            ? extractStringArray(obj.missingSkills)
            : Array.isArray(obj.skillsMissing)
                ? extractStringArray(obj.skillsMissing)
                : [],
        improvedBullets: Array.isArray(obj.improvedBullets)
            ? extractStringArray(obj.improvedBullets)
            : Array.isArray(obj.bullets)
                ? extractStringArray(obj.bullets)
                : [],
    };
}
function normalizeBuildResume(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        return null;
    const obj = value;
    const personalInfoRaw = obj.personalInfo && typeof obj.personalInfo === 'object' && !Array.isArray(obj.personalInfo)
        ? obj.personalInfo
        : {};
    const experience = Array.isArray(obj.experience)
        ? obj.experience.map((item) => {
            const exp = (item || {});
            return {
                company: typeof exp.company === 'string' ? exp.company.trim() : '',
                role: typeof exp.role === 'string' ? exp.role.trim() : '',
                startDate: typeof exp.startDate === 'string' ? exp.startDate.trim() : '',
                endDate: typeof exp.endDate === 'string' ? exp.endDate.trim() : '',
                description: Array.isArray(exp.description) ? extractStringArray(exp.description).slice(0, 3) : [],
            };
        })
        : [];
    const projects = Array.isArray(obj.projects)
        ? obj.projects.map((item) => {
            const project = (item || {});
            return {
                title: typeof project.title === 'string' ? project.title.trim() : '',
                description: Array.isArray(project.description) ? extractStringArray(project.description).slice(0, 3) : [],
                link: typeof project.link === 'string' ? project.link.trim() : '',
            };
        })
        : [];
    const education = Array.isArray(obj.education)
        ? obj.education.map((item) => {
            const edu = (item || {});
            return {
                institution: typeof edu.institution === 'string' ? edu.institution.trim() : '',
                degree: typeof edu.degree === 'string' ? edu.degree.trim() : '',
                startDate: typeof edu.startDate === 'string' ? edu.startDate.trim() : '',
                endDate: typeof edu.endDate === 'string' ? edu.endDate.trim() : '',
                score: typeof edu.score === 'string' ? edu.score.trim() : '',
            };
        })
        : [];
    return {
        title: typeof obj.title === 'string' && obj.title.trim() ? obj.title.trim() : 'AI Generated Resume',
        template: typeof obj.template === 'string' && obj.template.trim() ? obj.template.trim() : 'modern',
        mode: obj.mode === 'student' || obj.mode === 'professional'
            ? obj.mode
            : 'student',
        personalInfo: {
            fullname: typeof personalInfoRaw.fullname === 'string' ? personalInfoRaw.fullname.trim() : '',
            email: typeof personalInfoRaw.email === 'string' ? personalInfoRaw.email.trim() : '',
            phone: typeof personalInfoRaw.phone === 'string' ? personalInfoRaw.phone.trim() : '',
            location: typeof personalInfoRaw.location === 'string' ? personalInfoRaw.location.trim() : '',
            linkedin: typeof personalInfoRaw.linkedin === 'string' ? personalInfoRaw.linkedin.trim() : '',
            github: typeof personalInfoRaw.github === 'string' ? personalInfoRaw.github.trim() : '',
            portfolio: typeof personalInfoRaw.portfolio === 'string' ? personalInfoRaw.portfolio.trim() : '',
        },
        summary: typeof obj.summary === 'string' ? obj.summary.trim() : '',
        skills: Array.isArray(obj.skills) ? extractStringArray(obj.skills) : [],
        experience,
        projects,
        education,
        certifications: Array.isArray(obj.certifications) ? extractStringArray(obj.certifications) : [],
        achievements: Array.isArray(obj.achievements) ? extractStringArray(obj.achievements) : [],
        extracurriculars: Array.isArray(obj.extracurriculars) ? extractStringArray(obj.extracurriculars) : [],
        coursework: Array.isArray(obj.coursework) ? extractStringArray(obj.coursework) : [],
    };
}
function normalizeAtsAnalysis(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        return null;
    const obj = value;
    const rawScore = typeof obj.score === 'number' ? obj.score : typeof obj.score === 'string' ? Number(obj.score) : 0;
    return {
        score: Number.isFinite(rawScore) ? Math.max(0, Math.min(100, Math.round(rawScore))) : 0,
        matchedKeywords: Array.isArray(obj.matchedKeywords) ? extractStringArray(obj.matchedKeywords) : [],
        missingKeywords: Array.isArray(obj.missingKeywords) ? extractStringArray(obj.missingKeywords) : [],
        strengths: Array.isArray(obj.strengths) ? extractStringArray(obj.strengths) : [],
        weakSections: Array.isArray(obj.weakSections) ? extractStringArray(obj.weakSections) : [],
        actionChecklist: Array.isArray(obj.actionChecklist) ? extractStringArray(obj.actionChecklist) : [],
        roleFitSummary: typeof obj.roleFitSummary === 'string' ? obj.roleFitSummary : '',
    };
}
function normalizeSkillGap(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        return null;
    const obj = value;
    return {
        missingHardSkills: Array.isArray(obj.missingHardSkills) ? extractStringArray(obj.missingHardSkills) : [],
        missingSoftSkills: Array.isArray(obj.missingSoftSkills) ? extractStringArray(obj.missingSoftSkills) : [],
        suggestedKeywords: Array.isArray(obj.suggestedKeywords) ? extractStringArray(obj.suggestedKeywords) : [],
        learningPriority: Array.isArray(obj.learningPriority) ? extractStringArray(obj.learningPriority) : [],
    };
}
function parseAndNormalize(rawText, mode) {
    const cleaned = cleanText(rawText);
    const candidates = [];
    const direct = tryParseWithRepair(cleaned);
    if (direct !== null)
        candidates.push(direct);
    const blocks = extractJsonBlocks(cleaned);
    for (const block of blocks) {
        const parsed = tryParseWithRepair(block);
        if (parsed !== null)
            candidates.push(parsed);
    }
    if (candidates.length === 0) {
        console.error('Raw Ollama output:', cleaned);
        throw new Error('Failed to parse Ollama response');
    }
    for (const parsed of candidates) {
        if (mode === 'summary') {
            const normalized = normalizeImproveSummary(parsed);
            if (normalized)
                return normalized;
        }
        if (mode === 'experience' || mode === 'project') {
            const normalized = normalizeSuggestions(parsed);
            if (normalized)
                return normalized;
        }
        if (mode === 'tailor') {
            const normalized = normalizeTailorResume(parsed);
            if (normalized)
                return normalized;
        }
        if (mode === 'build-resume') {
            const normalized = normalizeBuildResume(parsed);
            if (normalized)
                return normalized;
        }
        if (mode === 'ats-analysis') {
            const normalized = normalizeAtsAnalysis(parsed);
            if (normalized)
                return normalized;
        }
        if (mode === 'skill-gap') {
            const normalized = normalizeSkillGap(parsed);
            if (normalized)
                return normalized;
        }
    }
    console.error('Raw Ollama output:', cleaned);
    throw new Error('Failed to normalize Ollama response');
}
async function generateOllama(prompt, mode) {
    const response = await ollama_1.default.chat({
        model: 'llama3',
        messages: [
            {
                role: 'user',
                content: `${prompt}

STRICT RULES:
- Output MUST be valid JSON
- NO explanation
- NO markdown
- Return ONLY one JSON block
- Follow the exact schema`,
            },
        ],
        options: {
            temperature: 0.2,
        },
    });
    const text = response.message.content || '';
    return parseAndNormalize(text, mode);
}
async function runJSON(prompt, mode) {
    return generateOllama(prompt, mode);
}
async function improveSummaryAI(input) {
    const prompt = `
You are an expert resume writing assistant.
Rewrite the following professional summary to be sharper, ATS-friendly, and results-oriented.
Keep it concise and realistic.


Tone: ${input.tone || 'professional'}
Target job title: ${input.jobTitle || 'Not provided'}


Summary:
${input.summary}


Return JSON only:
{
  "suggestion": "string"
}
`;
    return runJSON(prompt, 'summary');
}
async function improveExperienceAI(input) {
    const prompt = `
You are an expert resume coach.
Rewrite these experience bullet points with stronger action verbs, measurable impact where possible, and ATS-friendly phrasing.
Keep each bullet concise and professional.
Return 3 to 5 bullet suggestions.


Job title: ${input.jobTitle}
Company: ${input.company || 'Not provided'}
Target role: ${input.targetRole || 'Not provided'}


Bullets:
${input.bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}


Return JSON only:
{
  "suggestions": ["string", "string", "string"]
}
`;
    return runJSON(prompt, 'experience');
}
async function generateProjectAI(input) {
    const prompt = `
You are an expert resume writer.
Generate 3 strong resume-ready project bullet points.


Project name: ${input.projectName}
Project type: ${input.projectType || 'Not provided'}
Tech stack: ${input.techStack.join(', ')}
Target role: ${input.targetRole || 'Not provided'}


Return JSON only:
{
  "suggestions": ["string", "string", "string"]
}
`;
    return runJSON(prompt, 'project');
}
async function tailorResumeAI(input) {
    const prompt = `
You are an ATS resume optimization assistant.
Analyze the resume against the job description and suggest realistic improvements.


Resume:
${input.resumeText}


Job description:
${input.jobDescription}


Return JSON only:
{
  "improvedSummary": "string",
  "keywordSuggestions": ["string"],
  "missingSkills": ["string"],
  "improvedBullets": ["string"]
}
`;
    return runJSON(prompt, 'tailor');
}
async function buildResumeAI(input) {
    const prompt = `
You are an expert AI resume writer and hiring-focused career assistant.
Create a complete, ATS-friendly, job-ready resume in JSON only.


Rules:
- Write a strong professional title specific to the target role.
- Write a recruiter-friendly summary with measurable tone, strong wording, and clear positioning.
- Generate a realistic skills list aligned to the role and user input.
- Generate complete education entries if input hints are present.
- Generate complete work experience entries with strong, outcome-focused bullet points.
- Generate complete project entries with strong, technical, resume-ready bullet points.
- Use standard section naming and ATS-friendly wording.
- Keep every experience/project description to 3 bullets maximum.
- Do not leave major sections empty if enough input exists.
- If candidate is more student-focused, produce strong student-quality content.
- If job description is provided, align keywords naturally.


Candidate details:
Requested title: ${input.title || ''}
Requested template: ${input.template || 'modern'}
Mode: ${input.mode || 'student'}


Personal info:
Full name: ${input.personalInfo.fullname}
Email: ${input.personalInfo.email || ''}
Phone: ${input.personalInfo.phone || ''}
Location: ${input.personalInfo.location || ''}
LinkedIn: ${input.personalInfo.linkedin || ''}
GitHub: ${input.personalInfo.github || ''}
Portfolio: ${input.personalInfo.portfolio || ''}


Target role: ${input.targetRole}
Years of experience: ${input.yearsOfExperience}
Skills: ${input.skills.join(', ')}


Education input:
${(input.education || []).join('\n')}


Project input:
${(input.projects || []).join('\n')}


Work experience input:
${(input.workExperience || []).join('\n')}


Certifications input:
${(input.certifications || []).join('\n')}


Achievements input:
${(input.achievements || []).join('\n')}


Extracurriculars input:
${(input.extracurriculars || []).join('\n')}


Coursework input:
${(input.coursework || []).join('\n')}


Job description:
${input.jobDescription || 'Not provided'}


Return JSON only with exactly this shape:
{
  "title": "string",
  "template": "string",
  "mode": "student",
  "personalInfo": {
    "fullname": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "github": "string",
    "portfolio": "string"
  },
  "summary": "string",
  "skills": ["string"],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "startDate": "string",
      "endDate": "string",
      "description": ["string", "string", "string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "startDate": "string",
      "endDate": "string",
      "score": "string"
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": ["string", "string", "string"],
      "link": "string"
    }
  ],
  "certifications": ["string"],
  "achievements": ["string"],
  "extracurriculars": ["string"],
  "coursework": ["string"]
}
`;
    return runJSON(prompt, 'build-resume');
}
async function atsAnalysisAI(input) {
    const derived = deriveAnalysis(input.resumeText, input.jobDescription);
    const prompt = `
You are an expert ATS resume analyzer.
Use the following deterministic analysis as the source of truth and improve wording only if needed.
Do not invent new keywords that are not in the job description.
Preserve the score unless you have a compelling reason.

Deterministic analysis JSON:
${JSON.stringify({
        score: derived.score,
        matchedKeywords: derived.matchedKeywords,
        missingKeywords: derived.missingKeywords,
        strengths: derived.strengths,
        weakSections: derived.weakSections,
        actionChecklist: derived.actionChecklist,
        roleFitSummary: derived.roleFitSummary,
    }, null, 2)}

Resume:
${input.resumeText}

Job description:
${input.jobDescription}

Return JSON only:
{
  "score": 0,
  "matchedKeywords": ["string"],
  "missingKeywords": ["string"],
  "strengths": ["string"],
  "weakSections": ["string"],
  "actionChecklist": ["string"],
  "roleFitSummary": "string"
}
`;
    try {
        const ai = await runJSON(prompt, 'ats-analysis');
        const mergedMatched = uniq([...derived.matchedKeywords, ...(ai.matchedKeywords || [])]);
        const mergedMissing = uniq([
            ...derived.missingKeywords,
            ...(ai.missingKeywords || []).filter((kw) => !mergedMatched.some((m) => normalizePhrase(m) === normalizePhrase(kw))),
        ]);
        const mergedStrengths = uniq([...(ai.strengths || []), ...derived.strengths]);
        const mergedWeak = uniq([...(ai.weakSections || []), ...derived.weakSections]);
        const mergedChecklist = uniq([...(ai.actionChecklist || []), ...derived.actionChecklist]);
        const score = Math.max(derived.score, ai.score || 0);
        return {
            score: Math.max(0, Math.min(100, Math.round(score))),
            matchedKeywords: mergedMatched,
            missingKeywords: mergedMissing,
            strengths: mergedStrengths,
            weakSections: mergedWeak,
            actionChecklist: mergedChecklist,
            roleFitSummary: ai.roleFitSummary?.trim() || derived.roleFitSummary,
        };
    }
    catch {
        return {
            score: derived.score,
            matchedKeywords: derived.matchedKeywords,
            missingKeywords: derived.missingKeywords,
            strengths: derived.strengths,
            weakSections: derived.weakSections,
            actionChecklist: derived.actionChecklist,
            roleFitSummary: derived.roleFitSummary,
        };
    }
}
async function skillGapAI(input) {
    const role = input.targetRole || '';
    const jd = input.jobDescription || '';
    const derived = deriveAnalysis(input.resumeText, jd || role);
    const hard = uniq([
        ...derived.missingKeywords.filter((k) => HARD_SKILLS.some((h) => normalizePhrase(k).includes(normalizePhrase(h)) || normalizePhrase(h).includes(normalizePhrase(k)))),
        ...HARD_SKILLS.filter((k) => !containsPhrase(input.resumeText, k) && (jd ? containsPhrase(jd, k) : true)),
    ]);
    const soft = uniq([
        ...derived.missingKeywords.filter((k) => SOFT_SKILLS.some((s) => normalizePhrase(k).includes(normalizePhrase(s)) || normalizePhrase(s).includes(normalizePhrase(k)))),
        ...SOFT_SKILLS.filter((k) => !containsPhrase(input.resumeText, k) && (jd ? containsPhrase(jd, k) : true)),
    ]);
    const suggested = uniq([
        ...derived.matchedKeywords.slice(0, 10),
        ...derived.missingKeywords.slice(0, 15),
        ...(role ? [role] : []),
    ]);
    const learningPriority = uniq([
        ...hard.slice(0, 6),
        ...soft.slice(0, 4),
        ...SUPPORT_PHRASES.filter((k) => !containsPhrase(input.resumeText, k)).slice(0, 5),
    ]);
    return {
        missingHardSkills: hard,
        missingSoftSkills: soft,
        suggestedKeywords: suggested,
        learningPriority,
    };
}
