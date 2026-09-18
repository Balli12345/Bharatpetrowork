import React, { useState } from 'react';
import {
  Smartphone,
  AlertTriangle,
  Clock,
  Wrench,
  CheckCircle2,
  Phone,
  Shield,
  Truck,
  Filter
} from 'lucide-react';
import {
  ServiceRequest,
  Engineer,
  PetrolPump,
  User
} from '../types';
import { BPWLogo } from './brand/BPWLogo';

interface AdminAppProps {
  currentUser: User;
  requests: ServiceRequest[];
  engineers: Engineer[];
  pumps: PetrolPump[];
  onUpdateStatus: (requestId: string, status: string, note?: string) => Promise<any>;
  onAssignEngineer: (requestId: string, engineerId: string) => Promise<any>;
}

export const AdminApp: React.FC<AdminAppProps> = ({
  currentUser,
  requests,
  engineers,
  pumps,
  onUpdateStatus,
  onAssignEngineer
}) => {
  const [activeTab, setActiveTab] = useState<'emergency' | 'queue' | 'engineers'>('emergency');
  const [selectedReqForAction, setSelectedReqForAction] = useState<ServiceRequest | null>(null);
  const [selectedEngId, setSelectedEngId] = useState(engineers[0]?.id || '');

  const emergencyRequests = requests.filter(r => r.isEmergency && r.status !== 'COMPLETED' && r.status !== 'CLOSED');
  const pendingRequests = requests.filter(r => !r.isEmergency && (r.status === 'NEW' || r.status === 'PENDING_REVIEW' || r.status === 'ASSIGNED'));

  const handleAssign = async () => {
    if (!selectedReqForAction) return;
    await onAssignEngineer(selectedReqForAction.id, selectedEngId);
    setSelectedReqForAction(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#0F2B48] p-4 sm:p-6">
      <div className="max-w-md mx-auto space-y-5">
        
        {/* Mobile App Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <BPWLogo variant="light-bg" size="sm" subBrand="crm" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            DISPATCH LIVE
          </div>
        </div>

        {/* Tab Pill Buttons */}
        <div className="grid grid-cols-3 gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200 text-xs shadow-sm">
          <button
            onClick={() => setActiveTab('emergency')}
            className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'emergency' ? 'bg-[#E55812] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F2B48]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Alerts ({emergencyRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'queue' ? 'bg-[#0F2B48] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F2B48]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pending ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('engineers')}
            className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'engineers' ? 'bg-[#0F2B48] text-white shadow-sm' : 'text-slate-600 hover:text-[#0F2B48]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Fleet ({engineers.length})
          </button>
        </div>

        {/* TAB 1: EMERGENCY DISPATCH */}
        {activeTab === 'emergency' && (
          <div className="space-y-3">
            {emergencyRequests.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs space-y-2 shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-[#0F2B48] font-bold text-sm">All Clear</div>
                <p>No critical breakdown tickets currently unassigned or breaching SLA.</p>
              </div>
            ) : (
              emergencyRequests.map(req => (
                <div key={req.id} className="bg-white border-2 border-red-400 rounded-2xl p-4 space-y-3 shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-[#0F2B48]">{req.id}</span>
                        <span className="px-1.5 py-0.2 rounded bg-red-600 text-white text-[9px] font-extrabold uppercase">
                          45-MIN SLA
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#0F2B48] mt-1">{req.problemType}</h3>
                      <div className="text-xs text-slate-500 mt-0.5">{req.pumpName} ({req.oilCompany})</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    "{req.description || 'Total Forecourt Interruption Reported'}"
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Status: <span className="text-[#E55812] font-bold">{req.status}</span>
                    </span>
                    <button
                      onClick={() => setSelectedReqForAction(req)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#E55812] hover:bg-[#C8490B] text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm"
                    >
                      <Truck className="w-3.5 h-3.5" /> Dispatch Van
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: PENDING QUEUE */}
        {activeTab === 'queue' && (
          <div className="space-y-3">
            {pendingRequests.map(req => (
              <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-xs text-[#0F2B48] font-bold">{req.id}</div>
                    <div className="text-sm font-bold text-[#0F2B48]">{req.problemType}</div>
                    <div className="text-xs text-slate-500">{req.pumpName} • Category: {req.categoryName}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#0F2B48] border border-blue-200">
                    {req.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">Preferred: {req.preferredDate}</span>
                  <button
                    onClick={() => setSelectedReqForAction(req)}
                    className="text-[#0F2B48] hover:text-[#E55812] font-bold cursor-pointer"
                  >
                    Assign Technician →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: FLEET */}
        {activeTab === 'engineers' && (
          <div className="space-y-3">
            {engineers.map(e => (
              <div key={e.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#0F2B48]">{e.name}</h3>
                    <div className="text-xs text-slate-500">{e.employeeId} • {e.phone}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      e.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {e.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Mobile Van: <span className="text-[#0F2B48] font-semibold">{e.vehicleNumber}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* DISPATCH MODAL */}
      {selectedReqForAction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-5 space-y-4 text-slate-800 shadow-2xl">
            <h3 className="text-sm font-bold text-[#0F2B48] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#0F2B48]" />
              Dispatch Engineer to {selectedReqForAction.id}
            </h3>

            <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              Station: <strong className="text-[#0F2B48]">{selectedReqForAction.pumpName}</strong>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-slate-700">Select Technician</label>
              <select
                value={selectedEngId}
                onChange={e => setSelectedEngId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-[#0F2B48]"
              >
                {engineers.map(eng => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name} ({eng.status}) - {eng.vehicleNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs pt-2">
              <button
                onClick={() => setSelectedReqForAction(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                className="px-4 py-1.5 rounded-lg bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold cursor-pointer shadow-sm"
              >
                Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
