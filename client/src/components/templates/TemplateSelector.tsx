import { resumeTemplates, type ResumeTemplateId } from '../../constants/templates';

type Props = {
  selectedTemplate: ResumeTemplateId;
  onChange: (templateId: ResumeTemplateId) => void;
};

export default function TemplateSelector({ selectedTemplate, onChange }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {resumeTemplates.map((template) => {
        const active = template.id === selectedTemplate;

        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange(template.id)}
            className={`rounded-3xl border p-4 text-left transition ${
              active
                ? 'border-cyan-400 bg-cyan-500/10 text-white'
                : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/[0.07]'
            }`}
          >
            <div className={`h-2 w-16 rounded-full ${template.accent}`} />
            <h3 className="mt-4 text-lg font-semibold">{template.name}</h3>
            <p className="mt-2 text-sm text-slate-400">{template.description}</p>
          </button>
        );
      })}
    </div>
  );
}