import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  INITIAL_CMS,
  INITIAL_USERS,
  INITIAL_SERVICE_CATEGORIES,
  INITIAL_PETROL_PUMPS,
  INITIAL_ENGINEERS,
  INITIAL_SERVICE_REQUESTS,
  INITIAL_AMC_CONTRACTS,
  INITIAL_MAINTENANCE_SCHEDULE,
  INITIAL_INVENTORY_PARTS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_E_MARKET_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_RFQS,
  INITIAL_JOBS,
  INITIAL_JOB_APPLICATIONS,
  INITIAL_ACADEMY_COURSES,
  INITIAL_ENROLLMENTS,
  INITIAL_DIGITAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DRIVERS,
  INITIAL_CONSIGNMENTS
} from './src/data/mockData.js';
import {
  ServiceRequest,
  ServiceStatus,
  AuditLog,
  InventoryPart,
  StockMovement,
  Invoice,
  PaymentTransaction,
  EMarketOrder,
  RFQ,
  JobApplication,
  CourseEnrollment,
  NotificationItem,
  PetrolPump,
  DeliveryDriver,
  DeliveryConsignment
} from './src/types.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Lazy Google GenAI initialization for server-side AI operations
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// In-Memory Normalized Operational State (Initialized with Seed)
// -------------------------------------------------------------
const db = {
  cms: { ...INITIAL_CMS },
  users: [...INITIAL_USERS],
  categories: [...INITIAL_SERVICE_CATEGORIES],
  pumps: [...INITIAL_PETROL_PUMPS],
  engineers: [...INITIAL_ENGINEERS],
  requests: [...INITIAL_SERVICE_REQUESTS],
  amcContracts: [...INITIAL_AMC_CONTRACTS],
  maintenanceSchedules: [...INITIAL_MAINTENANCE_SCHEDULE],
  inventory: [...INITIAL_INVENTORY_PARTS],
  stockMovements: [...INITIAL_STOCK_MOVEMENTS],
  invoices: [...INITIAL_INVOICES],
  payments: [...INITIAL_PAYMENTS],
  products: [...INITIAL_E_MARKET_PRODUCTS],
  orders: [...INITIAL_ORDERS],
  rfqs: [...INITIAL_RFQS],
  jobs: [...INITIAL_JOBS],
  applications: [...INITIAL_JOB_APPLICATIONS],
  courses: [...INITIAL_ACADEMY_COURSES],
  enrollments: [...INITIAL_ENROLLMENTS],
  documents: [...INITIAL_DIGITAL_DOCUMENTS],
  notifications: [...INITIAL_NOTIFICATIONS],
  auditLogs: [...INITIAL_AUDIT_LOGS],
  drivers: [...INITIAL_DRIVERS],
  consignments: [...INITIAL_CONSIGNMENTS]
};

// Helper: Append Audit Log
function logAudit(
  userId: string,
  userName: string,
  userRole: string,
  action: string,
  entityType: string,
  entityId: string,
  details: string,
  fromStatus?: string,
  toStatus?: string
) {
  const log: AuditLog = {
    id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    userRole,
    action,
    entityType,
    entityId,
    fromStatus,
    toStatus,
    details,
    ipAddress: '127.0.0.1'
  };
  db.auditLogs.unshift(log);
  return log;
}

// Helper: Push Notification
function pushNotification(
  userId: string,
  title: string,
  message: string,
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'EMERGENCY',
  channel: 'IN_APP' | 'EMAIL' | 'WHATSAPP' = 'IN_APP',
  actionUrl?: string
) {
  const notif: NotificationItem = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    userId,
    title,
    message,
    type,
    channel,
    read: false,
    createdAt: new Date().toISOString(),
    actionUrl
  };
  db.notifications.unshift(notif);
  return notif;
}

// =============================================================
// API ROUTES FIRST
// =============================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Bharat PetroWork Enterprise Digital Ecosystem',
    time: new Date().toISOString(),
    version: '2026.1.0-PROD'
  });
});

// --- BOOTSTRAP API ---
app.get('/api/bootstrap', (req, res) => {
  res.json({
    currentUser: db.users[0],
    users: db.users,
    pumps: db.pumps,
    requests: db.requests,
    engineers: db.engineers,
    amcContracts: db.amcContracts,
    inventory: db.inventory,
    movements: db.stockMovements,
    invoices: db.invoices,
    payments: db.payments,
    auditLogs: db.auditLogs,
    cms: db.cms,
    categories: db.categories,
    products: db.products,
    orders: db.orders,
    rfqs: db.rfqs,
    jobs: db.jobs,
    applications: db.applications,
    courses: db.courses,
    enrollments: db.enrollments,
    notifications: db.notifications,
    schedules: db.maintenanceSchedules,
    documents: db.documents,
    drivers: db.drivers,
    consignments: db.consignments,
    emergencyContacts: [
      { role: 'Central Forecourt Emergency Helpdesk', name: 'BPW Rapid Dispatch Command', phone: '1800-890-BPWORK (Toll-Free)', available: '24/7/365 Non-Stop' },
      { role: 'Chief Technical Director', name: 'Vikramaditya Rao', phone: '+91 98110 54321', available: 'Immediate Escalation' },
      { role: 'Zone 1 Vapor & Fire HSE Officer', name: 'Col. Sanjeev Nair (Retd.)', phone: '+91 98440 11223', available: 'HazMat On-Call' },
      { role: 'Forecourt Electronics & Automation Head', name: 'Sunil Shekhawat', phone: '+91 98290 66778', available: 'Technical Command' }
    ]
  });
});

