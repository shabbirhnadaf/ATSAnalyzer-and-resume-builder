import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { getResumeByIdApi, type ResumeRecord } from '../api/resumes';
import ResumeDocument from '../components/templates/ResumeDocument';
import { defaultTemplateId, type ResumeTemplateId } from '../constants/templates';
import type { ResumeFormValues } from '../types/resume';

const clean = (value?: string) => (value || '').trim();

function normalizeResumeToFormValues(resume: ResumeRecord): ResumeFormValues {
  return {
    title: clean(resume.title),
    template: (clean((resume as any).template) || defaultTemplateId) as any,
    mode: 'student' as any,
    personalInfo: {
      fullname: clean(resume.personalInfo?.fullname),
      email: clean(resume.personalInfo?.email),
      phone: clean(resume.personalInfo?.phone),
      location: clean(resume.personalInfo?.location),
      linkedin: clean(resume.personalInfo?.linkedin),
      github: clean(resume.personalInfo?.github),
      portfolio: clean(resume.personalInfo?.portfolio),
    } as any,
    summary: clean(resume.summary),
    skills: Array.isArray(resume.skills) ? resume.skills.filter(Boolean) : [],
    experience: Array.isArray(resume.experience)
      ? resume.experience.map((item: any) => ({
          company: clean(item?.company),
          role: clean(item?.role),
          startDate: clean(item?.startDate),
          endDate: clean(item?.endDate),
          description: Array.isArray(item?.description) ? item.description.filter(Boolean) : [],
        }))
      : [],
    education: Array.isArray(resume.education)
      ? resume.education.map((item: any) => ({
          institution: clean(item?.institution),
          degree: clean(item?.degree),
          startDate: clean(item?.startDate),
          endDate: clean(item?.endDate),
          score: clean(item?.score),
        }))
      : [],
    projects: Array.isArray(resume.projects)
      ? resume.projects.map((item: any) => ({
          title: clean(item?.title),
          description: Array.isArray(item?.description) ? item.description.filter(Boolean) : [],
          link: clean(item?.link),
        }))
      : [],
    certifications: Array.isArray(resume.certifications) ? resume.certifications.filter(Boolean) : [],
    achievements: [],
    extracurriculars: [],
    coursework: [],
  } as ResumeFormValues;
}

export default function ResumePreviewPage() {
  const { id } = useParams();
  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const resumeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadResume = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getResumeByIdApi(id);
        setResume(response.data || null);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load resume preview.');
      } finally {
        setLoading(false);
      }
    };

    void loadResume();
  }, [id]);

  const completion = useMemo(() => {
    if (!resume) return 0;

    let score = 0;
    if (clean(resume.personalInfo?.fullname)) score += 20;
    if (clean(resume.summary)) score += 15;
    if ((resume.skills?.length || 0) > 0) score += 15;
    if ((resume.education?.length || 0) > 0) score += 20;
    if ((resume.experience?.length || 0) > 0 || (resume.projects?.length || 0) > 0) score += 20;
    if ((resume.certifications?.length || 0) > 0) score += 10;

    return score;
  }, [resume]);

  const exportPDF = async () => {
    if (!resumeRef.current || !resume) return;

    try {
      setExporting(true);
      setError('');

      const element = resumeRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: false,
        allowTaint: true,
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const safeName = clean(resume.personalInfo?.fullname || resume.title || 'resume')
        .replace(/\s+/g, '-')
        .toLowerCase();

      pdf.save(`${safeName}-resume.pdf`);
    } catch (err: any) {
      console.error('PDF export error:', err);
      setError(err?.message || 'Failed to export PDF.');
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        Loading preview...
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-100">
        Resume not found.
      </div>
    );
  }

  const templateId = (clean((resume as any).template) || defaultTemplateId) as ResumeTemplateId;
  const formValues = normalizeResumeToFormValues(resume);

  return (
    <section className="space-y-8 print:bg-white">
      <style>
        {`
          @media print {
            body {
              background: #ffffff !important;
            }

            header,
            nav,
            aside,
            button,
            .no-print {
              display: none !important;
            }

            .print-shell {
              padding: 0 !important;
              margin: 0 !important;
              background: #ffffff !important;
              border: none !important;
              box-shadow: none !important;
              display: block !important;
            }

            .print-stage {
              padding: 0 !important;
              margin: 0 !important;
              background: #ffffff !important;
              border: none !important;
              box-shadow: none !important;
              overflow: visible !important;
            }

            .print-resume {
              box-shadow: none !important;
              border: none !important;
              margin: 0 auto !important;
              background: #ffffff !important;
            }

            @page {
              size: A4;
              margin: 0;
            }
          }
        `}
      </style>

      <div className="no-print flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/5 p-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Preview & Export</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">
            {resume.title || 'Resume Preview'}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            This page uses the saved template, so preview, print, and export now stay consistent.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/builder?id=${resume._id}`}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-100"
          >
            Edit resume
          </Link>

          <button
            onClick={handlePrint}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-100"
          >
            Print / Save PDF
          </button>

          <button
            onClick={exportPDF}
            disabled={exporting}
            className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-medium text-slate-950 disabled:opacity-60"
          >
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {!!error && (
        <div className="no-print rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="print-shell grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="no-print h-max rounded-[2rem] border border-white/10 bg-white/5 p-5 text-white xl:sticky xl:top-8">
          <h2 className="text-xl font-semibold">Resume health</h2>

          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Completion</span>
              <span className="text-lg font-semibold text-white">{completion}%</span>
            </div>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <HealthItem
              label="Template selected"
              ok={!!templateId}
            />
            <HealthItem
              label="Personal info"
              ok={!!clean(resume.personalInfo?.fullname) && !!clean(resume.personalInfo?.email)}
            />
            <HealthItem label="Summary" ok={!!clean(resume.summary)} />
            <HealthItem label="Skills" ok={(resume.skills?.length || 0) > 0} />
            <HealthItem label="Education" ok={(resume.education?.length || 0) > 0} />
            <HealthItem
              label="Experience or Projects"
              ok={(resume.experience?.length || 0) > 0 || (resume.projects?.length || 0) > 0}
            />
            <HealthItem label="Certifications" ok={(resume.certifications?.length || 0) > 0} />
          </div>
        </aside>

        <div className="print-stage overflow-auto rounded-[2rem] border border-white/10 bg-slate-200/20 p-4 md:p-8">
          <div ref={resumeRef} className="print-resume mx-auto w-fit">
            <ResumeDocument values={formValues} templateId={templateId} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HealthItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-slate-200">{label}</span>
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          ok ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'
        }`}
      >
        {ok ? 'Good' : 'Add'}
      </span>
    </div>
  );
}