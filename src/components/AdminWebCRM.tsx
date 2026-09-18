import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  Fuel,
  Wrench,
  Clock,
  CreditCard,
  Package,
  BarChart3,
  MessageSquare,
  Globe,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  Download,
  Truck,
  RotateCcw,
  Sparkles,
  Layers,
  ShieldCheck
} from 'lucide-react';
import {
  User,
  PetrolPump,
  ServiceRequest,
  Engineer,
  AMCContract,
  InventoryPart,
  StockMovement,
  Invoice,
  PaymentTransaction,
  AuditLog,
  CMSContent,
  ServiceCategory,
  DeliveryConsignment,
  DeliveryDriver,
  RFQ
} from '../types';
import { BPWLogo } from './brand/BPWLogo';

interface AdminCRMProps {
  currentUser: User;
  users: User[];
  pumps: PetrolPump[];
  requests: ServiceRequest[];
  engineers: Engineer[];
  amcContracts: AMCContract[];
  inventory: InventoryPart[];
  movements: StockMovement[];
  invoices: Invoice[];
  payments: PaymentTransaction[];
  auditLogs: AuditLog[];
  cms: CMSContent;
  categories: ServiceCategory[];
  consignments?: DeliveryConsignment[];
  drivers?: DeliveryDriver[];
  rfqs?: RFQ[];
  onUpdateStatus: (requestId: string, status: string, note?: string) => Promise<any>;
  onAssignEngineer: (requestId: string, engineerId: string) => Promise<any>;
  onReplenishStock: (partId: string, qty: number, notes?: string) => Promise<any>;
  onUpdateCMS: (data: Partial<CMSContent>) => Promise<any>;
  onReconcilePayment?: (data: any) => Promise<any>;
  onUpdateConsignmentStatus?: (id: string, status: any) => Promise<any>;
  onOpenAudit: () => void;
  onOpenAI: () => void;
}

