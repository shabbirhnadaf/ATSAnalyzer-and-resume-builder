import type { ResumeTemplateId } from '../../constants/templates';
import type { ResumeFormValues } from '../../types/resume';

const asString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

type TimelineItem = {
  heading: string;
  subheading: string;
  bullets: string[];
};

type Props = {
  values: ResumeFormValues;
  templateId: ResumeTemplateId;
};

function mapExperience(values: ResumeFormValues): TimelineItem[] {
  return (values.experience || [])
    .map((item) => ({
      heading: `${asString(item?.role)}${asString(item?.company) ? ` · ${asString(item?.company)}` : ''}`,
      subheading: `${asString(item?.startDate)}${asString(item?.endDate) ? ` - ${asString(item?.endDate)}` : ''}`,
      bullets: Array.isArray(item?.description) ? item.description.map((d) => asString(d)).filter(Boolean) : [],
    }))
    .filter((item) => item.heading);
}

function mapProjects(values: ResumeFormValues): TimelineItem[] {
  return (values.projects || [])
    .map((item) => ({
      heading: asString(item?.title),
      subheading: asString(item?.link),
      bullets: Array.isArray(item?.description) ? item.description.map((d) => asString(d)).filter(Boolean) : [],
    }))
    .filter((item) => item.heading);
}

function mapEducation(values: ResumeFormValues): TimelineItem[] {
  return (values.education || [])
    .map((item) => ({
      heading: `${asString(item?.degree)}${asString(item?.institution) ? ` · ${asString(item?.institution)}` : ''}`,
      subheading: `${asString(item?.startDate)}${asString(item?.endDate) ? ` - ${asString(item?.endDate)}` : ''}${asString(item?.score) ? ` · ${asString(item?.score)}` : ''}`,
      bullets: [],
    }))
    .filter((item) => item.heading);
}

function toList(items?: unknown[]) {
  return Array.isArray(items) ? items.map((item) => asString(item)).filter(Boolean) : [];
}

export default function ResumeDocument({ values, templateId }: Props) {
  const person = values.personalInfo || ({} as any);
  const fullName = asString(person.fullname) || 'Your Name';
  const title = asString(values.title) || 'Professional Resume';
  const summary = asString(values.summary) || 'Your professional summary will appear here.';
  const contactLine = [asString(person.email), asString(person.phone), asString(person.location)].filter(Boolean).join(' · ');
  const links = [asString(person.linkedin), asString(person.github), asString(person.portfolio)].filter(Boolean);

  const skills = toList(values.skills);
  const certifications = toList(values.certifications);
  const experience = mapExperience(values);
  const projects = mapProjects(values);
  const education = mapEducation(values);

  return (
    <div className="mx-auto w-[210mm] min-w-[210mm] max-w-[210mm] bg-white text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
      <div className="min-h-[297mm] w-[210mm] overflow-hidden">
        {templateId === 'modern' && (
          <ModernTemplate
            fullName={fullName}
            title={title}
            summary={summary}
            contactLine={contactLine}
            links={links}
            skills={skills}
            certifications={certifications}
            experience={experience}
            projects={projects}
            education={education}
          />
        )}

        {templateId === 'minimal' && (
          <MinimalTemplate
            fullName={fullName}
            title={title}
            summary={summary}
            contactLine={contactLine}
            links={links}
            skills={skills}
            certifications={certifications}
            experience={experience}
            projects={projects}
            education={education}
          />
        )}

        {templateId === 'executive' && (
          <ExecutiveTemplate
            fullName={fullName}
            title={title}
            summary={summary}
            contactLine={contactLine}
            links={links}
            skills={skills}
            certifications={certifications}
            experience={experience}
            projects={projects}
            education={education}
          />
        )}

        {templateId === 'graduate' && (
          <GraduateTemplate
            fullName={fullName}
            title={title}
            summary={summary}
            contactLine={contactLine}
            links={links}
            skills={skills}
            certifications={certifications}
            experience={experience}
            projects={projects}
            education={education}
          />
        )}
      </div>
    </div>
  );
}

type TimelineProps = {
  fullName: string;
  title: string;
  summary: string;
  contactLine: string;
  links: string[];
  skills: string[];
  certifications: string[];
  experience: TimelineItem[];
  projects: TimelineItem[];
  education: TimelineItem[];
};

