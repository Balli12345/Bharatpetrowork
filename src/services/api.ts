/**
 * Bharat PetroWork — Central API Client
 */

import {
  User,
  PetrolPump,
  ServiceCategory,
  ServiceRequest,
  Engineer,
  AMCContract,
  MaintenanceSchedule,
  InventoryPart,
  StockMovement,
  Invoice,
  PaymentTransaction,
  EMarketProduct,
  EMarketOrder,
  RFQ,
  JobOpening,
  JobApplication,
  AcademyCourse,
  CourseEnrollment,
  DigitalDocument,
  NotificationItem,
  AuditLog,
  CMSContent,
  DeliveryDriver,
  DeliveryConsignment
} from '../types';

export const api = {
  // Auth
  async getUsers(): Promise<User[]> {
    const res = await fetch('/api/auth/users');
    return res.json();
  },

  async login(email?: string, role?: string): Promise<{ success: boolean; user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role })
    });
    return res.json();
  },

  // Pumps
  async getPumps(): Promise<PetrolPump[]> {
    const res = await fetch('/api/client/pumps');
    return res.json();
  },

  async addPump(pump: Partial<PetrolPump>): Promise<{ success: boolean; pump: PetrolPump }> {
    const res = await fetch('/api/client/pumps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pump)
    });
    return res.json();
  },

  // Categories & Requests
  async getCategories(): Promise<ServiceCategory[]> {
    const res = await fetch('/api/services/categories');
    return res.json();
  },

  async getRequests(): Promise<ServiceRequest[]> {
    const res = await fetch('/api/pump-mitra/requests');
    return res.json();
  },

  async createRequest(reqData: Partial<ServiceRequest>): Promise<{ success: boolean; request: ServiceRequest }> {
    const res = await fetch('/api/pump-mitra/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqData)
    });
    return res.json();
  },

  async updateRequestStatus(
    id: string,
    status: string,
    note?: string,
    userContext?: { userId: string; userName: string; userRole: string }
  ): Promise<{ success: boolean; request: ServiceRequest }> {
    const res = await fetch(`/api/pump-mitra/requests/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note, ...userContext })
    });
    return res.json();
  },

  // Engineers & Assignment
  async getEngineers(): Promise<Engineer[]> {
    const res = await fetch('/api/engineers');
    return res.json();
  },

  async assignEngineer(
    requestId: string,
    engineerId: string,
    userId?: string,
    userName?: string
  ): Promise<{ success: boolean; request: ServiceRequest; engineer: Engineer }> {
    const res = await fetch('/api/admin/assign-engineer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, engineerId, userId, userName })
    });
    return res.json();
  },

  async submitEngineerReport(
    requestId: string,
    reportData: any
  ): Promise<{ success: boolean; request: ServiceRequest }> {
    const res = await fetch(`/api/engineer/jobs/${requestId}/submit-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    });
    return res.json();
  },

  // Inventory
  async getInventory(): Promise<InventoryPart[]> {
    const res = await fetch('/api/inventory/parts');
    return res.json();
  },

  async getStockMovements(): Promise<StockMovement[]> {
    const res = await fetch('/api/inventory/movements');
    return res.json();
  },

  async replenishStock(partId: string, quantity: number, notes?: string): Promise<any> {
    const res = await fetch('/api/inventory/replenish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partId, quantity, notes })
    });
    return res.json();
  },

  // AMC & Maintenance
  async getAMCContracts(): Promise<AMCContract[]> {
    const res = await fetch('/api/amc/contracts');
    return res.json();
  },

  async getMaintenanceSchedules(): Promise<MaintenanceSchedule[]> {
    const res = await fetch('/api/amc/schedule');
    return res.json();
  },

  async renewAMC(amcId: string, packageType: string, durationYears: number): Promise<any> {
    const res = await fetch('/api/amc/renew', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amcId, packageType, durationYears })
    });
    return res.json();
  },

  // Invoices & Payments
  async getInvoices(): Promise<Invoice[]> {
    const res = await fetch('/api/invoices');
    return res.json();
  },

  async getPayments(): Promise<PaymentTransaction[]> {
    const res = await fetch('/api/payments');
    return res.json();
  },

  async processPayment(invoiceId: string, gateway: string, paymentMethod?: string): Promise<any> {
    const res = await fetch('/api/payments/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId, gateway, paymentMethod })
    });
    return res.json();
  },

  // E-Market
  async getProducts(): Promise<EMarketProduct[]> {
    const res = await fetch('/api/e-market/products');
    return res.json();
  },

  async getOrders(): Promise<EMarketOrder[]> {
    const res = await fetch('/api/e-market/orders');
    return res.json();
  },

  async createOrder(orderData: Partial<EMarketOrder>): Promise<any> {
    const res = await fetch('/api/e-market/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  async getRFQs(): Promise<RFQ[]> {
    const res = await fetch('/api/e-market/rfqs');
    return res.json();
  },

  async submitRFQ(rfqData: Partial<RFQ>): Promise<any> {
    const res = await fetch('/api/e-market/rfqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rfqData)
    });
    return res.json();
  },

  // Jobs
  async getJobs(): Promise<JobOpening[]> {
    const res = await fetch('/api/jobs');
    return res.json();
  },

  async getApplications(): Promise<JobApplication[]> {
    const res = await fetch('/api/jobs/applications');
    return res.json();
  },

  async applyJob(appData: any): Promise<any> {
    const res = await fetch('/api/jobs/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
    return res.json();
  },

  // Academy
  async getCourses(): Promise<AcademyCourse[]> {
    const res = await fetch('/api/academy/courses');
    return res.json();
  },

  async getEnrollments(): Promise<CourseEnrollment[]> {
    const res = await fetch('/api/academy/enrollments');
    return res.json();
  },

  async enrollCourse(courseId: string, userId?: string, userName?: string): Promise<any> {
    const res = await fetch('/api/academy/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, userId, userName })
    });
    return res.json();
  },

  async certifyEnrollment(enrollmentId: string): Promise<any> {
    const res = await fetch('/api/academy/certify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollmentId })
    });
    return res.json();
  },

  // Documents
  async getDocuments(): Promise<DigitalDocument[]> {
    const res = await fetch('/api/documents');
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch('/api/notifications');
    return res.json();
  },

  async markNotificationRead(id: string): Promise<any> {
    const res = await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
    return res.json();
  },

  // Admin & CMS
  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/admin/audit-logs');
    return res.json();
  },

  async getCMS(): Promise<CMSContent> {
    const res = await fetch('/api/cms');
    return res.json();
  },

  async updateCMS(cmsData: Partial<CMSContent>): Promise<any> {
    const res = await fetch('/api/cms', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cmsData)
    });
    return res.json();
  },

  // Bootstrap Ecosystem State
  async getBootstrapData(): Promise<any> {
    const res = await fetch('/api/bootstrap');
    return res.json();
  },

  async switchUser(userId: string): Promise<{ success: boolean; user: User; token: string }> {
    const users = (await this.getUsers()) || [];
    const user = users.find(u => u.id === userId) || users[0];
    if (!user) {
      throw new Error('User not found');
    }
    return this.login(user.email, user.role);
  },

  // Aliases for clear domain nomenclature
  async createServiceRequest(reqData: Partial<ServiceRequest>): Promise<{ success: boolean; request: ServiceRequest }> {
    return this.createRequest(reqData);
  },

  async createAMC(amcData: Partial<AMCContract>): Promise<any> {
    const res = await fetch('/api/amc/contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(amcData)
    });
    return res.json();
  },

  async createEMarketOrder(orderData: Partial<EMarketOrder>): Promise<any> {
    return this.createOrder(orderData);
  },

  async certifyCourse(enrollmentId: string): Promise<any> {
    return this.certifyEnrollment(enrollmentId);
  },

  async markNotificationsRead(): Promise<any> {
    const res = await fetch('/api/notifications/read-all', { method: 'POST' });
    return res.json();
  },

  // AI Assistant Endpoints
  async runDiagnostic(issueDescription: string, pumpContext?: string): Promise<{ analysis: string }> {
    const res = await fetch('/api/ai/diagnostics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issueDescription, pumpContext })
    });
    return res.json();
  },

  async generateCADImage(prompt: string, imageSize = '1K', aspectRatio = '16:9'): Promise<{ imageUrl: string }> {
    const res = await fetch('/api/ai/generate-cad-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, imageSize, aspectRatio })
    });
    return res.json();
  },

  // Logistics & Fleet Consignments
  async getConsignments(): Promise<DeliveryConsignment[]> {
    const res = await fetch('/api/logistics/consignments');
    return res.json();
  },

  async getDrivers(): Promise<DeliveryDriver[]> {
    const res = await fetch('/api/logistics/drivers');
    return res.json();
  },

  async updateConsignmentStatus(id: string, status: string, currentCity?: string, eta?: string, note?: string): Promise<any> {
    const res = await fetch(`/api/logistics/consignments/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, currentCity, eta, note })
    });
    return res.json();
  },

  async verifyPod(id: string, otp: string, receiverSignature?: string, receiverName?: string): Promise<any> {
    const res = await fetch(`/api/logistics/consignments/${id}/verify-pod`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp, receiverSignature, receiverName })
    });
    return res.json();
  },

  async submitRfqQuote(rfqId: string, quoteData: any): Promise<any> {
    const res = await fetch(`/api/e-market/rfqs/${rfqId}/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteData)
    });
    return res.json();
  },

  async acceptRfqQuote(rfqId: string, sellerId?: string): Promise<any> {
    const res = await fetch(`/api/e-market/rfqs/${rfqId}/accept-quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sellerId })
    });
    return res.json();
  },

  async reconcilePayment(paymentData: any): Promise<any> {
    const res = await fetch('/api/admin/payments/reconcile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return res.json();
  }
};