export const AdminWebCRM: React.FC<AdminCRMProps> = ({
  currentUser,
  users,
  pumps,
  requests,
  engineers,
  amcContracts,
  inventory,
  movements,
  invoices,
  payments,
  auditLogs,
  cms,
  categories,
  consignments = [],
  drivers = [],
  rfqs = [],
  onUpdateStatus,
  onAssignEngineer,
  onReplenishStock,
  onUpdateCMS,
  onReconcilePayment,
  onUpdateConsignmentStatus,
  onOpenAudit,
  onOpenAI
}) => {
  const [activeModule, setActiveModule] = useState<
    'dashboard' | 'pumps' | 'engineers' | 'requests' | 'billing' | 'inventory' | 'reports' | 'cms' | 'audit' | 'delivery' | 'payments' | 'rfqs'
  >('dashboard');

  // Request filter
  const [requestFilter, setRequestFilter] = useState<'ALL' | 'EMERGENCY' | 'PENDING' | 'WORK_IN_PROGRESS' | 'APPROVAL_PENDING' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Payment Reconciliation state
  const [reconcileSuccess, setReconcileSuccess] = useState<string | null>(null);
  const [isReconciling, setIsReconciling] = useState(false);

  // Engineer assignment modal
  const [assignModalReq, setAssignModalReq] = useState<ServiceRequest | null>(null);
  const [selectedEngId, setSelectedEngId] = useState(engineers[0]?.id || '');

  // Replenish stock modal
  const [replenishModalPart, setReplenishModalPart] = useState<InventoryPart | null>(null);
  const [replenishQty, setReplenishQty] = useState(25);
  const [replenishNotes, setReplenishNotes] = useState('');

  // CMS Edit State
  const [editTagline, setEditTagline] = useState(cms.tagline);
  const [editPumpsCount, setEditPumpsCount] = useState(cms.stats.pumpsServiced);
  const [cmsSaved, setCmsSaved] = useState(false);

  // Financial Metrics
  const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((acc, i) => acc + i.totalAmount, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'PENDING').reduce((acc, i) => acc + i.totalAmount, 0);
  const emergencyCount = requests.filter(r => r.isEmergency && r.status !== 'COMPLETED' && r.status !== 'CLOSED').length;
  const pendingApprovalCount = requests.filter(r => r.status === 'APPROVAL_PENDING').length;

  // Filtered Requests
  const filteredRequests = requests.filter(r => {
    if (requestFilter === 'EMERGENCY') return r.isEmergency;
    if (requestFilter === 'PENDING') return r.status === 'NEW' || r.status === 'ASSIGNED' || r.status === 'PENDING_REVIEW';
    if (requestFilter === 'WORK_IN_PROGRESS') return r.status === 'WORK_IN_PROGRESS' || r.status === 'ON_THE_WAY';
    if (requestFilter === 'APPROVAL_PENDING') return r.status === 'APPROVAL_PENDING';
    if (requestFilter === 'COMPLETED') return r.status === 'COMPLETED' || r.status === 'PAID' || r.status === 'CLOSED';
    return true;
  }).filter(r =>
    searchQuery === '' ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.pumpName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.problemType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmAssignment = async () => {
    if (!assignModalReq) return;
    await onAssignEngineer(assignModalReq.id, selectedEngId);
    setAssignModalReq(null);
  };

  const handleConfirmReplenish = async () => {
    if (!replenishModalPart) return;
    await onReplenishStock(replenishModalPart.id, replenishQty, replenishNotes);
    setReplenishModalPart(null);
  };

  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateCMS({
      tagline: editTagline,
      stats: {
        ...cms.stats,
        pumpsServiced: Number(editPumpsCount)
      }
    });
    setCmsSaved(true);
    setTimeout(() => setCmsSaved(false), 3000);
  };

  const navModules = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: `Service Engine (${requests.length})`, icon: Clock, badge: emergencyCount > 0 ? `${emergencyCount} ALERT` : undefined },
    { id: 'delivery', label: `Fleet Dispatch (${consignments.length})`, icon: Truck, badge: consignments.filter(c => c.status !== 'DELIVERED_POD').length > 0 ? `${consignments.filter(c => c.status !== 'DELIVERED_POD').length} ACTIVE` : undefined },
    { id: 'payments', label: `Settlements & Escrow (${payments.length})`, icon: CreditCard },
    { id: 'rfqs', label: `B2B RFQs & Quotes (${rfqs.length})`, icon: FileText },
    { id: 'pumps', label: `Petrol Pumps (${pumps.length})`, icon: Fuel },
    { id: 'engineers', label: `Engineers & Fleet (${engineers.length})`, icon: Wrench },
    { id: 'billing', label: `Billing & Invoices (${invoices.length})`, icon: CreditCard },
    { id: 'inventory', label: `Parts & Warehouse (${inventory.length})`, icon: Package },
    { id: 'reports', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'cms', label: 'Content Management', icon: Globe },
    { id: 'audit', label: `Audit Security Logs (${auditLogs.length})`, icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F2B48] flex flex-col lg:flex-row">
      {/* Enterprise CRM Sidebar */}
      <aside className="w-full lg:w-64 bg-[#0F2B48] text-white border-r border-[#1B3B60] p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="pb-4 border-b border-white/10 space-y-1">
            <BPWLogo variant="dark-bg" size="md" subBrand="crm" />
            <div className="text-[9px] text-[#F59E0B] font-mono font-bold tracking-wider uppercase pl-0.5">
              Control Tower • Operations Command
            </div>
          </div>

          <div className="space-y-1">
            {navModules.map(m => {
              const Icon = m.icon;
              const active = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    active
                      ? 'bg-[#E55812] text-white shadow-md'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{m.label}</span>
                  </div>
                  {m.badge && (
                    <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-extrabold animate-pulse">
                      {m.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Sidebar Tools */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <button
            onClick={onOpenAudit}
            className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 text-xs flex items-center gap-2 cursor-pointer font-medium"
          >
            <Layers className="w-3.5 h-3.5" /> Architecture Blueprint
          </button>
          <button
            onClick={onOpenAI}
            className="w-full text-left px-3 py-2 rounded-lg bg-[#E55812]/20 hover:bg-[#E55812]/30 border border-[#E55812]/40 text-amber-200 text-xs flex items-center gap-2 cursor-pointer font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Station Diagnostics
          </button>
        </div>
      </aside>

      {/* Main CRM Workspace */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <div>
              <h1 className="text-xl font-extrabold text-[#0F2B48] capitalize">
                {activeModule?.replace(/-/g, ' ')} Module
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Central Operations Console • Logged in as: <span className="text-[#0F2B48] font-bold">{currentUser.name}</span>
              </p>
            </div>

            {emergencyCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold animate-pulse">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>{emergencyCount} CRITICAL EMERGENCY TICKET IN QUEUE</span>
              </div>
            )}
          </div>

          {/* MODULE 1: DASHBOARD */}
          {activeModule === 'dashboard' && (
            <div className="space-y-6">
              {/* Financial & Operational KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="text-xs text-slate-500 font-medium">Total Settled Revenue</div>
                  <div className="text-2xl font-extrabold text-[#0F2B48] font-mono mt-1">
                    ₹{totalRevenue?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3 h-3 text-emerald-600" /> Real GST Invoices
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="text-xs text-slate-500 font-medium">Pending Receivables</div>
                  <div className="text-2xl font-extrabold text-[#E55812] font-mono mt-1">
                    ₹{pendingRevenue?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {invoices.filter(i => i.status === 'PENDING').length} Unpaid bills
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="text-xs text-slate-500 font-medium">Active Field Technicians</div>
                  <div className="text-2xl font-extrabold text-[#0F2B48] mt-1">
                    {engineers.filter(e => e.status !== 'OFFLINE').length} / {engineers.length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Equipped Service Vans</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="text-xs text-slate-500 font-medium">Pending QA Sign-offs</div>
                  <div className="text-2xl font-extrabold text-[#0F2B48] mt-1">
                    {pendingApprovalCount}
                  </div>
                  <div className="text-[11px] text-[#E55812] font-semibold mt-1">Ready for Invoicing</div>
                </div>
              </div>

              {/* Service Engine Ticker & Quick Dispatch */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#0F2B48] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#E55812]" />
                    Priority Field Dispatch Queue
                  </h3>
                  <button
                    onClick={() => setActiveModule('requests')}
                    className="text-xs text-[#0F2B48] hover:text-[#E55812] font-bold cursor-pointer"
                  >
                    Open Service Engine →
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {requests.slice(0, 5).map(req => (
                    <div key={req.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#0F2B48] font-bold">{req.id}</span>
                          <span className="font-bold text-[#0F2B48]">{req.problemType}</span>
                          {req.isEmergency && (
                            <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-extrabold">
                              EMERGENCY
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500">
                          {req.pumpName} ({req.oilCompany}) • Client: {req.clientName}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-600 font-medium">
                          {req.assignedEngineerName ? `Tech: ${req.assignedEngineerName}` : 'Unassigned'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0F2B48] border border-blue-200">
                          {req.status?.replace(/_/g, ' ')}
                        </span>
                        {!req.assignedEngineerId && (
                          <button
                            onClick={() => {
                              setAssignModalReq(req);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-[11px] cursor-pointer"
                          >
                            Assign Van
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real SVG Chart: Operational Activity */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#0F2B48] flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#0F2B48]" />
                    Operational Monthly Throughput & Service Dispatch
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">FY 2025-2026 Volume</span>
                </div>

                <div className="h-48 flex items-end justify-between gap-3 pt-6 px-4 bg-slate-50 border border-slate-200 rounded-xl">
                  {[
                    { month: 'Oct', count: 120, emergency: 14 },
                    { month: 'Nov', count: 145, emergency: 18 },
                    { month: 'Dec', count: 180, emergency: 22 },
                    { month: 'Jan', count: 210, emergency: 19 },
                    { month: 'Feb', count: 245, emergency: 31 },
                    { month: 'Mar', count: 290, emergency: 28 }
                  ].map((data, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="text-[10px] text-slate-500 font-mono font-semibold">{data.count}</div>
                      <div className="w-full max-w-[36px] bg-[#0F2B48] rounded-t-lg transition-all hover:bg-[#1A4068]" style={{ height: `${(data.count / 300) * 100}%` }}>
                        <div className="w-full bg-red-500 rounded-t-lg" style={{ height: `${(data.emergency / data.count) * 100}%` }} title={`${data.emergency} Emergency`} />
                      </div>
                      <div className="text-xs text-slate-600 font-semibold">{data.month}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#0F2B48] rounded" /> Standard Service Jobs
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded" /> 45-Min Emergency Dispatches
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: SERVICE ENGINE & 18-STATE MACHINE */}
          {activeModule === 'requests' && (
            <div className="space-y-6">
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-sm">
                  {[
                    { id: 'ALL', label: 'All' },
                    { id: 'EMERGENCY', label: '🚨 Emergency' },
                    { id: 'PENDING', label: 'New / Assigned' },
                    { id: 'WORK_IN_PROGRESS', label: 'In Execution' },
                    { id: 'APPROVAL_PENDING', label: 'QA Review' },
                    { id: 'COMPLETED', label: 'Settled / Closed' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setRequestFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                        requestFilter === f.id
                          ? 'bg-[#0F2B48] text-white font-bold shadow-sm'
                          : 'text-slate-600 hover:text-[#0F2B48]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by ID, RO or Problem..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-[#0F2B48] placeholder-slate-400 focus:outline-none focus:border-[#0F2B48] shadow-sm"
                  />
                </div>
              </div>

              {/* Service Requests Table / Card List */}
              <div className="space-y-3">
                {filteredRequests.map(req => (
                  <div
                    key={req.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm hover:border-slate-300 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#0F2B48]">{req.id}</span>
                          <span className="text-base font-bold text-[#0F2B48]">{req.problemType}</span>
                          {req.isEmergency && (
                            <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-extrabold uppercase animate-pulse">
                              EMERGENCY
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {req.pumpName} ({req.roCode || req.oilCompany}) • Category: {req.categoryName} • Client: {req.clientName}
                        </div>
                      </div>

                      {/* 18-State Selector */}
                      <div className="flex items-center gap-2">
                        <select
                          value={req.status}
                          onChange={e => onUpdateStatus(req.id, e.target.value, `Admin manual transition to ${e.target.value}`)}
                          className="bg-slate-50 border border-slate-300 text-xs font-bold text-[#0F2B48] rounded-lg p-2 focus:outline-none focus:border-[#0F2B48]"
                        >
                          <option value="NEW">NEW</option>
                          <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                          <option value="ESTIMATED">ESTIMATED</option>
                          <option value="ESTIMATE_APPROVED">ESTIMATE_APPROVED</option>
                          <option value="ASSIGNED">ASSIGNED</option>
                          <option value="ON_THE_WAY">ON_THE_WAY</option>
                          <option value="SITE_VISIT">SITE_VISIT</option>
                          <option value="INSPECTION">INSPECTION</option>
                          <option value="WORK_IN_PROGRESS">WORK_IN_PROGRESS</option>
                          <option value="PARTS_REQUESTED">PARTS_REQUESTED</option>
                          <option value="PARTS_DISPATCHED">PARTS_DISPATCHED</option>
                          <option value="APPROVAL_PENDING">APPROVAL_PENDING</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="INVOICE_GENERATED">INVOICE_GENERATED</option>
                          <option value="PAID">PAID</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CLOSED">CLOSED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>

                        {!req.assignedEngineerId ? (
                          <button
                            onClick={() => setAssignModalReq(req)}
                            className="px-3 py-2 rounded-lg bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs cursor-pointer shadow-sm"
                          >
                            Assign Engineer
                          </button>
                        ) : (
                          <button
                            onClick={() => setAssignModalReq(req)}
                            className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0F2B48] border border-slate-300 text-xs font-semibold cursor-pointer"
                          >
                            Reassign ({req.assignedEngineerName?.split(' ')[0]})
                          </button>
                        )}
                      </div>
                    </div>

                    {req.description && (
                      <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="text-slate-500 font-semibold">Dealer Notes: </span>
                        "{req.description}"
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-4">
                        <span>Created: {req.createdAt.split('T')[0]}</span>
                        <span>Estimated: ₹{(req.estimatedCost || 0)?.toLocaleString('en-IN')}</span>
                        {req.finalCost && (
                          <span className="text-emerald-700 font-mono font-bold">
                            Final Bill: ₹{req.finalCost?.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {req.status === 'APPROVAL_PENDING' && (
                        <button
                          onClick={async () => {
                            await onUpdateStatus(req.id, 'APPROVED', 'Admin QA validated customer sign-off and parts stock-out');
                            await onUpdateStatus(req.id, 'INVOICE_GENERATED', 'Automated GST invoice generation');
                          }}
                          className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow"
                        >
                          Approve QA & Issue Invoice
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 3: PETROL PUMPS */}
          {activeModule === 'pumps' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pumps.map(p => (
                  <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm hover:border-slate-300 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-[#0F2B48]">{p.pumpName}</h3>
                        <div className="text-xs font-mono text-[#E55812] font-semibold mt-0.5">RO Code: {p.roCode}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0F2B48] border border-blue-200 font-mono text-xs font-bold">
                        {p.oilCompany}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">{p.address}, {p.city}, {p.state}</div>

                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                      <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl">
                        <div className="text-slate-500 text-[10px]">Tanks</div>
                        <div className="font-bold text-[#0F2B48]">{p.totalTanks}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl">
                        <div className="text-slate-500 text-[10px]">Dispensers</div>
                        <div className="font-bold text-[#0F2B48]">{p.totalDispensers}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl">
                        <div className="text-slate-500 text-[10px]">ATG</div>
                        <div className={`font-bold ${p.atgInstalled ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {p.atgInstalled ? 'YES' : 'NO'}
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl">
                        <div className="text-slate-500 text-[10px]">AMC</div>
                        <div className={`font-bold ${p.amcActive ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {p.amcActive ? 'ACTIVE' : 'NONE'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 4: ENGINEERS & FLEET */}
          {activeModule === 'engineers' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {engineers.map(e => (
                  <div key={e.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#0F2B48]">{e.name}</h3>
                          <span className="text-xs font-mono text-[#0F2B48] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-bold">
                            {e.employeeId}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Phone: {e.phone} • Email: {e.email}
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          e.status === 'AVAILABLE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : e.status === 'BUSY'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {e.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      Vehicle: <span className="text-[#0F2B48] font-semibold">{e.vehicleNumber}</span> ({e.vehicleType})
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(e.specialization)
                        ? e.specialization
                        : typeof e.specialization === 'string'
                        ? e.specialization.split(',').map(s => s.trim())
                        : []
                      ).map((sp, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-medium">
                          {sp}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <span>Rating: ⭐ {e.rating}</span>
                      <span>Total Jobs Completed: {e.completedJobsCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 5: BILLING & INVOICES */}
          {activeModule === 'billing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#0F2B48]">GST Tax Invoices & Payment Ledger</h2>
                  <p className="text-xs text-slate-500">Total Invoiced: ₹{(totalRevenue + pendingRevenue)?.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="space-y-3">
                {invoices.map(inv => (
                  <div key={inv.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-[#0F2B48] font-bold">{inv.invoiceNumber}</span>
                        <span className="text-xs text-slate-500">Ref: {inv.requestId}</span>
                      </div>
                      <div className="text-sm font-semibold text-[#0F2B48]">{inv.pumpName} ({inv.clientName})</div>
                      <div className="text-xs text-slate-500">Issued: {inv.issueDate} • Due: {inv.dueDate}</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Amount (inc 18% GST)</div>
                        <div className="text-base font-extrabold font-mono text-[#0F2B48]">
                          ₹{inv.totalAmount?.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 6: INVENTORY & WAREHOUSE */}
          {activeModule === 'inventory' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#0F2B48]">Petroleum Equipment Spares & Stock Management</h2>
                  <p className="text-xs text-slate-500">Automatic Stock-Out upon Technician Job Submission</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory.map(part => (
                  <div key={part.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#0F2B48]">{part.partName}</h4>
                        <div className="text-xs font-mono text-[#E55812] font-semibold">{part.partCode}</div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          part.stock <= part.minStock
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {part.stock} {part.unit}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500">
                      Cost: ₹{part.costPrice} • Selling: ₹{part.sellingPrice} • Bin: {part.warehouseLocation}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Min threshold: {part.minStock}</span>
                      <button
                        onClick={() => {
                          setReplenishModalPart(part);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs cursor-pointer shadow-sm"
                      >
                        Request Stock
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stock Movement Ledger */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
                <h3 className="text-sm font-bold text-[#0F2B48]">Recent Stock Movement Ledger</h3>
                <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                  {movements.map(m => (
                    <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-[#0F2B48]">{m.partName}</div>
                        <div className="text-slate-500">{m.notes} ({m.timestamp.split('T')[0]})</div>
                      </div>
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded ${
                          m.movementType === 'IN'
                            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                            : 'text-amber-800 bg-amber-50 border border-amber-200'
                        }`}
                      >
                        {m.movementType === 'IN' ? `+${m.quantity}` : `-${m.quantity}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 7: AUDIT LOGS */}
          {activeModule === 'audit' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#0F2B48] flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#E55812]" />
                    Immutable Enterprise Audit Ledger
                  </h2>
                  <p className="text-xs text-slate-500">
                    Cryptographic audit trail tracking all state transitions, job assignments, and inventory stock-outs
                  </p>
                </div>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 font-mono">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[#0F2B48] font-bold">{log.action}</span>
                      <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                    </div>
                    <div className="text-slate-700">{log.details}</div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span>User: {log.userName} ({log.userRole})</span>
                      <span>Entity: {log.entityType}#{log.entityId}</span>
                      {log.fromStatus && log.toStatus && (
                        <span className="text-[#0F2B48] font-bold">
                          {log.fromStatus} → {log.toStatus}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 8: CMS */}
          {activeModule === 'cms' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 max-w-2xl shadow-sm">
              <h2 className="text-lg font-bold text-[#0F2B48]">Public Website & Portal CMS</h2>

              {cmsSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                  ✓ CMS Content updated and published immediately.
                </div>
              )}

              <form onSubmit={handleSaveCMS} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Tagline</label>
                  <textarea
                    rows={2}
                    value={editTagline}
                    onChange={e => setEditTagline(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-[#0F2B48] focus:border-[#0F2B48] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pumps Serviced Counter</label>
                  <input
                    type="number"
                    value={editPumpsCount}
                    onChange={e => setEditPumpsCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-[#0F2B48] focus:border-[#0F2B48] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold cursor-pointer shadow-sm"
                >
                  Publish CMS Updates
                </button>
              </form>
            </div>
          )}

          {/* MODULE: FLEET LOGISTICS & DISPATCH COMMAND */}
          {activeModule === 'delivery' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0F2B48]">Forecourt Heavy Equipment Fleet & Logistics Command</h2>
                  <p className="text-xs text-slate-500">PESO HazMat compliant transportation, E-Way bills, GPS telemetry & Digital POD</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    GPS Fleet Tracking: LIVE
                  </span>
                </div>
              </div>

              {/* KPI Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Total Consignments</div>
                  <div className="text-2xl font-black text-[#0F2B48] mt-1">{consignments.length}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Heavy machinery & STPs</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">In Highway Transit</div>
                  <div className="text-2xl font-black text-amber-600 mt-1">
                    {consignments.filter(c => c.status === 'IN_TRANSIT' || c.status === 'DISPATCHED').length}
                  </div>
                  <div className="text-[11px] text-amber-600 font-semibold mt-0.5">En-route with E-Way Bill</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">On-Site Forecourt</div>
                  <div className="text-2xl font-black text-blue-600 mt-1">
                    {consignments.filter(c => c.status === 'FORECOURT_ARRIVED' || c.status === 'UNLOADED_INSPECTED').length}
                  </div>
                  <div className="text-[11px] text-blue-600 font-semibold mt-0.5">Ready for POD sign-off</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Delivered & Verified</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    {consignments.filter(c => c.status === 'DELIVERED_POD').length}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% Digital OTP POD</div>
                </div>
              </div>

              {/* Consignments Master Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0F2B48] flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#E55812]" />
                    <span>Active Delivery Consignments Ledger</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Showing {consignments.length} records
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500">
                      <tr>
                        <th className="p-3.5">Consignment / PO</th>
                        <th className="p-3.5">Destination RO / Outlet</th>
                        <th className="p-3.5">Cargo Details</th>
                        <th className="p-3.5">Driver & Vehicle</th>
                        <th className="p-3.5">E-Way Bill</th>
                        <th className="p-3.5">Current City / ETA</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {consignments.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50 transition">
                          <td className="p-3.5">
                            <div className="font-mono font-bold text-[#0F2B48]">{c.consignmentNumber}</div>
                            <div className="text-[11px] text-slate-400 font-mono">PO: {c.orderNumber}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-900">{c.buyerName}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1">{c.deliveryAddress}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-medium text-slate-800">{c.items.length} Line Items</div>
                            <div className="text-[11px] text-slate-500 font-mono">{c.totalWeightKg} kg Gross</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-900">{c.driverName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{c.vehicleNumber}</div>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-700">
                            {c.ewayBillNumber}
                          </td>
                          <td className="p-3.5">
                            <div className="font-medium text-slate-800">{c.currentCity}</div>
                            <div className="text-[11px] text-emerald-600 font-semibold">{c.eta}</div>
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              c.status === 'DELIVERED_POD'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : c.status === 'FORECOURT_ARRIVED'
                                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {c.status?.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            {c.status !== 'DELIVERED_POD' && onUpdateConsignmentStatus && (
                              <button
                                onClick={() => onUpdateConsignmentStatus(c.id, 'DELIVERED_POD')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition"
                              >
                                Mark Delivered
                              </button>
                            )}
                            {c.status === 'DELIVERED_POD' && (
                              <span className="text-[11px] font-bold text-emerald-600">✓ POD Verified</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fleet HazMat Drivers Master */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#0F2B48] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Licensed HazMat Heavy Fleet Drivers</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {drivers.map(d => (
                    <div key={d.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{d.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.status === 'ON_TRIP' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {d.status?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-slate-600 font-mono text-[11px]">
                        Vehicle: <strong>{d.vehicleNumber}</strong> ({d.vehicleModel})
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        License: <span className="font-mono">{d.licenseNumber}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-slate-500">Contact: {d.phone}</span>
                        <span className="font-bold text-emerald-600">★ {d.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE: PAYMENTS & ESCROW RECONCILIATION */}
          {activeModule === 'payments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0F2B48]">Payment Settlements & Escrow Reconciliation</h2>
                  <p className="text-xs text-slate-500">Dual-layer B2B escrow clearing, Razorpay gateway webhooks & 18% GST tax ledger</p>
                </div>

                <button
                  disabled={isReconciling}
                  onClick={async () => {
                    if (!onReconcilePayment) return;
                    setIsReconciling(true);
                    setReconcileSuccess(null);
                    try {
                      await onReconcilePayment({
                        reconcileDate: new Date().toISOString(),
                        reconciledBy: currentUser.name
                      });
                      setReconcileSuccess('All pending gateway settlements & escrows successfully reconciled!');
                      setTimeout(() => setReconcileSuccess(null), 4000);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setIsReconciling(false);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isReconciling ? 'animate-spin' : ''}`} />
                  <span>{isReconciling ? 'Reconciling Ledger...' : 'Run Escrow Reconciliation'}</span>
                </button>
              </div>

              {reconcileSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{reconcileSuccess}</span>
                </div>
              )}

              {/* Financial Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Gross Transaction Vol.</div>
                  <div className="text-2xl font-black font-mono text-[#0F2B48] mt-1">
                    ₹{payments.reduce((acc, p) => acc + p.amount, 0)?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Total processed volume</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Settled Escrow</div>
                  <div className="text-2xl font-black font-mono text-emerald-600 mt-1">
                    ₹{payments.filter(p => p.status === 'SUCCESS').reduce((acc, p) => acc + p.amount, 0)?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Cleared to bank accounts</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">GST 18% Output Pool</div>
                  <div className="text-2xl font-black font-mono text-blue-600 mt-1">
                    ₹{Math.round(payments.reduce((acc, p) => acc + p.amount, 0) * 0.18)?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Direct GSTN E-Invoicing</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">TDS 2% Compliance</div>
                  <div className="text-2xl font-black font-mono text-purple-600 mt-1">
                    ₹{Math.round(payments.reduce((acc, p) => acc + p.amount, 0) * 0.02)?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Section 194C Remittance</div>
                </div>
              </div>

              {/* Payments Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0F2B48] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#E55812]" />
                    <span>Transactions & Settlement Ledger</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    {payments.length} Records Logged
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500">
                      <tr>
                        <th className="p-3.5">Txn ID / Ref</th>
                        <th className="p-3.5">Invoice #</th>
                        <th className="p-3.5">Gateway & Mode</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Timestamp</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 transition">
                          <td className="p-3.5 font-mono font-bold text-[#0F2B48]">
                            {p.transactionRef}
                          </td>
                          <td className="p-3.5 font-mono text-slate-700">
                            {p.invoiceId}
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-slate-900">{p.gateway}</span>
                            <span className="text-[11px] text-slate-500 ml-1.5">({p.paymentMethod})</span>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-emerald-600">
                            ₹{p.amount?.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3.5 text-slate-500">
                            {new Date(p.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE: B2B RFQs & COMMISSIONS */}
          {activeModule === 'rfqs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0F2B48]">B2B Bulk RFQ Exchange & Brokerage Oversight</h2>
                  <p className="text-xs text-slate-500">Manage dealer requests, OEM quotations & automated 3.5% commission billing</p>
                </div>
              </div>

              {/* RFQ Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rfqs.map(rfq => (
                  <div key={rfq.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-600">{rfq.rfqNumber}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                            {rfq.status}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{rfq.productName}</h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Buyer: <strong>{rfq.buyerName}</strong> • Target Qty: <strong>{rfq.requestedQty} Units</strong>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase">Target Budget</div>
                        <div className="text-sm font-black font-mono text-emerald-600">
                          ₹{rfq.targetPrice?.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                      <strong>Requirements:</strong> {rfq.requirements}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-800 mb-2">
                        OEM Quotes Submitted ({rfq.quotesReceived?.length || 0}):
                      </div>
                      {rfq.quotesReceived && rfq.quotesReceived.length > 0 ? (
                        <div className="space-y-1.5">
                          {rfq.quotesReceived.map((q, idx) => (
                            <div key={idx} className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-emerald-900">{q.sellerName}</span>
                                <span className="text-[11px] text-emerald-700 ml-2">Lead Time: {q.deliveryTimeline}</span>
                              </div>
                              <div className="font-mono font-bold text-emerald-800">
                                ₹{q.unitPrice?.toLocaleString('en-IN')} / unit
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">No quotes submitted yet by OEMs.</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL: Assign Engineer to Request */}
      {assignModalReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-[#0F2B48] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0F2B48]" />
                Dispatch Petroleum Engineer
              </h3>
              <button onClick={() => setAssignModalReq(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-1">
              <div className="font-bold text-[#0F2B48]">{assignModalReq.id} - {assignModalReq.problemType}</div>
              <div className="text-slate-500">{assignModalReq.pumpName} ({assignModalReq.pumpAddress})</div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-slate-700">Select Available Technician</label>
              <select
                value={selectedEngId}
                onChange={e => setSelectedEngId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-[#0F2B48]"
              >
                {engineers.map(eng => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name} ({eng.employeeId}) • Status: {eng.status} • Van: {eng.vehicleNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setAssignModalReq(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssignment}
                className="px-5 py-2 rounded-lg bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold cursor-pointer shadow-sm"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Replenish Stock */}
      {replenishModalPart && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-[#0F2B48] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#E55812]" />
                Warehouse Stock Replenishment
              </h3>
              <button onClick={() => setReplenishModalPart(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-1">
              <div className="font-bold text-[#0F2B48]">{replenishModalPart.partName}</div>
              <div className="text-slate-500">Current Stock: {replenishModalPart.stock} {replenishModalPart.unit}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batch Quantity to Add</label>
                <input
                  type="number"
                  min={1}
                  value={replenishQty}
                  onChange={e => setReplenishQty(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-[#0F2B48]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Purchase Order Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Received from Elaflex Germany consignment"
                  value={replenishNotes}
                  onChange={e => setReplenishNotes(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-[#0F2B48]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setReplenishModalPart(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReplenish}
                className="px-5 py-2 rounded-lg bg-[#E55812] hover:bg-[#C8490B] text-white font-bold cursor-pointer shadow-sm"
              >
                Add to Warehouse
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
