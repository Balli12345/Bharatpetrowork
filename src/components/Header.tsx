import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  Menu,
  X,
  User as UserIcon,
  ChevronDown,
  Bell,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Shield,
  Fuel,
  Wrench,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  LayoutDashboard,
  Truck
} from 'lucide-react';
import { BPWLogo, BPWSubBrand } from './brand/BPWLogo';
import { User, NotificationItem } from '../types';
import { AuthPortalType } from './auth/PortalAuthModal';

export interface HeaderProps {
  currentUser: User;
  allUsers: User[];
  notifications: NotificationItem[];
  activePortal: string;
  onSelectPortal: (portal: string) => void;
  onSwitchUser: (userId: string) => void;
  onMarkNotificationsRead: () => void;
  onOpenAuditModal: () => void;
  onOpenAIModal: () => void;
  onOpenAuthModal?: (portal: AuthPortalType, mode?: 'login' | 'register') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  notifications,
  activePortal,
  onSelectPortal,
  onSwitchUser,
  onMarkNotificationsRead,
  onOpenAuditModal,
  onOpenAIModal,
  onOpenAuthModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showPortalLoginDropdown, setShowPortalLoginDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const isPublic = activePortal === 'public';

  // Sub-brand determination for Portal mode
  const getSubBrand = (): BPWSubBrand => {
    switch (activePortal) {
      case 'pump-mitra': return 'pump-mitra';
      case 'engineer': return 'engineer';
      case 'e-market': return 'e-market';
      case 'jobs': return 'jobs';
      case 'academy': return 'academy';
      case 'admin-crm':
      case 'admin-app': return 'admin';
      default: return 'none';
    }
  };

  const portalList: { id: string; label: string; subBrand: BPWSubBrand; icon: any; authType: AuthPortalType }[] = [
    { id: 'public', label: 'Home', subBrand: 'none', icon: Fuel, authType: 'pump-mitra' },
    { id: 'pump-mitra', label: 'Pump Mitra', subBrand: 'pump-mitra', icon: LayoutDashboard, authType: 'pump-mitra' },
    { id: 'e-market', label: 'E-Marketing', subBrand: 'e-market', icon: ShoppingBag, authType: 'e-market' },
    { id: 'jobs', label: 'Jobs & Career', subBrand: 'jobs', icon: Briefcase, authType: 'jobs' },
    { id: 'academy', label: 'BPW Academy', subBrand: 'academy', icon: GraduationCap, authType: 'academy' },
    { id: 'engineer', label: 'Engineer App', subBrand: 'engineer', icon: Wrench, authType: 'engineer' },
    { id: 'delivery', label: 'Fleet & Delivery', subBrand: 'none', icon: Truck, authType: 'engineer' },
    { id: 'admin-crm', label: 'Control Center', subBrand: 'admin', icon: Shield, authType: 'admin' }
  ];