function ModernTemplate(props: TimelineProps) {
  return (
    <div className="h-full px-[16mm] py-[14mm]">
      <header className="border-b border-slate-200 pb-5">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-slate-900">{props.fullName}</h1>
            <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.2em] text-cyan-700">{props.title}</p>
            <p className="mt-3 text-[12px] leading-6 text-slate-600">{props.contactLine}</p>
          </div>
          <div className="rounded-2xl bg-cyan-50 px-4 py-3 text-right">
            {props.links.map((link, index) => (
              <p key={`${link}-${index}`} className="break-all text-[11px] text-cyan-800">
                {link}
              </p>
            ))}
          </div>
        </div>
        <p className="mt-4 text-[12.5px] leading-6 text-slate-700">{props.summary}</p>
      </header>

      <div className="mt-6 grid grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="space-y-5">
          <ResumeSection title="Experience">
            <TimelineCards items={props.experience} compact />
          </ResumeSection>
          <ResumeSection title="Projects">
            <TimelineCards items={props.projects} compact />
          </ResumeSection>
        </div>

        <div className="space-y-5">
          <ResumeSection title="Skills">
            <TagCloud items={props.skills} tone="cyan" />
          </ResumeSection>
          <ResumeSection title="Education">
            <TimelineCards items={props.education} />
          </ResumeSection>
          <ResumeSection title="Certifications">
            <TagCloud items={props.certifications} tone="slate" />
          </ResumeSection>
        </div>
      </div>
    </div>
  );
}

function MinimalTemplate(props: TimelineProps) {
  return (
    <div className="h-full px-[16mm] py-[14mm]">
      <header className="pb-5">
        <h1 className="text-[30px] font-bold tracking-tight">{props.fullName}</h1>
        <p className="mt-2 text-[12px] uppercase tracking-[0.2em] text-slate-500">{props.title}</p>
        <p className="mt-3 text-[12px] text-slate-600">{props.contactLine}</p>
        {!!props.links.length && <p className="mt-2 break-all text-[11px] text-slate-500">{props.links.join(' · ')}</p>}
      </header>

      <SectionRule />
      <ResumeSection title="Summary">
        <p className="text-[12.5px] leading-6 text-slate-700">{props.summary}</p>
      </ResumeSection>
      <SectionRule />
      <ResumeSection title="Skills">
        <InlineList items={props.skills} />
      </ResumeSection>
      <SectionRule />
      <ResumeSection title="Experience">
        <SimpleTimeline items={props.experience} />
      </ResumeSection>
      <SectionRule />
      <ResumeSection title="Projects">
        <SimpleTimeline items={props.projects} />
      </ResumeSection>
      <SectionRule />
      <ResumeSection title="Education">
        <SimpleTimeline items={props.education} />
      </ResumeSection>
      {!!props.certifications.length && (
        <>
          <SectionRule />
          <ResumeSection title="Certifications">
            <InlineList items={props.certifications} />
          </ResumeSection>
        </>
      )}
    </div>
  );
}

function ExecutiveTemplate(props: TimelineProps) {
  return (
    <div className="h-full px-[15mm] py-[14mm]">
      <header className="rounded-[14px] bg-slate-950 px-6 py-6 text-white">
        <h1 className="text-[30px] font-semibold tracking-tight">{props.fullName}</h1>
        <p className="mt-2 text-[12px] uppercase tracking-[0.22em] text-violet-300">{props.title}</p>
        <p className="mt-4 text-[12px] leading-6 text-slate-300">{props.contactLine}</p>
        {!!props.links.length && <p className="mt-2 break-all text-[11px] leading-5 text-slate-400">{props.links.join(' · ')}</p>}
      </header>

      <div className="mt-5 grid grid-cols-[0.82fr_1.18fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-[14px] bg-violet-50 p-4">
            <ResumeSection title="Profile" darkTitle>
              <p className="text-[12.5px] leading-6 text-slate-700">{props.summary}</p>
            </ResumeSection>
          </div>
          <div className="rounded-[14px] border border-slate-200 p-4">
            <ResumeSection title="Skills" darkTitle>
              <TagCloud items={props.skills} tone="violet" />
            </ResumeSection>
          </div>
          <div className="rounded-[14px] border border-slate-200 p-4">
            <ResumeSection title="Certifications" darkTitle>
              <TagCloud items={props.certifications} tone="slate" />
            </ResumeSection>
          </div>
          <div className="rounded-[14px] border border-slate-200 p-4">
            <ResumeSection title="Education" darkTitle>
              <SimpleTimeline items={props.education} />
            </ResumeSection>
          </div>
        </div>

        <div className="rounded-[14px] border border-slate-200 p-5">
          <ResumeSection title="Professional Experience" darkTitle>
            <TimelineCards items={props.experience} accent="violet" />
          </ResumeSection>
          <div className="mt-5">
            <ResumeSection title="Selected Projects" darkTitle>
              <TimelineCards items={props.projects} accent="violet" compact />
            </ResumeSection>
          </div>
        </div>
      </div>
    </div>
  );
}

