import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Play,
  FileCheck,
  Download,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import {
  AcademyCourse,
  CourseEnrollment,
  User
} from '../types';
import { BPWLogo } from './brand/BPWLogo';

interface BPWAcademyProps {
  currentUser: User;
  courses: AcademyCourse[];
  enrollments: CourseEnrollment[];
  onEnroll: (courseId: string) => Promise<any>;
  onCertify: (enrollmentId: string) => Promise<any>;
  selectedCourseId?: string | null;
}

export const BPWAcademy: React.FC<BPWAcademyProps> = ({
  currentUser,
  courses = [],
  enrollments = [],
  onEnroll,
  onCertify,
  selectedCourseId
}) => {
  const safeCourses = courses || [];
  const safeEnrollments = enrollments || [];

  const [activeTab, setActiveTab] = useState<'courses' | 'my-learning' | 'certificate'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse | null>(
    (selectedCourseId && safeCourses.find(c => c.id === selectedCourseId)) || safeCourses[0] || null
  );

  const [activeCertificate, setActiveCertificate] = useState<{
    enrollment: CourseEnrollment;
    course: AcademyCourse;
  } | null>(null);

  const handleEnrollCourse = async (courseId: string) => {
    await onEnroll(courseId);
    setActiveTab('my-learning');
  };

  const handleCompleteAndCertify = async (enrollmentId: string) => {
    const res = await onCertify(enrollmentId);
    const enrollment = safeEnrollments.find(e => e.id === enrollmentId) || res?.enrollment;
    const course = safeCourses.find(c => c.id === enrollment?.courseId) || safeCourses[0];
    if (enrollment && course) {
      setActiveCertificate({ enrollment, course });
      setActiveTab('certificate');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#0F2B48] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BPWLogo variant="light-bg" size="lg" subBrand="academy" />
            <div className="hidden sm:block border-l border-slate-200 pl-4">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-[#0F2B48]">Technical Skill & Safety Academy</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  OISD-141 / PESO STANDARDS
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Standardized technical skill licensing for petrol-pump field engineers, automation technicians & HSE officers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 font-semibold shadow-sm">
              Active Enrollments: <span className="font-bold text-[#0F2B48]">{enrollments.length}</span>
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'courses' ? 'bg-[#0F2B48] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F2B48] bg-white border border-slate-200'
            }`}
          >
            Accredited Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('my-learning')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'my-learning' ? 'bg-[#0F2B48] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F2B48] bg-white border border-slate-200'
            }`}
          >
            My Learning & Certifications ({enrollments.length})
          </button>
          {activeCertificate && (
            <button
              onClick={() => setActiveTab('certificate')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'certificate' ? 'bg-[#E55812] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F2B48] bg-white border border-slate-200'
              }`}
            >
              Issued Certificate
            </button>
          )}
        </div>

        {/* TAB 1: ACCREDITED COURSES */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Courses List */}
            <div className="lg:col-span-7 space-y-4">
              {courses.map(c => {
                const isSelected = selectedCourse?.id === c.id;
                const isEnrolled = enrollments.some(e => e.courseId === c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCourse(c)}
                    className={`p-5 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-white border-2 border-[#0F2B48] shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#0F2B48] font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {c.code}
                        </span>
                        <h3 className="text-base font-bold text-[#0F2B48] mt-1.5">{c.title}</h3>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {c.level}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{c.description}</p>

                    <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {c.durationHours} Hours
                      </span>
                      <span>{c.enrolledCount} Engineers Certified</span>
                      {isEnrolled ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                        </span>
                      ) : (
                        <span className="text-[#0F2B48] font-semibold hover:text-[#E55812]">View Curriculum →</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Course Details Pane */}
            <div className="lg:col-span-5">
              {selectedCourse && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 sticky top-24 shadow-sm">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#E55812]">{selectedCourse.code}</span>
                    <h2 className="text-lg font-bold text-[#0F2B48] mt-1">{selectedCourse.title}</h2>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{selectedCourse.description}</p>
                  </div>

                  {/* Modules Curriculum */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                      Curriculum Syllabus & Field Practical Modules:
                    </h4>
                    <div className="space-y-2">
                      {selectedCourse.modules.map((mod, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                          <div className="font-bold text-[#0F2B48] flex items-center justify-between">
                            <span>Module {idx + 1}: {mod.title}</span>
                            <span className="text-slate-500 font-mono text-[10px]">{mod.duration}</span>
                          </div>
                          <p className="text-[11px] text-slate-600">{mod.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleEnrollCourse(selectedCourse.id)}
                      className="w-full py-3 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-extrabold text-sm shadow-sm cursor-pointer flex items-center justify-center gap-2"
                    >
                      <GraduationCap className="w-4 h-4 text-[#F59E0B]" />
                      Enroll in Technical Program
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY LEARNING */}
        {activeTab === 'my-learning' && (
          <div className="space-y-4">
            {enrollments.map(enr => (
              <div key={enr.id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-[#0F2B48]">{enr.courseTitle}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Enrolled: {enr.enrolledAt} • Student: <span className="text-slate-800 font-semibold">{enr.userName}</span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      enr.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-blue-50 text-[#0F2B48] border-blue-200'
                    }`}
                  >
                    {enr.status?.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Course Completion</span>
                    <span className="text-emerald-700 font-mono font-bold">{enr.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${enr.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {enr.certificateId ? (
                    <div className="text-xs font-mono text-[#E55812]">
                      Issued Credential ID: <span className="font-bold">{enr.certificateId}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">Take final exam to unlock official credential</span>
                  )}

                  {enr.status !== 'COMPLETED' ? (
                    <button
                      onClick={() => handleCompleteAndCertify(enr.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-sm"
                    >
                      Complete Practical Exam & Issue Certificate →
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const course = safeCourses.find(c => c.id === enr.courseId) || safeCourses[0];
                        if (course) {
                          setActiveCertificate({ enrollment: enr, course });
                          setActiveTab('certificate');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs cursor-pointer shadow-sm"
                    >
                      View Official Certificate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: VERIFIABLE CERTIFICATE VIEWER */}
        {activeTab === 'certificate' && activeCertificate && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border-4 border-[#0F2B48] rounded-3xl p-8 sm:p-12 shadow-xl relative text-center space-y-6 text-[#0F2B48]">
              <div className="flex justify-center">
                <BPWLogo variant="light-bg" size="lg" subBrand="academy" />
              </div>

              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#E55812] font-bold">
                  BHARAT PETROWORK TECHNICAL EDUCATION & CERTIFICATION BOARD
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2B48] mt-2 tracking-tight">
                  Certificate of Technical Competence
                </h2>
                <div className="text-xs text-slate-500 mt-1">
                  Accredited Petroleum Hazardous Operations Standards (OISD-141 / PESO Protocol)
                </div>
              </div>

              <div className="py-2">
                <div className="text-xs text-slate-500">This is to officially certify that</div>
                <div className="text-2xl font-bold text-[#0F2B48] font-serif mt-1">
                  {activeCertificate.enrollment.userName}
                </div>
                <div className="text-xs text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
                  has demonstrated verified competence in hazardous area safety protocols, electrofusion welding, flameproof electrical inspection, and field practical demonstrations for:
                </div>
                <div className="text-lg font-extrabold text-[#E55812] mt-2">
                  {activeCertificate.course.title}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-xs">
                <div>
                  <div className="text-slate-400 text-[10px]">Certificate ID</div>
                  <div className="font-mono font-bold text-[#0F2B48] text-xs">
                    {activeCertificate.enrollment.certificateId || 'BPW-CERT-2026-88194'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Date of Certification</div>
                  <div className="font-mono font-bold text-slate-700">
                    {activeCertificate.enrollment.completedAt || new Date().toISOString().split('T')[0]}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Registry Status</div>
                  <div className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    VERIFIED OFFICIAL
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4 text-[#F59E0B]" /> Print / Download Official Certificate
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