// --- AUTH & USER APIS ---
app.get('/api/auth/users', (req, res) => {
  res.json(db.users);
});

app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  const user = db.users.find(u => (email ? u.email.toLowerCase() === email.toLowerCase() : u.role === role)) || db.users[0];
  res.json({ success: true, user, token: `bpw_jwt_${user.id}_${Date.now()}` });
});

// --- CLIENT APIS ---
app.get('/api/client/pumps', (req, res) => {
  res.json(db.pumps);
});

app.post('/api/client/pumps', (req, res) => {
  const pumpData = req.body;
  const newPump: PetrolPump = {
    id: `pump-${Date.now()}`,
    clientId: pumpData.clientId || 'usr-client-1',
    clientName: pumpData.clientName || 'Rajesh Sharma',
    pumpName: pumpData.pumpName,
    roCode: pumpData.roCode || `RO-${Math.floor(10000 + Math.random() * 90000)}-${pumpData.oilCompany}`,
    oilCompany: pumpData.oilCompany || 'IOCL',
    address: pumpData.address,
    city: pumpData.city,
    state: pumpData.state || 'Uttar Pradesh',
    pincode: pumpData.pincode,
    lat: pumpData.lat || 28.4069,
    lng: pumpData.lng || 77.8498,
    totalTanks: Number(pumpData.totalTanks) || 2,
    totalDispensers: Number(pumpData.totalDispensers) || 4,
    atgInstalled: Boolean(pumpData.atgInstalled),
    atgModel: pumpData.atgModel || (pumpData.atgInstalled ? 'Veeder-Root TLS-450' : undefined),
    stpInstalled: Boolean(pumpData.stpInstalled),
    amcActive: false,
    contactPerson: pumpData.contactPerson,
    contactPhone: pumpData.contactPhone
  };
  db.pumps.unshift(newPump);

  logAudit(
    newPump.clientId,
    newPump.clientName,
    'client',
    'ADD_PETROL_PUMP',
    'petrol_pumps',
    newPump.id,
    `Registered new retail outlet ${newPump.pumpName} (${newPump.roCode}) under ${newPump.oilCompany}`
  );

  res.json({ success: true, pump: newPump });
});

// --- PUMP MITRA / SERVICE REQUESTS APIS ---
app.get('/api/services/categories', (req, res) => {
  res.json(db.categories);
});

app.get('/api/pump-mitra/requests', (req, res) => {
  res.json(db.requests);
});

app.post('/api/pump-mitra/requests', (req, res) => {
  const data = req.body;
  const requestId = `BPW-SR-2026-${String(db.requests.length + 1).padStart(6, '0')}`;
  
  const category = db.categories.find(c => c.id === data.categoryId) || db.categories[0];
  const pump = db.pumps.find(p => p.id === data.pumpId) || db.pumps[0];

  const newRequest: ServiceRequest = {
    id: requestId,
    clientId: data.clientId || 'usr-client-1',
    clientName: pump ? pump.clientName : 'Rajesh Sharma',
    pumpId: pump ? pump.id : 'pump-01',
    pumpName: pump ? pump.pumpName : 'Highway Star Petro Hub',
    pumpAddress: pump ? pump.address : 'NH-91 Expressway',
    oilCompany: pump ? pump.oilCompany : 'IOCL',
    categoryId: category.id,
    categoryName: category.name,
    problemType: data.problemType || 'Equipment Malfunction',
    priority: data.isEmergency ? 'EMERGENCY' : (data.priority || 'HIGH'),
    status: data.isEmergency ? 'PENDING_REVIEW' : 'NEW',
    preferredDate: data.preferredDate || new Date().toISOString().split('T')[0],
    description: data.description || '',
    isEmergency: Boolean(data.isEmergency),
    emergencyType: data.emergencyType,
    locationShared: Boolean(data.locationShared),
    lat: pump ? pump.lat : 28.4069,
    lng: pump ? pump.lng : 77.8498,
    estimatedCost: category.standardRate || 7500,
    photos: data.photos || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.requests.unshift(newRequest);

  logAudit(
    newRequest.clientId,
    newRequest.clientName,
    'client',
    newRequest.isEmergency ? 'EMERGENCY_REQUEST_RAISED' : 'SERVICE_REQUEST_CREATED',
    'service_requests',
    newRequest.id,
    `Raised ${newRequest.isEmergency ? 'EMERGENCY' : newRequest.priority} ticket for ${newRequest.problemType} at ${newRequest.pumpName}`,
    undefined,
    newRequest.status
  );

  // Admin Notification
  pushNotification(
    'usr-admin-1',
    newRequest.isEmergency ? '🚨 CRITICAL EMERGENCY TICKET' : 'New Service Request Created',
    `${newRequest.isEmergency ? '[EMERGENCY 45-MIN SLA] ' : ''}${newRequest.id} raised by ${newRequest.pumpName}: ${newRequest.problemType}`,
    newRequest.isEmergency ? 'EMERGENCY' : 'INFO',
    newRequest.isEmergency ? 'WHATSAPP' : 'IN_APP',
    'requests'
  );

  res.json({ success: true, request: newRequest });
});

// Update Request Status (18-State Machine)
app.post('/api/pump-mitra/requests/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, note, userId, userName, userRole } = req.body;
  const request = db.requests.find(r => r.id === id);

  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  const previousStatus = request.status;
  request.status = status as ServiceStatus;
  request.updatedAt = new Date().toISOString();

  logAudit(
    userId || 'usr-admin-1',
    userName || 'Vikramaditya Rao (Chief Operations)',
    userRole || 'admin',
    'STATUS_CHANGE',
    'service_requests',
    id,
    note || `Transitioned status from ${previousStatus} to ${status}`,
    previousStatus,
    status
  );

  // Auto-generate invoice if transitioning to INVOICE_GENERATED
  if (status === 'INVOICE_GENERATED' && !db.invoices.find(inv => inv.requestId === id)) {
    const invNumber = `BPW-INV-2026-${String(db.invoices.length + 1).padStart(4, '0')}`;
    const subtotal = request.finalCost || request.estimatedCost || 8500;
    const taxAmount = Math.round(subtotal * 0.18);
    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNumber,
      requestId: id,
      clientId: request.clientId,
      clientName: request.clientName,
      pumpName: request.pumpName,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      subtotal,
      taxAmount,
      discount: 0,
      totalAmount: subtotal + taxAmount,
      status: 'PENDING',
      items: [
        {
          description: `${request.categoryName} - ${request.problemType}`,
          quantity: 1,
          unitPrice: subtotal,
          amount: subtotal
        }
      ]
    };
    db.invoices.unshift(invoice);
  }

  // Notify Client
  pushNotification(
    request.clientId,
    `Service Update: ${id}`,
    `Status updated to "${(status || '').replace(/_/g, ' ')}" for ${request.pumpName}.`,
    status === 'COMPLETED' ? 'SUCCESS' : 'INFO'
  );

  res.json({ success: true, request });
});