function GraduateTemplate(props: TimelineProps) {
  return (
    <div className="h-full px-[15mm] py-[14mm]">
      <header className="border-b-[3px] border-emerald-500 pb-5">
        <h1 className="text-[28px] font-bold tracking-tight text-slate-900">{props.fullName}</h1>
        <p className="mt-2 text-[12px] uppercase tracking-[0.24em] text-emerald-700">{props.title}</p>
        <p className="mt-3 text-[12px] text-slate-600">{props.contactLine}</p>
        {!!props.links.length && <p className="mt-2 break-all text-[11px] text-slate-500">{props.links.join(' · ')}</p>}
      </header>

      <div className="mt-6 grid grid-cols-[0.92fr_1.08fr] gap-6">
        <div className="space-y-5">
          <ResumeSection title="Profile">
            <p className="text-[12.5px] leading-6 text-slate-700">{props.summary}</p>
          </ResumeSection>
          <ResumeSection title="Skills">
            <TagCloud items={props.skills} tone="green" />
          </ResumeSection>
          <ResumeSection title="Certifications">
            <TagCloud items={props.certifications} tone="slate" />
          </ResumeSection>
        </div>

        <div className="space-y-5">
          <ResumeSection title="Education">
            <TimelineCards items={props.education} accent="green" />
          </ResumeSection>
          <ResumeSection title="Projects">
            <TimelineCards items={props.projects} accent="green" />
          </ResumeSection>
          <ResumeSection title="Experience">
            <TimelineCards items={props.experience} accent="green" compact />
          </ResumeSection>
        </div>
      </div>
    </div>
  );
}

function ResumeSection({
  title,
  children,
  darkTitle,
}: {
  title: string;
  children: React.ReactNode;
  darkTitle?: boolean;
}) {
  return (
    <section>
      <h3 className={`mb-3 text-[11px] font-bold uppercase tracking-[0.22em] ${darkTitle ? 'text-slate-900' : 'text-slate-500'}`}>
        {title}
      </h3>
      {children}
    </section>
  );
}

function SectionRule() {
  return <div className="my-4 h-px bg-slate-200" />;
}

function TagCloud({
  items,
  tone,
}: {
  items: string[];
  tone: 'cyan' | 'green' | 'violet' | 'slate';
}) {
  if (!items.length) return <p className="text-[11px] text-slate-400">No items added yet.</p>;

  const toneClass =
    tone === 'cyan'
      ? 'border-cyan-200 bg-cyan-50 text-cyan-800'
      : tone === 'green'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : tone === 'violet'
      ? 'border-violet-200 bg-violet-50 text-violet-800'
      : 'border-slate-200 bg-slate-100 text-slate-700';

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className={`rounded-full border px-2.5 py-1 text-[10.5px] font-medium ${toneClass}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

function InlineList({ items }: { items: string[] }) {
  if (!items.length) return <p className="text-[11px] text-slate-400">No items added yet.</p>;
  return <p className="text-[12px] leading-6 text-slate-700">{items.join(' · ')}</p>;
}

function SimpleTimeline({ items }: { items: TimelineItem[] }) {
  if (!items.length) return <p className="text-[11px] text-slate-400">No items added yet.</p>;

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <article key={`${item.heading}-${index}`}>
          <div className="flex items-start justify-between gap-4">
            <h4 className="text-[12.5px] font-semibold text-slate-900">{item.heading}</h4>
            {!!item.subheading && <p className="text-[10.5px] text-slate-500">{item.subheading}</p>}
          </div>
          {!!item.bullets.length && (
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[11.5px] leading-5 text-slate-700">
              {item.bullets.map((bullet, bulletIndex) => (
                <li key={`${bullet}-${bulletIndex}`}>{bullet}</li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  );
}

function TimelineCards({
  items,
  accent,
  compact,
}: {
  items: TimelineItem[];
  accent?: 'violet' | 'green';
  compact?: boolean;
}) {
  if (!items.length) return <p className="text-[11px] text-slate-400">No items added yet.</p>;

  const accentClass =
    accent === 'violet'
      ? 'border-violet-200 bg-violet-50/40'
      : accent === 'green'
      ? 'border-emerald-200 bg-emerald-50/40'
      : 'border-slate-200 bg-slate-50/60';

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      {items.map((item, index) => (
        <article key={`${item.heading}-${index}`} className={`rounded-xl border p-3 ${accentClass}`}>
          <h4 className="text-[12.5px] font-semibold text-slate-900">{item.heading}</h4>
          {!!item.subheading && <p className="mt-1 text-[10.5px] text-slate-500">{item.subheading}</p>}
          {!!item.bullets.length && (
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[11.5px] leading-5 text-slate-700">
              {item.bullets.map((bullet, bulletIndex) => (
                <li key={`${bullet}-${bulletIndex}`}>{bullet}</li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  );
}