  const handleNavClick = (portalId: string, anchorId?: string) => {
    setMobileMenuOpen(false);
    if (portalId === 'public') {
      onSelectPortal('public');
      if (anchorId) {
        setTimeout(() => {
          const el = document.getElementById(anchorId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      onSelectPortal(portalId);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm select-none">
      {/* 1. Official Corporate Topbar Strip */}
      <div className="bg-[#0F2B48] text-white text-[11px] px-4 sm:px-6 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-4 text-slate-300">
          <span className="hidden sm:flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Official Portal: Bharat PetroWork Infrastructure
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#F59E0B]" />
            <span className="font-semibold text-white">+91 85270 23022</span> / 1800-890-BPWORK
          </span>
          <span className="hidden md:flex items-center gap-1">
            <Mail className="w-3 h-3 text-[#F59E0B]" />
            bharatpetrolwork@gmail.com
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden lg:flex items-center gap-1 text-slate-300 font-medium">
            <Clock className="w-3 h-3 text-[#F59E0B]" /> 24/7 Rapid Emergency Response SLA: 45 Mins
          </span>

          {/* Quick AI Diagnostics Trigger */}
          <button
            onClick={onOpenAIModal}
            className="flex items-center gap-1 bg-[#1A4068] hover:bg-[#235385] text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold transition border border-amber-400/30 cursor-pointer"
            title="Forecourt CAD Blueprint & Hazardous Zone AI Diagnostics"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>AI Diagnostics</span>
          </button>

          {/* Architecture Blueprint Trigger */}
          <button
            onClick={onOpenAuditModal}
            className="hidden sm:flex items-center gap-1 bg-slate-900/60 hover:bg-slate-900 text-slate-200 px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer"
          >
            <Layers className="w-3 h-3 text-amber-400" />
            <span>Architecture Specs</span>
          </button>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
        {/* Logo */}
        <button
          onClick={() => onSelectPortal('public')}
          className="cursor-pointer focus:outline-none flex items-center"
        >
          <BPWLogo
            variant="light-bg"
            size="lg"
            subBrand={isPublic ? 'none' : getSubBrand()}
            showTagline={isPublic}
          />
        </button>

        {/* Center Desktop Navigation for Public Website */}
        {isPublic ? (
          <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold text-[#0F2B48]">
            <button
              onClick={() => handleNavClick('public')}
              className="text-[#0F2B48] hover:text-[#E55812] transition cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('public', 'about')}
              className="text-slate-600 hover:text-[#E55812] transition cursor-pointer"
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('public', 'services')}
              className="text-slate-600 hover:text-[#E55812] transition cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick('public', 'tank-rehab')}
              className="text-slate-600 hover:text-[#E55812] transition cursor-pointer"
            >
              Tank Rehabilitation
            </button>
            <button
              onClick={() => onSelectPortal('pump-mitra')}
              className="text-emerald-700 hover:text-emerald-800 transition cursor-pointer flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md"
            >
              Pump Mitra
            </button>
            <button
              onClick={() => onSelectPortal('e-market')}
              className="text-slate-600 hover:text-[#E55812] transition cursor-pointer"
            >
              E-Marketing
            </button>
            <button
              onClick={() => onSelectPortal('jobs')}
              className="text-slate-600 hover:text-[#E55812] transition cursor-pointer"
            >
              Jobs & Career
            </button>
            <button
              onClick={() => onSelectPortal('academy')}
              className="text-slate-600 hover:text-[#E55812] transition cursor-pointer"
            >
              BPW Academy
            </button>
            <button
              onClick={() => handleNavClick('public', 'contact')}
              className="text-slate-600 hover:text-[#E55812] transition cursor-pointer"
            >
              Contact Us
            </button>
          </nav>
        ) : (
          /* Portal Breadcrumb & Switcher when inside an application */
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onSelectPortal('public')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#0F2B48] hover:bg-white transition cursor-pointer"
            >
              ← Public Website
            </button>
            <div className="h-4 w-[1px] bg-slate-300 mx-1" />
            {portalList.filter(p => p.id !== 'public').map(portal => {
              const active = activePortal === portal.id;
              const Icon = portal.icon;
              return (
                <button
                  key={portal.id}
                  onClick={() => onSelectPortal(portal.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    active
                      ? 'bg-[#0F2B48] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#0F2B48] hover:bg-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{portal.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Right Action Tools & Account / Login Area */}
        <div className="flex items-center gap-3">
          {/* Emergency Hotline Button */}
          <button
            onClick={() => {
              if (activePortal === 'public') {
                const el = document.getElementById('emergency-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else onSelectPortal('pump-mitra');
              } else {
                onSelectPortal('pump-mitra');
              }
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer animate-pulse"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Emergency 45-Min</span>
          </button>

          {/* Portal Access / Sign In Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowPortalLoginDropdown(!showPortalLoginDropdown)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs shadow-sm transition cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Portal Sign In</span>
              <ChevronDown className="w-3 h-3 text-slate-300" />
            </button>

            {/* Portal Login Dropdown Menu */}
            {showPortalLoginDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50">
                <div className="px-2 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Access Bharat PetroWork Portals
                </div>
                <div className="space-y-1 mt-2">
                  {[
                    { id: 'pump-mitra', title: 'Pump Mitra Portal', sub: 'Petrol Pump Dealers & Clients', auth: 'pump-mitra' as AuthPortalType, icon: LayoutDashboard },
                    { id: 'engineer', title: 'Field Engineer Terminal', sub: 'Field Technicians & Inspections', auth: 'engineer' as AuthPortalType, icon: Wrench },
                    { id: 'e-market', title: 'E-Market Marketplace', sub: 'B2B Equipment Procurement', auth: 'e-market' as AuthPortalType, icon: ShoppingBag },
                    { id: 'academy', title: 'BPW Academy', sub: 'Technical Training & Certifications', auth: 'academy' as AuthPortalType, icon: GraduationCap },
                    { id: 'jobs', title: 'Jobs & Career', sub: 'Petroleum Engineering Openings', auth: 'jobs' as AuthPortalType, icon: Briefcase },
                    { id: 'admin-crm', title: 'Control Center (Admin)', sub: 'Dispatch & Operations Command', auth: 'admin' as AuthPortalType, icon: Shield }
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setShowPortalLoginDropdown(false);
                          if (onOpenAuthModal) {
                            onOpenAuthModal(item.auth, 'login');
                          } else {
                            onSelectPortal(item.id);
                          }
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-start gap-2.5 transition cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#0F2B48] flex items-center justify-center shrink-0 group-hover:bg-[#0F2B48] group-hover:text-white transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-[#0F2B48] flex items-center justify-between">
                            <span>{item.title}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#E55812] transition" />
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">{item.sub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-[#0F2B48] hover:bg-slate-50 transition cursor-pointer"
              title="Operational Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Menu */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 text-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-bold text-[#0F2B48]">
                  <span>Operational Notifications ({notifications.length})</span>
                  <button
                    onClick={onMarkNotificationsRead}
                    className="text-[11px] text-[#E55812] hover:underline font-semibold cursor-pointer"
                  >
                    Mark All Read
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 mt-2">
                  {notifications.slice(0, 6).map(notif => (
                    <div
                      key={notif.id}
                      className={`py-2.5 px-2 text-xs rounded-xl transition ${
                        notif.read ? 'opacity-60' : 'bg-blue-50/50 border-l-2 border-[#0F2B48]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-[#0F2B48]">
                        <span className="flex items-center gap-1.5">
                          {notif.type === 'EMERGENCY' && <span className="text-red-500">🚨</span>}
                          {notif.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{notif.channel}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1 leading-snug">{notif.message}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => setShowNotifMenu(false)}
                    className="text-xs text-[#0F2B48] font-bold hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Persona Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer text-left"
              title="Switch Persona / User Simulation"
            >
              <div className="w-7 h-7 rounded-lg bg-[#0F2B48] text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden lg:block">
                <div className="text-xs font-bold text-[#0F2B48] truncate max-w-[100px]">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-slate-500 capitalize leading-none">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {/* Persona Switcher Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50">
                <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Switch Active Persona:
                </div>
                <div className="space-y-1 mt-1">
                  {allUsers.slice(0, 6).map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u.id);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                        currentUser.id === u.id
                          ? 'bg-[#0F2B48] text-white font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{u.name}</div>
                        <div className={`text-[10px] ${currentUser.id === u.id ? 'text-amber-300' : 'text-slate-500'}`}>
                          {u.companyName || u.role}
                        </div>
                      </div>
                      {currentUser.id === u.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#F59E0B]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Navigation</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('public')}
              className="p-2.5 rounded-xl bg-slate-50 text-left text-xs font-bold text-[#0F2B48]"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('public', 'about')}
              className="p-2.5 rounded-xl bg-slate-50 text-left text-xs font-bold text-[#0F2B48]"
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('public', 'services')}
              className="p-2.5 rounded-xl bg-slate-50 text-left text-xs font-bold text-[#0F2B48]"
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick('public', 'tank-rehab')}
              className="p-2.5 rounded-xl bg-slate-50 text-left text-xs font-bold text-[#0F2B48]"
            >
              Tank Rehabilitation
            </button>
            <button
              onClick={() => handleNavClick('public', 'contact')}
              className="p-2.5 rounded-xl bg-slate-50 text-left text-xs font-bold text-[#0F2B48]"
            >
              Contact Us
            </button>
          </div>

          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 pt-2">Application Portals</div>
          <div className="space-y-1.5">
            {portalList.filter(p => p.id !== 'public').map(p => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSelectPortal(p.id);
                  }}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-xs font-bold transition ${
                    activePortal === p.id
                      ? 'bg-[#0F2B48] text-white'
                      : 'bg-slate-50 text-[#0F2B48] hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#F59E0B]" />
                    <span>{p.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>24/7 Service Hotline:</span>
            <span className="font-bold text-[#0F2B48]">+91 98110 54321</span>
          </div>
        </div>
      )}
    </header>
  );
};
