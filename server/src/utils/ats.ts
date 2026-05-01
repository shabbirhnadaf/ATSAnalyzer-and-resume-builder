type TermCategory = 'technical' | 'practice' | 'platform' | 'soft';

type TermDefinition = {
  label: string;
  aliases: string[];
  category: TermCategory;
  weight: number;
};

type RankedTerm = {
  label: string;
  category: TermCategory;
  score: number;
};

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'for', 'to', 'of', 'in', 'on', 'with', 'is', 'are', 'as', 'by', 'at', 'be',
  'this', 'that', 'from', 'will', 'you', 'your', 'we', 'our', 'they', 'their', 'can', 'should', 'must', 'have',
  'has', 'had', 'about', 'into', 'over', 'under', 'than', 'then', 'also', 'such', 'using', 'used', 'ability',
  'preferred', 'required', 'responsibilities', 'responsibility', 'requirements', 'qualification', 'qualifications',
]);

const GENERIC_PHRASES = new Set([
  'software engineer',
  'developer',
  'engineer',
  'team player',
  'fast paced environment',
  'strong understanding',
  'good communication',
  'excellent communication',
  'relevant experience',
  'computer science',
  'bachelors degree',
  'problem solving skills',
]);

const SIGNAL_WORDS = [
  'api', 'apis', 'testing', 'deployment', 'automation', 'architecture', 'security', 'performance', 'scalable',
  'scalability', 'integration', 'debugging', 'analytics', 'analysis', 'database', 'cloud', 'frontend', 'backend',
  'full-stack', 'full stack', 'responsive', 'collaboration', 'communication', 'leadership', 'stakeholder',
  'mentoring', 'ownership', 'monitoring', 'design', 'development', 'optimization', 'accessibility',
];

const IMPACT_TERMS = [
  'improved', 'increased', 'reduced', 'optimized', 'launched', 'delivered', 'scaled', 'built', 'designed',
  'implemented', 'developed', 'automated', 'collaborated', 'led', 'migrated', 'shipped',
];