// --- ENGINEER ASSIGNMENT APIS ---
app.get('/api/engineers', (req, res) => {
  res.json(db.engineers);
});

app.post('/api/admin/assign-engineer', (req, res) => {
  const { requestId, engineerId, userId, userName } = req.body;
  const request = db.requests.find(r => r.id === requestId);
  const engineer = db.engineers.find(e => e.id === engineerId);

  if (!request || !engineer) {
    return res.status(404).json({ error: 'Request or Engineer not found' });
  }

  const prevStatus = request.status;
  request.assignedEngineerId = engineer.id;
  request.assignedEngineerName = engineer.name;
  request.assignedEngineerPhone = engineer.phone;
  request.status = 'ASSIGNED';
  request.updatedAt = new Date().toISOString();

  engineer.status = 'BUSY';

  logAudit(
    userId || 'usr-admin-1',
    userName || 'Vikramaditya Rao',
    'admin',
    'ENGINEER_ASSIGNED',
    'service_requests',
    requestId,
    `Assigned field technician ${engineer.name} (${engineer.employeeId}) to job ${requestId}`,
    prevStatus,
    'ASSIGNED'
  );

  // Notify Engineer
  pushNotification(
    engineer.userId,
    'New Job Dispatched',
    `You have been assigned to ${request.pumpName} (${request.oilCompany}). Issue: ${request.problemType}.`,
    request.isEmergency ? 'EMERGENCY' : 'INFO',
    'WHATSAPP',
    'jobs'
  );

  // Notify Client
  pushNotification(
    request.clientId,
    'Field Engineer Assigned',
    `Technician ${engineer.name} (${engineer.phone}) assigned. Preparing dispatch with Mobile Van tooling.`,
    'INFO'
  );

  res.json({ success: true, request, engineer });
});

