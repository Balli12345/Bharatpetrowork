/**
 * Bharat PetroWork — Enterprise Ecosystem Types
 * Official Source: https://bharatpetrowork.com/
 */

export type UserRole = 
  | 'admin'
  | 'client'
  | 'engineer'
  | 'buyer'
  | 'seller'
  | 'candidate'
  | 'student'
  | 'driver';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  companyName?: string;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
}

export type ServiceStatus =
  | 'NEW'
  | 'PENDING_REVIEW'
  | 'ASSIGNED'
  | 'ENGINEER_ACCEPTED'
  | 'ON_THE_WAY'
  | 'SITE_VISIT'
  | 'INSPECTION'
  | 'WORK_IN_PROGRESS'
  | 'WAITING_FOR_PARTS'
  | 'WAITING_FOR_CUSTOMER'
  | 'COMPLETED'
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'INVOICE_GENERATED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'CLOSED'
  | 'CANCELLED'
  | 'REJECTED';

export type RequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export type OilMarketingCompany = 'IOCL' | 'BPCL' | 'HPCL' | 'Reliance' | 'Nayara' | 'Shell' | 'Other';

export interface PetrolPump {
  id: string;
  clientId: string;
  clientName: string;
  pumpName: string;
  roCode: string; // Retail Outlet Code e.g. RO-10492
  oilCompany: OilMarketingCompany;
  address: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  totalTanks: number;
  totalDispensers: number;
  atgInstalled: boolean;
  atgModel?: string;
  stpInstalled: boolean;
  amcActive: boolean;
  amcId?: string;
  contactPerson: string;
  contactPhone: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  estimatedHours: number;
  standardRate: number;
  active: boolean;
}

