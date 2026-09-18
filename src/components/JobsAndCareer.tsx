import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  GraduationCap,
  CheckCircle2,
  Send,
  Users,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  JobOpening,
  JobApplication,
  User
} from '../types';
import { BPWLogo } from './brand/BPWLogo';

interface JobsAndCareerProps {
  currentUser: User;
  jobs: JobOpening[];
  applications: JobApplication[];
  onApplyJob: (appData: any) => Promise<any>;
  onNavigateToAcademy: (courseId?: string) => void;
}

export const JobsAndCareer: React.FC<JobsAndCareerProps> = ({
  currentUser,
  jobs,
  applications,
  onApplyJob,
  onNavigateToAcademy
}) => {
  const [activeTab, setActiveTab] = useState<'openings' | 'applications'>('openings');
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobOpening | null>(null);

  // Apply Form
  const [candidateName, setCandidateName] = useState(currentUser.name);
  const [candidateEmail, setCandidateEmail] = useState(currentUser.email);
  const [candidatePhone, setCandidatePhone] = useState('+91 95443 22110');
  const [experienceYears, setExperienceYears] = useState(3);
  const [skillsText, setSkillsText] = useState('Fuel Piping, HDPE Electrofusion, LOTO Safety');
  const [applySuccess, setApplySuccess] = useState(false);
  const [recommendedCourseId, setRecommendedCourseId] = useState<string | null>(null);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForApply) return;

    const res = await onApplyJob({
      jobId: selectedJobForApply.id,
      candidateName,
      candidateEmail,
      candidatePhone,
      experienceYears: Number(experienceYears),
      skills: skillsText.split(',').map(s => s.trim())
    });

    setRecommendedCourseId(res.recommendedCourseId || selectedJobForApply.recommendedCourseId || null);
    setSelectedJobForApply(null);
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setActiveTab('applications');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#0F2B48] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BPWLogo variant="light-bg" size="lg" subBrand="careers" />
            <div className="hidden sm:block border-l border-slate-200 pl-4">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-[#0F2B48]">Fuel Infrastructure Jobs & Hiring</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                  NATIONWIDE HIRING
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Field service technician, forecourt automation, and pipeline engineering opportunities across India
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToAcademy()}
            className="px-4 py-2.5 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <GraduationCap className="w-4 h-4 text-[#F59E0B]" />
            BPW Academy Skill Certification
          </button>
        </div>

        {applySuccess && (
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-emerald-900 space-y-2 text-center shadow-sm">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
            <h3 className="font-bold text-sm">Application Successfully Submitted!</h3>
            <p className="text-xs text-slate-600">
              Our Technical Recruitment Panel will review your petroleum engineering experience.
            </p>
            {recommendedCourseId && (
              <div className="pt-2">
                <button
                  onClick={() => onNavigateToAcademy(recommendedCourseId)}
                  className="px-4 py-1.5 rounded-lg bg-[#0F2B48] text-white font-bold text-xs hover:bg-[#1A4068] inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  Boost your selection chances with BPW Course ({recommendedCourseId}) →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('openings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'openings' ? 'bg-[#0F2B48] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F2B48] bg-white border border-slate-200'
            }`}
          >
            Open Positions ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'applications' ? 'bg-[#0F2B48] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F2B48] bg-white border border-slate-200'
            }`}
          >
            My Applications ({applications.length})
          </button>
        </div>

        {/* TAB 1: OPEN POSITIONS */}
        {activeTab === 'openings' && (
          <div className="space-y-4">
            {jobs.map(job => (
              <div
                key={job.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-300 shadow-sm transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-[#0F2B48]">{job.title}</h2>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0F2B48] border border-blue-200 text-xs font-semibold">
                        {job.jobType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                      </span>
                      <span>• Experience: {job.experience}</span>
                      <span>• Department: {job.department}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold font-mono text-emerald-700">{job.salaryRange}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{job.applicantsCount} Candidates Applied</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{job.description}</p>

                <div>
                  <div className="text-xs font-semibold text-slate-700 mb-1.5">Required Technical Competencies:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skillsRequired.map((skill, sidx) => (
                      <span key={sidx} className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {job.recommendedCourseId ? (
                    <button
                      onClick={() => onNavigateToAcademy(job.recommendedCourseId)}
                      className="text-xs text-[#0F2B48] hover:text-[#E55812] font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4 text-[#F59E0B]" />
                      Recommended BPW Course: {job.recommendedCourseId}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">Official BPW Field Role</span>
                  )}

                  <button
                    onClick={() => setSelectedJobForApply(job)}
                    className="px-5 py-2 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    Apply for Position <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: MY APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#0F2B48]">{app.jobTitle}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Applied on: {app.appliedDate} • Candidate: {app.candidateName}
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0F2B48] border border-blue-200">
                    {app.status}
                  </span>
                </div>

                {/* ATS 6-Stage Visual Indicator */}
                <div>
                  <div className="text-[11px] text-slate-500 mb-2 font-mono">Recruitment Pipeline Stage:</div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px] font-bold">
                    {['APPLIED', 'SCREENING', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'].map((st, idx) => {
                      const isCurrent = app.status === st;
                      return (
                        <div
                          key={st}
                          className={`p-2 rounded-lg border ${
                            isCurrent
                              ? 'bg-[#0F2B48] text-white border-[#0F2B48] shadow-sm'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}
                        >
                          Stage {idx + 1}: {st}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL: APPLY TO JOB */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0F2B48] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#E55812]" />
                Apply: {selectedJobForApply.title}
              </h3>
              <button onClick={() => setSelectedJobForApply(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleApply} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={e => setCandidateName(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:border-[#0F2B48] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Email</label>
                  <input
                    type="email"
                    value={candidateEmail}
                    onChange={e => setCandidateEmail(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:border-[#0F2B48] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Mobile Phone</label>
                  <input
                    type="tel"
                    value={candidatePhone}
                    onChange={e => setCandidatePhone(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:border-[#0F2B48] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Relevant Fuel / Station Experience (Years)</label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={experienceYears}
                  onChange={e => setExperienceYears(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:border-[#0F2B48] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Skills & Certifications (Comma Separated)</label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={e => setSkillsText(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:border-[#0F2B48] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedJobForApply(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold cursor-pointer shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
