import React, { useState } from 'react';
import {
  Fuel,
  AlertTriangle,
  Plus,
  Clock,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  FileText,
  Truck,
  Phone,
  Calendar,
  MapPin,
  ChevronRight,
  ExternalLink,
  Layers,
  ArrowRight,
  Download,
  Zap,
  Activity,
  Printer
} from 'lucide-react';
import {
  PetrolPump,
  ServiceRequest,
  ServiceCategory,
  AMCContract,
  MaintenanceSchedule,
  Invoice,
  DigitalDocument,
  User
} from '../types';
import { BPWLogo } from './brand/BPWLogo';
import { BPWDocumentViewer, BPWDocType } from './documents/BPWDocumentViewer';

interface PumpMitraProps {
  currentUser: User;
  pumps?: PetrolPump[];
  requests?: ServiceRequest[];
  categories?: ServiceCategory[];
  amcContracts?: AMCContract[];
  schedules?: MaintenanceSchedule[];
  invoices?: Invoice[];
  documents?: DigitalDocument[];
  emergencyContacts?: any[];
  onCreateRequest: (data: Partial<ServiceRequest>) => Promise<any>;
  onAddPump?: (data: Partial<PetrolPump>) => Promise<any>;
  onProcessPayment?: (invoiceId: string, gateway: string) => Promise<any>;
  onPayInvoice?: (invoiceId: string, gateway: string) => Promise<any>;
  onRenewAMC?: (amcId: string, pkg?: string, years?: number) => Promise<any>;
  onCreateAMC?: (amcData: Partial<AMCContract>) => Promise<any>;
  initialOpenEmergency?: boolean;
}

