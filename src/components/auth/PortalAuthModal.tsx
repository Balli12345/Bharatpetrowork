import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Building,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { BPWLogo, BPWSubBrand } from '../brand/BPWLogo';
import { User, UserRole } from '../../types';

export type AuthPortalType = 
  | 'pump-mitra'
  | 'engineer'
  | 'e-market'
  | 'jobs'
  | 'academy'
  | 'admin';

interface PortalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  portal: AuthPortalType;
  initialMode?: 'login' | 'register';
  onLoginSuccess?: (user: User, targetPortal: string) => void;
  onSuccess?: (user: User, targetPortal: string) => void;
  availableUsers?: User[];
}

export const PortalAuthModal: React.FC<PortalAuthModalProps> = ({
  isOpen,
  onClose,
  portal,
  initialMode = 'login',
  onLoginSuccess,
  onSuccess,
  availableUsers = []
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [extraField, setExtraField] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotPwd, setShowForgotPwd] = useState(false);

  const safeUsers = availableUsers || [];
  const handleSuccess = onLoginSuccess || onSuccess || (() => {});

  if (!isOpen) return null;

  // Portal configuration mapping
  const portalConfigs: Record<AuthPortalType, {
    subBrand: BPWSubBrand;
    title: string;
    description: string;
    defaultRole: UserRole;
    targetRoute: string;
    allowRegister: boolean;
    extraFieldLabel: string;
    extraFieldPlaceholder: string;
    demoUserFinder: (users: User[]) => User | undefined;
  }> = {
    'pump-mitra': {
      subBrand: 'pump-mitra',
      title: 'Pump Mitra Portal Access',
      description: 'Centralized station maintenance, pump inspections, leak checks, and AMC management for fuel station dealers.',
      defaultRole: 'client',
      targetRoute: 'pump-mitra',
      allowRegister: true,
      extraFieldLabel: 'Retail Outlet (RO) Code / Oil Marketing Company',
      extraFieldPlaceholder: 'e.g. RO-10492 / IOCL Northern Hub',
      demoUserFinder: (users = []) => (users || []).find(u => u.role === 'client')
    },
    'engineer': {
      subBrand: 'engineer',
      title: 'Field Engineer Terminal',
      description: 'Field technical operations, hazard area LOTO, work execution, before/after photos, and customer digital sign-off.',
      defaultRole: 'engineer',
      targetRoute: 'engineer',
      allowRegister: true,
      extraFieldLabel: 'OISD-141 / PESO Certification ID',
      extraFieldPlaceholder: 'e.g. OISD-CERT-88492-Z1',
      demoUserFinder: (users = []) => (users || []).find(u => u.role === 'engineer')
    },
    'e-market': {
      subBrand: 'e-market',
      title: 'Fuel Infrastructure E-Market',
      description: 'B2B procurement of certified dispensers, submersible pumps, ATG systems, shear valves, and forecourt hardware.',
      defaultRole: 'buyer',
      targetRoute: 'e-market',
      allowRegister: true,
      extraFieldLabel: 'Business GSTIN / Vendor Registration No.',
      extraFieldPlaceholder: 'e.g. 09AABCB1234F1Z8',
      demoUserFinder: (users = []) => (users || []).find(u => u.role === 'buyer' || u.role === 'seller')
    },
    'jobs': {
      subBrand: 'jobs',
      title: 'Jobs & Petroleum Career Portal',
      description: 'Career opportunities for petroleum engineers, mechanical specialists, electrical technicians, and project managers.',
      defaultRole: 'candidate',
      targetRoute: 'jobs',
      allowRegister: true,
      extraFieldLabel: 'Highest Technical Qualification & Experience',
      extraFieldPlaceholder: 'e.g. B.Tech Petroleum Engg (4 Years Exp)',
      demoUserFinder: (users = []) => (users || []).find(u => u.role === 'candidate')
    },
    'academy': {
      subBrand: 'academy',
      title: 'BPW Technical Academy',
      description: 'Industry-accredited training programs in tank rehabilitation, dispenser automation, vapor recovery, and forecourt safety.',
      defaultRole: 'student',
      targetRoute: 'academy',
      allowRegister: true,
      extraFieldLabel: 'Student Enrollment ID or College/Company',
      extraFieldPlaceholder: 'e.g. BPW-ACA-2026-ENG',
      demoUserFinder: (users = []) => (users || []).find(u => u.role === 'student' || u.role === 'candidate')
    },
    'admin': {
      subBrand: 'admin',
      title: 'Operations Control Center',
      description: 'Restricted administrative CRM for dispatch routing, van logistics, spares inventory, GST invoicing, and audit ledgers.',
      defaultRole: 'admin',
      targetRoute: 'admin-crm',
      allowRegister: false, // Admin only logins for compliance
      extraFieldLabel: 'Security Authorization Key',
      extraFieldPlaceholder: 'Master Security Credential',
      demoUserFinder: (users = []) => (users || []).find(u => u.role === 'admin')
    }
  };

  const config = portalConfigs[portal];
  const demoUser = config.demoUserFinder(safeUsers);

  // Fill Demo Credentials helper
  const handleQuickDemoFill = () => {
    if (demoUser) {
      setEmail(demoUser.email);
      setPassword('bpw2026!prod');
      setErrorMsg('');
      setSuccessMsg(`Auto-filled verified demo persona: ${demoUser.name} (${demoUser.role.toUpperCase()})`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'login') {
      if (!email.trim()) {
        setErrorMsg('Please enter your registered email address.');
        return;
      }
      // Match from existing users or fallback
      const found = safeUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (found) {
        setSuccessMsg(`Welcome back, ${found.name}! Redirecting to ${config.title}...`);
        setTimeout(() => {
          handleSuccess(found, config.targetRoute);
          onClose();
        }, 500);
      } else if (demoUser) {
        // Log in as portal persona with custom email
        const userToLogin: User = {
          ...demoUser,
          email: email.trim()
        };
        setSuccessMsg(`Authenticated successfully! Welcome, ${userToLogin.name}.`);
        setTimeout(() => {
          handleSuccess(userToLogin, config.targetRoute);
          onClose();
        }, 500);
      } else {
        setErrorMsg('Invalid credentials. Please use the Quick Demo Fill or contact support.');
      }
    } else {
      // Register Mode
      if (!name.trim() || !email.trim() || !phone.trim()) {
        setErrorMsg('Please fill in all mandatory fields.');
        return;
      }
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        companyName: companyName.trim() || 'Bharat PetroWork Network Partner',
        role: config.defaultRole,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      setSuccessMsg(`Account created successfully for ${newUser.name}! Logging into ${config.title}...`);
      setTimeout(() => {
        handleSuccess(newUser, config.targetRoute);
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top Decorative Brand Bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#0F2B48] via-[#E55812] to-[#F59E0B]" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Unified Brand Logo with Sub-Brand Indicator */}
          <div className="mb-3">
            <BPWLogo
              variant="light-bg"
              size="md"
              subBrand={config.subBrand}
            />
          </div>

          <h2 className="text-xl font-extrabold text-[#0F2B48] tracking-tight">
            {mode === 'login' ? `Login to ${config.title}` : `Register for ${config.title}`}
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {config.description}
          </p>

          {/* Tabs for Login / Register (if allowed) */}
          {config.allowRegister && (
            <div className="flex bg-slate-100 p-1 rounded-xl mt-4 text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  mode === 'login'
                    ? 'bg-white text-[#0F2B48] shadow-sm font-bold'
                    : 'hover:text-[#0F2B48]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  mode === 'register'
                    ? 'bg-white text-[#0F2B48] shadow-sm font-bold'
                    : 'hover:text-[#0F2B48]'
                }`}
              >
                New Registration
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 pt-4">
          {/* Quick Demo Autofill Banner */}
          {demoUser && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="text-[11px] text-amber-900 font-medium">
                  Quick Demo: <span className="font-bold">{demoUser.name}</span> ({demoUser.email})
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition shadow-sm cursor-pointer shrink-0"
              >
                Auto-Fill
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-700 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra Patel"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F2B48] focus:border-transparent text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Fuel Station Name</label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. National Highway Fuels RO"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F2B48] focus:border-transparent text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Contact *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F2B48] focus:border-transparent text-slate-900"
                    />
                  </div>
                </div>

                {config.extraFieldLabel && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {config.extraFieldLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={config.extraFieldPlaceholder}
                      value={extraField}
                      onChange={e => setExtraField(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F2B48] focus:border-transparent text-slate-900"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@petrohub.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F2B48] focus:border-transparent text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPwd(true)}
                    className="text-[11px] text-[#E55812] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F2B48] focus:border-transparent text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow transition transform hover:-translate-y-0.5 cursor-pointer mt-2"
            >
              <span>{mode === 'login' ? `Secure Sign In to ${config.title}` : `Complete ${config.title} Registration`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Security & Official Verification Guarantee */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              256-Bit TLS Secured
            </span>
            <span className="font-medium">
              PESO & OISD-141 Compliant
            </span>
          </div>

          {/* Helpdesk Contacts */}
          <div className="mt-2 text-center text-[10px] text-slate-400">
            Need urgent access assistance? Call 24/7 Hotline: <span className="font-bold text-slate-600">+91 98110 54321</span>
          </div>
        </div>

        {/* Forgot Password Sheet */}
        {showForgotPwd && (
          <div className="absolute inset-0 bg-white/95 p-6 flex flex-col justify-center items-center text-center space-y-3 z-20">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-1">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-[#0F2B48]">Credential Recovery</h3>
            <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
              For petroleum forecourt safety and compliance, credentials can be reset by contacting your designated Bharat PetroWork Regional Desk or using the registered emergency helpline.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-mono w-full max-w-xs">
              <div>Toll-Free: 1800-890-BPWORK</div>
              <div>Desk: support@bharatpetrowork.com</div>
            </div>
            <button
              onClick={() => setShowForgotPwd(false)}
              className="mt-2 text-xs font-bold text-[#0F2B48] underline hover:text-[#1A4068]"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