const TERM_CATALOG: TermDefinition[] = [
  { label: 'React', aliases: ['react', 'reactjs', 'react.js'], category: 'technical', weight: 10 },
  { label: 'Next.js', aliases: ['next.js', 'nextjs'], category: 'technical', weight: 10 },
  { label: 'TypeScript', aliases: ['typescript'], category: 'technical', weight: 10 },
  { label: 'JavaScript', aliases: ['javascript'], category: 'technical', weight: 10 },
  { label: 'Node.js', aliases: ['node', 'node.js', 'nodejs'], category: 'technical', weight: 10 },
  { label: 'Express.js', aliases: ['express', 'express.js', 'expressjs'], category: 'technical', weight: 9 },
  { label: 'MongoDB', aliases: ['mongodb', 'mongo db'], category: 'technical', weight: 9 },
  { label: 'PostgreSQL', aliases: ['postgresql', 'postgres'], category: 'technical', weight: 9 },
  { label: 'MySQL', aliases: ['mysql'], category: 'technical', weight: 8 },
  { label: 'SQL', aliases: ['sql', 'structured query language'], category: 'technical', weight: 8 },
  { label: 'REST APIs', aliases: ['rest api', 'rest apis', 'restful api', 'restful apis'], category: 'technical', weight: 10 },
  { label: 'GraphQL', aliases: ['graphql'], category: 'technical', weight: 8 },
  { label: 'HTML', aliases: ['html', 'html5'], category: 'technical', weight: 7 },
  { label: 'CSS', aliases: ['css', 'css3'], category: 'technical', weight: 7 },
  { label: 'Tailwind CSS', aliases: ['tailwind', 'tailwind css'], category: 'technical', weight: 8 },
  { label: 'Redux', aliases: ['redux', 'redux toolkit'], category: 'technical', weight: 7 },
  { label: 'State Management', aliases: ['state management'], category: 'practice', weight: 7 },
  { label: 'Responsive Design', aliases: ['responsive design', 'responsive ui', 'responsive frontend'], category: 'practice', weight: 8 },
  { label: 'Accessibility', aliases: ['accessibility', 'wcag', 'a11y'], category: 'practice', weight: 8 },
  { label: 'Performance Optimization', aliases: ['performance optimization', 'performance tuning', 'web performance'], category: 'practice', weight: 9 },
  { label: 'API Integration', aliases: ['api integration', 'third party integrations', 'third-party integrations'], category: 'practice', weight: 8 },
  { label: 'Authentication', aliases: ['authentication', 'auth'], category: 'practice', weight: 8 },
  { label: 'Authorization', aliases: ['authorization', 'role based access', 'role-based access'], category: 'practice', weight: 8 },
  { label: 'JWT', aliases: ['jwt', 'json web token'], category: 'technical', weight: 7 },
  { label: 'Unit Testing', aliases: ['unit testing', 'unit tests', 'jest'], category: 'practice', weight: 9 },
  { label: 'Integration Testing', aliases: ['integration testing', 'integration tests'], category: 'practice', weight: 8 },
  { label: 'End-to-End Testing', aliases: ['end-to-end testing', 'e2e testing', 'playwright', 'cypress'], category: 'practice', weight: 8 },
  { label: 'Debugging', aliases: ['debugging', 'troubleshooting'], category: 'practice', weight: 8 },
  { label: 'Agile', aliases: ['agile', 'scrum'], category: 'practice', weight: 7 },
  { label: 'Git', aliases: ['git', 'github', 'gitlab'], category: 'practice', weight: 7 },
  { label: 'CI/CD', aliases: ['ci/cd', 'ci cd', 'continuous integration', 'continuous delivery'], category: 'practice', weight: 9 },
  { label: 'Docker', aliases: ['docker', 'containerization'], category: 'platform', weight: 9 },
  { label: 'Kubernetes', aliases: ['kubernetes', 'k8s'], category: 'platform', weight: 9 },
  { label: 'AWS', aliases: ['aws', 'amazon web services'], category: 'platform', weight: 9 },
  { label: 'Azure', aliases: ['azure'], category: 'platform', weight: 8 },
  { label: 'Google Cloud', aliases: ['gcp', 'google cloud', 'google cloud platform'], category: 'platform', weight: 8 },
  { label: 'Linux', aliases: ['linux'], category: 'platform', weight: 7 },
  { label: 'Redis', aliases: ['redis'], category: 'technical', weight: 7 },
  { label: 'Microservices', aliases: ['microservices', 'microservice architecture'], category: 'practice', weight: 9 },
  { label: 'System Design', aliases: ['system design', 'architecture design', 'software architecture'], category: 'practice', weight: 9 },
  { label: 'Scalable Applications', aliases: ['scalable applications', 'scalable systems', 'scalable web applications'], category: 'practice', weight: 9 },
  { label: 'Database Design', aliases: ['database design', 'schema design', 'data modeling'], category: 'practice', weight: 8 },
  { label: 'Deployment', aliases: ['deployment', 'release management'], category: 'practice', weight: 8 },
  { label: 'Monitoring', aliases: ['monitoring', 'observability', 'logging'], category: 'practice', weight: 8 },
  { label: 'Security', aliases: ['security', 'application security', 'secure coding'], category: 'practice', weight: 8 },
  { label: 'Automation', aliases: ['automation', 'process automation'], category: 'practice', weight: 8 },
  { label: 'Documentation', aliases: ['documentation', 'technical documentation'], category: 'practice', weight: 6 },
  { label: 'Figma', aliases: ['figma'], category: 'technical', weight: 6 },
  { label: 'UI/UX', aliases: ['ui/ux', 'ux', 'user experience', 'user interface'], category: 'practice', weight: 7 },
  { label: 'Communication', aliases: ['communication', 'verbal communication', 'written communication'], category: 'soft', weight: 7 },
  { label: 'Team Collaboration', aliases: ['team collaboration', 'collaboration', 'teamwork', 'cross-functional collaboration'], category: 'soft', weight: 8 },
  { label: 'Problem Solving', aliases: ['problem solving', 'problem-solving'], category: 'soft', weight: 8 },
  { label: 'Leadership', aliases: ['leadership', 'leading teams'], category: 'soft', weight: 7 },
  { label: 'Ownership', aliases: ['ownership', 'accountability'], category: 'soft', weight: 7 },
  { label: 'Stakeholder Management', aliases: ['stakeholder management', 'stakeholder communication', 'stakeholders'], category: 'soft', weight: 7 },
  { label: 'Mentoring', aliases: ['mentoring', 'coaching'], category: 'soft', weight: 6 },
  { label: 'Frontend Development', aliases: ['frontend development', 'front-end development', 'frontend'], category: 'practice', weight: 8 },
  { label: 'Backend Development', aliases: ['backend development', 'back-end development', 'backend'], category: 'practice', weight: 8 },
  { label: 'Full-Stack Development', aliases: ['full stack', 'full-stack development', 'fullstack'], category: 'practice', weight: 8 },
  { label: 'Python', aliases: ['python'], category: 'technical', weight: 8 },
  { label: 'Java', aliases: ['java'], category: 'technical', weight: 8 },
  { label: 'C++', aliases: ['c++', 'cpp'], category: 'technical', weight: 7 },
  { label: 'Spring Boot', aliases: ['spring boot'], category: 'technical', weight: 7 },
  { label: 'Laravel', aliases: ['laravel'], category: 'technical', weight: 7 },
  { label: 'Payment Integration', aliases: ['payment integration', 'payments'], category: 'practice', weight: 7 },
  { label: 'Real-Time Systems', aliases: ['real-time systems', 'real time systems', 'websockets', 'socket.io'], category: 'practice', weight: 7 },
];

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9+#./\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const titleCase = (phrase: string) =>
  phrase
    .split(' ')
    .filter(Boolean)
    .map((word) => {
      if (/^(api|apis|sql|aws|jwt|ci\/cd|ui\/ux)$/i.test(word)) return word.toUpperCase();
      if (/^[a-z]\+\+$/i.test(word)) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');

const unique = (items: string[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = normalize(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const limit = (items: string[], count: number) => unique(items).slice(0, count);

const includesPhrase = (text: string, phrase: string) => {
  const normalizedText = normalize(text);
  const normalizedPhrase = normalize(phrase);
  if (!normalizedPhrase) return false;

  if (normalizedPhrase.includes('.')) {
    return normalizedText.includes(normalizedPhrase.replace(/\./g, '')) || normalizedText.includes(normalizedPhrase);
  }

  return normalizedText.includes(normalizedPhrase);
};

const matchesCatalogTerm = (text: string, term: TermDefinition) =>
  term.aliases.some((alias) => includesPhrase(text, alias));

const isMeaningfulPhrase = (phrase: string) => {
  const normalized = normalize(phrase);
  if (!normalized) return false;
  if (GENERIC_PHRASES.has(normalized)) return false;
  if (/^\d+$/.test(normalized)) return false;

  const words = normalized.split(' ').filter(Boolean);
  if (words.length === 0 || words.length > 5) return false;
  if (words.every((word) => STOP_WORDS.has(word))) return false;
  if (words.length === 1) {
    const [single] = words;
    return SIGNAL_WORDS.some((signal) => single.includes(signal.replace(/\s+/g, '')));
  }

  return SIGNAL_WORDS.some((signal) => normalized.includes(signal)) || words.some((word) => word.length >= 6);
};

const cleanPhraseLeadIn = (phrase: string) =>
  phrase
    .replace(
      /\b(requirements?|qualifications?|responsibilities|skills?|must have|nice to have|experience with|proficiency with|proficiency in|strong knowledge of|knowledge of|hands on with|hands-on with|familiarity with|working with|ability to|proven ability to)\b/gi,
      ' '
    )
    .replace(/\b(working|building|creating|developing|designing|delivering|managing|supporting)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const splitIntoChunks = (text: string) =>
  text
    .replace(/\r/g, '\n')
    .replace(/[•·●▪]/g, '\n')
    .split(/[\n.;]+/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

const extractCatalogTerms = (text: string, emphasisBoost = 0) => {
  const normalized = normalize(text);

  return TERM_CATALOG.reduce<RankedTerm[]>((acc, term) => {
    if (!matchesCatalogTerm(normalized, term)) return acc;
    acc.push({
      label: term.label,
      category: term.category,
      score: term.weight + emphasisBoost,
    });
    return acc;
  }, []);
};

const extractFreeformTerms = (jobDescription: string) => {
  const ranked = new Map<string, RankedTerm>();
  const chunks = splitIntoChunks(jobDescription);

  for (const chunk of chunks) {
    const lowered = normalize(chunk);
    const emphasisBoost =
      /\b(requirements?|qualifications?|must have|nice to have|skills?|responsibilities)\b/i.test(chunk) ? 3 : 0;

    const chunkTerms = extractCatalogTerms(chunk, emphasisBoost);
    for (const term of chunkTerms) {
      const existing = ranked.get(term.label);
      ranked.set(term.label, existing ? { ...term, score: existing.score + term.score } : term);
    }

    const cleaned = cleanPhraseLeadIn(chunk);
    const pieces = cleaned
      .split(/,|\/|\band\b|\bor\b/gi)
      .map((part) => part.trim())
      .filter(Boolean);

    for (const piece of pieces) {
      const normalizedPiece = normalize(piece);
      if (!isMeaningfulPhrase(normalizedPiece)) continue;

      const catalogHit = TERM_CATALOG.find((term) => matchesCatalogTerm(normalizedPiece, term));
      const label = catalogHit?.label || titleCase(normalizedPiece);
      const category = catalogHit?.category || 'practice';
      const score = (catalogHit?.weight || 5) + emphasisBoost + (lowered.includes(normalize(piece)) ? 1 : 0);

      const existing = ranked.get(label);
      ranked.set(label, existing ? { ...existing, score: Math.max(existing.score, score) + 1 } : { label, category, score });
    }
  }

  return [...ranked.values()];
};

const extractRoleSignals = (jobTitle: string) => {
  const title = normalize(jobTitle);
  const terms: RankedTerm[] = [];

  if (!title) return terms;
  if (title.includes('frontend') || title.includes('front end')) terms.push({ label: 'Frontend Development', category: 'practice', score: 11 });
  if (title.includes('backend') || title.includes('back end')) terms.push({ label: 'Backend Development', category: 'practice', score: 11 });
  if (title.includes('full stack') || title.includes('full-stack')) terms.push({ label: 'Full-Stack Development', category: 'practice', score: 11 });
  if (title.includes('react')) terms.push({ label: 'React', category: 'technical', score: 11 });
  if (title.includes('node')) terms.push({ label: 'Node.js', category: 'technical', score: 11 });
  if (title.includes('javascript')) terms.push({ label: 'JavaScript', category: 'technical', score: 10 });
  if (title.includes('typescript')) terms.push({ label: 'TypeScript', category: 'technical', score: 10 });

  return terms;
};

const pruneRedundantTerms = (terms: RankedTerm[]) => {
  const sorted = [...terms].sort((a, b) => b.score - a.score || a.label.length - b.label.length);
  const kept: RankedTerm[] = [];

  for (const term of sorted) {
    const normalizedTerm = normalize(term.label);
    const overlaps = kept.some((existing) => {
      const normalizedExisting = normalize(existing.label);
      if (normalizedExisting === normalizedTerm) return true;
      const sameFamily =
        normalizedExisting.includes(normalizedTerm) || normalizedTerm.includes(normalizedExisting);
      return sameFamily && existing.category === term.category;
    });

    if (!overlaps) kept.push(term);
  }

  return kept;
};

const extractMeaningfulRequirements = (jobDescription: string, jobTitle = '') => {
  const allTerms = [
    ...extractRoleSignals(jobTitle),
    ...extractCatalogTerms(jobDescription, 1),
    ...extractFreeformTerms(jobDescription),
  ];

  const byLabel = new Map<string, RankedTerm>();
  for (const term of allTerms) {
    const existing = byLabel.get(term.label);
    if (!existing) {
      byLabel.set(term.label, term);
      continue;
    }

    byLabel.set(term.label, {
      ...term,
      score: existing.score + term.score,
    });
  }

  const pruned = pruneRedundantTerms([...byLabel.values()]);
  const technical = pruned.filter((term) => term.category === 'technical').slice(0, 5);
  const practice = pruned.filter((term) => term.category === 'practice').slice(0, 4);
  const platform = pruned.filter((term) => term.category === 'platform').slice(0, 2);
  const soft = pruned.filter((term) => term.category === 'soft').slice(0, 2);

  return unique([
    ...technical.map((term) => term.label),
    ...practice.map((term) => term.label),
    ...platform.map((term) => term.label),
    ...soft.map((term) => term.label),
  ]).slice(0, 10);
};

const categorizeRequirement = (label: string): TermCategory => {
  const catalog = TERM_CATALOG.find((term) => term.label === label);
  if (catalog) return catalog.category;
  return 'practice';
};

export const scoreResumeAgainstJD = (resumeText: string, jobDescription: string, jobTitle = '') => {
  const jdKeywords = extractMeaningfulRequirements(jobDescription, jobTitle);
  const matchedKeywords = jdKeywords.filter((keyword) => includesPhrase(resumeText, keyword));
  const missingKeywords = jdKeywords.filter((keyword) => !includesPhrase(resumeText, keyword));

  const technicalTerms = jdKeywords.filter((term) => categorizeRequirement(term) === 'technical');
  const practiceTerms = jdKeywords.filter((term) => categorizeRequirement(term) === 'practice');
  const platformTerms = jdKeywords.filter((term) => categorizeRequirement(term) === 'platform');
  const softTerms = jdKeywords.filter((term) => categorizeRequirement(term) === 'soft');

  const technicalMatches = technicalTerms.filter((term) => includesPhrase(resumeText, term)).length;
  const practiceMatches = practiceTerms.filter((term) => includesPhrase(resumeText, term)).length;
  const platformMatches = platformTerms.filter((term) => includesPhrase(resumeText, term)).length;
  const softMatches = softTerms.filter((term) => includesPhrase(resumeText, term)).length;

  const keywordCoverage = jdKeywords.length ? matchedKeywords.length / jdKeywords.length : 0;
  const technicalCoverage = technicalTerms.length ? technicalMatches / technicalTerms.length : 1;
  const practiceCoverage = practiceTerms.length ? practiceMatches / practiceTerms.length : 1;
  const platformCoverage = platformTerms.length ? platformMatches / platformTerms.length : 1;
  const softCoverage = softTerms.length ? softMatches / softTerms.length : 1;

  const hasSummary = /summary|profile/i.test(resumeText);
  const hasExperience = /experience|employment|internship|work history/i.test(resumeText);
  const hasEducation = /education|degree|university|college|cgpa|gpa/i.test(resumeText);
  const hasSkills = /skills|technical skills|core skills/i.test(resumeText);
  const hasProjects = /project|projects|portfolio/i.test(resumeText);
  const hasMetrics = /\b\d+%|\b\d+\s?(users|clients|days|weeks|months|hours|features|projects|apis)\b/i.test(resumeText);
  const hasImpactLanguage = IMPACT_TERMS.some((term) => includesPhrase(resumeText, term));

  const sectionCoverage = [hasSummary, hasExperience, hasEducation, hasSkills, hasProjects].filter(Boolean).length / 5;

  let score = Math.round(
    keywordCoverage * 48 +
      technicalCoverage * 18 +
      practiceCoverage * 12 +
      platformCoverage * 7 +
      softCoverage * 5 +
      sectionCoverage * 5 +
      (hasMetrics ? 3 : 0) +
      (hasImpactLanguage ? 2 : 0)
  );

  if (matchedKeywords.length >= 6) score += 3;
  if (technicalTerms.length > 0 && technicalMatches === technicalTerms.length) score += 3;
  if (missingKeywords.length <= 2 && jdKeywords.length > 0) score += 2;
  score = Math.max(0, Math.min(100, score));

  const strengths: string[] = [];
  if (technicalMatches >= 3) {
    strengths.push(`Strong technical alignment on ${matchedKeywords.filter((item) => technicalTerms.includes(item)).slice(0, 4).join(', ')}.`);
  }
  if (practiceMatches >= 2) strengths.push('Role-relevant engineering practices are already visible in the resume.');
  if (hasProjects) strengths.push('Projects give the scanner concrete implementation evidence, not just a keyword list.');
  if (hasMetrics) strengths.push('Quantified outcomes make the resume stronger for both ATS screening and recruiter review.');
  if (hasSkills) strengths.push('The skills section is structured clearly, which improves ATS readability.');

  const priorityFixes = unique([
    ...(missingKeywords.length > 0
      ? [`Add evidence for the top missing requirements: ${missingKeywords.slice(0, 4).join(', ')}.`]
      : []),
    ...(!hasExperience ? ['Add a clearer experience section with role, company, and impact-focused bullets.'] : []),
    ...(!hasProjects ? ['Add 1 to 2 relevant projects that prove hands-on execution for the target role.'] : []),
    ...(!hasSkills ? ['Refine the skills section so the most relevant tools and practices are easy to parse.'] : []),
    ...(!hasMetrics ? ['Rewrite a few bullets with measurable outcomes such as scale, speed, revenue, or time saved.'] : []),
    ...(!hasImpactLanguage ? ['Use stronger action verbs so achievements read like outcomes instead of task lists.'] : []),
    ...(resumeText.trim().length < 700 ? ['The resume is still thin for ATS screening. Add more role-specific depth and proof.'] : []),
  ]).slice(0, 4);

  const roleFitSummary =
    score >= 80
      ? 'Strong match. The resume covers the main role signals and backs them with credible implementation evidence.'
      : score >= 60
      ? 'Moderate match. The core fit is visible, but a few missing role signals and stronger proof points would improve ATS performance.'
      : 'Low match right now. Focus on the exact role signals, clearer project evidence, and measurable outcomes before applying.';

  return {
    score,
    matchedKeywords: limit(matchedKeywords, 6),
    missingKeywords: limit(missingKeywords, 6),
    strengths: limit(strengths, 3),
    priorityFixes,
    roleFitSummary,
  };
};