export interface ServiceRequest {
  id: string; // Unique format e.g. BPW-SR-2026-000001
  clientId: string;
  clientName: string;
  pumpId: string;
  pumpName: string;
  pumpAddress: string;
  oilCompany: OilMarketingCompany;
  categoryId: string;
  categoryName: string;
  problemType: string;
  priority: RequestPriority;
  status: ServiceStatus;
  preferredDate: string;
  description: string;
  isEmergency: boolean;
  emergencyType?: string;
  locationShared: boolean;
  lat?: number;
  lng?: number;
  assignedEngineerId?: string;
  assignedEngineerName?: string;
  assignedEngineerPhone?: string;
  estimatedCost: number;
  finalCost?: number;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Engineer {
  id: string;
  userId: string;
  employeeId?: string;
  name: string;
  phone: string;
  email: string;
  specialization: string | string[];
  experienceYears?: number;
  status: 'ONLINE' | 'OFFLINE' | 'AVAILABLE' | 'BUSY';
  currentLat?: number;
  currentLng?: number;
  locationLastUpdated?: string;
  rating?: number;
  totalJobsCompleted?: number;
  completedJobsCount?: number;
  verified?: boolean;
  avatar?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  vanId?: string;
  location?: string;
}

export interface JobReport {
  id: string;
  requestId: string;
  engineerId: string;
  engineerName: string;
  punchInTime: string;
  punchOutTime?: string;
  inspectionFindings: string;
  workSummary: string;
  safetyChecklistPassed: boolean;
  beforePhotos: string[];
  afterPhotos: string[];
  partsUsed: Array<{
    partId: string;
    partName: string;
    partCode: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  customerSignatureName?: string;
  signedAt?: string;
  submittedAt: string;
  adminApproved: boolean;
  adminApprovedAt?: string;
}

export interface AMCContract {
  id: string;
  contractNumber: string; // e.g. BPW-AMC-2026-0042
  pumpId: string;
  pumpName: string;
  clientId: string;
  clientName: string;
  startDate: string;
  endDate: string;
  packageType: 'Comprehensive' | 'Non-Comprehensive' | 'Preventive Gold';
  annualFee: number;
  visitsTotal: number;
  visitsCompleted: number;
  maintenanceFrequency: 'MONTHLY' | 'QUARTERLY' | 'BI_ANNUAL';
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';
  coveredServices: string[];
  terms: string;
  nextScheduledVisit: string;
}

export interface MaintenanceSchedule {
  id: string;
  pumpId: string;
  pumpName: string;
  amcId?: string;
  scheduledDate: string;
  maintenanceType: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'INSPECTION';
  equipmentCategory: 'TANK' | 'PIPELINE' | 'DISPENSER' | 'ELECTRICAL' | 'FIRE_SAFETY' | 'GENERAL';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  assignedEngineerName?: string;
  checklist: Array<{ item: string; done: boolean }>;
}

export interface InventoryPart {
  id: string;
  partName: string;
  partCode: string; // e.g. BPW-PRT-NZL-04
  category: string;
  brand: string;
  supplier: string;
  stock: number;
  minStock: number;
  purchasePrice: number;
  sellingPrice: number;
  unit: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  lastRestocked: string;
}

export interface StockMovement {
  id: string;
  partId: string;
  partName: string;
  movementType: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  referenceId: string; // Job report or PO id
  notes: string;
  timestamp: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // BPW-INV-2026-0089
  requestId?: string;
  clientId: string;
  clientName: string;
  pumpName: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number; // 18% GST
  discount: number;
  totalAmount: number;
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'REFUNDED';
  paymentMethod?: string;
  paidAt?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
}

export interface PaymentTransaction {
  id: string;
  transactionRef: string;
  invoiceNumber: string;
  clientId: string;
  amount: number;
  gateway: 'RAZORPAY_SIM' | 'UPI_QR' | 'NEFT_RTGS';
  status: 'PENDING' | 'INITIATED' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  paymentDate: string;
}

export interface EMarketProduct {
  id: string;
  title: string;
  partCode: string;
  category: string;
  sellerId: string;
  sellerName: string;
  price: number;
  originalPrice: number;
  moq: number; // Minimum Order Quantity
  stock: number;
  rating: number;
  reviewsCount: number;
  image: string;
  specifications: Record<string, string>;
  isRfqAllowed: boolean;
  description: string;
}

export interface EMarketOrder {
  id: string;
  orderNumber: string; // BPW-ORD-9041
  buyerId: string;
  buyerName: string;
  items: Array<{
    productId: string;
    productTitle: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: 'PLACED' | 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'PENDING';
  shippingAddress: string;
  createdAt: string;
}

export interface RFQ {
  id: string;
  rfqNumber: string; // BPW-RFQ-2026-014
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  requestedQty: number;
  targetPrice?: number;
  requirements: string;
  status: 'OPEN' | 'QUOTED' | 'ACCEPTED' | 'REJECTED';
  quotesReceived: Array<{
    sellerId: string;
    sellerName: string;
    quotedPrice: number;
    deliveryDays: number;
    validUntil: string;
  }>;
  createdAt: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Site-based';
  experienceRequired: string;
  openings: number;
  salaryRange: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: 'ACTIVE' | 'CLOSED';
  recommendedCourseId?: string;
  recommendedCourseTitle?: string;
  applicantsCount: number;
}

export type ApplicationStage = 
  | 'APPLIED' 
  | 'SCREENING' 
  | 'SHORTLISTED' 
  | 'INTERVIEW' 
  | 'SELECTED' 
  | 'REJECTED';

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  experienceYears: number;
  skills: string[];
  resumeUrl?: string;
  status: ApplicationStage;
  appliedDate: string;
  interviewDate?: string;
  feedback?: string;
}

export interface AcademyCourse {
  id: string;
  title: string;
  code: string; // e.g. BPW-ACAD-ATG-101
  category: string;
  durationHours: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master Certification';
  price: number;
  rating: number;
  enrolledCount: number;
  modulesCount: number;
  description: string;
  curriculum: Array<{
    title: string;
    lessons: string[];
  }>;
  connectedJobRole: string;
  certificateOffered: boolean;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  userId: string;
  userName: string;
  progressPercentage: number;
  status: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED';
  enrolledAt: string;
  completedAt?: string;
  certificateId?: string;
}

export interface DigitalDocument {
  id: string;
  title: string;
  fileName: string;
  category: 'PUMP_LICENSE' | 'CALIBRATION' | 'AMC_AGREEMENT' | 'INVOICE' | 'WORK_REPORT' | 'SAFETY_CERT';
  entityId: string;
  entityType: 'PUMP' | 'SERVICE_REQUEST' | 'ENGINEER' | 'AMC';
  fileSize: string;
  uploadedAt: string;
  isPrivate: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'EMERGENCY';
  channel: 'IN_APP' | 'EMAIL' | 'WHATSAPP';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  fromStatus?: string;
  toStatus?: string;
  details: string;
  ipAddress: string;
}

export interface CMSContent {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  headquarters: string;
  stats: {
    pumpsServiced: number;
    engineersActive: number;
    citiesCovered: number;
    amcOutlets: number;
    emergencyResponseAvgMinutes: number;
  };
  announcements: string[];
}

export interface EmergencyContact {
  role: string;
  name: string;
  phone: string;
  available: string;
}

export type DeliveryStatus =
  | 'PENDING_DISPATCH'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'FORECOURT_ARRIVED'
  | 'UNLOADED_INSPECTED'
  | 'DELIVERED_POD';

export interface DeliveryDriver {
  id: string;
  userId: string;
  name: string;
  phone: string;
  licenseNumber: string;
  hazmatCertified: boolean;
  vehicleNumber: string;
  vehicleModel: string;
  currentLocation: string;
  status: 'AVAILABLE' | 'ON_TRIP' | 'RESTING';
  rating: number;
  tripsCompleted: number;
  emergencyContact: string;
}

export interface DeliveryConsignment {
  id: string;
  consignmentNumber: string; // e.g. BPW-LOG-2026-8801
  orderId: string;
  orderNumber: string;
  buyerName: string;
  deliveryAddress: string;
  roCode?: string;
  contactPerson: string;
  contactPhone: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  vehicleType: string;
  ewayBillNumber: string;
  invoiceNumber: string;
  items: Array<{
    title: string;
    quantity: number;
    weightKg: number;
    serialNumbers?: string[];
  }>;
  totalWeightKg: number;
  hazmatClass: string;
  status: DeliveryStatus;
  currentCity: string;
  eta: string;
  originWarehouse: string;
  destination: string;
  dispatchedAt: string;
  deliveredAt?: string;
  deliveryOtp: string;
  receiverSignature?: string;
  safetyChecklistCompleted: boolean;
}

