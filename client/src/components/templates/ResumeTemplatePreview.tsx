import type { ResumeTemplateId } from '../../constants/templates';
import type { ResumeFormValues } from '../../types/resume';
import ResumeDocument from './ResumeDocument';

type Props = {
  values: ResumeFormValues;
  templateId: ResumeTemplateId;
};

export default function ResumeTemplatePreview({ values, templateId }: Props) {
  return (
    <aside className="xl:sticky xl:top-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Live Preview</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">A4 Resume</h2>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          Template: {templateId}
        </div>
      </div>

      <div className="overflow-auto rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),rgba(15,23,42,0.96)_40%)] p-4 shadow-2xl md:p-6">
        <div className="mx-auto origin-top scale-[0.5] sm:scale-[0.62] lg:scale-[0.72] 2xl:scale-[0.82]">
          <ResumeDocument values={values} templateId={templateId} />
        </div>
      </div>
    </aside>
  );
}