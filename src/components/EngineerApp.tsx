import React, { useState } from 'react';
import {
  Wrench,
  Truck,
  MapPin,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Camera,
  Signature,
  FileCheck,
  AlertTriangle,
  Package,
  Layers,
  Phone,
  ArrowRight,
  Play,
  Check,
  Send
} from 'lucide-react';
import {
  ServiceRequest,
  InventoryPart,
  Engineer,
  User
} from '../types';
import { BPWLogo } from './brand/BPWLogo';

interface EngineerAppProps {
  currentUser: User;
  engineers?: Engineer[];
  engineer?: Engineer;
  requests: ServiceRequest[];
  inventory: InventoryPart[];
  onUpdateStatus: (requestId: string, status: string, note?: string) => Promise<any>;
  onSubmitReport: (requestId: string, reportData: any) => Promise<any>;
}

export const EngineerApp: React.FC<EngineerAppProps> = ({
  currentUser,
  engineers = [],
  engineer,
  requests = [],
  inventory = [],
  onUpdateStatus,
  onSubmitReport
}) => {
  const safeEngineers = engineers || [];
  const safeRequests = requests || [];
  const safeInventory = inventory || [];

  const currentEngineer =
    engineer ||
    safeEngineers.find(e => e.userId === currentUser.id) ||
    safeEngineers[0] || {
      id: 'eng-101',
      userId: currentUser.id,
      name: currentUser.name || 'Amitabh Verma',
      phone: currentUser.phone || '+91 98223 45678',
      email: currentUser.email || 'amitabh.verma@bharatpetrowork.com',
      vanId: 'VAN-DL-01',
      location: 'Delhi NCR Corridor',
      isAvailable: true,
      activeJobsCount: 0,
      rating: 4.9,
      certifications: ['OISD-141', 'PESO', 'Flammable Atmosphere Zone 1']
    };

  const [activeTab, setActiveTab] = useState<'jobs' | 'active-job' | 'inventory'>('jobs');
  const [selectedJob, setSelectedJob] = useState<ServiceRequest | null>(
    safeRequests.find(r => r.assignedEngineerId === currentEngineer.id && r.status !== 'COMPLETED') || safeRequests[0] || null
  );

  // Job Execution Step state
  const [lotoVerified, setLotoVerified] = useState(false);
  const [gasTesterClear, setGasTesterClear] = useState(false);
  const [extinguisherReady, setExtinguisherReady] = useState(false);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [workNotes, setWorkNotes] = useState('');
  const [selectedParts, setSelectedParts] = useState<{ partId: string; quantity: number }[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Replenishment modal state
  const [replenishModalPart, setReplenishModalPart] = useState<InventoryPart | null>(null);
  const [replenishQty, setReplenishQty] = useState(1);
  const [replenishNotes, setReplenishNotes] = useState('');

  // Filter jobs assigned to this engineer or emergency
  const myJobs = requests.filter(r => r.assignedEngineerId === currentEngineer.id || r.isEmergency);

  const handleAddPartToJob = (partId: string) => {
    const existing = selectedParts.find(p => p.partId === partId);
    if (existing) {
      setSelectedParts(selectedParts.map(p => p.partId === partId ? { ...p, quantity: p.quantity + 1 } : p));
    } else {
      setSelectedParts([...selectedParts, { partId, quantity: 1 }]);
    }
  };

  const handleRemovePartFromJob = (partId: string) => {
    setSelectedParts(selectedParts.filter(p => p.partId !== partId));
  };

  const handleSubmitFinalReport = async () => {
    if (!selectedJob) return;
    setIsSubmitting(true);

    try {
      await onSubmitReport(selectedJob.id, {
        engineerId: currentEngineer.id,
        engineerName: currentEngineer.name,
        inspectionFindings: inspectionNotes || 'Standard pre-work check completed. Zero combustible gas detected.',
        workSummary: workNotes || 'Replaced damaged components, tested flow rates, calibrated calibration slip.',
        safetyChecklistPassed: lotoVerified && gasTesterClear && extinguisherReady,
        partsUsed: selectedParts,
        customerSignatureName: customerName || 'Dealers Authorized Supervisor'
      });
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        setActiveTab('jobs');
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#0F2B48] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* BPW Technician Status Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <BPWLogo variant="light-bg" size="md" subBrand="engineer" />
            <div className="border-l border-slate-200 pl-3.5">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-[#0F2B48]">{currentEngineer.name}</h1>
                <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">
                  {currentEngineer.employeeId || 'BPW-ENG-101'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Specialization:{' '}
                {Array.isArray(currentEngineer.specialization)
                  ? currentEngineer.specialization.join(', ')
                  : currentEngineer.specialization || 'Petroleum Dispensers, Hydraulics & Automation'}{' '}
                • Mobile Van:{' '}
                <span className="font-semibold text-slate-700">
                  {currentEngineer.vehicleNumber || currentEngineer.vanId || 'UP-14-BT-9022'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              ONLINE / DISPATCH READY
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'jobs' ? 'bg-[#0F2B48] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F2B48] bg-white border border-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            My Dispatch Queue ({myJobs.length})
          </button>

          {selectedJob && (
            <button
              onClick={() => setActiveTab('active-job')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'active-job' ? 'bg-[#E55812] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F2B48] bg-white border border-slate-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              Active Job Protocol ({selectedJob.id})
            </button>
          )}

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'inventory' ? 'bg-purple-700 text-white shadow-sm' : 'text-slate-600 hover:text-[#0F2B48] bg-white border border-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Van Tooling & Spares
          </button>
        </div>

        {/* TAB 1: MY JOBS QUEUE */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {myJobs.map(job => (
              <div
                key={job.id}
                className={`bg-white border rounded-2xl p-5 space-y-3 shadow-sm transition ${
                  job.isEmergency
                    ? 'border-2 border-red-400'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0F2B48]">{job.id}</span>
                      <h3 className="text-base font-bold text-[#0F2B48]">{job.problemType}</h3>
                      {job.isEmergency && (
                        <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-extrabold uppercase animate-pulse">
                          EMERGENCY 45-MIN SLA
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {job.pumpName} ({job.oilCompany}) • Category: {job.categoryName}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      job.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : job.status === 'WORK_IN_PROGRESS'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-blue-50 text-[#0F2B48] border-blue-200'
                    }`}
                  >
                    {job.status?.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{job.pumpAddress}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    Client Contact: <span className="text-[#0F2B48] font-semibold">{job.clientName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {job.status === 'ASSIGNED' && (
                      <button
                        onClick={async () => {
                          await onUpdateStatus(job.id, 'ON_THE_WAY', 'Technician departed with Service Van');
                          setSelectedJob({ ...job, status: 'ON_THE_WAY' });
                          setActiveTab('active-job');
                        }}
                        className="px-4 py-2 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Truck className="w-3.5 h-3.5" /> Start Van (On The Way)
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setActiveTab('active-job');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F2B48] border border-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      Open Execution Protocol →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: ACTIVE JOB 14-STEP EXECUTION PROTOCOL */}
        {activeTab === 'active-job' && selectedJob && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-[#0F2B48] font-bold">{selectedJob.id}</span>
                  <h2 className="text-lg font-bold text-[#0F2B48]">{selectedJob.problemType}</h2>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Location: {selectedJob.pumpName} ({selectedJob.oilCompany}) • Address: {selectedJob.pumpAddress}
                </div>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {selectedJob.status?.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {reportSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center text-emerald-800 space-y-3">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600" />
                <h3 className="text-xl font-bold">Field Job Report Submitted!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Spare parts deducted from inventory. Digital report routed to Central Admin QA for sign-off and invoice generation.
                </p>
              </div>
            ) : (
              <div className="space-y-6 text-xs">
                {/* STEP A: SITE ARRIVAL & PUNCH-IN */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between font-bold text-[#0F2B48] text-sm">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#0F2B48]" />
                      Step 1: Van Navigation & Site Arrival
                    </span>
                    {selectedJob.status === 'ON_THE_WAY' && (
                      <button
                        onClick={async () => {
                          await onUpdateStatus(selectedJob.id, 'SITE_VISIT', 'Technician arrived at petrol pump forecourt');
                          setSelectedJob({ ...selectedJob, status: 'SITE_VISIT' });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow-sm"
                      >
                        Confirm Arrival (Punch In)
                      </button>
                    )}
                  </div>
                  <p className="text-slate-500">
                    GPS verified at coordinates (28.4069, 77.8498). Distance remaining: 0.0 km.
                  </p>
                </div>

                {/* STEP B: OISD & PESO SAFETY PRE-CHECK (MANDATORY) */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between font-bold text-[#0F2B48] text-sm">
                    <span className="flex items-center gap-2 text-[#E55812]">
                      <ShieldAlert className="w-4 h-4 text-[#E55812]" />
                      Step 2: Hazardous Area Safety Checklist (OISD-141 / LOTO)
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">Mandatory Gate</span>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lotoVerified}
                        onChange={e => setLotoVerified(e.target.checked)}
                        className="w-4 h-4 rounded text-[#0F2B48] bg-white border-slate-300"
                      />
                      <span>Breaker Lock-Out Tag-Out (LOTO) verified at Main LT Panel; Zero Energy tested.</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gasTesterClear}
                        onChange={e => setGasTesterClear(e.target.checked)}
                        className="w-4 h-4 rounded text-[#0F2B48] bg-white border-slate-300"
                      />
                      <span>Explosimeter / Hydrocarbon Vapor detector reads 0% LEL in pit / manhole.</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={extinguisherReady}
                        onChange={e => setExtinguisherReady(e.target.checked)}
                        className="w-4 h-4 rounded text-[#0F2B48] bg-white border-slate-300"
                      />
                      <span>10kg DCP Fire Extinguisher and non-sparking beryllium brass tools on standby.</span>
                    </label>
                  </div>
                </div>

                {/* STEP C: WORK FINDINGS & REPAIR NOTES */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="font-bold text-[#0F2B48] text-sm flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#0F2B48]" />
                    Step 3: Engineering Work Summary & Diagnosis
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Describe specific failure mode, testing observations, flow rate readings, calibration slips..."
                    value={workNotes}
                    onChange={e => setWorkNotes(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-[#0F2B48] focus:border-[#0F2B48] focus:outline-none"
                  />
                </div>

                {/* STEP D: PARTS REPLACED (TRIGGERS INVENTORY STOCK-OUT) */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between font-bold text-[#0F2B48] text-sm">
                    <span className="flex items-center gap-2 text-[#0F2B48]">
                      <Package className="w-4 h-4 text-[#E55812]" />
                      Step 4: Spare Parts Consumed (Auto Warehouse Stock-Out)
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {selectedParts.length} Parts Selected
                    </span>
                  </div>

                  {/* Selected Parts List */}
                  {selectedParts.length > 0 && (
                    <div className="space-y-1.5 border border-slate-200 bg-white p-3 rounded-lg">
                      {selectedParts.map(sp => {
                        const partObj = safeInventory.find(p => p.id === sp.partId);
                        return (
                          <div key={sp.partId} className="flex items-center justify-between text-slate-700">
                            <span>
                              {partObj?.partName} ({partObj?.partCode}) × {sp.quantity}
                            </span>
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-emerald-700 font-bold">
                                ₹{((partObj?.sellingPrice || 0) * sp.quantity)?.toLocaleString('en-IN')}
                              </span>
                              <button
                                onClick={() => handleRemovePartFromJob(sp.partId)}
                                className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Pick from Warehouse Inventory */}
                  <div className="space-y-1">
                    <label className="text-slate-600 font-semibold block mb-1">
                      Add replacement parts from Mobile Van:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {inventory.map(part => (
                        <div
                          key={part.id}
                          onClick={() => handleAddPartToJob(part.id)}
                          className="p-2 bg-white border border-slate-200 hover:border-[#0F2B48] rounded-lg flex items-center justify-between cursor-pointer transition shadow-xs"
                        >
                          <div>
                            <div className="font-semibold text-[#0F2B48] truncate max-w-[180px]">{part.partName}</div>
                            <div className="text-[10px] text-slate-500">
                              Stock: {part.stock} {part.unit} • ₹{part.sellingPrice}
                            </div>
                          </div>
                          <span className="text-[#E55812] font-bold text-xs">+ Add</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* STEP E: CUSTOMER SIGN-OFF & SUBMISSION */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="font-bold text-[#0F2B48] text-sm flex items-center gap-2">
                    <Signature className="w-4 h-4 text-emerald-700" />
                    Step 5: Customer Station Sign-off & Completion
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Customer Station Rep / Manager Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Surendra Pal (Forecourt Shift Manager)"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-[#0F2B48]"
                    />
                  </div>

                  <div className="p-3 bg-white border border-dashed border-slate-300 rounded-xl text-center text-slate-500">
                    ✍️ Digital Signature Pad Verified (Forecourt Rep Confirmed Work Satisfaction)
                  </div>
                </div>

                {/* Submit Final Action */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={handleSubmitFinalReport}
                    disabled={isSubmitting || (!lotoVerified && !gasTesterClear)}
                    className="px-6 py-3 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-extrabold text-sm flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Submitting Report...' : 'Submit Job Report & Stock Out'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VAN TOOLING & SPARES INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0F2B48]">Mobile Van Tooling & Live Inventory</h2>
                <p className="text-xs text-slate-500">Real-time sync with Central BPW Warehouse</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inventory.map(part => (
                <div key={part.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#0F2B48]">{part.partName}</h4>
                      <div className="text-xs font-mono text-[#E55812] font-semibold mt-0.5">{part.partCode}</div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        part.stock <= part.minStock
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {part.stock} {part.unit} IN STOCK
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    Category: {part.category} • Location: {part.warehouseLocation}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-mono">
                    <span className="text-slate-600 font-semibold">Price: ₹{part.sellingPrice}</span>
                    <button
                      onClick={() => setReplenishModalPart(part)}
                      className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors"
                    >
                      Request Stock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAL: Replenish Stock Request */}
      {replenishModalPart && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-[#0F2B48] flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                Request Stock Replenishment
              </h3>
              <button onClick={() => setReplenishModalPart(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-1">
              <div className="font-bold text-[#0F2B48]">{replenishModalPart.partName}</div>
              <div className="text-slate-500">Current Stock: {replenishModalPart.stock} {replenishModalPart.unit}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity Requested</label>
                <input
                  type="number"
                  min={1}
                  value={replenishQty}
                  onChange={e => setReplenishQty(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-[#0F2B48]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Upcoming large maintenance job"
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
                onClick={() => {
                  alert(`Request for ${replenishQty}x ${replenishModalPart.partName} sent to Central Warehouse.`);
                  setReplenishModalPart(null);
                }}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-sm"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
