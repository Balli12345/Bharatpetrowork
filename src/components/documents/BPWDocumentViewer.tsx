import React from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Building,
  Fuel,
  FileText,
  Award
} from 'lucide-react';
import { BPWLogo } from '../brand/BPWLogo';
import { BPW_BRAND_CONSTANTS } from '../brand';
import { Invoice, ServiceRequest, AMCContract, DigitalDocument } from '../../types';

export type BPWDocType = 'invoice' | 'work-order' | 'amc-contract' | 'test-report';

export interface BPWDocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  type: BPWDocType;
  invoice?: Invoice | null;
  request?: ServiceRequest | null;
  amc?: AMCContract | null;
  document?: DigitalDocument | null;
}

export const BPWDocumentViewer: React.FC<BPWDocumentViewerProps> = ({
  isOpen,
  onClose,
  type,
  invoice,
  request,
  amc,
  document: digitalDoc
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 print:border-none print:shadow-none print:rounded-none">
        {/* Top Control Bar (Hidden during print) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-100 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F2B48]">
            <FileText className="w-4 h-4 text-[#E55812]" />
            <span>Official Bharat PetroWork Document Preview</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#0F2B48] hover:bg-[#1A4068] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div className="p-8 sm:p-12 text-[#0F2B48] space-y-6 print:p-6 print:text-black">
          {/* 1. Official Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-[#0F2B48]">
            <div>
              <BPWLogo variant="light-bg" size="lg" showTagline={false} />
              <div className="text-[11px] text-slate-600 mt-2 space-y-0.5 max-w-sm">
                <div className="font-bold text-[#0F2B48]">{BPW_BRAND_CONSTANTS.legalName}</div>
                <div>{BPW_BRAND_CONSTANTS.headquarters}</div>
                <div>GSTIN: <span className="font-mono font-bold text-slate-800">{BPW_BRAND_CONSTANTS.gstin}</span> | CIN: {BPW_BRAND_CONSTANTS.cin}</div>
                <div>Toll-Free: {BPW_BRAND_CONSTANTS.tollFree} | Email: {BPW_BRAND_CONSTANTS.email}</div>
              </div>
            </div>

            <div className="text-right sm:self-center">
              <div className="inline-block px-3 py-1 bg-amber-100 border border-amber-300 rounded-md text-amber-900 font-bold text-xs uppercase tracking-wider font-mono">
                {type === 'invoice' && 'TAX INVOICE (RULE 46)'}
                {type === 'work-order' && 'WORK COMPLETION REPORT'}
                {type === 'amc-contract' && 'ANNUAL MAINTENANCE CONTRACT'}
                {type === 'test-report' && 'OISD COMPLIANCE TEST REPORT'}
              </div>
              <div className="mt-2 text-xs font-mono">
                <div className="font-bold text-sm text-[#0F2B48]">
                  {type === 'invoice' && (invoice?.invoiceNumber || 'INV-2026-0819')}
                  {type === 'work-order' && `WCR-${request?.id || 'REQ-101'}`}
                  {type === 'amc-contract' && (amc?.contractNumber || 'AMC-2026-N1')}
                  {type === 'test-report' && (digitalDoc?.documentNumber || 'TEST-OISD-901')}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Date: {new Date().toISOString().split('T')[0]}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Client / Fuel Station Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                Billed / Issued To:
              </div>
              <div className="font-extrabold text-sm text-[#0F2B48]">
                {invoice?.pumpName || request?.pumpName || amc?.pumpName || 'Forecourt Fuel Retail Station'}
              </div>
              <div className="text-slate-600 mt-1 space-y-0.5">
                <div>Client Representative: {invoice?.clientName || request?.clientName || 'Station Manager'}</div>
                <div>Retail Outlet Code: <span className="font-mono font-bold">RO-10492-IOCL</span></div>
                <div>Address: National Highway 24, Sector 12, NCR Hub</div>
                <div>Station GSTIN: <span className="font-mono">07AABCS9876Q1Z2</span></div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                Engineering & Dispatch Wing:
              </div>
              <div className="font-extrabold text-sm text-[#0F2B48]">
                Northern Petroleum Operations Division
              </div>
              <div className="text-slate-600 mt-1 space-y-0.5">
                <div>Dispatched Engineer: {request?.assignedEngineerName || 'Amitabh Verma (Lead Petroleum Specialist)'}</div>
                <div>Mobile Service Van: UP-16-BW-4921 (HazMat Tooling Kit)</div>
                <div>Safety Protocol: LOTO Verified • 0% LEL Confirmed</div>
                <div>Service SLA: 45-Minute Emergency Response Standard</div>
              </div>
            </div>
          </div>

          {/* 3. Line Items Table (For Invoice) */}
          {type === 'invoice' && invoice && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-[#0F2B48] text-white font-bold">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Description of Service / Equipment</th>
                      <th className="p-2.5">HSN/SAC</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Unit Rate (₹)</th>
                      <th className="p-2.5 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {invoice.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono">{idx + 1}</td>
                        <td className="p-2.5 font-semibold text-[#0F2B48]">{item.description}</td>
                        <td className="p-2.5 font-mono text-slate-500">{item.hsnSac || '998719'}</td>
                        <td className="p-2.5 text-center font-mono">{item.quantity}</td>
                        <td className="p-2.5 text-right font-mono">₹{item.unitRate?.toLocaleString('en-IN')}</td>
                        <td className="p-2.5 text-right font-mono font-bold">₹{item.amount?.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tax Calculations */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono font-semibold">₹{invoice.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>CGST (9%):</span>
                    <span className="font-mono">₹{invoice.cgst?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SGST (9%):</span>
                    <span className="font-mono">₹{invoice.sgst?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-[#0F2B48] pt-2 border-t-2 border-[#0F2B48]">
                    <span>Total Amount:</span>
                    <span className="font-mono text-[#E55812]">₹{invoice.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 text-right">
                    Amount in words: INR Indian Rupees Only
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Work Order / Completion Details (For work-order) */}
          {type === 'work-order' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-[#0F2B48]">Scope of Maintenance & Action Report</h4>
                <p className="text-slate-600 leading-relaxed">
                  {request?.description || 'Routine multi-point forecourt inspection, calibration of electronic pulser, and ultrasonic verification of suction manifold pipe.'}
                </p>
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 font-bold">
                    ✓ LOTO Applied
                  </div>
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 font-bold">
                    ✓ 0.0% LEL Gas Free
                  </div>
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 font-bold">
                    ✓ Calibration Tested
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. AMC Contract Terms (For AMC) */}
          {type === 'amc-contract' && amc && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#0F2B48]">{amc.packageType} Annual Service Coverage</h4>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    ACTIVE CONTRACT
                  </span>
                </div>
                <div className="text-slate-600">
                  Validity: <span className="font-bold">{amc.startDate}</span> to <span className="font-bold">{amc.endDate}</span>
                </div>
                <div className="pt-2">
                  <div className="font-bold text-[#0F2B48] mb-1">Contracted Deliverables:</div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {amc.coveredServices.map((srv, idx) => (
                      <li key={idx}>{srv}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 6. Legal Certifications & Bank Settlement Info */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-slate-500">
            <div>
              <div className="font-bold text-[#0F2B48] mb-1">Direct Bank Remittance (NEFT / RTGS):</div>
              <div>Bank: State Bank of India, Commercial Branch</div>
              <div>Account Name: Bharat PetroWork Infrastructure Pvt Ltd</div>
              <div>A/C No: 409182390192 | IFSC: SBIN0001248</div>
              <div>UPI VPA: <span className="font-mono font-bold text-slate-700">bharatpetrowork@sbi</span></div>
            </div>

            {/* Official Digital Seal & Stamp */}
            <div className="flex flex-col items-end justify-center text-right">
              <div className="w-24 h-24 border-2 border-dashed border-emerald-600 rounded-full flex flex-col items-center justify-center text-center p-1 text-emerald-800 bg-emerald-50/50 rotate-[-5deg]">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-[8px] font-extrabold tracking-tight uppercase">BHARAT PETROWORK</span>
                <span className="text-[7px] font-mono">QUALITY SEAL</span>
                <span className="text-[6px] text-emerald-600">VERIFIED OFFICIAL</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Authorised Signatory Stamp</div>
            </div>
          </div>

          {/* Official Footer */}
          <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 space-y-0.5">
            <div>This is an official computer-generated Bharat PetroWork document. No physical signature is required.</div>
            <div>Subject to Delhi / NCR Jurisdiction. Registered Office: Sector 62, Noida, NCR, India.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
