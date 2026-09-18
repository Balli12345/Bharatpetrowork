import React, { useState } from 'react';
import {
  ShieldCheck,
  Wrench,
  Truck,
  Award,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  PhoneCall,
  HardHat,
  Zap,
  Flame,
  FileText,
  ChevronRight,
  Sparkles,
  Layers,
  Building,
  Fuel,
  Users,
  CheckCircle2,
  Calendar,
  Send,
  Phone,
  Mail,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import { CMSContent, ServiceCategory, PetrolPump, User } from '../types';
import { BPWLogo } from './brand/BPWLogo';
import { BPW_BRAND_CONSTANTS } from './brand';

export interface PublicWebsiteProps {
  cms: CMSContent;
  categories: ServiceCategory[];
  pumps?: PetrolPump[];
  currentUser?: User;
  onRequestService?: (req: any) => Promise<any>;
  onNavigate?: (view: string, extra?: any) => void;
  onOpenAudit: () => void;
  onOpenAI: () => void;
  onOpenAuth?: (portal: any) => void;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({
  cms,
  categories,
  pumps = [],
  currentUser,
  onRequestService,
  onNavigate,
  onOpenAudit,
  onOpenAI,
  onOpenAuth
}) => {
  // Direct Quick Inquiry State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryPump, setInquiryPump] = useState('');
  const [inquiryCategory, setInquiryCategory] = useState(categories[0]?.name || 'Mechanical Works');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Emergency Breakdown State
  const [emergencyPumpName, setEmergencyPumpName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyLocation, setEmergencyLocation] = useState('');
  const [emergencyIssue, setEmergencyIssue] = useState('Dispenser Hydraulic Lock / Delivery Motor Failure');
  const [emergencySubmitted, setEmergencySubmitted] = useState(false);

  const navigateTo = (view: string, extra?: any) => {
    if (onNavigate) {
      onNavigate(view, extra);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryPhone.trim()) return;

    if (onRequestService) {
      await onRequestService({
        clientId: currentUser?.id || 'usr-client-1',
        clientName: inquiryName || currentUser?.name || 'Inquiry Contact',
        pumpId: pumps[0]?.id || 'pmp-101',
        pumpName: inquiryPump || 'Forecourt Fuel Station',
        categoryId: 'cat-mech',
        categoryName: inquiryCategory,
        title: `Public Inquiry: ${inquiryCategory}`,
        description: inquiryMessage || 'Requested consultation and site visit via public portal.',
        priority: 'MEDIUM',
        status: 'NEW',
        assignedEngineerId: null,
        assignedEngineerName: null,
        assignedVanId: null,
        estimatedCost: 8500,
        finalCost: null,
        scheduledDate: new Date().toISOString().split('T')[0],
        completedDate: null,
        lotoApplied: false,
        zeroLelConfirmed: false,
        partsUsed: [],
        technicianNotes: null,
        customerRating: null
      });
    }

    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryName('');
      setInquiryPhone('');
      setInquiryPump('');
      setInquiryMessage('');
    }, 4000);
  };

  const handleEmergencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emergencyPhone.trim()) return;

    if (onRequestService) {
      await onRequestService({
        clientId: currentUser?.id || 'usr-client-1',
        clientName: 'Forecourt Station Emergency Desk',
        pumpId: pumps[0]?.id || 'pmp-101',
        pumpName: emergencyPumpName || 'Highway Retail Outlet',
        categoryId: 'cat-disp',
        categoryName: 'Dispenser & Hydraulics',
        title: `EMERGENCY 45-MIN BREAKDOWN: ${emergencyIssue}`,
        description: `Rapid emergency dispatch requested for ${emergencyLocation || 'Forecourt site'}. Contact: ${emergencyPhone}. Issue: ${emergencyIssue}`,
        priority: 'EMERGENCY',
        status: 'NEW',
        assignedEngineerId: null,
        assignedEngineerName: null,
        assignedVanId: null,
        estimatedCost: 12500,
        finalCost: null,
        scheduledDate: new Date().toISOString().split('T')[0],
        completedDate: null,
        lotoApplied: false,
        zeroLelConfirmed: false,
        partsUsed: [],
        technicianNotes: null,
        customerRating: null
      });
    }

    setEmergencySubmitted(true);
    setTimeout(() => {
      setEmergencySubmitted(false);
      setEmergencyPumpName('');
      setEmergencyPhone('');
      setEmergencyLocation('');
    }, 5000);
  };

  // Official Service Disciplines from Bharat PetroWork Architecture
  const services = [
    {
      id: 'civil',
      title: 'Civil Works',
      icon: HardHat,
      desc: 'Site development, foundation engineering, canopy installation, RCC driveway paving, and hydrocarbon-resistant drainage.',
      features: ['PESO Compliant Foundations', 'Heavy-Duty RCC Driveways', 'Underground Tank Pits & Retaining Walls']
    },
    {
      id: 'mech',
      title: 'Mechanical Works',
      icon: Wrench,
      desc: 'Fuel storage tanks, double-wall electrofusion piping systems, multi-product dispensers, shear valves, and submersible turbine pumps (STP).',
      features: ['Multi-Product Dispenser Erection', 'Double-Wall HDPE Piping', 'Overfill Prevention Valves (OPV)']
    },
    {
      id: 'elec',
      title: 'Electrical Works',
      icon: Zap,
      desc: 'Flameproof (FLP) Zone 0/1/2 wiring, automated ATG consoles, chemical earthing grids, and high-efficiency forecourt LED lighting.',
      features: ['FLP Cable Glanding & Sealing', 'Chemical Earthing Pits < 2Ω', 'Automated Tank Gauge (ATG) Wiring']
    },
    {
      id: 'safety',
      title: 'Fire & Safety Systems',
      icon: Flame,
      desc: 'OISD-141 compliant fire water ring mains, automatic DCP foam systems, vapor recovery units (VRU), and safety compliance audits.',
      features: ['OISD-141 Audits & Rectification', 'PESO Statutory Inspection Ready', 'Fire Hydrant & Monitor Systems']
    },
    {
      id: 'om',
      title: 'Maintenance Support (O&M)',
      icon: Clock,
      desc: 'Routine inspections, 24/7 emergency technician dispatch, meter calibration, and comprehensive multi-year Annual Maintenance Contracts (AMC).',
      features: ['45-Minute Emergency SLA', 'Quarterly Preventive Maintenance', 'W&M Stamping & Meter Verification']
    },
    {
      id: 'tank',
      title: 'Tank Rehabilitation',
      icon: ShieldCheck,
      desc: 'Robotic de-sludging, ultrasonic tank shell integrity scanning, internal epoxy/polyurethane lining, and zero-shutdown leak sealing.',
      features: ['Ultrasonic Non-Destructive Testing', 'Internal Corrosion Barrier Lining', 'Zero-Downtime Station Rehabilitation']
    }
  ];

  // Work Process Stages
  const workProcess = [
    {
      step: '01',
      title: 'Planning & Consultation',
      desc: 'Detailed site survey, hazardous area zoning analysis, OISD/PESO statutory review, and layout schematics.'
    },
    {
      step: '02',
      title: 'Design & Engineering',
      desc: 'Precise CAD blueprints, hydraulic flow calculations, flameproof electrical load schedules, and safety barrier specifications.'
    },
    {
      step: '03',
      title: 'Execution & Installation',
      desc: 'Turnkey execution by certified petroleum engineers adhering strictly to Lock-Out Tag-Out (LOTO) protocols.'
    },
    {
      step: '04',
      title: 'Testing & Compliance',
      desc: 'Hydrostatic pressure tests, zero LEL vapor gas detection, electrical insulation checks, and statutory sign-offs.'
    },
    {
      step: '05',
      title: 'Handover & 24/7 Support',
      desc: 'Commissioning, digital asset tagging into Pump Mitra, and round-the-clock rapid dispatch coverage.'
    }
  ];

  // Industries Served
  const industries = [
    {
      title: 'Retail Petrol Pumps',
      desc: 'Turnkey development and maintenance for retail dealer networks across IOCL, BPCL, HPCL, Nayara, Reliance, and Shell.',
      count: '1,450+ Outlets'
    },
    {
      title: 'Fuel Storage Facilities',
      desc: 'High-volume inland fuel depots, bulk storage tank farms, and private fleet fueling stations.',
      count: '80+ Depots'
    },
    {
      title: 'Oil Terminals',
      desc: 'High-pressure pipeline terminal manifolds, bulk loading gantries, and additive injection skids.',
      count: '35+ Terminals'
    },
    {
      title: 'Fuel Transport Companies',
      desc: 'Automated fleet dispensing stations, bowser calibration, and captive bulk diesel delivery depots.',
      count: '120+ Fleet Yards'
    },
    {
      title: 'Industrial Fuel Systems',
      desc: 'Manufacturing units, heavy mining facilities, processing plants, and commercial infrastructure power installations.',
      count: '210+ Industrial Sites'
    }
  ];

  return (
    <div className="bg-white text-[#0F2B48]">
      {/* 1. HERO SECTION: Official Corporate Infrastructure Branding */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-10 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0F2B48] text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
                <span>India’s Premier Fuel Infrastructure & Petroleum Engineering Company</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F2B48] tracking-tight leading-[1.12]">
                Building India’s Fuel Infrastructure with{' '}
                <span className="text-[#E55812]">Precision & Trust</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
                Bharat PetroWork is an advanced technical and engineering services company in India specializing in developing petrol pumps and modern fuel stations. We offer end-to-end solutions covering civil construction, pipeline systems, tank rehabilitation, dispenser maintenance, and 24/7 digital operations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigateTo('pump-mitra')}
                  className="px-6 py-3.5 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#0F2B48]/20 transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Fuel className="w-4 h-4 text-[#F59E0B]" />
                  Launch Pump Mitra Portal
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('emergency-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-red-600/20 transition transform hover:-translate-y-0.5 cursor-pointer animate-pulse"
                >
                  <AlertTriangle className="w-4 h-4 text-white" />
                  24/7 Emergency Breakdown
                </button>

                <button
                  onClick={() => navigateTo('e-market')}
                  className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F2B48] font-bold text-sm flex items-center gap-2 border border-slate-200 transition cursor-pointer"
                >
                  E-Marketplace
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Corporate Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ISO 9001:2015 Certified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>PESO Statutory Approved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>OISD-141 Safety Compliant</span>
                </div>
              </div>
            </div>

            {/* Right Card: Rapid Service Booking Form */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative">
                <div className="absolute -top-3.5 right-6 bg-[#E55812] text-white text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Central Helpdesk
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0F2B48] flex items-center justify-center font-bold">
                    <Truck className="w-6 h-6 text-[#E55812]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#0F2B48]">Request Station Service</h3>
                    <p className="text-xs text-slate-500">Direct booking with Bharat PetroWork Dispatch</p>
                  </div>
                </div>

                {inquirySubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-800 space-y-2">
                    <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-extrabold text-base">Service Request Registered!</h4>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Your ticket has been recorded in the central dispatcher queue. Our area field supervisor will contact you within 15 minutes.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Name / Station Manager *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Chandra"
                        value={inquiryName}
                        onChange={e => setInquiryName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F2B48] text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Contact *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={inquiryPhone}
                          onChange={e => setInquiryPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F2B48] text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Retail Outlet (RO) / City</label>
                        <input
                          type="text"
                          placeholder="e.g. IOCL Hub Noida"
                          value={inquiryPump}
                          onChange={e => setInquiryPump(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F2B48] text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Service Requirement</label>
                      <select
                        value={inquiryCategory}
                        onChange={e => setInquiryCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F2B48] bg-white text-slate-900"
                      >
                        <option>Mechanical & Piping Installation</option>
                        <option>Underground Tank Rehabilitation & Lining</option>
                        <option>Dispenser Breakdown & Calibration</option>
                        <option>Flameproof Electrical & ATG Automation</option>
                        <option>Annual Maintenance Contract (AMC)</option>
                        <option>Fire Safety & PESO Compliance Audit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Brief Description of Work</label>
                      <textarea
                        rows={2}
                        placeholder="Provide details about symptoms, equipment model, or scope..."
                        value={inquiryMessage}
                        onChange={e => setInquiryMessage(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F2B48] text-slate-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Service Request</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS KPI BANNER */}
      <section className="bg-[#0F2B48] text-white py-12 border-y border-[#1A4068]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#F59E0B] font-mono">100+</div>
              <div className="text-xs sm:text-sm text-slate-300 font-semibold mt-1">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">24/7</div>
              <div className="text-xs sm:text-sm text-slate-300 font-semibold mt-1">Support Desk Available</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#F59E0B] font-mono">10+</div>
              <div className="text-xs sm:text-sm text-slate-300 font-semibold mt-1">Years Industry Experience</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">{cms.stats.pumpsServiced}+</div>
              <div className="text-xs sm:text-sm text-slate-300 font-semibold mt-1">Petrol Pumps Serviced</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">99.8%</div>
              <div className="text-xs sm:text-sm text-slate-300 font-semibold mt-1">Forecourt Uptime SLA</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT US SECTION */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-bold">
                ABOUT BHARAT PETROWORK
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48] tracking-tight">
                Developing Petrol Pumps & Modern Fuel Stations Across India
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Bharat PetroWork is an infrastructure and engineering services company dedicated to building India’s fuel infrastructure with precision and trust. We specialize in developing petrol pumps and fuel stations across the country, providing comprehensive end-to-end solutions.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                From initial site survey, canopy erection, and underground tank installation to advanced tank rehabilitation, leak detection, and automation systems, our multidisciplinary teams of certified petroleum engineers deliver solutions that meet the highest standards of safety, quality, and regulatory compliance.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="font-extrabold text-sm text-[#0F2B48] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#E55812]" />
                    End-to-End Solutions
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Design, civil construction, mechanical piping, and digital operations.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="font-extrabold text-sm text-[#0F2B48] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#E55812]" />
                    Regulatory Compliance
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    100% adherence to PESO, OISD-141, and local municipal bylaws.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              {/* Three Core Pillars: Project Planning, Quality Inspection, Maintenance Support */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0F2B48] transition">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0F2B48] text-white flex items-center justify-center font-bold shrink-0">
                    <Building className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0F2B48]">Project Planning — Concept to Completion</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      We manage all stages of fuel station development with detailed planning, engineering expertise, site layout design, execution strategy, and quality-focused project management.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0F2B48] transition">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0F2B48] text-white flex items-center justify-center font-bold shrink-0">
                    <Award className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0F2B48]">Quality Inspection — Safety & Rigor</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Our teams adhere to strict petroleum infrastructure standards, conducting rigorous safety checks, quality inspections, ultrasonic wall-thickness tests, and statutory audits.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0F2B48] transition">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0F2B48] text-white flex items-center justify-center font-bold shrink-0">
                    <Clock className="w-6 h-6 text-[#E55812]" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0F2B48]">Maintenance Support — 24/7 Operations</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      We provide ongoing support through routine inspections, servicing, emergency repairs, and Annual Maintenance Contracts (AMC) to ensure uninterrupted forecourt operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE SERVICES GRID */}
      <section id="services" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 text-[#0F2B48] text-xs font-bold">
              COMPREHENSIVE CAPABILITIES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48] tracking-tight">
              Specialized Petroleum Infrastructure Engineering Services
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every discipline is executed by certified technical crews equipped with mobile service vans and specialized petroleum diagnostic tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:border-[#0F2B48] transition group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#0F2B48] flex items-center justify-center group-hover:bg-[#0F2B48] group-hover:text-white transition">
                      <Icon className="w-6 h-6 text-[#E55812]" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#0F2B48]">{service.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{service.desc}</p>
                    
                    <ul className="space-y-2 pt-2 border-t border-slate-100">
                      {service.features.map((f, i) => (
                        <li key={i} className="text-[11px] font-medium text-slate-700 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <button
                      onClick={() => navigateTo('pump-mitra')}
                      className="text-xs font-bold text-[#0F2B48] group-hover:text-[#E55812] flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>Book Service via Pump Mitra</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TANK REHABILITATION SPECIAL FOCUS */}
      <section id="tank-rehab" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-[#0F2B48] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-[#1A4068]/30 to-transparent pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-bold">
                  FLAGSHIP ENGINEERING SERVICE
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Underground Tank Rehabilitation Systems & Environmental Protection
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                  Bharat PetroWork specializes in fuel infrastructure rehabilitation, safety enhancement, and environmental protection. Our underground tank rehabilitation services include tank renovation, internal lining, precision leak detection, and de-sludging without requiring excavation or shutting down retail sales.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                    <div className="font-bold text-sm text-[#F59E0B]">Site Survey & Testing</div>
                    <div className="text-xs text-slate-300 mt-0.5">Ultrasonic wall scanning and hydrostatic pressure leak tests.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                    <div className="font-bold text-sm text-[#F59E0B]">Robotic Sludge Removal</div>
                    <div className="text-xs text-slate-300 mt-0.5">Zero-entry vacuum de-sludging and tank floor degreasing.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                    <div className="font-bold text-sm text-[#F59E0B]">Internal Epoxy Lining</div>
                    <div className="text-xs text-slate-300 mt-0.5">Double-layer hydrocarbon barrier coating with 10-year warranty.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                    <div className="font-bold text-sm text-[#F59E0B]">Commissioning & Cert</div>
                    <div className="text-xs text-slate-300 mt-0.5">PESO statutory certification and calibration verification.</div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-4">
                  <button
                    onClick={() => navigateTo('pump-mitra')}
                    className="px-6 py-3 rounded-xl bg-[#E55812] hover:bg-[#D9480F] text-white font-bold text-xs shadow-lg transition cursor-pointer"
                  >
                    Schedule Tank Inspection
                  </button>
                  <button
                    onClick={onOpenAI}
                    className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/30 transition cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                    AI Tank CAD Analysis
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white text-[#0F2B48] rounded-2xl p-6 shadow-xl">
                <h3 className="font-extrabold text-base mb-3">Rehabilitation Highlights</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">1</div>
                    <div>
                      <div className="font-bold">Zero Excavation Required</div>
                      <div className="text-slate-500">Eliminates forecourt driveway digging and prevents station revenue loss.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">2</div>
                    <div>
                      <div className="font-bold">10-Year Anti-Corrosion Warranty</div>
                      <div className="text-slate-500">Dual-component polyurethane lining provides total fuel barrier shield.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">3</div>
                    <div>
                      <div className="font-bold">OISD-141 Safety Standard Compliant</div>
                      <div className="text-slate-500">Fully inspected and certified for explosive Zone-1 vapor protection.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WORK PROCESS */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
              SYSTEMATIC EXECUTION
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48] tracking-tight">
              Our 5-Stage Engineering Work Process
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every project follows our standardized, quality-assured engineering methodology from concept to operational handover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {workProcess.map((step, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl font-extrabold text-[#E55812] font-mono mb-3">{step.step}</div>
                  <h3 className="text-base font-extrabold text-[#0F2B48] mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <span>Phase {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. INDUSTRIES SERVED */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 text-[#0F2B48] text-xs font-bold">
              MARKET FOOTPRINT
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48] tracking-tight">
              Industries & Fuel Sectors We Serve
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Bharat PetroWork delivers specialized engineering, maintenance, and technical solutions across petroleum retail and industrial sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {industries.map((ind, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-extrabold text-[#E55812] uppercase tracking-wider mb-2 font-mono">
                    {ind.count}
                  </div>
                  <h3 className="text-sm font-extrabold text-[#0F2B48] mb-2">{ind.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{ind.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1 text-[11px] font-bold text-[#0F2B48]">
                  <span>Active Network</span>
                  <ChevronRight className="w-3 h-3 text-[#E55812]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PUMP MITRA ECOSYSTEM CONNECTIVITY */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                PUMP MITRA DIGITAL PLATFORM
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48] tracking-tight">
                Smart Infrastructure Maintenance for Petrol Pump Owners
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Pump Mitra is Bharat PetroWork's dedicated digital platform connecting petrol pump owners, certified petroleum engineers, and infrastructure companies. It provides seamless management of fuel stations:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { title: 'Tank Cleaning & Testing', desc: 'Book ultrasonic tests, sludge suction, and water ingress checks.' },
                  { title: 'Pipeline Installation', desc: 'Monitor electrofusion double-wall HDPE line installations.' },
                  { title: 'Leak Detection', desc: 'Automated sensor diagnostics and zero LEL vapor scanning.' },
                  { title: 'Dispenser Repair', desc: 'Nozzle calibration, pulser repair, and motor replacements.' },
                  { title: 'AMC Maintenance', desc: 'Scheduled quarterly preventive servicing with SLA tracking.' },
                  { title: 'Automation Systems', desc: 'IoT ATG level integration and forecourt POS connectivity.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <div className="font-bold text-xs text-[#0F2B48]">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigateTo('pump-mitra')}
                  className="px-6 py-3.5 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <span>Enter Pump Mitra Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-[#0F2B48] text-white rounded-3xl p-8 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <BPWLogo variant="dark-bg" size="sm" subBrand="pump-mitra" />
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    LIVE ECOSYSTEM
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                    <div className="text-xs text-slate-400">Step 1: Station Owner</div>
                    <div className="font-bold text-sm text-white mt-0.5">Dealer logs ticket on Pump Mitra app</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                    <div className="text-xs text-slate-400">Step 2: Central Control</div>
                    <div className="font-bold text-sm text-amber-300 mt-0.5">Admin assigns certified Field Engineer & Mobile Van</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                    <div className="text-xs text-slate-400">Step 3: On-Site Execution</div>
                    <div className="font-bold text-sm text-white mt-0.5">Engineer performs LOTO, parts replacement, and digital sign-off</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                    <div className="text-xs text-slate-400">Step 4: Real-time Settlement</div>
                    <div className="font-bold text-sm text-emerald-300 mt-0.5">Invoice generated with GST, auto inventory deduction, ticket closed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. EMERGENCY BREAKDOWN SECTION (45-MIN SLA) */}
      <section id="emergency-section" className="py-20 bg-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                24/7 FORECOURT HAZMAT & EMERGENCY SLA
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                45-Minute Emergency Breakdown Rapid Dispatch
              </h2>
              <p className="text-red-100 text-sm leading-relaxed">
                A fuel dispenser breakdown, hydraulic failure, shear valve trip, or vapor leak immediately halts station revenue. Our rapid mobile response units are equipped with flameproof safety tools, spare parts, and certified petroleum technicians for immediate dispatch.
              </p>
              <div className="flex items-center gap-4 text-xs font-bold pt-2">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-amber-300" />
                  <span>Immediate Escalation: +91 85270 23022 / 1800-890-BPWORK</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span>Average Arrival: 38 Mins</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white text-[#0F2B48] rounded-3xl p-6 sm:p-8 shadow-2xl">
              {emergencySubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-red-700">EMERGENCY DISPATCH INITIATED!</h3>
                  <p className="text-xs text-slate-600">
                    The nearest Bharat PetroWork service van has been notified with your coordinates. Keep your phone line active for immediate dispatch confirmation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEmergencySubmit} className="space-y-3">
                  <div className="font-extrabold text-base text-[#0F2B48] mb-1">
                    Instant Forecourt Emergency Dispatch
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Station / RO Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Highway Fuel Center RO-10492"
                      value={emergencyPumpName}
                      onChange={e => setEmergencyPumpName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98112 34567"
                        value={emergencyPhone}
                        onChange={e => setEmergencyPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Site Location / Highway</label>
                      <input
                        type="text"
                        placeholder="e.g. NH-24 Km 42"
                        value={emergencyLocation}
                        onChange={e => setEmergencyLocation(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Incident Nature</label>
                    <select
                      value={emergencyIssue}
                      onChange={e => setEmergencyIssue(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-red-600 bg-white"
                    >
                      <option>Dispenser Hydraulic Lock / Motor Failure</option>
                      <option>Underground Pipe Vapor Leakage / Pressure Drop</option>
                      <option>Submersible Turbine Pump (STP) Trip</option>
                      <option>Shear Valve Impact / Fuel Shutoff</option>
                      <option>Flameproof Electrical Tripping / Flash Alert</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4 text-white" />
                    <span>DISPATCH EMERGENCY VAN NOW</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 10. CONTACT US SECTION */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 text-[#0F2B48] text-xs font-bold">
                GET IN TOUCH
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B48] tracking-tight">
                Connect with Bharat PetroWork Central Technical Desk
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed font-normal">
                Whether you require turnkey petrol pump development, underground tank rehabilitation, emergency repair, or AMC coverage, our technical directors and field engineers are ready to assist.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0F2B48] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#E55812]" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#0F2B48]">Corporate Headquarters</div>
                    <div className="text-xs text-slate-600 mt-0.5">{BPW_BRAND_CONSTANTS.headquarters}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0F2B48] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#E55812]" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#0F2B48]">24/7 National Helpdesk</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Toll-Free: {BPW_BRAND_CONSTANTS.tollFree} | Mobile: {BPW_BRAND_CONSTANTS.supportHotline}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0F2B48] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#E55812]" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#0F2B48]">Email Inquiries</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {BPW_BRAND_CONSTANTS.email} | {BPW_BRAND_CONSTANTS.infoEmail}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-8">
              <h3 className="text-lg font-extrabold text-[#0F2B48] mb-4">Send a Direct Message / RFQ</h3>
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={inquiryName}
                      onChange={e => setInquiryName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={inquiryPhone}
                      onChange={e => setInquiryPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message or Project Scope</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your site details, fuel station location, equipment requirements..."
                    value={inquiryMessage}
                    onChange={e => setInquiryMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs flex items-center gap-2 shadow transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Bharat PetroWork</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CORPORATE FOOTER */}
      <footer className="bg-[#0A1C30] text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
            {/* Brand column */}
            <div className="lg:col-span-2 space-y-4">
              <BPWLogo variant="dark-bg" size="lg" showTagline={true} />
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Bharat PetroWork is India’s dedicated petroleum engineering and infrastructure ecosystem, developing fuel stations, executing underground tank rehabilitation, and ensuring uninterrupted forecourt uptime.
              </p>
              <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                <div>GSTIN: {BPW_BRAND_CONSTANTS.gstin}</div>
                <div>CIN: {BPW_BRAND_CONSTANTS.cin}</div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">Portals</div>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => navigateTo('pump-mitra')} className="hover:text-amber-400 transition cursor-pointer">
                    Pump Mitra Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('engineer')} className="hover:text-amber-400 transition cursor-pointer">
                    Field Engineer App
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('e-market')} className="hover:text-amber-400 transition cursor-pointer">
                    E-Marketplace
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('academy')} className="hover:text-amber-400 transition cursor-pointer">
                    BPW Technical Academy
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('jobs')} className="hover:text-amber-400 transition cursor-pointer">
                    Jobs & Career
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('admin-crm')} className="hover:text-amber-400 transition cursor-pointer">
                    Operations Control Center
                  </button>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <div className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">Services</div>
              <ul className="space-y-2 text-xs">
                <li>Tank Rehabilitation Systems</li>
                <li>Civil Driveways & Canopies</li>
                <li>Electrofusion HDPE Piping</li>
                <li>Dispenser Erection & Calibration</li>
                <li>Flameproof Electrical Zone-1</li>
                <li>OISD-141 Safety Compliance</li>
              </ul>
            </div>

            {/* Compliance & Emergency */}
            <div>
              <div className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">Emergency & Trust</div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-200">
                  <div className="font-bold text-[11px] text-red-300">24/7 HazMat Response:</div>
                  <div className="font-mono font-bold mt-0.5">+91 85270 23022 / 1800-890-BPWORK</div>
                </div>
                <div className="text-[11px] text-slate-400">
                  Certified: ISO 9001:2015, PESO Approved, OISD Compliant.
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              © {new Date().getFullYear()} {BPW_BRAND_CONSTANTS.legalName}. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Statutory Compliance</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
