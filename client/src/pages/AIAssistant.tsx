import { useState } from 'react';
import AIPromptPanel from '../components/ai/AIPromptPanel';
import AISuggestionCard from '../components/ai/AISuggestionCard';
import {
  generateProjectApi,
  improveExperienceApi,
  improveSummaryApi,
  tailorResumeApi,
} from '../api/ai';

type SuggestionItem = {
  title: string;
  content: string;
};

type ExperienceResultShape = {
  suggestions?: string[];
  experience?: string[];
};

type ProjectResultShape = {
  suggestions?: string[];
  projects?: string[];
};

type TailorResultShape = {
  improvedSummary?: string;
  keywordSuggestions?: string[];
  missingSkills?: string[];
  improvedBullets?: string[];
};

function normalizeContent(value: unknown): string {
  if (typeof value === 'string') return value;

  if (Array.isArray(value)) {
    return value
      .map((item: unknown) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') return JSON.stringify(item, null, 2);
        return String(item ?? '');
      })
      .join('\n');
  }

  if (value && typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return String(value ?? '');
}

export default function AIAssistant() {
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<SuggestionItem[]>([]);
  const [error, setError] = useState<string>('');

  const run = async (fn: () => Promise<void>): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      await fn();
    } catch (err: unknown) {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'AI request failed';

      setError(message as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-7 text-white shadow-[0_24px_80px_rgba(2,8,23,0.28)]">
        <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">AI Workspace</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">AI Resume Assistant</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-300">
          Improve summaries, rewrite experience bullets, generate project content, and tailor your
          resume to a job description.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <AIPromptPanel
          loading={loading}
          onImproveSummary={(payload) =>
            run(async () => {
              const res = await improveSummaryApi(payload);

              setItems([
                {
                  title: 'Improved Summary',
                  content: normalizeContent(res.data?.suggestion),
                },
              ]);
            })
          }
          onImproveExperience={(payload) =>
            run(async () => {
              const res = await improveExperienceApi(payload);
              const data: ExperienceResultShape = res.data;

              const suggestions: string[] = Array.isArray(data.suggestions)
                ? data.suggestions
                : Array.isArray(data.experience)
                ? data.experience
                : [];

              setItems(
                suggestions.map((item: string, index: number) => ({
                  title: `Experience Suggestion ${index + 1}`,
                  content: normalizeContent(item),
                }))
              );
            })
          }
          onGenerateProject={(payload) =>
            run(async () => {
              const res = await generateProjectApi(payload);
              const data: ProjectResultShape = res.data;

              const suggestions: string[] = Array.isArray(data.suggestions)
                ? data.suggestions
                : Array.isArray(data.projects)
                ? data.projects
                : [];

              setItems(
                suggestions.map((item: string, index: number) => ({
                  title: `Project Bullet ${index + 1}`,
                  content: normalizeContent(item),
                }))
              );
            })
          }
          onTailorResume={(payload) =>
            run(async () => {
              const res = await tailorResumeApi(payload);
              const data: TailorResultShape = res.data;

              setItems([
                {
                  title: 'Improved Summary',
                  content: normalizeContent(data.improvedSummary ?? ''),
                },
                {
                  title: 'Keywords',
                  content: normalizeContent(data.keywordSuggestions ?? []),
                },
                {
                  title: 'Missing Skills',
                  content: normalizeContent(data.missingSkills ?? []),
                },
                {
                  title: 'Improved Bullets',
                  content: normalizeContent(data.improvedBullets ?? []),
                },
              ]);
            })
          }
        />

        <div className="space-y-4">
          {error && (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
              {error}
            </div>
          )}

          {items.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-8 text-slate-300">
              No suggestions yet. Run an AI action to see results.
            </div>
          ) : (
            items.map((item: SuggestionItem, index: number) => (
              <AISuggestionCard
                key={`${item.title}-${index}`}
                title={item.title}
                content={item.content}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}