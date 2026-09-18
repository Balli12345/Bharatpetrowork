import React, { useState } from 'react';
import {
  DeliveryConsignment,
  DeliveryDriver,
  DeliveryStatus,
  User
} from '../types';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Phone,
  AlertTriangle,
  Package,
  QrCode,
  KeyRound,
  CheckSquare,
  Square,
  ArrowRight,
  Sparkles,
  Shield,
  Layers,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

interface DeliveryAppProps {
  currentUser: User | null;
  consignments: DeliveryConsignment[];
  drivers: DeliveryDriver[];
  onUpdateConsignmentStatus: (id: string, status: DeliveryStatus, currentCity?: string, eta?: string, note?: string) => Promise<any>;
  onVerifyPod: (id: string, otp: string, signature?: string, receiverName?: string) => Promise<any>;
}

export const DeliveryApp: React.FC<DeliveryAppProps> = ({
  currentUser,
  consignments = [],
  drivers = [],
  onUpdateConsignmentStatus,
  onVerifyPod
}) => {
  const safeDrivers = drivers || [];
  const safeConsignments = consignments || [];

  // Find matching driver or default to first
  const currentDriver = safeDrivers.find(d => d?.userId === currentUser?.id) || safeDrivers[0] || null;

  // Selected consignment
  const [selectedId, setSelectedId] = useState<string>(safeConsignments[0]?.id || '');
  const activeConsignment = safeConsignments.find(c => c?.id === selectedId) || safeConsignments[0] || null;

  // OTP and Verification states
  const [otpInput, setOtpInput] = useState('');
  const [receiverNameInput, setReceiverNameInput] = useState(activeConsignment?.contactPerson || '');
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [podSuccess, setPodSuccess] = useState(false);

  // PESO Checklist states
  const [checklist, setChecklist] = useState({
    sparkArrestor: true,
    engineOff: true,
    groundingClamped: true,
    extinguishersReady: true,
    noSmokingCordon: true
  });

  const allChecklistPassed = Object.values(checklist).every(Boolean);

  const handleStatusAdvance = async (newStatus: DeliveryStatus, promptCity?: string) => {
    if (!activeConsignment) return;
    try {
      await onUpdateConsignmentStatus(
        activeConsignment.id,
        newStatus,
        promptCity || activeConsignment.currentCity,
        newStatus === 'FORECOURT_ARRIVED' ? 'Arrived on Site' : activeConsignment.eta
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifyPodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConsignment) return;
    setOtpError('');
    setIsVerifying(true);
    try {
      const res = await onVerifyPod(
        activeConsignment.id,
        otpInput.trim(),
        `${receiverNameInput.trim()} (Digital Forecourt Verified)`,
        receiverNameInput.trim()
      );
      if (res.error) {
        setOtpError(res.error);
      } else {
        setPodSuccess(true);
        setOtpInput('');
      }
    } catch (err: any) {
      setOtpError('Failed to verify OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const stages: { key: DeliveryStatus; label: string; desc: string }[] = [
    { key: 'PENDING_DISPATCH', label: 'Yard Staged', desc: 'Loaded & E-Way Bill Issued' },
    { key: 'DISPATCHED', label: 'Dispatched', desc: 'Left Regional Logistics Depot' },
    { key: 'IN_TRANSIT', label: 'In Transit', desc: 'Highway Transit Underway' },
    { key: 'FORECOURT_ARRIVED', label: 'Arrived at Site', desc: 'At Petrol Pump Forecourt' },
    { key: 'UNLOADED_INSPECTED', label: 'Offloaded & Checked', desc: 'Cranage & Physical Inspection' },
    { key: 'DELIVERED_POD', label: 'Handover Completed', desc: 'OTP & Digital Signature Verified' }
  ];

  const getStageIndex = (status: DeliveryStatus) => {
    const idx = stages.findIndex(s => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  const currentStageIndex = activeConsignment ? getStageIndex(activeConsignment.status) : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Banner / Hero */}
      <div className="bg-[#0A192F] text-white border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PESO HazMat Fleet Logistics
                </span>
                <span className="text-xs text-slate-400 font-mono">Phase 11-23 Fleet Network</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                Bharat PetroWork Logistics & Dispatch Portal
              </h1>
              <p className="text-xs text-slate-300">
                Heavy Equipment & Forecourt Component Transit Command — GPS Live Telemetry & Digital POD
              </p>
            </div>
          </div>

          {/* Driver Quick Badge */}
          <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
              {currentDriver?.name?.split(' ')[0]?.[0] || 'D'}
            </div>
            <div className="text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                {currentDriver?.name}
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                {currentDriver?.vehicleNumber} • {currentDriver?.vehicleModel}
              </div>
            </div>
            <a
              href="tel:+918527023022"
              title="Emergency Logistics Hotline"
              className="ml-2 px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] flex items-center gap-1 transition"
            >
              <Phone className="w-3 h-3" />
              SOS
            </a>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Consignments Selector Bar */}
        <div className="mb-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Consignments ({consignments.length}):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {consignments.map(c => {
              const isSelected = c.id === selectedId;
              const isDelivered = c.status === 'DELIVERED_POD';
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedId(c.id);
                    setOtpError('');
                    setPodSuccess(false);
                    setReceiverNameInput(c.contactPerson);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-[#0A192F] text-white border-[#0A192F] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-mono">{c.consignmentNumber}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      isDelivered
                        ? 'bg-emerald-500/20 text-emerald-600'
                        : 'bg-amber-500/20 text-amber-700'
                    }`}
                  >
                    {c.status?.replace(/_/g, ' ')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {activeConsignment ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Shipment Details & Progression */}
            <div className="lg:col-span-2 space-y-6">
              {/* Consignment Status Banner */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        {activeConsignment.consignmentNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        PO Ref: {activeConsignment.orderNumber}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                      {activeConsignment.buyerName}
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{activeConsignment.deliveryAddress}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-slate-200">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Estimated Arrival</div>
                    <div className="text-base font-black text-emerald-600 flex items-center sm:justify-end gap-1">
                      <Clock className="w-4 h-4" />
                      {activeConsignment.eta}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      Current: {activeConsignment.currentCity}
                    </div>
                  </div>
                </div>

                {/* Milestone Pipeline Visualizer */}
                <div className="pt-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                    Transit Milestone Progression
                  </h3>
                  <div className="relative">
                    <div className="hidden sm:block absolute top-5 left-4 right-4 h-1 bg-slate-200 -z-0">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 relative z-10">
                      {stages.map((stage, idx) => {
                        const isCompleted = idx <= currentStageIndex;
                        const isCurrent = idx === currentStageIndex;
                        return (
                          <div
                            key={stage.key}
                            className={`p-2.5 rounded-xl border text-center transition ${
                              isCurrent
                                ? 'bg-amber-50 border-amber-400 shadow-sm'
                                : isCompleted
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                          >
                            <div
                              className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {isCompleted ? '✓' : idx + 1}
                            </div>
                            <div className="text-[11px] font-bold line-clamp-1">{stage.label}</div>
                            <div className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">{stage.desc}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Driver Operational Action Controls */}
                  {activeConsignment.status !== 'DELIVERED_POD' && (
                    <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Advance Dispatch Milestone:</div>
                        <div className="text-[11px] text-slate-500">
                          Update real-time highway telemetry and notify forecourt station manager.
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {activeConsignment.status === 'PENDING_DISPATCH' && (
                          <button
                            onClick={() => handleStatusAdvance('DISPATCHED', 'National Highway Outer Ring')}
                            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
                          >
                            <span>Confirm Yard Departure</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {activeConsignment.status === 'DISPATCHED' && (
                          <button
                            onClick={() => handleStatusAdvance('IN_TRANSIT', 'National Highway Corridor')}
                            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
                          >
                            <span>Mark En-Route (In Transit)</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {activeConsignment.status === 'IN_TRANSIT' && (
                          <button
                            onClick={() => handleStatusAdvance('FORECOURT_ARRIVED', 'Forecourt Retail Outlet Yard')}
                            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
                          >
                            <span>Mark Forecourt Site Arrival</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {activeConsignment.status === 'FORECOURT_ARRIVED' && (
                          <button
                            onClick={() => handleStatusAdvance('UNLOADED_INSPECTED', 'Site Cranage Staging')}
                            disabled={!allChecklistPassed}
                            className={`px-3.5 py-2 rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5 transition ${
                              allChecklistPassed
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <span>Offload & Inspection Pass</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cargo Inventory & Item Manifest */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-600" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                      Consignment Manifest & Serial Numbers
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Gross Weight: {activeConsignment.totalWeightKg} kg
                  </span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {activeConsignment.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-white hover:bg-slate-50 transition flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{item.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Quantity: <strong className="text-slate-800">{item.quantity} Units</strong> • Net Weight: {item.weightKg} kg
                        </div>
                        {item.serialNumbers && item.serialNumbers.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {item.serialNumbers.map(s => (
                              <span key={s} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700">
                                S/N: {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          OEM Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Compliance & E-Way Bill Bar */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">E-Way Bill Number</div>
                    <div className="font-mono font-bold text-slate-900 mt-0.5">{activeConsignment.ewayBillNumber}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Tax Invoice Ref</div>
                    <div className="font-mono font-bold text-slate-900 mt-0.5">{activeConsignment.invoiceNumber}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">HazMat Protocol</div>
                    <div className="font-semibold text-amber-700 truncate mt-0.5">{activeConsignment.hazmatClass}</div>
                  </div>
                </div>
              </div>

              {/* Mandatory PESO Forecourt Offloading Checklist */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Mandatory PESO Forecourt Discharge Safety Checklist
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  OISD-141 Standard compliance required prior to operating cranes or unloading heavy dispensers & STPs.
                </p>

                <div className="space-y-2.5">
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={checklist.sparkArrestor}
                      onChange={e => setChecklist(prev => ({ ...prev, sparkArrestor: e.target.checked }))}
                      className="mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-800">PESO Approved Spark Arrestor Checked</div>
                      <div className="text-slate-500 text-[11px]">Exhaust pipe clamp secured; verified zero open flames or carbon discharge.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={checklist.engineOff}
                      onChange={e => setChecklist(prev => ({ ...prev, engineOff: e.target.checked }))}
                      className="mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-800">Vehicle Engine Isolated & Wheel Chocks Placed</div>
                      <div className="text-slate-500 text-[11px]">Battery master cut-off switch engaged during offloading.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={checklist.groundingClamped}
                      onChange={e => setChecklist(prev => ({ ...prev, groundingClamped: e.target.checked }))}
                      className="mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-800">Static Grounding Copper Bond Clamped</div>
                      <div className="text-slate-500 text-[11px]">Bonding wire connected to forecourt earthing pit to dissipate static voltage.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={checklist.extinguishersReady}
                      onChange={e => setChecklist(prev => ({ ...prev, extinguishersReady: e.target.checked }))}
                      className="mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-800">2x 10kg DCP Fire Extinguishers Staged</div>
                      <div className="text-slate-500 text-[11px]">Pressure gauges in green zone; positioned within 4 meters of tailgate.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={checklist.noSmokingCordon}
                      onChange={e => setChecklist(prev => ({ ...prev, noSmokingCordon: e.target.checked }))}
                      className="mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-800">15-Meter HazMat Safety Perimeter Cordoned</div>
                      <div className="text-slate-500 text-[11px]">Safety cones placed; customer retail vehicles routed away from delivery bay.</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Handover, Delivery OTP, and Proof of Delivery (POD) */}
            <div className="space-y-6">
              {/* Receiver & Contact Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Destination & Consignee Contact
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{activeConsignment.contactPerson}</div>
                    <div className="text-slate-500">{activeConsignment.roCode ? `RO Code: ${activeConsignment.roCode}` : 'Forecourt In-Charge'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${activeConsignment.contactPhone}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-2 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <span>{activeConsignment.contactPhone}</span>
                    </a>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <strong>Dispatch Depot:</strong> {activeConsignment.originWarehouse}
                  </div>
                </div>
              </div>

              {/* Delivery OTP & Digital POD Verification */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Handover & Digital POD Verification
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  The Station Manager must verify the equipment and provide the 4-digit Delivery OTP sent to their registered mobile.
                </p>

                {activeConsignment.status === 'DELIVERED_POD' || podSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div className="font-black text-emerald-900 text-sm">Delivery Completed & Verified!</div>
                    <div className="text-xs text-emerald-800">
                      Proof of Delivery (POD) signed by: <br />
                      <strong>{activeConsignment.receiverSignature || receiverNameInput}</strong>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-700 pt-1">
                      Delivered: {activeConsignment.deliveredAt ? new Date(activeConsignment.deliveredAt)?.toLocaleString('en-IN') : 'Just now'}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleVerifyPodSubmit} className="space-y-4">
                    {/* Demo Helper Pill */}
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold">Station Manager OTP: </span>
                        <code className="bg-white px-2 py-0.5 rounded font-mono font-bold text-slate-900 border border-amber-300">
                          {activeConsignment.deliveryOtp}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpInput(activeConsignment.deliveryOtp)}
                        className="text-[11px] font-bold text-amber-700 hover:underline"
                      >
                        Auto-Fill
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Enter 4-Digit Delivery OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={e => setOtpInput(e.target.value)}
                        placeholder="e.g. 7419"
                        className="w-full text-center tracking-widest font-mono text-xl py-2.5 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Receiver Full Name / Station Stamp
                      </label>
                      <input
                        type="text"
                        value={receiverNameInput}
                        onChange={e => setReceiverNameInput(e.target.value)}
                        placeholder="e.g. Suresh Meena (Station Manager)"
                        className="w-full text-xs py-2.5 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                      />
                    </div>

                    {otpError && (
                      <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{otpError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isVerifying || !allChecklistPassed}
                      className={`w-full py-3 rounded-xl font-black text-xs shadow-md transition flex items-center justify-center gap-2 ${
                        allChecklistPassed
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isVerifying ? (
                        <span>Verifying with Command...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify OTP & Sign Digital POD</span>
                        </>
                      )}
                    </button>

                    {!allChecklistPassed && (
                      <p className="text-[10px] text-center text-amber-700">
                        * Please complete all PESO safety checklist items above to enable POD submission.
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Vehicle & Rig Telemetry */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Fleet Unit Details</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    GPS Active
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vehicle No:</span>
                    <span className="font-mono font-bold text-slate-800">{activeConsignment.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Platform:</span>
                    <span className="font-semibold text-slate-800">{activeConsignment.vehicleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Captain / Driver:</span>
                    <span className="font-semibold text-slate-800">{activeConsignment.driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">License:</span>
                    <span className="font-mono text-[11px] text-slate-600">{currentDriver.licenseNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Package className="w-12 h-12 mx-auto text-slate-400 mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Consignments Selected</h3>
            <p className="text-xs text-slate-500 mt-1">Select an active consignment from the top bar to manage shipment.</p>
          </div>
        )}
      </div>
    </div>
  );
};
