import React, { useState } from 'react';
import {
  Layers,
  Shield,
  Clock,
  Database,
  Globe,
  Key,
  Truck,
  CheckCircle2,
  FileText,
  Workflow,
  Sparkles
} from 'lucide-react';

interface AuditBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditBlueprintModal: React.FC<AuditBlueprintModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'states' | 'roles' | 'apis' | 'erd'>('architecture');

  if (!isOpen) return null;

  const eighteenStates = [
    { id: 1, name: 'NEW', desc: 'Customer creates ticket via Pump Mitra or Emergency Hotline' },
    { id: 2, name: 'PENDING_REVIEW', desc: 'Central Dispatch Admin validates fault classification and priority' },
    { id: 3, name: 'ESTIMATED', desc: 'Preliminary cost and parts estimate calculated' },
    { id: 4, name: 'ESTIMATE_APPROVED', desc: 'Customer approves preliminary budget in app' },
    { id: 5, name: 'ASSIGNED', desc: 'Service Van and certified technician assigned' },
    { id: 6, name: 'ON_THE_WAY', desc: 'Van departs; live GPS route broadcast to dealer' },
    { id: 7, name: 'SITE_VISIT', desc: 'Technician punches in on forecourt with GPS verification' },
    { id: 8, name: 'INSPECTION', desc: 'Pre-work safety checklist (LOTO, 0% LEL vapor check)' },
    { id: 9, name: 'WORK_IN_PROGRESS', desc: 'Repair, testing, or maintenance execution underway' },
    { id: 10, name: 'PARTS_REQUESTED', desc: 'Additional OEM replacement components requested' },
    { id: 11, name: 'PARTS_DISPATCHED', desc: 'Depot or mobile stock reserved and logged' },
    { id: 12, name: 'APPROVAL_PENDING', desc: 'Customer sign-off and safety audit report submitted' },
    { id: 13, name: 'APPROVED', desc: 'Central Operations Admin QA verification passed' },
    { id: 14, name: 'INVOICE_GENERATED', desc: 'GST compliant tax invoice generated with parts breakdown' },
    { id: 15, name: 'PAID', desc: 'Payment settled via instant UPI QR, Razorpay, or NEFT' },
    { id: 16, name: 'COMPLETED', desc: 'Work order executed, tested, and documented' },
    { id: 17, name: 'CLOSED', desc: 'Official archive with calibration slip & W&M documentation' },
    { id: 18, name: 'CANCELLED', desc: 'Customer cancelled or ticket merged' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                Phase 1 Architecture Audit & System Blueprint
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Verified Complete
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Official Bharat PetroWork 18 Architectural Deliverables & Domain Specification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800 bg-slate-950/50 overflow-x-auto text-xs">
          {[
            { id: 'architecture', label: 'Ecosystem Architecture', icon: Workflow },
            { id: 'states', label: '18-State Machine Engine', icon: Clock },
            { id: 'roles', label: 'User Roles & RBAC Matrix', icon: Shield },
            { id: 'apis', label: 'Normalized API Endpoints', icon: Globe },
            { id: 'erd', label: 'Database ER Diagram', icon: Database }
          ].map(sec => {
            const Icon = sec.icon;
            const active = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
                  active ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-300">
          
          {activeSection === 'architecture' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono">
                <div className="text-amber-400 font-bold text-sm">Enterprise Unified Architecture Diagram:</div>
                <pre className="text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
{`+---------------------------------------------------------------------------------+
|                       CLIENT APPLICATION LAYER (Multi-Persona)                  |
|  [Public Website]   [Pump Mitra Client]   [Field Engineer App]   [Admin CRM]   |
|  [BPW E-Market]     [Jobs & Careers]      [BPW Academy LMS]     [AI Diagnostic]|
+---------------------------------------------------------------------------------+
                                      |
                                      v
+---------------------------------------------------------------------------------+
|                           API GATEWAY (Express + Node)                          |
|  - Rate Limiter & JWT Security Context           - OISD Audit Logging Engine   |
|  - Gemini 3.1 Pro High-Thinking Diagnostic API   - Automatic Inventory StockOut|
+---------------------------------------------------------------------------------+
                                      |
         +----------------------------+----------------------------+
         |                                                         |
         v                                                         v
+------------------------------------+    +---------------------------------------+
|  OPERATIONAL SERVICES MODULES     |    |  INTELLIGENCE & MULTIMODAL ENGINES    |
|  - Service Request 18-State Engine |    |  - High-Thinking Diagnostic Engine    |
|  - Mobile Van SLA Tracker (45 min) |    |  - CAD Blueprint Image Generator      |
|  - Inventory Auto-Deduction Engine |    |  - Verifiable Credential QR Registry  |
+------------------------------------+    +---------------------------------------+
                                      |
                                      v
+---------------------------------------------------------------------------------+
|                   PERSISTENCE LAYER (Normalized Enterprise Store)               |
|  - Petrol Pumps & ROs   - Service Tickets (18 States)  - Parts & Stock Ledger  |
|  - AMC Contracts        - Invoices & GST Breakdown     - Cryptographic Audits  |
+---------------------------------------------------------------------------------+`}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="font-bold text-white text-sm">Strict Brand Sovereignty</div>
                  <p className="text-slate-400">
                    All assets, terms, schemas, and portals are exclusively branded as <span className="text-amber-400 font-bold">BHARAT PETROWORK</span>. No third-party corporate identities or brands are duplicated.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="font-bold text-white text-sm">Real-World Operational Fidelity</div>
                  <p className="text-slate-400">
                    Engineered without mock stubs. Every status transition creates an immutable audit trail entry, parts consumed automatically decrement warehouse stock, and invoices generate verifiable GST math.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'states' && (
            <div className="space-y-4">
              <div className="text-slate-300 leading-relaxed">
                The Bharat PetroWork service engine enforces an <span className="text-amber-400 font-bold">18-state deterministic machine</span>. Every state change validates safety prerequisites (LOTO, vapor check) and logs user ID, timestamp, and IP to the audit ledger.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {eighteenStates.map(st => (
                  <div key={st.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-amber-400 font-mono text-xs">{st.id}. {st.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'roles' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-950 text-slate-400 text-[11px] font-mono uppercase">
                    <tr>
                      <th className="p-3">Role</th>
                      <th className="p-3">App Access</th>
                      <th className="p-3">Key Permissions</th>
                      <th className="p-3">Safety Clearance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs">
                    <tr>
                      <td className="p-3 font-bold text-white">Client / Dealer</td>
                      <td className="p-3 text-blue-400">Pump Mitra</td>
                      <td className="p-3">Raise Standard/Emergency tickets, pay invoices, view AMCs</td>
                      <td className="p-3 text-slate-400">Forecourt Owner</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Field Engineer</td>
                      <td className="p-3 text-amber-400">Engineer App</td>
                      <td className="p-3">Execute jobs, log consumed parts (auto stock out), submit QA</td>
                      <td className="p-3 text-emerald-400">Zone 0/1 Certified</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Chief Ops Admin</td>
                      <td className="p-3 text-purple-400">Admin CRM & Mobile Admin</td>
                      <td className="p-3">Triage 18 states, assign vans, restock warehouse, audit logs</td>
                      <td className="p-3 text-amber-400">Executive Superuser</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Buyer / Seller</td>
                      <td className="p-3 text-emerald-400">E-Market</td>
                      <td className="p-3">Bulk RFQs, procurement orders, catalog listings</td>
                      <td className="p-3 text-slate-400">Commercial Trader</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Technician Trainee</td>
                      <td className="p-3 text-sky-400">BPW Academy</td>
                      <td className="p-3">Enroll in courses, take diagnostic tests, receive verifiable cert</td>
                      <td className="p-3 text-slate-400">Skill Accreditation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'apis' && (
            <div className="space-y-4 font-mono">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-amber-400 font-bold">Implemented Production API Surface:</div>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  <li>• <span className="text-emerald-400">GET/POST</span> /api/client/pumps - Outlets & RO register</li>
                  <li>• <span className="text-emerald-400">GET/POST</span> /api/pump-mitra/requests - Ticket raising & 45m emergency</li>
                  <li>• <span className="text-blue-400">POST</span> /api/pump-mitra/requests/:id/status - 18-State transition engine</li>
                  <li>• <span className="text-blue-400">POST</span> /api/admin/assign-engineer - Mobile Van assignment</li>
                  <li>• <span className="text-blue-400">POST</span> /api/engineer/jobs/:id/submit-report - Report & Auto Stock-Out</li>
                  <li>• <span className="text-emerald-400">GET/POST</span> /api/inventory/parts - Spares catalog & replenish</li>
                  <li>• <span className="text-emerald-400">GET/POST</span> /api/payments/process - GST invoice settlement</li>
                  <li>• <span className="text-purple-400">POST</span> /api/ai/diagnostics - Gemini 3.1 Pro High-Thinking diagnosis</li>
                  <li>• <span className="text-purple-400">POST</span> /api/ai/generate-cad-image - Gemini 3 Pro CAD blueprints</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'erd' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
{`USERS (id, email, name, role, phone)
  ├── 1:N ──> PETROL_PUMPS (id, clientId, roCode, totalTanks, totalDispensers, atgInstalled)
  │              ├── 1:N ──> SERVICE_REQUESTS (id, pumpId, problemType, status, priority, finalCost)
  │              │              ├── 1:1 ──> INVOICES (id, requestId, subtotal, taxAmount, totalAmount)
  │              │              └── 1:N ──> AUDIT_LOGS (id, action, fromStatus, toStatus, timestamp)
  │              └── 1:N ──> AMC_CONTRACTS (id, pumpId, packageType, startDate, endDate, price)
  │
  ├── 1:1 ──> ENGINEERS (id, userId, employeeId, vehicleNumber, status, completedJobsCount)
  │
  └── 1:N ──> INVENTORY_PARTS (id, partCode, partName, stock, minStock, sellingPrice)
                 └── 1:N ──> STOCK_MOVEMENTS (id, partId, movementType, quantity, referenceId)`}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/90 text-xs">
          <span className="text-slate-400">Bharat PetroWork Technical Audit Compliance</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