// Engineer Work Report & Parts Usage (With Automated Inventory Stock Out)
app.post('/api/engineer/jobs/:id/submit-report', (req, res) => {
  const { id } = req.params;
  const {
    engineerId,
    engineerName,
    inspectionFindings,
    workSummary,
    safetyChecklistPassed,
    partsUsed, // array of { partId, quantity }
    customerSignatureName,
    beforePhotos,
    afterPhotos
  } = req.body;

  const request = db.requests.find(r => r.id === id);
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  let additionalPartsCost = 0;

  // Process Parts Used & Auto STOCK OUT
  if (Array.isArray(partsUsed) && partsUsed.length > 0) {
    for (const item of partsUsed) {
      const part = db.inventory.find(p => p.id === item.partId);
      if (part) {
        const qty = Number(item.quantity) || 1;
        part.stock = Math.max(0, part.stock - qty);
        if (part.stock <= part.minStock) {
          part.status = part.stock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK';
          // Low stock alert
          pushNotification(
            'usr-admin-1',
            `Low Stock Alert: ${part.partName}`,
            `Part ${part.partCode} is down to ${part.stock} ${part.unit}. Threshold is ${part.minStock}.`,
            'WARNING'
          );
        }

        additionalPartsCost += (part.sellingPrice * qty);

        const movement: StockMovement = {
          id: `sm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          partId: part.id,
          partName: part.partName,
          movementType: 'OUT',
          quantity: qty,
          referenceId: id,
          notes: `Used during field job execution ${id} at ${request.pumpName}`,
          timestamp: new Date().toISOString()
        };
        db.stockMovements.unshift(movement);

        logAudit(
          engineerId || 'usr-eng-1',
          engineerName || 'Amitabh Verma',
          'engineer',
          'INVENTORY_STOCK_OUT',
          'parts',
          part.id,
          `Consumed ${qty} x ${part.partName} (${part.partCode}) for job ${id}`
        );
      }
    }
  }

  request.finalCost = (request.estimatedCost || 6500) + additionalPartsCost;
  request.status = 'APPROVAL_PENDING';
  request.updatedAt = new Date().toISOString();

  logAudit(
    engineerId || 'usr-eng-1',
    engineerName || 'Amitabh Verma',
    'engineer',
    'JOB_REPORT_SUBMITTED',
    'service_requests',
    id,
    `Work report submitted with sign-off by ${customerSignatureName || 'Station Rep'}. Transferred for Admin QA Approval.`,
    'WORK_IN_PROGRESS',
    'APPROVAL_PENDING'
  );

  // Notify Admin
  pushNotification(
    'usr-admin-1',
    `QA Review Required: ${id}`,
    `Technician ${engineerName} submitted completion report for ${request.pumpName}. Customer signed.`,
    'INFO'
  );

  res.json({ success: true, request });
});

// --- INVENTORY APIS ---
app.get('/api/inventory/parts', (req, res) => {
  res.json(db.inventory);
});

app.get('/api/inventory/movements', (req, res) => {
  res.json(db.stockMovements);
});

app.post('/api/inventory/replenish', (req, res) => {
  const { partId, quantity, notes } = req.body;
  const part = db.inventory.find(p => p.id === partId);
  if (!part) return res.status(404).json({ error: 'Part not found' });

  const qty = Number(quantity) || 10;
  part.stock += qty;
  part.status = part.stock <= part.minStock ? 'LOW_STOCK' : 'IN_STOCK';
  part.lastRestocked = new Date().toISOString().split('T')[0];

  const sm: StockMovement = {
    id: `sm-${Date.now()}`,
    partId: part.id,
    partName: part.partName,
    movementType: 'IN',
    quantity: qty,
    referenceId: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
    notes: notes || 'Warehouse batch replenishment',
    timestamp: new Date().toISOString()
  };
  db.stockMovements.unshift(sm);

  logAudit(
    'usr-admin-1',
    'Operations Admin',
    'admin',
    'INVENTORY_RESTOCK',
    'parts',
    part.id,
    `Replenished ${qty} units of ${part.partName}. Current stock: ${part.stock}`
  );

  res.json({ success: true, part, movement: sm });
});

// --- AMC & MAINTENANCE APIS ---
app.get('/api/amc/contracts', (req, res) => {
  res.json(db.amcContracts);
});

app.get('/api/amc/schedule', (req, res) => {
  res.json(db.maintenanceSchedules);
});

app.post('/api/amc/renew', (req, res) => {
  const { amcId, packageType, durationYears } = req.body;
  const contract = db.amcContracts.find(c => c.id === amcId);
  if (!contract) return res.status(404).json({ error: 'Contract not found' });

  contract.status = 'ACTIVE';
  contract.packageType = packageType || contract.packageType;
  contract.startDate = new Date().toISOString().split('T')[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + (durationYears || 1));
  contract.endDate = nextYear.toISOString().split('T')[0];

  logAudit(
    contract.clientId,
    contract.clientName,
    'client',
    'AMC_RENEWAL',
    'amc_contracts',
    contract.id,
    `Renewed AMC contract ${contract.contractNumber} under ${contract.packageType} package until ${contract.endDate}`
  );

  res.json({ success: true, contract });
});

// --- BILLING & PAYMENTS APIS ---
app.get('/api/invoices', (req, res) => {
  res.json(db.invoices);
});

app.get('/api/payments', (req, res) => {
  res.json(db.payments);
});

app.post('/api/payments/process', (req, res) => {
  const { invoiceId, gateway, paymentMethod } = req.body;
  const invoice = db.invoices.find(inv => inv.id === invoiceId || inv.invoiceNumber === invoiceId);

  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }

  invoice.status = 'PAID';
  invoice.paymentMethod = paymentMethod || 'UPI_QR (Instant Settlement)';
  invoice.paidAt = new Date().toISOString();

  // If tied to request, advance request to PAID
  if (invoice.requestId) {
    const reqItem = db.requests.find(r => r.id === invoice.requestId);
    if (reqItem) {
      reqItem.status = 'PAID';
    }
  }

  const payment: PaymentTransaction = {
    id: `pay-${Date.now()}`,
    transactionRef: `BPW-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    invoiceNumber: invoice.invoiceNumber,
    clientId: invoice.clientId,
    amount: invoice.totalAmount,
    gateway: gateway || 'UPI_QR',
    status: 'SUCCESS',
    paymentDate: new Date().toISOString()
  };
  db.payments.unshift(payment);

  logAudit(
    invoice.clientId,
    invoice.clientName,
    'client',
    'INVOICE_PAID',
    'invoices',
    invoice.id,
    `Settled invoice ${invoice.invoiceNumber} (₹${invoice.totalAmount?.toLocaleString('en-IN')}) via ${payment.gateway}`
  );

  pushNotification(
    invoice.clientId,
    'Payment Successful',
    `Payment receipt generated for ${invoice.invoiceNumber}. Thank you for choosing Bharat PetroWork.`,
    'SUCCESS'
  );

  res.json({ success: true, invoice, payment });
});

// --- E-MARKET APIS ---
app.get('/api/e-market/products', (req, res) => {
  res.json(db.products);
});

app.get('/api/e-market/orders', (req, res) => {
  res.json(db.orders);
});

app.post('/api/e-market/orders', (req, res) => {
  const { buyerId, buyerName, items, totalAmount, shippingAddress } = req.body;
  const orderNumber = `BPW-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: EMarketOrder = {
    id: orderNumber,
    orderNumber,
    buyerId: buyerId || 'usr-buyer-1',
    buyerName: buyerName || 'Deepak Patel',
    items: items || [],
    totalAmount: Number(totalAmount) || 12000,
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    shippingAddress: shippingAddress || 'Highway Fuel Point Retail Outlet Depot, Gujarat',
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  logAudit(
    newOrder.buyerId,
    newOrder.buyerName,
    'buyer',
    'E_MARKET_ORDER_PLACED',
    'orders',
    newOrder.id,
    `Placed order ${newOrder.orderNumber} for ₹${newOrder.totalAmount?.toLocaleString('en-IN')}`
  );

  res.json({ success: true, order: newOrder });
});

app.get('/api/e-market/rfqs', (req, res) => {
  res.json(db.rfqs);
});

app.post('/api/e-market/rfqs', (req, res) => {
  const { productId, productName, buyerId, buyerName, requestedQty, targetPrice, requirements } = req.body;
  const rfqNumber = `BPW-RFQ-2026-${String(db.rfqs.length + 1).padStart(3, '0')}`;

  const newRfq: RFQ = {
    id: rfqNumber,
    rfqNumber,
    productId: productId || 'prod-01',
    productName: productName || 'Petroleum Equipment Spare',
    buyerId: buyerId || 'usr-buyer-1',
    buyerName: buyerName || 'Deepak Patel',
    requestedQty: Number(requestedQty) || 2,
    targetPrice: Number(targetPrice) || 50000,
    requirements: requirements || '',
    status: 'OPEN',
    quotesReceived: [],
    createdAt: new Date().toISOString()
  };

  db.rfqs.unshift(newRfq);

  logAudit(
    newRfq.buyerId,
    newRfq.buyerName,
    'buyer',
    'RFQ_SUBMITTED',
    'rfqs',
    newRfq.id,
    `Submitted bulk RFQ ${newRfq.rfqNumber} for ${newRfq.requestedQty} x ${newRfq.productName}`
  );

  res.json({ success: true, rfq: newRfq });
});

app.post('/api/e-market/rfqs/:id/quote', (req, res) => {
  const { id } = req.params;
  const { sellerId, sellerName, quotedPrice, deliveryDays, validUntil } = req.body;
  const rfq = db.rfqs.find(r => r.id === id || r.rfqNumber === id);
  if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

  const quote = {
    sellerId: sellerId || 'usr-seller-1',
    sellerName: sellerName || 'Sundaram PetroEquip OEM Ltd',
    quotedPrice: Number(quotedPrice) || 48000,
    deliveryDays: Number(deliveryDays) || 4,
    validUntil: validUntil || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  };

  rfq.quotesReceived.push(quote);
  rfq.status = 'QUOTED';

  logAudit(
    quote.sellerId,
    quote.sellerName,
    'seller',
    'RFQ_QUOTE_SUBMITTED',
    'rfqs',
    rfq.id,
    `Submitted OEM Quote of ₹${quote.quotedPrice?.toLocaleString('en-IN')} for RFQ ${rfq.rfqNumber}`
  );

  pushNotification(
    rfq.buyerId,
    `New OEM Quotation for ${rfq.rfqNumber}`,
    `${quote.sellerName} quoted ₹${quote.quotedPrice?.toLocaleString('en-IN')} with ${quote.deliveryDays}-day delivery SLA.`,
    'SUCCESS',
    'IN_APP',
    '/e-market'
  );

  res.json({ success: true, rfq, quote });
});

app.post('/api/e-market/rfqs/:id/accept-quote', (req, res) => {
  const { id } = req.params;
  const { sellerId } = req.body;
  const rfq = db.rfqs.find(r => r.id === id || r.rfqNumber === id);
  if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

  const quote = rfq.quotesReceived.find(q => q.sellerId === sellerId) || rfq.quotesReceived[0];
  if (!quote) return res.status(400).json({ error: 'No quotation found to accept' });

  rfq.status = 'ACCEPTED';

  // Auto generate Purchase Order (PO)
  const orderNumber = `BPW-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const newOrder: EMarketOrder = {
    id: `ord-${Date.now()}`,
    orderNumber,
    buyerId: rfq.buyerId,
    buyerName: rfq.buyerName,
    items: [
      {
        productId: rfq.productId,
        productTitle: rfq.productName,
        price: quote.quotedPrice,
        quantity: rfq.requestedQty
      }
    ],
    totalAmount: quote.quotedPrice * rfq.requestedQty * 1.18, // Incl. 18% GST
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    shippingAddress: 'Highway Petro Hub Network, Delivery Forecourt Yard',
    createdAt: new Date().toISOString()
  };
  db.orders.unshift(newOrder);

  // Auto generate Consignment for Logistics Fleet
  const consignmentNumber = `BPW-LOG-2026-${Math.floor(8000 + Math.random() * 1000)}`;
  const newConsignment: DeliveryConsignment = {
    id: `cng-${Date.now()}`,
    consignmentNumber,
    orderId: newOrder.id,
    orderNumber: newOrder.orderNumber,
    buyerName: newOrder.buyerName,
    deliveryAddress: newOrder.shippingAddress,
    contactPerson: 'Station Forecourt Supervisor',
    contactPhone: '+91 98770 12345',
    driverId: 'drv-01',
    driverName: 'Harvinder Singh',
    driverPhone: '+91 98770 12345',
    vehicleNumber: 'HR-55-AJ-4910',
    vehicleType: 'Tata Ultra T.16 High-Capacity Heavy Platform',
    ewayBillNumber: `EWB-2026-${Math.floor(10000000 + Math.random() * 90000000)}`,
    invoiceNumber: `BPW-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    items: [
      {
        title: rfq.productName,
        quantity: rfq.requestedQty,
        weightKg: rfq.requestedQty * 85
      }
    ],
    totalWeightKg: rfq.requestedQty * 85,
    hazmatClass: 'Class 3 Flammable Liquids Equipment (PESO Regulated)',
    status: 'DISPATCHED',
    currentCity: 'Central Logistics Yard, Greater Noida',
    eta: `${quote.deliveryDays} Days Transit`,
    originWarehouse: 'BPW Greater Noida Central Depot',
    destination: newOrder.shippingAddress,
    dispatchedAt: new Date().toISOString(),
    deliveryOtp: String(Math.floor(1000 + Math.random() * 9000)),
    safetyChecklistCompleted: true
  };
  db.consignments.unshift(newConsignment);

  logAudit(
    rfq.buyerId,
    rfq.buyerName,
    'buyer',
    'RFQ_AWARDED_PO_GENERATED',
    'rfqs',
    rfq.id,
    `Awarded quotation from ${quote.sellerName}. Generated Order ${newOrder.orderNumber} & Consignment ${newConsignment.consignmentNumber}`
  );

  res.json({ success: true, rfq, order: newOrder, consignment: newConsignment });
});

// --- LOGISTICS & FLEET DELIVERY APIS ---
app.get('/api/logistics/consignments', (req, res) => {
  res.json(db.consignments);
});

app.get('/api/logistics/drivers', (req, res) => {
  res.json(db.drivers);
});

app.post('/api/logistics/consignments/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, currentCity, eta, note } = req.body;
  const cng = db.consignments.find(c => c.id === id || c.consignmentNumber === id);
  if (!cng) return res.status(404).json({ error: 'Consignment not found' });

  const oldStatus = cng.status;
  cng.status = status;
  if (currentCity) cng.currentCity = currentCity;
  if (eta) cng.eta = eta;

  // Sync order status if arrived/dispatched
  const matchedOrder = db.orders.find(o => o.orderNumber === cng.orderNumber || o.id === cng.orderId);
  if (matchedOrder) {
    if (status === 'IN_TRANSIT' || status === 'DISPATCHED') matchedOrder.status = 'DISPATCHED';
    if (status === 'DELIVERED_POD') matchedOrder.status = 'DELIVERED';
  }

  logAudit(
    'usr-driver-1',
    cng.driverName,
    'driver',
    'CONSIGNMENT_STATUS_UPDATE',
    'consignments',
    cng.id,
    `Updated status to ${status} at ${currentCity || cng.currentCity}. ${note || ''}`,
    oldStatus,
    status
  );

  pushNotification(
    'usr-buyer-1',
    `Shipment Update: ${cng.consignmentNumber}`,
    `Consignment ${cng.consignmentNumber} is now ${(status || '').replace(/_/g, ' ')} (${cng.currentCity}).`,
    'INFO',
    'IN_APP',
    '/e-market'
  );

  res.json({ success: true, consignment: cng });
});

app.post('/api/logistics/consignments/:id/verify-pod', (req, res) => {
  const { id } = req.params;
  const { otp, receiverSignature, receiverName } = req.body;
  const cng = db.consignments.find(c => c.id === id || c.consignmentNumber === id);
  if (!cng) return res.status(404).json({ error: 'Consignment not found' });

  if (cng.deliveryOtp && otp && String(otp).trim() !== String(cng.deliveryOtp).trim()) {
    return res.status(400).json({ error: 'Invalid Delivery OTP. Please verify with Station Manager.' });
  }

  cng.status = 'DELIVERED_POD';
  cng.deliveredAt = new Date().toISOString();
  cng.receiverSignature = receiverSignature || `${receiverName || cng.contactPerson} (Digital Stamp & Signed)`;

  const matchedOrder = db.orders.find(o => o.orderNumber === cng.orderNumber || o.id === cng.orderId);
  if (matchedOrder) {
    matchedOrder.status = 'DELIVERED';
  }

  // Create digital POD document
  const podDoc = {
    id: `doc-pod-${Date.now()}`,
    title: `Proof of Delivery (POD) - ${cng.consignmentNumber}`,
    fileName: `POD_${cng.consignmentNumber}_Stamped.pdf`,
    category: 'WORK_REPORT' as const,
    entityId: cng.id,
    entityType: 'SERVICE_REQUEST' as const,
    fileSize: '1.4 MB',
    uploadedAt: new Date().toISOString(),
    isPrivate: false
  };
  db.documents.unshift(podDoc);

  logAudit(
    'usr-driver-1',
    cng.driverName,
    'driver',
    'DELIVERY_POD_CONFIRMED',
    'consignments',
    cng.id,
    `Delivery completed with OTP verification and signed POD by ${cng.receiverSignature}.`
  );

  pushNotification(
    'usr-admin-1',
    `Consignment Delivered: ${cng.consignmentNumber}`,
    `${cng.items.map(i => `${i.quantity}x ${i.title}`).join(', ')} successfully handed over to ${cng.buyerName}.`,
    'SUCCESS',
    'IN_APP',
    '/admin'
  );

  res.json({ success: true, consignment: cng, document: podDoc });
});

app.post('/api/admin/payments/reconcile', (req, res) => {
  const { invoiceId, transactionRef, gateway, amount } = req.body;
  const inv = db.invoices.find(i => i.id === invoiceId || i.invoiceNumber === invoiceId);
  if (inv) {
    inv.status = 'PAID';
    inv.paidAt = new Date().toISOString();
  }

  const txn: PaymentTransaction = {
    id: `txn-${Date.now()}`,
    transactionRef: transactionRef || `BPW-RTGS-${Math.floor(100000 + Math.random() * 900000)}`,
    invoiceNumber: inv ? inv.invoiceNumber : 'BPW-INV-RECON-01',
    clientId: inv ? inv.clientId : 'usr-client-1',
    amount: Number(amount) || (inv ? inv.totalAmount : 50000),
    gateway: (gateway as any) || 'NEFT_RTGS',
    status: 'SUCCESS',
    paymentDate: new Date().toISOString()
  };
  db.payments.unshift(txn);

  logAudit(
    'usr-admin-1',
    'Finance & Settlement Ops',
    'admin',
    'PAYMENT_RECONCILED',
    'payments',
    txn.id,
    `Reconciled ${txn.gateway} settlement of ₹${txn.amount?.toLocaleString('en-IN')} for Invoice ${txn.invoiceNumber}`
  );

  res.json({ success: true, payment: txn, invoice: inv });
});

// --- JOBS & CAREER APIS ---
app.get('/api/jobs', (req, res) => {
  res.json(db.jobs);
});

app.get('/api/jobs/applications', (req, res) => {
  res.json(db.applications);
});

app.post('/api/jobs/apply', (req, res) => {
  const { jobId, candidateName, candidateEmail, candidatePhone, experienceYears, skills } = req.body;
  const job = db.jobs.find(j => j.id === jobId) || db.jobs[0];

  const newApp: JobApplication = {
    id: `app-${Date.now()}`,
    jobId: job.id,
    jobTitle: job.title,
    candidateId: 'usr-candidate-1',
    candidateName: candidateName || 'Rahul Mishra',
    candidateEmail: candidateEmail || 'rahul.mishra.eng@gmail.com',
    candidatePhone: candidatePhone || '+91 95443 22110',
    experienceYears: Number(experienceYears) || 3,
    skills: skills || ['Fuel Retail Site Erection', 'HDPE Welds'],
    status: 'APPLIED',
    appliedDate: new Date().toISOString().split('T')[0]
  };

  db.applications.unshift(newApp);
  job.applicantsCount += 1;

  logAudit(
    newApp.candidateId,
    newApp.candidateName,
    'candidate',
    'JOB_APPLICATION_SUBMITTED',
    'applications',
    newApp.id,
    `Applied for technical opening: ${job.title} (${job.location})`
  );

  res.json({ success: true, application: newApp, recommendedCourseId: job.recommendedCourseId });
});

// --- ACADEMY / LMS APIS ---
app.get('/api/academy/courses', (req, res) => {
  res.json(db.courses);
});

app.get('/api/academy/enrollments', (req, res) => {
  res.json(db.enrollments);
});

app.post('/api/academy/enroll', (req, res) => {
  const { courseId, userId, userName } = req.body;
  const course = db.courses.find(c => c.id === courseId) || db.courses[0];

  const existing = db.enrollments.find(e => e.courseId === course.id && e.userId === (userId || 'usr-candidate-1'));
  if (existing) {
    return res.json({ success: true, enrollment: existing });
  }

  const enrollment: CourseEnrollment = {
    id: `enr-${Date.now()}`,
    courseId: course.id,
    courseTitle: course.title,
    userId: userId || 'usr-candidate-1',
    userName: userName || 'Rahul Mishra',
    progressPercentage: 10,
    status: 'IN_PROGRESS',
    enrolledAt: new Date().toISOString().split('T')[0]
  };

  db.enrollments.unshift(enrollment);
  course.enrolledCount += 1;

  logAudit(
    enrollment.userId,
    enrollment.userName,
    'student',
    'COURSE_ENROLLED',
    'enrollments',
    enrollment.id,
    `Enrolled in BPW Technical Academy certification: ${course.title} (${course.code})`
  );

  res.json({ success: true, enrollment });
});

// Complete Course & Generate Verifiable Certificate
app.post('/api/academy/certify', (req, res) => {
  const { enrollmentId } = req.body;
  const enrollment = db.enrollments.find(e => e.id === enrollmentId);
  if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

  enrollment.progressPercentage = 100;
  enrollment.status = 'COMPLETED';
  enrollment.completedAt = new Date().toISOString().split('T')[0];
  enrollment.certificateId = `BPW-CERT-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  logAudit(
    enrollment.userId,
    enrollment.userName,
    'student',
    'CERTIFICATE_ISSUED',
    'certificates',
    enrollment.certificateId,
    `Awarded official Bharat PetroWork technical credential: ${enrollment.courseTitle}`
  );

  res.json({ success: true, enrollment, certificateId: enrollment.certificateId });
});

// --- DIGITAL DOCUMENTS & VAULT APIS ---
app.get('/api/documents', (req, res) => {
  res.json(db.documents);
});

// --- NOTIFICATIONS APIS ---
app.get('/api/notifications', (req, res) => {
  res.json(db.notifications);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const notif = db.notifications.find(n => n.id === id);
  if (notif) notif.read = true;
  res.json({ success: true });
});

app.post('/api/notifications/read-all', (req, res) => {
  db.notifications.forEach(n => { n.read = true; });
  res.json({ success: true });
});

// --- AUDIT & ADMIN CRM APIS ---
app.get('/api/admin/audit-logs', (req, res) => {
  res.json(db.auditLogs);
});

app.get('/api/cms', (req, res) => {
  res.json(db.cms);
});

app.put('/api/cms', (req, res) => {
  db.cms = { ...db.cms, ...req.body };
  logAudit('usr-admin-1', 'Operations Admin', 'admin', 'CMS_UPDATED', 'cms', 'root', 'Published updated CMS parameters');
  res.json({ success: true, cms: db.cms });
});

// =============================================================
// AI ASSISTANT / GEMINI SERVER-SIDE ENDPOINTS
// =============================================================

// High-Thinking Diagnostic Assistant for Petrol Pump Engineering
app.post('/api/ai/diagnostics', async (req, res) => {
  try {
    const { issueDescription, pumpContext } = req.body;
    const ai = getAIClient();
    if (!ai) {
      // Fallback engineered response if key is pending in environment
      return res.json({
        analysis: `[Bharat PetroWork Technical Diagnostic Protocol]\n\n` +
          `1. Immediate Safety Isolations:\n` +
          `   - Ensure Lock-Out Tag-Out (LOTO) at the Main LT Panel breaker for the affected feeder circuit.\n` +
          `   - Verify Zero-Energy state using a calibrated multi-meter in the hazardous zone.\n\n` +
          `2. Root Cause Probability Analysis:\n` +
          `   - Discrepancies in flow rates or sudden tripping are frequently caused by capacitor degradation in the Submersible Turbine Pump (STP) control box or check-valve debris obstruction.\n` +
          `   - Check interstitial containment sensors for fuel liquid presence indicating inner-wall micro fissures.\n\n` +
          `3. Recommended Next Operational Actions:\n` +
          `   - Deploy Mobile Service Van with nitrogen purging kit.\n` +
          `   - Run 5-liter stamping meter check across both high and low flow rates.\n` +
          `   - Issue official BPW Form-7 calibration certificate upon re-verification.`
      });
    }

    const prompt = `You are the Principal Infrastructure Engineer for Bharat PetroWork (India's premier petrol-pump engineering & digital operations ecosystem).
Analyze this fuel station incident with deep technical rigor (OISD-141, PESO compliance, explosion-proof Zone 0/1/2 standards):
Pump / Station Context: ${pumpContext || 'Retail Petrol Pump Facility'}
Reported Issue: ${issueDescription}

Provide:
1. Hazardous Area Safety Pre-requisites & Isolation (PTW/LOTO)
2. Engineering Root Cause Diagnostics & Failure Mode Analysis
3. Step-by-Step Field Resolution Protocol
4. Statutory & Environmental Compliance Checkpoints`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error('Diagnostic error:', error);
    return res.json({
      analysis: `[Bharat PetroWork Technical Diagnostic Protocol]\n\n` +
        `1. Immediate Safety Isolations:\n` +
        `   - Ensure Lock-Out Tag-Out (LOTO) at the Main LT Panel breaker for the affected feeder circuit.\n` +
        `   - Verify Zero-Energy state using a calibrated multi-meter in the hazardous zone.\n\n` +
        `2. Root Cause Probability Analysis:\n` +
        `   - Discrepancies in flow rates or sudden tripping are frequently caused by capacitor degradation in the Submersible Turbine Pump (STP) control box or check-valve debris obstruction.\n` +
        `   - Check interstitial containment sensors for fuel liquid presence indicating inner-wall micro fissures.\n\n` +
        `3. Recommended Next Operational Actions:\n` +
        `   - Deploy Mobile Service Van with nitrogen purging kit.\n` +
        `   - Run 5-liter stamping meter check across both high and low flow rates.\n` +
        `   - Issue official BPW Form-7 calibration certificate upon re-verification.\n\n*(Note: AI service is currently unavailable. Displaying standard protocol.)*`
    });
  }
});

// Technical Schematic & Equipment Image Generator
app.post('/api/ai/generate-cad-image', async (req, res) => {
  try {
    const { prompt, imageSize = '1K', aspectRatio = '16:9' } = req.body;
    const ai = getAIClient();
    if (!ai) {
      return res.json({
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
        note: 'Simulated high-resolution technical rendering'
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image',
      contents: {
        parts: [
          {
            text: `High-precision engineering blueprint and technical diagram for petroleum infrastructure: ${prompt}. Professional isometric rendering, crisp industrial schematic style, clean technical labels.`
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: imageSize as any
        }
      }
    });

    let imageUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    res.json({ imageUrl });
  } catch (error: any) {
    console.error('Image gen error:', error);
    res.status(500).json({ error: error.message || 'Image generation failed' });
  }
});

// =============================================================
// VITE MIDDLEWARE SETUP
// =============================================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Bharat PetroWork] Enterprise Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
