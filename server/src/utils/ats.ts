const STOP_WORDS = new Set([
    'the','a','an','and','or','for','to','of','in','on','with','is','are','as','by','at','be','this','that',
  'from','will','you','your','we','our','they','their','can','should','must','have','has','had'
]);

const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9+\s#.-]/g, ' ');

const tokenize = (text: string) => 
    normalize(text)
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 2 && !STOP_WORDS.has(t));

const unique = (arr: string[]) => [...new Set(arr)];

const extractKeyWords = (text: string) => {
    const tokens = tokenize(text);
    const freq = new Map<string, number>();
    for (const token of tokens) freq.set(token, (freq.get(token) || 0) + 1);

    return [...freq.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([token]) => token)
            .slice(0, 40);
}

export const scoreResumeAgainstJD = (resumeText: string, jobDescription: string) => {
    const jdKeywords = extractKeyWords(jobDescription);
    const resumeTokens = new Set(tokenize(resumeText));

    const mathKeywords = jdKeywords.filter((kw) => resumeTokens.has(kw));
    const missingKeywords = jdKeywords.filter((kw) => !resumeTokens.has(kw));

    const keywordScore = jdKeywords.length ? Math.round((mathKeywords.length / jdKeywords.length) * 70) : 0;

    const warnings: string[] = [];
    const suggestions: string[] = [];
    const lowerResume = resumeText.toLowerCase();

    if(!/experiance|work experience/.test(lowerResume)) warnings.push('Missing clear Experiance section');
    if(!/education/.test(lowerResume)) warnings.push('Missing clear Education section');
    if(!/skills/.test(lowerResume)) warnings.push('Missing clear Skills section');
    if(resumeText.length < 500) warnings.push('Resume content looks too short for strong ATS relevance');

    if(missingKeywords.length > 0) {
        suggestions.push(`Add relevant missing keywords such as: ${missingKeywords.slice(0, 10).join(', ')}`);
    }
    if(!/summary|profile/.test(lowerResume)) {
        suggestions.push('Add a professional summary tailored to the job description');
    }
    if(!/project|projects/.test(lowerResume)) {
        suggestions.push('Include project details if they support the target role');
    }
    
    const sectionScore = Math.max(0, 30 - warnings.length * 7);
    const score = Math.min(100, keywordScore + sectionScore);

    return {
        score,
        mathKeywords: unique(mathKeywords),
        missingKeywords: unique(missingKeywords),
        warnings,
        suggestions,
    }
}