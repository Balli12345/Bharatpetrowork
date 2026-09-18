import React, { useState, useEffect } from 'react';
import { api } from './services/api';
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
  EMarketProduct,
  EMarketOrder,
  RFQ,
  JobOpening,
  JobApplication,
  AcademyCourse,
  CourseEnrollment,
  NotificationItem,
  EmergencyContact,
  MaintenanceSchedule,
  DigitalDocument,
  DeliveryDriver,
  DeliveryConsignment,
  DeliveryStatus
} from './types';

import { Header } from './components/Header';
import { PublicWebsite } from './components/PublicWebsite';
import { PumpMitraClientApp } from './components/PumpMitraClientApp';
import { EngineerApp } from './components/EngineerApp';
import { DeliveryApp } from './components/DeliveryApp';
import { AdminWebCRM } from './components/AdminWebCRM';
import { AdminApp } from './components/AdminApp';
import { EMarket } from './components/EMarket';
import { JobsAndCareer } from './components/JobsAndCareer';
import { BPWAcademy } from './components/BPWAcademy';
import { AuditBlueprintModal } from './components/AuditBlueprintModal';
import { AIDiagnosticAssistantModal } from './components/AIDiagnosticAssistantModal';
import { PortalAuthModal, AuthPortalType } from './components/auth/PortalAuthModal';
import { BPWDocumentViewer, BPWDocType } from './components/documents/BPWDocumentViewer';
import { BPWLogo } from './components/brand/BPWLogo';
import { ShieldAlert, Sparkles, Layers, PhoneCall, Loader2, Wrench } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activePortal, setActivePortal] = useState<string>('public');

  // Application State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pumps, setPumps] = useState<PetrolPump[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [amcContracts, setAmcContracts] = useState<AMCContract[]>([]);
  const [inventory, setInventory] = useState<InventoryPart[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [cms, setCms] = useState<CMSContent | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [products, setProducts] = useState<EMarketProduct[]>([]);
  const [orders, setOrders] = useState<EMarketOrder[]>([]);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [courses, setCourses] = useState<AcademyCourse[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [documents, setDocuments] = useState<DigitalDocument[]>([]);
  const [consignments, setConsignments] = useState<DeliveryConsignment[]>([]);
  const [drivers, setDrivers] = useState<DeliveryDriver[]>([]);

  // Modals & Viewers
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedAcademyCourseId, setSelectedAcademyCourseId] = useState<string | null>(null);

  // Auth Modal State
  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean;
    portal: AuthPortalType;
    mode: 'login' | 'register';
  }>({
    isOpen: false,
    portal: 'pump-mitra',
    mode: 'login'
  });

  // Universal Document Viewer State
  const [docViewerState, setDocViewerState] = useState<{
    isOpen: boolean;
    type: BPWDocType;
    invoice?: Invoice | null;
    request?: ServiceRequest | null;
    amc?: AMCContract | null;
    document?: DigitalDocument | null;
  }>({
    isOpen: false,
    type: 'invoice'
  });

  // Initial Data Fetch
  const loadData = async () => {
    try {
      const data = await api.getBootstrapData();
      setCurrentUser(data.currentUser);
      setUsers(data.users || []);
      setPumps(data.pumps || []);
      setRequests(data.requests || []);
      setEngineers(data.engineers || []);
      setAmcContracts(data.amcContracts || []);
      setInventory(data.inventory || []);
      setMovements(data.movements || []);
      setInvoices(data.invoices || []);
      setPayments(data.payments || []);
      setAuditLogs(data.auditLogs || []);
      setCms(data.cms);
      setCategories(data.categories || []);
      setProducts(data.products || []);
      setOrders(data.orders || []);
      setRfqs(data.rfqs || []);
      setJobs(data.jobs || []);
      setApplications(data.applications || []);
      setCourses(data.courses || []);
      setEnrollments(data.enrollments || []);
      setNotifications(data.notifications || []);
      setEmergencyContacts(data.emergencyContacts || []);
      setSchedules(data.schedules || []);
      setDocuments(data.documents || []);
      setConsignments(data.consignments || []);
      setDrivers(data.drivers || []);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateConsignmentStatus = async (id: string, status: DeliveryStatus, currentCity?: string, eta?: string, note?: string) => {
    await api.updateConsignmentStatus(id, status, currentCity, eta, note);
    await loadData();
  };

  const handleVerifyPod = async (id: string, otp: string, signature?: string, receiverName?: string) => {
    const res = await api.verifyPod(id, otp, signature, receiverName);
    await loadData();
    return res;
  };

  const handleAcceptRfqQuote = async (rfqId: string, sellerId?: string) => {
    const res = await api.acceptRfqQuote(rfqId, sellerId);
    await loadData();
    return res;
  };

  const handleSubmitRfqQuote = async (rfqId: string, quoteData: any) => {
    const res = await api.submitRfqQuote(rfqId, quoteData);
    await loadData();
    return res;
  };

  const handleReconcilePayment = async (paymentData: any) => {
    const res = await api.reconcilePayment(paymentData);
    await loadData();
    return res;
  };

  // Handlers
  const handleSwitchUser = async (userId: string) => {
    const res = await api.switchUser(userId);
    if (res.user) {
      setCurrentUser(res.user);
      // Auto switch portal to match role naturally
      if (res.user.role === 'admin') setActivePortal('admin-crm');
      else if (res.user.role === 'engineer') setActivePortal('engineer');
      else if (res.user.role === 'client') setActivePortal('pump-mitra');
      else setActivePortal('public');
    }
  };

  const handleCreateRequest = async (requestData: Partial<ServiceRequest>) => {
    const res = await api.createServiceRequest(requestData);
    if (res.request) {
      setRequests(prev => [res.request, ...prev]);
      await loadData();
    }
    return res;
  };

  const handleUpdateStatus = async (requestId: string, status: string, note?: string) => {
    const res = await api.updateRequestStatus(requestId, status, note);
    if (res.request) {
      setRequests(prev => prev.map(r => r.id === requestId ? res.request : r));
      await loadData();
    }
    return res;
  };

  const handleAssignEngineer = async (requestId: string, engineerId: string) => {
    const res = await api.assignEngineer(requestId, engineerId);
    if (res.request) {
      setRequests(prev => prev.map(r => r.id === requestId ? res.request : r));
      await loadData();
    }
    return res;
  };

  const handleEngineerReport = async (jobId: string, reportData: any) => {
    const res = await api.submitEngineerReport(jobId, reportData);
    await loadData();
    return res;
  };

  const handleProcessPayment = async (invoiceId: string, method: string) => {
    const res = await api.processPayment(invoiceId, method);
    await loadData();
    return res;
  };

  const handleRenewAMC = async (amcId: string, pkg?: string, years?: number) => {
    const res = await fetch('/api/amc/renew', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amcId, packageType: pkg, durationYears: years || 1 })
    });
    await loadData();
    return res.json();
  };

  const handleCreateAMC = async (amcData: Partial<AMCContract>) => {
    const res = await api.createAMC(amcData);
    await loadData();
    return res;
  };

  const handleAddPump = async (pumpData: Partial<PetrolPump>) => {
    const res = await api.addPump(pumpData);
    if (res.pump) {
      setPumps(prev => [res.pump, ...prev]);
      await loadData();
    }
    return res;
  };

  const handleReplenishStock = async (partId: string, qty: number, notes?: string) => {
    const res = await api.replenishStock(partId, qty, notes);
    await loadData();
    return res;
  };

  const handleUpdateCMS = async (cmsData: Partial<CMSContent>) => {
    const res = await api.updateCMS(cmsData);
    if (res.cms) setCms(res.cms);
    return res;
  };

  const handleCreateOrder = async (orderData: Partial<EMarketOrder>) => {
    const res = await api.createEMarketOrder(orderData);
    await loadData();
    return res;
  };

  const handleSubmitRFQ = async (rfqData: Partial<RFQ>) => {
    const res = await api.submitRFQ(rfqData);
    await loadData();
    return res;
  };

  const handleApplyJob = async (appData: any) => {
    const res = await api.applyJob(appData);
    await loadData();
    return res;
  };

  const handleEnrollCourse = async (courseId: string) => {
    const res = await api.enrollCourse(courseId);
    await loadData();
    return res;
  };

  const handleCertify = async (enrollmentId: string) => {
    const res = await api.certifyCourse(enrollmentId);
    await loadData();
    return res;
  };

  const handleMarkNotificationsRead = async () => {
    await api.markNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleOpenAuth = (portal: AuthPortalType, mode: 'login' | 'register' = 'login') => {
    setAuthModalState({
      isOpen: true,
      portal,
      mode
    });
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    if (authModalState.portal === 'pump-mitra') setActivePortal('pump-mitra');
    else if (authModalState.portal === 'engineer') setActivePortal('engineer');
    else if (authModalState.portal === 'admin-crm') setActivePortal('admin-crm');
    else if (authModalState.portal === 'emarket') setActivePortal('e-market');
    else if (authModalState.portal === 'academy') setActivePortal('academy');
  };

  // Corporate Loading Screen
  if (loading || !currentUser || !cms) {
    return (
      <div className="min-h-screen bg-[#0F2B48] flex flex-col items-center justify-center text-white space-y-6 p-6">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/15 shadow-2xl flex flex-col items-center max-w-sm text-center">
          <BPWLogo variant="dark-bg" size="lg" subBrand="main" />
          <div className="mt-6 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-amber-400/20 border-t-amber-400 animate-spin flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[#E55812]" />
            </div>
          </div>
          <h2 className="text-base font-extrabold text-white tracking-wide uppercase mt-4">
            BHARAT PETROWORK
          </h2>
          <p className="text-xs text-slate-300 font-mono mt-1">
            Initializing Unified Digital Ecosystem...
          </p>
          <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[10px] text-amber-300 font-semibold">
            <span>ISO 9001:2015</span> • <span>PESO Certified</span> • <span>OISD-141</span>
          </div>
        </div>
      </div>
    );
  }

  // Find engineer record for engineer view
  const currentEngineer = (engineers || []).find(e => e.userId === currentUser.id) || engineers?.[0] || null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F2B48] flex flex-col selection:bg-[#E55812] selection:text-white">
      {/* Global Universal Header */}
      <Header
        currentUser={currentUser}
        allUsers={users}
        notifications={notifications}
        activePortal={activePortal}
        onSelectPortal={setActivePortal}
        onSwitchUser={handleSwitchUser}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        onOpenAuditModal={() => setShowAuditModal(true)}
        onOpenAIModal={() => setShowAIModal(true)}
        onOpenAuthModal={handleOpenAuth}
      />

      {/* Primary Dynamic Workspaces */}
      <div className="flex-1">
        {activePortal === 'public' && (
          <PublicWebsite
            cms={cms}
            categories={categories}
            pumps={pumps}
            currentUser={currentUser}
            onRequestService={handleCreateRequest}
            onNavigate={(portal) => setActivePortal(portal)}
            onOpenAI={() => setShowAIModal(true)}
            onOpenAudit={() => setShowAuditModal(true)}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {activePortal === 'pump-mitra' && (
          <PumpMitraClientApp
            currentUser={currentUser}
            pumps={pumps}
            requests={requests}
            amcContracts={amcContracts}
            schedules={schedules}
            invoices={invoices}
            documents={documents}
            categories={categories}
            emergencyContacts={emergencyContacts}
            onCreateRequest={handleCreateRequest}
            onAddPump={handleAddPump}
            onProcessPayment={handleProcessPayment}
            onPayInvoice={handleProcessPayment}
            onRenewAMC={handleRenewAMC}
            onCreateAMC={handleCreateAMC}
          />
        )}

        {activePortal === 'engineer' && (
          <EngineerApp
            currentUser={currentUser}
            engineers={engineers}
            engineer={currentEngineer}
            requests={requests}
            inventory={inventory}
            onUpdateStatus={handleUpdateStatus}
            onSubmitReport={handleEngineerReport}
          />
        )}

        {activePortal === 'delivery' && (
          <DeliveryApp
            currentUser={currentUser}
            consignments={consignments}
            drivers={drivers}
            onUpdateConsignmentStatus={handleUpdateConsignmentStatus}
            onVerifyPod={handleVerifyPod}
          />
        )}

        {activePortal === 'admin-crm' && (
          <AdminWebCRM
            currentUser={currentUser}
            users={users}
            pumps={pumps}
            requests={requests}
            engineers={engineers}
            amcContracts={amcContracts}
            inventory={inventory}
            movements={movements}
            invoices={invoices}
            payments={payments}
            auditLogs={auditLogs}
            cms={cms}
            categories={categories}
            consignments={consignments}
            drivers={drivers}
            rfqs={rfqs}
            onUpdateStatus={handleUpdateStatus}
            onAssignEngineer={handleAssignEngineer}
            onReplenishStock={handleReplenishStock}
            onUpdateCMS={handleUpdateCMS}
            onReconcilePayment={handleReconcilePayment}
            onUpdateConsignmentStatus={handleUpdateConsignmentStatus}
            onOpenAudit={() => setShowAuditModal(true)}
            onOpenAI={() => setShowAIModal(true)}
          />
        )}

        {activePortal === 'admin-app' && (
          <AdminApp
            currentUser={currentUser}
            requests={requests}
            engineers={engineers}
            pumps={pumps}
            onUpdateStatus={handleUpdateStatus}
            onAssignEngineer={handleAssignEngineer}
          />
        )}

        {activePortal === 'e-market' && (
          <EMarket
            currentUser={currentUser}
            products={products}
            orders={orders}
            rfqs={rfqs}
            consignments={consignments}
            onCreateOrder={handleCreateOrder}
            onSubmitRFQ={handleSubmitRFQ}
            onAcceptQuote={handleAcceptRfqQuote}
            onSubmitQuote={handleSubmitRfqQuote}
          />
        )}

        {activePortal === 'jobs' && (
          <JobsAndCareer
            currentUser={currentUser}
            jobs={jobs}
            applications={applications}
            onApplyJob={handleApplyJob}
            onNavigateToAcademy={(courseId) => {
              setSelectedAcademyCourseId(courseId || null);
              setActivePortal('academy');
            }}
          />
        )}

        {activePortal === 'academy' && (
          <BPWAcademy
            currentUser={currentUser}
            courses={courses}
            enrollments={enrollments}
            onEnroll={handleEnrollCourse}
            onCertify={handleCertify}
            selectedCourseId={selectedAcademyCourseId}
          />
        )}
      </div>

      {/* Floating Operational Quick-Dock (Bottom-Right) */}
      <aside aria-label="Operational quick controls" className="fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200/80 p-1.5 rounded-2xl shadow-xl hover:shadow-2xl transition">
        <a
          href="tel:+918527023022"
          title="24/7 Forecourt Emergency Hotline (+91 85270 23022)"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">+91 85270 23022</span>
          <span className="sm:hidden">SOS</span>
        </a>

        <button
          onClick={() => setShowAIModal(true)}
          title="AI Diagnostic Assistant (Gemini 2.5 Flash)"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0F2B48] hover:bg-[#1A4068] text-white font-bold text-xs shadow-sm transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">AI Station Assistant</span>
        </button>

        <button
          onClick={() => setShowAuditModal(true)}
          title="System Architecture Blueprint"
          className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-[#E55812]" />
          <span className="hidden lg:inline">Blueprint</span>
        </button>
      </aside>

      {/* Global Deliverable Blueprint Modal */}
      <AuditBlueprintModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
      />

      {/* Global AI High-Thinking & CAD Modal */}
      <AIDiagnosticAssistantModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
      />

      {/* Global Sub-Brand Portal Authentication Modal */}
      <PortalAuthModal
        isOpen={authModalState.isOpen}
        portal={authModalState.portal}
        initialMode={authModalState.mode}
        availableUsers={users || []}
        onClose={() => setAuthModalState(prev => ({ ...prev, isOpen: false }))}
        onSuccess={handleAuthSuccess}
      />

      {/* Global Document & Tax Invoice Print Viewer */}
      <BPWDocumentViewer
        isOpen={docViewerState.isOpen}
        type={docViewerState.type}
        invoice={docViewerState.invoice}
        request={docViewerState.request}
        amc={docViewerState.amc}
        document={docViewerState.document}
        onClose={() => setDocViewerState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
