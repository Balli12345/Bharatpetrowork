import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  Image as ImageIcon,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  FileText,
  Download,
  Flame,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';

interface AIDiagnosticAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIDiagnosticAssistantModal: React.FC<AIDiagnosticAssistantModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'diagnostic' | 'cad-gen'>('diagnostic');

  // Diagnostic State
  const [issueDescription, setIssueDescription] = useState(
    'Submersible turbine pump (Red Jacket 1.5HP) in UST compartment #2 trips the main LT panel miniature circuit breaker after 45 seconds of continuous discharge. Forecourt ATG console reported intermittent interstitial sump alarm.'
  );
  const [pumpContext, setPumpContext] = useState('IOCL Retail Outlet, 4 Tanks, Dual Product MPD dispensers, Zone 1 Hazardous Forecourt');
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // CAD Blueprint Image Generator State
  const [cadPrompt, setCadPrompt] = useState(
    'Isometric engineering blueprint schematic of a retail petrol pump underground storage tank (UST) installation showing double-wall HDPE piping, submersible turbine pump (STP), shear valve, and ATG console interface'
  );
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '1:1'>('16:9');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  if (!isOpen) return null;

  const handleRunDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDescription) return;
    setIsDiagnosing(true);
    setDiagnosticResult(null);

    try {
      const res = await api.runDiagnostic(issueDescription, pumpContext);
      setDiagnosticResult(res.analysis);
    } catch (err: any) {
      setDiagnosticResult(`Error during diagnosis: ${err.message || 'System failed to reach reasoning engine.'}`);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleGenerateCAD = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cadPrompt) return;
    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);

    try {
      const res = await api.generateCADImage(cadPrompt, imageSize, aspectRatio);
      setGeneratedImageUrl(res.imageUrl);
    } catch (err: any) {
      alert(`Image generation failed: ${err.message}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-blue-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                BPW AI Technical Operations Center
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                  Thinking Level: HIGH
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Powered by Gemini 3.1 Pro Preview (Diagnostic Reasoning) & Gemini 3 Pro (CAD Schematics)
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
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800 bg-slate-950/50 text-xs">
          <button
            onClick={() => setActiveTab('diagnostic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'diagnostic' ? 'bg-amber-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            High-Thinking Fault Diagnosis (gemini-3.1-pro-preview)
          </button>
          <button
            onClick={() => setActiveTab('cad-gen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'cad-gen' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Equipment CAD & Blueprint Generator (1K / 2K / 4K)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* TAB 1: HIGH-THINKING DIAGNOSTIC */}
          {activeTab === 'diagnostic' && (
            <div className="space-y-5">
              <form onSubmit={handleRunDiagnostic} className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Station Infrastructure Context:
                  </label>
                  <input
                    type="text"
                    value={pumpContext}
                    onChange={e => setPumpContext(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Complex Engineering Fault / Symptom Description:
                  </label>
                  <textarea
                    rows={3}
                    value={issueDescription}
                    onChange={e => setIssueDescription(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Cross-references OISD-141, PESO Rule 33, and IS:5571 FLP guidelines.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isDiagnosing}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {isDiagnosing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        Thinking with High Depth...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        Run High-Thinking Diagnosis
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Diagnostic Result */}
              {diagnosticResult && (
                <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-5 space-y-3 font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-amber-400 font-bold">
                    <span className="flex items-center gap-2">
                      <Cpu className="w-4 h-4" /> Official Technical Analysis & Isolation Protocol
                    </span>
                    <span className="text-[10px] text-slate-400">Model: gemini-3.1-pro-preview</span>
                  </div>
                  <div className="text-slate-200 text-xs whitespace-pre-wrap leading-relaxed">
                    {diagnosticResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CAD BLUEPRINT IMAGE GENERATOR */}
          {activeTab === 'cad-gen' && (
            <div className="space-y-5">
              <form onSubmit={handleGenerateCAD} className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Technical CAD Prompt / Equipment Schematic:
                  </label>
                  <textarea
                    rows={3}
                    value={cadPrompt}
                    onChange={e => setCadPrompt(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Resolution Affordance (User Choice):
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['1K', '2K', '4K'] as const).map(res => (
                        <button
                          key={res}
                          type="button"
                          onClick={() => setImageSize(res)}
                          className={`p-2 rounded-lg border text-center font-bold font-mono transition cursor-pointer ${
                            imageSize === res
                              ? 'bg-blue-600 text-white border-blue-400'
                              : 'bg-slate-950 text-slate-400 border-slate-800'
                          }`}
                        >
                          {res}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Aspect Ratio:
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={e => setAspectRatio(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                    >
                      <option value="16:9">16:9 (Widescreen CAD)</option>
                      <option value="4:3">4:3 (Technical Sheet)</option>
                      <option value="1:1">1:1 (Square Detail)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">
                    Model: <span className="text-white font-mono">gemini-3-pro-image</span>
                  </span>

                  <button
                    type="submit"
                    disabled={isGeneratingImage}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating {imageSize} Blueprint...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4" />
                        Render {imageSize} CAD Schematic
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Generated Image Result */}
              {generatedImageUrl && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-white font-bold">Rendered Industrial Schematic ({imageSize})</span>
                    <a
                      href={generatedImageUrl}
                      download="bpw_engineering_cad.png"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Full Res
                    </a>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-slate-800 max-h-[380px] flex items-center justify-center bg-black">
                    <img
                      src={generatedImageUrl}
                      alt="CAD Schematic"
                      className="max-h-[380px] w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/90 text-xs">
          <span className="text-slate-400 font-mono">Status: Server-Side Operational</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