export const PumpMitraClientApp: React.FC<PumpMitraProps> = ({
  currentUser,
  pumps = [],
  requests = [],
  categories = [],
  amcContracts = [],
  schedules = [],
  invoices = [],
  documents = [],
  onCreateRequest,
  onAddPump = async (_data?: Partial<PetrolPump>) => {},
  onProcessPayment,
  onPayInvoice,
  onRenewAMC,
  onCreateAMC,
  initialOpenEmergency = false
}) => {
  const handlePayment = onProcessPayment || onPayInvoice || (async () => {});
  const handleRenewal = onRenewAMC || (async (id) => { if (onCreateAMC) await onCreateAMC({ id }); });
  const [activeTab, setActiveTab] = useState<'overview' | 'pumps' | 'requests' | 'amc' | 'invoices' | 'vault'>('overview');
  
  // Modals
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(initialOpenEmergency);
  const [showAddPumpModal, setShowAddPumpModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState<Invoice | null>(null);
  const [selectedRequestForTracking, setSelectedRequestForTracking] = useState<ServiceRequest | null>(null);
  const [docViewerData, setDocViewerData] = useState<{
    isOpen: boolean;
    type: BPWDocType;
    invoice?: Invoice | null;
    request?: ServiceRequest | null;
    amc?: AMCContract | null;
    document?: DigitalDocument | null;
  }>({ isOpen: false, type: 'invoice' });

  // Forms state
  const [reqPumpId, setReqPumpId] = useState(pumps[0]?.id || '');
  const [reqCategoryId, setReqCategoryId] = useState(categories[0]?.id || '');
  const [reqProblem, setReqProblem] = useState('');
  const [reqPriority, setReqPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('HIGH');
  const [reqDesc, setReqDesc] = useState('');
  const [reqDate, setReqDate] = useState(new Date().toISOString().split('T')[0]);

  // Emergency Form State
  const [emPumpId, setEmPumpId] = useState(pumps[0]?.id || '');
  const [emType, setEmType] = useState('Total Fuel Dispenser Failure');
  const [emDesc, setEmDesc] = useState('');
  const [emShareLocation, setEmShareLocation] = useState(true);

  // Add Pump Form State
  const [newPumpName, setNewPumpName] = useState('');
  const [newRoCode, setNewRoCode] = useState('');
  const [newOilCompany, setNewOilCompany] = useState<'IOCL' | 'BPCL' | 'HPCL' | 'Nayara' | 'Reliance' | 'Shell'>('IOCL');
  const [newCity, setNewCity] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newTanks, setNewTanks] = useState(2);
  const [newDispensers, setNewDispensers] = useState(4);
  const [newAtg, setNewAtg] = useState(true);

  // Payment Form
  const [paymentMethod, setPaymentMethod] = useState('UPI_QR');

  // Submit standard request
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateRequest({
      clientId: currentUser.id,
      pumpId: reqPumpId,
      categoryId: reqCategoryId,
      problemType: reqProblem || 'General Maintenance',
      priority: reqPriority,
      preferredDate: reqDate,
      description: reqDesc,
      isEmergency: false
    });
    setShowRequestModal(false);
    setReqProblem('');
    setReqDesc('');
    setActiveTab('requests');
  };

  // Submit emergency request
  const handleCreateEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateRequest({
      clientId: currentUser.id,
      pumpId: emPumpId,
      problemType: emType,
      emergencyType: emType,
      priority: 'EMERGENCY',
      isEmergency: true,
      description: emDesc || 'CRITICAL FAILURE: Immediate mobile technician dispatch needed',
      locationShared: emShareLocation
    });
    setShowEmergencyModal(false);
    setEmDesc('');
    setActiveTab('requests');
  };

  // Submit new pump
  const handleAddPump = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddPump({
      clientId: currentUser.id,
      clientName: currentUser.name,
      pumpName: newPumpName,
      roCode: newRoCode || `RO-${Math.floor(10000 + Math.random() * 90000)}-${newOilCompany}`,
      oilCompany: newOilCompany,
      city: newCity,
      address: newAddress,
      totalTanks: Number(newTanks),
      totalDispensers: Number(newDispensers),
      atgInstalled: newAtg
    });
    setShowAddPumpModal(false);
    setNewPumpName('');
    setNewCity('');
    setNewAddress('');
    setActiveTab('pumps');
  };

  // Payment confirmation
  const handleConfirmPayment = async () => {
    if (!showPaymentModal) return;
    await handlePayment(showPaymentModal.id, paymentMethod);
    setShowPaymentModal(null);
  };

  // Calculations
  const activeReqs = requests.filter(r => r.status !== 'COMPLETED' && r.status !== 'CLOSED' && r.status !== 'CANCELLED');
  const emergencyReqs = requests.filter(r => r.isEmergency && r.status !== 'COMPLETED' && r.status !== 'CLOSED');
  const pendingInvoices = invoices.filter(inv => inv.status === 'PENDING');
  const totalAmountDue = pendingInvoices.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-[#0F2B48] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top BPW Pump Mitra Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BPWLogo variant="light-bg" size="lg" subBrand="pump-mitra" />
            <div className="hidden sm:block border-l border-slate-200 pl-4">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-[#0F2B48]">Dealer Infrastructure Portal</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ACTIVE UPTIME
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Client: <span className="text-[#0F2B48] font-bold">{currentUser.name}</span> • 24/7 Field SLA
              </p>
            </div>
          </div>

          {/* Quick Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer animate-pulse"
            >
              <AlertTriangle className="w-4 h-4" />
              Emergency Breakdown (45m SLA)
            </button>
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#F59E0B]" />
              Raise Service Request
            </button>
            <button
              onClick={() => setShowAddPumpModal(true)}
              className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F2B48] border border-slate-200 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Fuel className="w-4 h-4 text-[#E55812]" />
              Add Outlet
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs scrollbar-none">
          {[
            { id: 'overview', label: 'Overview & Dashboard', icon: Activity },
            { id: 'pumps', label: `My Petrol Pumps (${pumps.length})`, icon: Fuel },
            { id: 'requests', label: `Service Requests (${requests.length})`, icon: Clock },
            { id: 'amc', label: `AMC & Maintenance (${amcContracts.length})`, icon: ShieldCheck },
            { id: 'invoices', label: `Invoices & Payments (${invoices.length})`, icon: CreditCard },
            { id: 'vault', label: `Digital Document Vault (${documents.length})`, icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer font-semibold ${
                  active
                    ? 'bg-[#0F2B48] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0F2B48] hover:bg-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">Registered Outlets</div>
                <div className="text-2xl font-extrabold text-white mt-1">{pumps.length}</div>
                <div className="text-[11px] text-blue-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> PESO Compliant
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">Active Service Tickets</div>
                <div className="text-2xl font-extrabold text-blue-400 mt-1">{activeReqs.length}</div>
                <div className="text-[11px] text-slate-400 mt-1">In progress & assigned</div>
              </div>

              <div className="bg-slate-900 border border-red-500/30 bg-red-950/10 rounded-xl p-4">
                <div className="text-xs text-red-400 font-semibold">Critical Breakdown</div>
                <div className="text-2xl font-extrabold text-red-400 mt-1">{emergencyReqs.length}</div>
                <div className="text-[11px] text-red-300 mt-1">45-min SLA dispatch</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">Active AMC Coverage</div>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                  {amcContracts.filter(c => c.status === 'ACTIVE').length} Outlets
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">Full 24/7 Coverage</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">Outstanding Invoices</div>
                <div className="text-2xl font-extrabold text-amber-400 mt-1">
                  ₹{totalAmountDue?.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-amber-300 mt-1">{pendingInvoices.length} Pending Bills</div>
              </div>
            </div>

            {/* Quick Live Request Tracker / Recent Request */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Latest Service Request Status
                  </h3>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    View All Tickets <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {requests.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">No service requests yet.</div>
                ) : (
                  <div className="space-y-4">
                    {requests.slice(0, 3).map(req => (
                      <div
                        key={req.id}
                        onClick={() => {
                          setSelectedRequestForTracking(req);
                          setActiveTab('requests');
                        }}
                        className="p-4 bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-xl transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-amber-400 font-bold">{req.id}</span>
                            <span className="text-xs font-bold text-white">{req.problemType}</span>
                            {req.isEmergency && (
                              <span className="px-2 py-0.5 rounded bg-red-600/30 border border-red-500 text-red-300 text-[10px] font-extrabold uppercase">
                                EMERGENCY
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">
                            {req.pumpName} ({req.oilCompany}) • Category: {req.categoryName}
                          </div>
                          {req.assignedEngineerName && (
                            <div className="text-xs text-blue-300 flex items-center gap-1.5 pt-1">
                              <Truck className="w-3.5 h-3.5 text-blue-400" />
                              Assigned: <span className="font-semibold">{req.assignedEngineerName}</span> ({req.assignedEngineerPhone})
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              req.status === 'COMPLETED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : req.status === 'WORK_IN_PROGRESS'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}
                          >
                            {req.status?.replace(/_/g, ' ')}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Maintenance Schedule / AMC status */}
              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    AMC & Safety Schedule
                  </h3>
                  <button
                    onClick={() => setActiveTab('amc')}
                    className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    Details
                  </button>
                </div>

                <div className="space-y-3">
                  {schedules.slice(0, 3).map(sch => (
                    <div key={sch.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-white">
                        <span>{sch.type?.replace(/_/g, ' ')}</span>
                        <span className="text-amber-400 font-mono">{sch.scheduledDate}</span>
                      </div>
                      <div className="text-slate-400">{sch.pumpName}</div>
                      <div className="text-[11px] text-slate-500">Tech: {sch.assignedEngineerName}</div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-blue-950/20 border border-blue-500/20 rounded-xl text-xs text-blue-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Next scheduled OISD-141 inspection is within 14 days. Zero downtime guaranteed.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY PETROL PUMPS */}
        {activeTab === 'pumps' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Registered Petrol Pumps</h2>
                <p className="text-xs text-slate-400">Retail fuel outlets mapped under your dealer account</p>
              </div>
              <button
                onClick={() => setShowAddPumpModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Petrol Pump
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pumps.map(pump => (
                <div key={pump.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{pump.pumpName}</h3>
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-xs font-bold">
                          {pump.oilCompany}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-amber-400 mt-1">RO Code: {pump.roCode}</div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        pump.amcActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {pump.amcActive ? 'AMC ACTIVE' : 'NO AMC'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{pump.address}, {pump.city}, {pump.state} - {pump.pincode}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs">
                    <div className="bg-slate-950 p-2 rounded-lg text-center">
                      <div className="text-slate-400 text-[10px]">Tanks</div>
                      <div className="text-white font-bold font-mono text-sm">{pump.totalTanks} USTs</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg text-center">
                      <div className="text-slate-400 text-[10px]">Dispensers</div>
                      <div className="text-white font-bold font-mono text-sm">{pump.totalDispensers} MPDs</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg text-center">
                      <div className="text-slate-400 text-[10px]">ATG Automation</div>
                      <div className={`font-bold font-mono text-xs ${pump.atgInstalled ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {pump.atgInstalled ? 'ENABLED' : 'OFF'}
                      </div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg text-center">
                      <div className="text-slate-400 text-[10px]">STP Pump</div>
                      <div className="font-bold font-mono text-xs text-blue-400">
                        {pump.stpInstalled ? 'RED JACKET' : 'SUCTION'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-slate-400">
                      Contact: <span className="text-slate-200">{pump.contactPerson}</span> ({pump.contactPhone})
                    </div>
                    <button
                      onClick={() => {
                        setReqPumpId(pump.id);
                        setShowRequestModal(true);
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                    >
                      Book Service →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SERVICE REQUESTS & TRACKING */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Service Requests & Real-Time Tracking</h2>
                <p className="text-xs text-slate-400">Strict 18-State Machine Workflow with Live Van Dispatch</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEmergencyModal(true)}
                  className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Emergency
                </button>
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> New Ticket
                </button>
              </div>
            </div>

            {/* If a request is selected for detailed inspection / tracking */}
            {selectedRequestForTracking && (
              <div className="bg-slate-900 border-2 border-blue-500/60 rounded-2xl p-6 shadow-2xl space-y-6">
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-amber-400 font-mono font-bold text-sm">
                        {selectedRequestForTracking.id}
                      </span>
                      <h3 className="text-lg font-bold text-white">
                        {selectedRequestForTracking.problemType}
                      </h3>
                      {selectedRequestForTracking.isEmergency && (
                        <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-extrabold animate-pulse">
                          EMERGENCY 45-MIN SLA
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {selectedRequestForTracking.pumpName} • Category: {selectedRequestForTracking.categoryName}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRequestForTracking(null)}
                    className="text-xs text-slate-400 hover:text-white cursor-pointer px-2 py-1 bg-slate-800 rounded"
                  >
                    Close Tracker
                  </button>
                </div>

                {/* 18-State Visual Progress Tracker */}
                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider font-mono">
                    Official BPW 18-State Workflow Engine Progress:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-center text-xs font-semibold">
                    {[
                      'NEW',
                      'ASSIGNED',
                      'ON_THE_WAY',
                      'SITE_VISIT',
                      'WORK_IN_PROGRESS',
                      'APPROVAL_PENDING',
                      'APPROVED',
                      'INVOICE_GENERATED',
                      'PAID',
                      'COMPLETED'
                    ].map((st, idx) => {
                      const isCurrent = selectedRequestForTracking.status === st;
                      return (
                        <div
                          key={st}
                          className={`p-2 rounded-lg border text-[11px] ${
                            isCurrent
                              ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-105 font-bold'
                              : 'bg-slate-950 text-slate-400 border-slate-800'
                          }`}
                        >
                          <div className="text-[9px] text-slate-500 mb-0.5">Stage {idx + 1}</div>
                          {st?.replace(/_/g, ' ')}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned Field Engineer Card */}
                {selectedRequestForTracking.assignedEngineerName ? (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <Truck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Dispatched Petroleum Engineer:</div>
                        <div className="text-base font-bold text-white">
                          {selectedRequestForTracking.assignedEngineerName}
                        </div>
                        <div className="text-xs text-blue-300 flex items-center gap-2">
                          <Phone className="w-3 h-3" /> {selectedRequestForTracking.assignedEngineerPhone}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Mobile Service Van</div>
                      <div className="text-xs font-mono text-emerald-400 font-bold">Equipped with Tooling & FLP Spares</div>
                      <div className="text-[11px] text-slate-400 mt-1">Live ETA: ~18 mins to station</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Ticket is in dispatch triage. Our Central Ops Admin is assigning the nearest Mobile Van.</span>
                  </div>
                )}
              </div>
            )}

            {/* List of Requests */}
            <div className="space-y-3">
              {requests.map(req => (
                <div
                  key={req.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-amber-400 font-bold">{req.id}</span>
                      <span className="text-sm font-bold text-white">{req.problemType}</span>
                      {req.isEmergency && (
                        <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-extrabold uppercase">
                          EMERGENCY
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {req.pumpName} ({req.oilCompany}) • Category: {req.categoryName} • Raised:{' '}
                      {req.createdAt.split('T')[0]}
                    </div>
                    {req.description && (
                      <div className="text-xs text-slate-300 italic">"{req.description}"</div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-[11px] text-slate-400">Estimated Cost</div>
                      <div className="text-xs font-mono text-white font-bold">
                        ₹{(req.finalCost || req.estimatedCost || 0)?.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        req.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : req.status === 'WORK_IN_PROGRESS'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}
                    >
                      {req.status?.replace(/_/g, ' ')}
                    </span>

                    <button
                      onClick={() => setSelectedRequestForTracking(req)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 text-xs font-medium cursor-pointer"
                    >
                      Track Job →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AMC & MAINTENANCE */}
        {activeTab === 'amc' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Annual Maintenance Contracts (AMC)</h2>
                <p className="text-xs text-slate-400">Comprehensive preventive, electrical, and calibration coverage</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {amcContracts.map(amc => (
                <div key={amc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{amc.pumpName}</h3>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                          {amc.packageType}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-400 mt-1">Contract: {amc.contractNumber}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {amc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-800 text-xs">
                    <div>
                      <div className="text-slate-400">Valid Period</div>
                      <div className="text-white font-mono font-bold mt-0.5">{amc.startDate} to {amc.endDate}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Annual Price</div>
                      <div className="text-emerald-400 font-mono font-bold mt-0.5">
                        ₹{amc.price?.toLocaleString('en-IN')} / year
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-300 font-semibold mb-2">Covered Deliverables:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {amc.coveredServices.map((srv, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                          ✓ {srv}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Auto-renewal available</span>
                    <button
                      onClick={() => handleRenewal(amc.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs cursor-pointer shadow-sm transition"
                    >
                      Renew AMC Contract
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: INVOICES & PAYMENTS */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Invoices & Settlement</h2>
                <p className="text-xs text-slate-400">GST compliant tax invoices for fuel retail maintenance</p>
              </div>
            </div>

            <div className="space-y-4">
              {invoices.map(inv => (
                <div
                  key={inv.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-blue-400 font-bold">{inv.invoiceNumber}</span>
                      <span className="text-xs text-slate-400">• Request Ref: {inv.requestId}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{inv.pumpName}</div>
                    <div className="text-xs text-slate-400">
                      Issued: {inv.issueDate} • Due: {inv.dueDate}
                    </div>
                    <div className="text-xs text-slate-300">
                      Items: {inv.items.map(i => i.description).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Total (Inc. 18% GST)</div>
                      <div className="text-base font-extrabold font-mono text-white">
                        ₹{inv.totalAmount?.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {inv.status}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDocViewerData({ isOpen: true, type: 'invoice', invoice: inv })}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-[#0F2B48] font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#E55812]" />
                        View Tax Invoice
                      </button>

                      {inv.status === 'PENDING' && (
                        <button
                          onClick={() => setShowPaymentModal(inv)}
                          className="px-4 py-2 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs shadow cursor-pointer"
                        >
                          Pay Online
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: DIGITAL DOCUMENT VAULT */}
        {activeTab === 'vault' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Digital Document & Compliance Vault</h2>
              <p className="text-xs text-slate-400">Statutory PESO licenses, calibration certificates, and job sign-offs</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map(doc => (
                <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 text-[10px] font-mono uppercase">
                      {doc.docType}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{doc.title}</h4>
                    <div className="text-xs text-slate-400 mt-1 font-mono">Doc #{doc.documentNumber}</div>
                  </div>
                  <div className="text-xs text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
                    <span>Exp: {doc.expiryDate || 'Permanent'}</span>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> View Slip
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAL: Standard Service Request */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                Raise Service Request
              </h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Petrol Pump</label>
                <select
                  value={reqPumpId}
                  onChange={e => setReqPumpId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  {pumps.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.pumpName} ({p.roCode}) - {p.oilCompany}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Service Category</label>
                <select
                  value={reqCategoryId}
                  onChange={e => setReqCategoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Base Rate: ₹{c.standardRate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Problem / Equipment Type</label>
                <input
                  type="text"
                  placeholder="e.g. Dispenser Nozzle Leaking / STP Submersible Tripping"
                  value={reqProblem}
                  onChange={e => setReqProblem(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Priority</label>
                  <select
                    value={reqPriority}
                    onChange={e => setReqPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="LOW">Low (Next 48 hrs)</option>
                    <option value="MEDIUM">Medium (Within 24 hrs)</option>
                    <option value="HIGH">High (Within 6 hrs)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={reqDate}
                    onChange={e => setReqDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description / Observations</label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue, symptoms, dispenser DU numbers, or tank compartment..."
                  value={reqDesc}
                  onChange={e => setReqDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Emergency Breakdown (45-Min SLA) */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-500 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-red-500/40">
              <div className="flex items-center gap-2 text-red-400 font-extrabold text-base">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
                <span>EMERGENCY BREAKDOWN DISPATCH (45m SLA)</span>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmergency} className="space-y-3.5 text-xs">
              <div className="bg-red-950/30 border border-red-500/40 rounded-xl p-3 text-red-200">
                ⚠️ Emergency tickets trigger an instant WhatsApp & phone alert to the nearest Mobile Service Van. Priority is escalated to EMERGENCY.
              </div>

              <div>
                <label className="block font-semibold mb-1">Affected Petrol Pump</label>
                <select
                  value={emPumpId}
                  onChange={e => setEmPumpId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  {pumps.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.pumpName} - {p.roCode}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Emergency Category</label>
                <select
                  value={emType}
                  onChange={e => setEmType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="Total Fuel Dispenser Failure">Total Fuel Dispenser Failure</option>
                  <option value="Submersible Pump (STP) Motor Lock / Tripping">Submersible Pump (STP) Motor Lock / Tripping</option>
                  <option value="Fuel Leakage / Hazardous Product Spill">Fuel Leakage / Hazardous Product Spill</option>
                  <option value="ATG Console Crash / High Water Ingress Alarm">ATG Console Crash / High Water Ingress Alarm</option>
                  <option value="Power Main LT Panel Flameproof Fault">Power Main LT Panel Flameproof Fault</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Immediate Problem Details</label>
                <textarea
                  rows={3}
                  placeholder="State the exact symptoms, danger levels, whether dispensing is completely halted..."
                  value={emDesc}
                  onChange={e => setEmDesc(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="locShare"
                  checked={emShareLocation}
                  onChange={e => setEmShareLocation(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 bg-slate-950 border-slate-800"
                />
                <label htmlFor="locShare" className="text-slate-300">
                  Transmit Live Station GPS Coordinates to Service Van Navigation
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmergencyModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-extrabold shadow-lg shadow-red-600/40"
                >
                  Confirm Emergency Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Petrol Pump */}
      {showAddPumpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Fuel className="w-4 h-4 text-amber-400" />
                Register New Retail Outlet
              </h3>
              <button
                onClick={() => setShowAddPumpModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPump} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Petrol Pump Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kisan Fuel Station / NH-44 Express"
                  value={newPumpName}
                  onChange={e => setNewPumpName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Oil Marketing Company</label>
                  <select
                    value={newOilCompany}
                    onChange={e => setNewOilCompany(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="IOCL">IOCL (Indian Oil)</option>
                    <option value="BPCL">BPCL (Bharat Petroleum)</option>
                    <option value="HPCL">HPCL (Hindustan Petroleum)</option>
                    <option value="Nayara">Nayara Energy</option>
                    <option value="Reliance">Reliance Petroleum</option>
                    <option value="Shell">Shell India</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">RO Code</label>
                  <input
                    type="text"
                    placeholder="e.g. RO-44910-IOCL"
                    value={newRoCode}
                    onChange={e => setNewRoCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">City / District</label>
                  <input
                    type="text"
                    placeholder="e.g. Bulandshahr / Pune"
                    value={newCity}
                    onChange={e => setNewCity(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Full Address / Highway</label>
                  <input
                    type="text"
                    placeholder="e.g. NH-91 Toll Plaza km 42"
                    value={newAddress}
                    onChange={e => setNewAddress(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Total UST Tanks</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={newTanks}
                    onChange={e => setNewTanks(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Total Dispensers (MPD)</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newDispensers}
                    onChange={e => setNewDispensers(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="atgCheck"
                  checked={newAtg}
                  onChange={e => setNewAtg(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800"
                />
                <label htmlFor="atgCheck" className="text-slate-300">
                  Auto Tank Gauge (ATG) Console Installed (Veeder-Root / Franklin)
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPumpModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Register Outlet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Online Payment Simulator */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                Invoice Settlement Desk
              </h3>
              <button
                onClick={() => setShowPaymentModal(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center space-y-1">
              <div className="text-xs text-slate-400 font-mono">{showPaymentModal.invoiceNumber}</div>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                ₹{showPaymentModal.totalAmount?.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400">Includes 18% GST (BPW Central Billing)</div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-slate-300">Choose Instant Gateway</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'UPI_QR', label: 'UPI / BharatPe QR' },
                  { id: 'RAZORPAY', label: 'Net Banking' },
                  { id: 'CARD', label: 'Credit/Debit' }
                ].map(gw => (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => setPaymentMethod(gw.id)}
                    className={`p-2.5 rounded-lg border text-center transition cursor-pointer ${
                      paymentMethod === gw.id
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {gw.label}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'UPI_QR' && (
              <div className="bg-white p-4 rounded-xl text-center space-y-2 text-slate-950">
                <div className="w-32 h-32 mx-auto bg-slate-100 border-2 border-slate-300 flex items-center justify-center font-mono text-[10px] text-slate-600 rounded-lg">
                  [ UPI QR CODE ]
                </div>
                <div className="text-xs font-bold">Scan with BHIM / GPay / Paytm</div>
                <div className="text-[10px] font-mono text-slate-500">VPA: bharatpetrowork@icici</div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowPaymentModal(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                Confirm Settlement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official BPW Document Viewer Modal */}
      <BPWDocumentViewer
        isOpen={docViewerData.isOpen}
        onClose={() => setDocViewerData(prev => ({ ...prev, isOpen: false }))}
        type={docViewerData.type}
        invoice={docViewerData.invoice}
        request={docViewerData.request}
        amc={docViewerData.amc}
        document={docViewerData.document}
      />

    </div>
  );
};
