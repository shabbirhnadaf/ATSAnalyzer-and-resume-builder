import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import {
  createResumeApi,
  getResumeByIdApi,
  type ResumePayload,
  updateResumeApi,
} from '../api/resumes';
import type { ResumeFormValues, ResumeTemplateId } from '../types/resume';
import { defaultTemplateId, resumeTemplates } from '../constants/templates';
import { toErrorText } from '../lib/errorText';

const emptyEducation = {
  institution: '',
  degree: '',
  startDate: '',
  endDate: '',
  score: '',
};

const emptyExperience = {
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  description: ['', '', ''],
};

const emptyProject = {
  title: '',
  description: ['', '', ''],
  link: '',
};

const defaultValues: ResumeFormValues = {
  title: '',
  template: defaultTemplateId,
  mode: 'student',
  personalInfo: {
    fullname: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  summary: '',
  skills: [],
  experience: [],
  education: [emptyEducation],
  projects: [],
  certifications: [],
  achievements: [],
  extracurriculars: [],
  coursework: [],
};

const clean = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export default function Builder() {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [skillsInput, setSkillsInput] = useState('');
  const [certificationsInput, setCertificationsInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateId>(defaultTemplateId);

  const { register, control, handleSubmit, reset, setValue, watch } = useForm<ResumeFormValues>({
    defaultValues,
  });

  const education = useFieldArray({ control, name: 'education' });
  const experience = useFieldArray({ control, name: 'experience' });
  const projects = useFieldArray({ control, name: 'projects' });

  const values = watch();

  useEffect(() => {
    if (!resumeId) return;

    const loadResume = async () => {
      try {
        setLoading(true);
        setStatus('');
        const response = await getResumeByIdApi(resumeId);
        const data = response.data;

        const nextTemplate = (clean(data.template) || defaultTemplateId) as ResumeTemplateId;
        setSelectedTemplate(nextTemplate);

        reset({
          ...defaultValues,
          title: clean(data.title),
          template: nextTemplate,
          mode: 'student',
          personalInfo: {
            fullname: clean(data.personalInfo?.fullname),
            email: clean(data.personalInfo?.email),
            phone: clean(data.personalInfo?.phone),
            location: clean(data.personalInfo?.location),
            linkedin: clean(data.personalInfo?.linkedin),
            github: clean(data.personalInfo?.github),
            portfolio: clean(data.personalInfo?.portfolio),
          },
          summary: clean(data.summary),
          skills: [],
          experience:
            Array.isArray(data.experience) && data.experience.length
              ? data.experience.map((item) => ({
                  company: clean(item.company),
                  role: clean(item.role),
                  startDate: clean(item.startDate),
                  endDate: clean(item.endDate),
                  description:
                    Array.isArray(item.description) && item.description.length
                      ? item.description.map((d) => clean(d))
                      : ['', '', ''],
                }))
              : [],
          education:
            Array.isArray(data.education) && data.education.length
              ? data.education.map((item) => ({
                  institution: clean(item.institution),
                  degree: clean(item.degree),
                  startDate: clean(item.startDate),
                  endDate: clean(item.endDate),
                  score: clean(item.score),
                }))
              : [emptyEducation],
          projects:
            Array.isArray(data.projects) && data.projects.length
              ? data.projects.map((item) => ({
                  title: clean(item.title),
                  description:
                    Array.isArray(item.description) && item.description.length
                      ? item.description.map((d) => clean(d))
                      : ['', '', ''],
                  link: clean(item.link),
                }))
              : [],
          certifications: [],
          achievements: [],
          extracurriculars: [],
          coursework: [],
        });

        setSkillsInput(Array.isArray(data.skills) ? data.skills.map((item) => clean(item)).filter(Boolean).join(', ') : '');
        setCertificationsInput(
          Array.isArray(data.certifications)
            ? data.certifications.map((item) => clean(item)).filter(Boolean).join(', ')
            : ''
        );
      } catch (error: any) {
        setStatus(
          toErrorText(error?.response?.data?.message) ||
            toErrorText(error?.message) ||
            'Failed to load resume.'
        );
      } finally {
        setLoading(false);
      }
    };

    void loadResume();
  }, [resumeId, reset]);

  useEffect(() => {
    setValue('template', selectedTemplate);
  }, [selectedTemplate, setValue]);

  const payload = useMemo<ResumePayload>(
    () => ({
      title: clean(values.title),
      template: selectedTemplate,
      personalInfo: {
        fullname: clean(values.personalInfo?.fullname),
        email: clean(values.personalInfo?.email),
        phone: clean(values.personalInfo?.phone),
        location: clean(values.personalInfo?.location),
        linkedin: clean(values.personalInfo?.linkedin),
        github: clean(values.personalInfo?.github),
        portfolio: clean(values.personalInfo?.portfolio),
      },
      summary: clean(values.summary),
      skills: skillsInput.split(',').map((item) => item.trim()).filter(Boolean),
      experience: (values.experience || [])
        .map((item) => ({
          company: clean(item.company),
          role: clean(item.role),
          startDate: clean(item.startDate),
          endDate: clean(item.endDate),
          description: (item.description || []).map((d) => clean(d)).filter(Boolean),
        }))
        .filter((item) => item.company || item.role || item.startDate || item.endDate || item.description.length),
      education: (values.education || [])
        .map((item) => ({
          institution: clean(item.institution),
          degree: clean(item.degree),
          startDate: clean(item.startDate),
          endDate: clean(item.endDate),
          score: clean(item.score),
        }))
        .filter((item) => item.institution || item.degree || item.startDate || item.endDate || item.score),
      projects: (values.projects || [])
        .map((item) => ({
          title: clean(item.title),
          description: (item.description || []).map((d) => clean(d)).filter(Boolean),
          link: clean(item.link),
        }))
        .filter((item) => item.title || item.link || item.description.length),
      certifications: certificationsInput.split(',').map((item) => item.trim()).filter(Boolean),
    }),
    [values, skillsInput, certificationsInput, selectedTemplate]
  );

  const onSubmit = async () => {
    try {
      setSaving(true);
      setStatus('');
      setErrors([]);

      if (resumeId) {
        await updateResumeApi(resumeId, payload);
        setStatus('Resume updated successfully.');
      } else {
        await createResumeApi(payload);
        setStatus('Resume created successfully.');
      }
    } catch (error: any) {
      const issues = error?.response?.data?.details;
      if (Array.isArray(issues)) {
        setErrors(
          issues
            .map((item: unknown) => toErrorText(item))
            .filter(Boolean)
        );
      }
      setStatus(
        toErrorText(error?.response?.data?.message) ||
          toErrorText(error?.message) ||
          'Unable to save resume.'
      );
    } finally {
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        Loading resume...
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-7 text-white shadow-[0_24px_80px_rgba(2,8,23,0.28)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Resume Builder</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                {resumeId ? 'Edit resume' : 'Create resume'}
              </h1>
              <p className="mt-3 text-[15px] leading-7 text-slate-300">
                Clean, spacious editor with full-width fields and simple section cards.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/ai-assistant"
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-100"
                >
                  AI Assistant
                </Link>
                <Link
                  to="/ai-resume-builder"
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-100"
                >
                  AI Resume Builder
                </Link>
                <Link
                  to="/ai-ats-analysis"
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-100"
                >
                  AI ATS Analysis
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                {selectedTemplate}
              </span>
            </div>
          </div>
        </div>

        {!!status && (
          <div
            className={`rounded-2xl border p-4 text-sm ${
              errors.length
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-100'
                : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100'
            }`}
          >
            <p>{status}</p>
            {!!errors.length && (
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {errors.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <Section title="Template" subtitle="Choose the resume style to save with this record.">
          <div className="grid gap-4 md:grid-cols-2">
            {resumeTemplates.map((template) => {
              const active = template.id === selectedTemplate;
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`rounded-3xl border p-4 text-left transition ${
                    active
                      ? `${template.surface} shadow-[0_14px_32px_rgba(2,8,23,0.18)]`
                      : 'border-white/10 bg-slate-950/30 hover:border-white/20 hover:bg-white/4'
                  }`}
                >
                  <div className={`h-24 rounded-2xl bg-gradient-to-br ${template.accent}`} />
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{template.description}</p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                      {template.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="Resume Setup">
          <div className="grid gap-5">
            <Field label="Resume title" placeholder="Frontend Developer Resume 2026 *" register={register('title')} />
          </div>
        </Section>

        <Section title="Personal Information">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full name" placeholder="John Doe *" register={register('personalInfo.fullname')} />
            <Field label="Email" placeholder="john@example.com *" register={register('personalInfo.email')} />
            <Field label="Phone" placeholder="+91 9876543210 *" register={register('personalInfo.phone')} />
            <Field label="Location" placeholder="Bengaluru, India *" register={register('personalInfo.location')} />
            <Field label="LinkedIn URL" placeholder="https://linkedin.com/in/username" register={register('personalInfo.linkedin')} />
            <Field label="GitHub URL" placeholder="https://github.com/username" register={register('personalInfo.github')} />
            <div className="md:col-span-2">
              <Field label="Portfolio URL" placeholder="https://yourportfolio.com" register={register('personalInfo.portfolio')} />
            </div>
          </div>
        </Section>

        <Section title="Professional Summary">
          <TextArea
            label="Summary"
            placeholder="Write a concise summary tailored to your target role..."
            rows={5}
            register={register('summary')}
          />
        </Section>

        <Section title="Skills">
          <TextArea
            label="Skills"
            placeholder="React, TypeScript, Tailwind CSS, Node.js, Express, MongoDB"
            rows={4}
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
          />
        </Section>

        <Section title="Education">
          <div className="space-y-4">
            {education.fields.map((field, index) => (
              <div key={field.id} className="rounded-3xl border border-white/10 bg-slate-900/35 p-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Institution" placeholder="XYZ University *" register={register(`education.${index}.institution`)} />
                  <Field label="Degree / Course" placeholder="B.Tech in Computer Science *" register={register(`education.${index}.degree`)} />
                  <Field label="Start date" placeholder="2021 *" register={register(`education.${index}.startDate`)} />
                  <Field label="End date" placeholder="2025 *" register={register(`education.${index}.endDate`)} />
                  <div className="md:col-span-2">
                    <Field label="Score / Grade" placeholder="8.7 CGPA / 87%" register={register(`education.${index}.score`)} />
                  </div>
                </div>
                <button type="button" onClick={() => education.remove(index)} className="mt-4 text-sm text-rose-300 hover:text-rose-200">
                  Remove education
                </button>
              </div>
            ))}
            <AddButton onClick={() => education.append({ ...emptyEducation })}>Add education</AddButton>
          </div>
        </Section>

        <Section title="Experience">
          <div className="space-y-4">
            {experience.fields.map((field, index) => (
              <div key={field.id} className="rounded-3xl border border-white/10 bg-slate-900/35 p-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Company / Organization" placeholder="Acme Technologies" register={register(`experience.${index}.company`)} />
                  <Field label="Role / Position" placeholder="Frontend Developer Intern" register={register(`experience.${index}.role`)} />
                  <Field label="Start date" placeholder="Jan 2025" register={register(`experience.${index}.startDate`)} />
                  <Field label="End date" placeholder="Present" register={register(`experience.${index}.endDate`)} />
                </div>

                <div className="mt-5 space-y-4">
                  {[0, 1, 2].map((bulletIndex) => (
                    <Field
                      key={bulletIndex}
                      label={`Impact bullet ${bulletIndex + 1}`}
                      placeholder={`Describe measurable impact or responsibility ${bulletIndex + 1}`}
                      register={register(`experience.${index}.description.${bulletIndex}`)}
                    />
                  ))}
                </div>

                <button type="button" onClick={() => experience.remove(index)} className="mt-4 text-sm text-rose-300 hover:text-rose-200">
                  Remove experience
                </button>
              </div>
            ))}
            <AddButton onClick={() => experience.append({ ...emptyExperience })}>Add experience</AddButton>
          </div>
        </Section>

        <Section title="Projects">
          <div className="space-y-4">
            {projects.fields.map((field, index) => (
              <div key={field.id} className="rounded-3xl border border-white/10 bg-slate-900/35 p-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Project title" placeholder="AI-Powered Resume Builder" register={register(`projects.${index}.title`)} />
                  <Field label="Project link" placeholder="https://github.com/username/project" register={register(`projects.${index}.link`)} />
                </div>

                <div className="mt-5 space-y-4">
                  {[0, 1, 2].map((bulletIndex) => (
                    <Field
                      key={bulletIndex}
                      label={`Project bullet ${bulletIndex + 1}`}
                      placeholder={`Explain feature, stack, or outcome ${bulletIndex + 1}`}
                      register={register(`projects.${index}.description.${bulletIndex}`)}
                    />
                  ))}
                </div>

                <button type="button" onClick={() => projects.remove(index)} className="mt-4 text-sm text-rose-300 hover:text-rose-200">
                  Remove project
                </button>
              </div>
            ))}
            <AddButton onClick={() => projects.append({ ...emptyProject })}>Add project</AddButton>
          </div>
        </Section>

        <Section title="Certifications">
          <TextArea
            label="Certifications"
            placeholder="AWS Cloud Practitioner, Google UX Design"
            rows={3}
            value={certificationsInput}
            onChange={(e) => setCertificationsInput(e.target.value)}
          />
        </Section>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-cyan-400 px-7 py-3.5 font-medium text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
          >
            {saving ? 'Saving...' : resumeId ? 'Update Resume' : 'Save Resume'}
          </button>

          <button
            type="button"
            onClick={() => {
              reset(defaultValues);
              setSkillsInput('');
              setCertificationsInput('');
              setSelectedTemplate(defaultTemplateId);
              setStatus('');
              setErrors([]);
            }}
            className="rounded-xl border border-white/10 px-7 py-3.5 text-slate-200 transition hover:bg-white/5"
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(8,15,30,0.10)]">
      <div className="mb-5">
        <h2 className="text-[1.35rem] font-semibold text-white">{title}</h2>
        {subtitle ? <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block text-sm font-medium text-slate-200">{children}</label>;
}

function Field({
  label,
  placeholder,
  register,
}: {
  label: string;
  placeholder: string;
  register: any;
}) {
  return (
    <div className="w-full">
      <Label>{label}</Label>
      <input
        {...register}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 text-[15px] text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
      />
    </div>
  );
}

function TextArea({
  label,
  placeholder,
  rows,
  register,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  rows: number;
  register?: any;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="w-full">
      <Label>{label}</Label>
      <textarea
        {...(register || {})}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 text-[15px] leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
      />
    </div>
  );
}

function AddButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-dashed border-cyan-400/30 px-4 py-3 text-sm text-cyan-300 transition hover:bg-cyan-500/10"
    >
      {children}
    </button>
  );
}