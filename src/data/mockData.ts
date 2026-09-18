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

export const INITIAL_CMS: CMSContent = {
  companyName: "Bharat PetroWork",
  tagline: "India's Premier Petrol-Pump Infrastructure, Engineering & Digital Operations Ecosystem",
  phone: "+91 98765 43210",
  email: "bharatpetrolwork@gmail.com",
  headquarters: "Bulandshahr & NCR Regional Tech Hub, India",
  stats: {
    pumpsServiced: 1450,
    engineersActive: 86,
    citiesCovered: 42,
    amcOutlets: 620,
    emergencyResponseAvgMinutes: 38
  },
  announcements: [
    "Monsoon Underground Tank Water Ingress Inspection Drive 2026 Active",
    "New OISD-141 / PESO Compliance Certification Modules launched on BPW Academy",
    "Rapid Mobile Service Vans now operational across 12 high-density highway corridors"
  ]
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-client-1',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@highwayfuels.com',
    phone: '+91 98112 34567',
    role: 'client',
    companyName: 'Highway Petro Hub Network',
    status: 'active',
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'usr-eng-1',
    name: 'Amitabh Verma',
    email: 'amitabh.verma@bharatpetrowork.com',
    phone: '+91 98223 45678',
    role: 'engineer',
    status: 'active',
    createdAt: '2024-11-01T09:00:00Z'
  },
  {
    id: 'usr-admin-1',
    name: 'Vikramaditya Rao (Chief Operations)',
    email: 'ops.admin@bharatpetrowork.com',
    phone: '+91 99001 12233',
    role: 'admin',
    status: 'active',
    createdAt: '2024-08-01T08:00:00Z'
  },
  {
    id: 'usr-buyer-1',
    name: 'Deepak Patel',
    email: 'deepak@gujaratfuels.in',
    phone: '+91 97334 55667',
    role: 'buyer',
    companyName: 'Sardar Fuels & Logistics',
    status: 'active',
    createdAt: '2025-02-15T11:00:00Z'
  },
  {
    id: 'usr-seller-1',
    name: 'Kavita Sundaram',
    email: 'kavita@petrovalves.com',
    phone: '+91 96556 77889',
    role: 'seller',
    companyName: 'Sundaram PetroEquip OEM Ltd',
    status: 'active',
    createdAt: '2024-12-05T12:00:00Z'
  },
  {
    id: 'usr-candidate-1',
    name: 'Rahul Mishra',
    email: 'rahul.mishra.eng@gmail.com',
    phone: '+91 95443 22110',
    role: 'candidate',
    status: 'active',
    createdAt: '2025-03-01T14:30:00Z'
  },
  {
    id: 'usr-driver-1',
    name: 'Harvinder Singh (HazMat Fleet Captain)',
    email: 'harvinder.logistics@bharatpetrowork.com',
    phone: '+91 98770 12345',
    role: 'driver',
    companyName: 'BPW Heavy Logistics & HazMat Transport Unit',
    status: 'active',
    createdAt: '2024-10-12T07:00:00Z'
  }
];

export const INITIAL_SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-civil',
    name: 'Civil Works',
    slug: 'civil-works',
    description: 'Site development, reinforced concrete foundations, canopy erection, driveways & sales building infrastructure.',
    iconName: 'Building2',
    estimatedHours: 48,
    standardRate: 35000,
    active: true
  },
  {
    id: 'cat-mech',
    name: 'Mechanical Works',
    slug: 'mechanical-works',
    description: 'Underground fuel storage tanks (UST), above-ground tanks, double-wall piping, dispenser hydrants & vapor recovery.',
    iconName: 'Wrench',
    estimatedHours: 24,
    standardRate: 18000,
    active: true
  },
  {
    id: 'cat-elec',
    name: 'Electrical Works',
    slug: 'electrical-works',
    description: 'Hazardous zone electrical wiring, explosion-proof panels, earthing grids, high mast lighting & DG automatic changeovers.',
    iconName: 'Zap',
    estimatedHours: 12,
    standardRate: 12500,
    active: true
  },
  {
    id: 'cat-fire',
    name: 'Fire & Safety Systems',
    slug: 'fire-safety',
    description: 'DCP & foam firefighting units, automated flame alarms, hydrant piping, PESO/OISD statutory safety compliance.',
    iconName: 'ShieldAlert',
    estimatedHours: 8,
    standardRate: 14000,
    active: true
  },
  {
    id: 'cat-om',
    name: 'Operation & Maintenance (O&M)',
    slug: 'operation-maintenance',
    description: 'Comprehensive annual maintenance contracts (AMC), routine nozzle calibration, filter changes & preventive health checks.',
    iconName: 'Cog',
    estimatedHours: 6,
    standardRate: 8500,
    active: true
  },
  {
    id: 'cat-tank-rehab',
    name: 'Underground Tank Rehabilitation',
    slug: 'tank-rehabilitation',
    description: 'Zero-downtime internal epoxy lining, ultrasonic wall thickness scanning, vacuum decay testing & anti-corrosion barrier.',
    iconName: 'Layers',
    estimatedHours: 36,
    standardRate: 48000,
    active: true
  },
  {
    id: 'cat-dispenser',
    name: 'Fuel Dispenser Services',
    slug: 'dispenser-services',
    description: 'MPD electronic metering overhaul, pulse transmitter calibration, solenoid valve tuning & vapor recovery nozzle testing.',
    iconName: 'Fuel',
    estimatedHours: 5,
    standardRate: 6500,
    active: true
  },
  {
    id: 'cat-pipeline',
    name: 'Pipeline Maintenance & Repair',
    slug: 'pipeline-maintenance',
    description: 'Electrofusion joint repair, double-wall HDPE leak detection testing, pressure decay analysis & manifold valve refurbishing.',
    iconName: 'GitCommit',
    estimatedHours: 10,
    standardRate: 15000,
    active: true
  },
  {
    id: 'cat-van',
    name: 'Mobile Service Van Support',
    slug: 'mobile-service-van',
    description: 'Rapid response emergency van equipped with mobile compressor, nitrogen purging tools, spare nozzles & calibration jigs.',
    iconName: 'Truck',
    estimatedHours: 4,
    standardRate: 9500,
    active: true
  }
];

export const INITIAL_PETROL_PUMPS: PetrolPump[] = [
  {
    id: 'pump-01',
    clientId: 'usr-client-1',
    clientName: 'Rajesh Sharma',
    pumpName: 'Highway Star Petro Hub',
    roCode: 'RO-10492-IOCL',
    oilCompany: 'IOCL',
    address: 'NH-91, Mile 42, Delhi-Kanpur Expressway',
    city: 'Bulandshahr',
    state: 'Uttar Pradesh',
    pincode: '203001',
    lat: 28.4069,
    lng: 77.8498,
    totalTanks: 4,
    totalDispensers: 6,
    atgInstalled: true,
    atgModel: 'Veeder-Root TLS-450 Plus',
    stpInstalled: true,
    amcActive: true,
    amcId: 'amc-01',
    contactPerson: 'Manoj Kumar (Station Manager)',
    contactPhone: '+91 98112 99887'
  },
  {
    id: 'pump-02',
    clientId: 'usr-client-1',
    clientName: 'Rajesh Sharma',
    pumpName: 'City Pride Fuel Station',
    roCode: 'RO-33821-BPCL',
    oilCompany: 'BPCL',
    address: 'Ring Road Bypass, Near Industrial Area Phase 2',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    lat: 28.5355,
    lng: 77.3910,
    totalTanks: 3,
    totalDispensers: 4,
    atgInstalled: true,
    atgModel: 'Franklin Fueling Colibri',
    stpInstalled: true,
    amcActive: true,
    amcId: 'amc-02',
    contactPerson: 'Suresh Rawat',
    contactPhone: '+91 98771 22334'
  },
  {
    id: 'pump-03',
    clientId: 'usr-client-1',
    clientName: 'Rajesh Sharma',
    pumpName: 'Greenway Express Nayara',
    roCode: 'RO-90214-NAY',
    oilCompany: 'Nayara',
    address: 'Grand Trunk Road, Sector 14 Junction',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    pincode: '201001',
    lat: 28.6692,
    lng: 77.4538,
    totalTanks: 2,
    totalDispensers: 4,
    atgInstalled: false,
    stpInstalled: true,
    amcActive: false,
    contactPerson: 'Vikram Singh',
    contactPhone: '+91 97118 44556'
  }
];

export const INITIAL_ENGINEERS: Engineer[] = [
  {
    id: 'eng-01',
    userId: 'usr-eng-1',
    employeeId: 'BPW-ENG-084',
    name: 'Amitabh Verma',
    phone: '+91 98223 45678',
    email: 'amitabh.verma@bharatpetrowork.com',
    specialization: 'ATG Systems, Automation & Submersible Pumps',
    vehicleNumber: 'DL-01-EA-4912',
    vehicleType: 'BPW Mobile Service Van (Tata Winger)',
    experienceYears: 7,
    status: 'ONLINE',
    currentLat: 28.4102,
    currentLng: 77.8520,
    locationLastUpdated: 'Just now',
    rating: 4.9,
    totalJobsCompleted: 142,
    completedJobsCount: 142,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'eng-02',
    userId: 'usr-eng-2',
    employeeId: 'BPW-ENG-112',
    name: 'Sunil Shekhawat',
    phone: '+91 98991 33445',
    email: 'sunil.s@bharatpetrowork.com',
    specialization: 'Dispenser Hydraulic Calibration & Nozzles',
    vehicleNumber: 'UP-16-BV-7821',
    vehicleType: 'BPW Calibration Unit (Mahindra Bolero Maxi)',
    experienceYears: 5,
    status: 'AVAILABLE',
    currentLat: 28.5300,
    currentLng: 77.3850,
    locationLastUpdated: '5 mins ago',
    rating: 4.8,
    totalJobsCompleted: 98,
    completedJobsCount: 98,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'eng-03',
    userId: 'usr-eng-3',
    employeeId: 'BPW-ENG-043',
    name: 'Harish Chandra',
    phone: '+91 97665 11223',
    email: 'harish.c@bharatpetrowork.com',
    specialization: 'Tank Rehabilitation & Hydrostatic Pressure Testing',
    vehicleNumber: 'UP-14-BT-9022',
    vehicleType: 'BPW Tank Testing Rig (Force Traveller)',
    experienceYears: 9,
    status: 'BUSY',
    currentLat: 28.6710,
    currentLng: 77.4600,
    locationLastUpdated: '12 mins ago',
    rating: 4.95,
    totalJobsCompleted: 215,
    completedJobsCount: 215,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: 'BPW-SR-2026-000001',
    clientId: 'usr-client-1',
    clientName: 'Rajesh Sharma',
    pumpId: 'pump-01',
    pumpName: 'Highway Star Petro Hub',
    pumpAddress: 'NH-91, Mile 42, Delhi-Kanpur Expressway, Bulandshahr',
    oilCompany: 'IOCL',
    categoryId: 'cat-dispenser',
    categoryName: 'Fuel Dispenser Services',
    problemType: 'Dispenser Bay 2 High Flow Rate Metering Discrepancy & Pulsar Flutter',
    priority: 'HIGH',
    status: 'WORK_IN_PROGRESS',
    preferredDate: '2026-09-15',
    description: 'During morning delivery verification, Nozzle 3 on Dispenser 2 exhibited a +15ml error per 5-liter stamping check. Requires immediate electronic calibration and solenoid inspection.',
    isEmergency: false,
    locationShared: true,
    lat: 28.4069,
    lng: 77.8498,
    assignedEngineerId: 'eng-01',
    assignedEngineerName: 'Amitabh Verma',
    assignedEngineerPhone: '+91 98223 45678',
    estimatedCost: 6500,
    finalCost: 7200,
    photos: ['https://images.unsplash.com/photo-1527018606416-a67ffec538ce?w=600&auto=format&fit=crop&q=80'],
    createdAt: '2026-09-15T01:30:00Z',
    updatedAt: '2026-09-15T03:45:00Z'
  },
  {
    id: 'BPW-SR-2026-000002',
    clientId: 'usr-client-1',
    clientName: 'Rajesh Sharma',
    pumpId: 'pump-02',
    pumpName: 'City Pride Fuel Station',
    pumpAddress: 'Ring Road Bypass, Near Industrial Area Phase 2, Noida',
    oilCompany: 'BPCL',
    categoryId: 'cat-mech',
    categoryName: 'Mechanical Works',
    problemType: 'Emergency STP Tripping & Pressure Drop on MS Line',
    priority: 'EMERGENCY',
    status: 'ON_THE_WAY',
    preferredDate: '2026-09-15',
    description: 'Motor Starters for Tank 1 Motor Submersible Pump continuously tripping on overcurrent. MS dispense halted across all 4 bays. Urgent mobile service van required.',
    isEmergency: true,
    emergencyType: 'Total Dispense Failure - Submersible Pump Shutdown',
    locationShared: true,
    lat: 28.5355,
    lng: 77.3910,
    assignedEngineerId: 'eng-02',
    assignedEngineerName: 'Sunil Shekhawat',
    assignedEngineerPhone: '+91 98991 33445',
    estimatedCost: 14000,
    photos: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'],
    createdAt: '2026-09-15T02:15:00Z',
    updatedAt: '2026-09-15T03:10:00Z'
  },
  {
    id: 'BPW-SR-2026-000003',
    clientId: 'usr-client-1',
    clientName: 'Rajesh Sharma',
    pumpId: 'pump-03',
    pumpName: 'Greenway Express Nayara',
    pumpAddress: 'Grand Trunk Road, Sector 14 Junction, Ghaziabad',
    oilCompany: 'Nayara',
    categoryId: 'cat-fire',
    categoryName: 'Fire & Safety Systems',
    problemType: 'Periodic PESO Safety Audit & DCP Extinguisher Hydrotest',
    priority: 'MEDIUM',
    status: 'NEW',
    preferredDate: '2026-09-18',
    description: 'Annual explosive regulatory inspection due next week. Need complete safety inspection certificate, fire bucket inspection and flame arrester mesh cleansing.',
    isEmergency: false,
    locationShared: false,
    estimatedCost: 12000,
    photos: [],
    createdAt: '2026-09-14T11:00:00Z',
    updatedAt: '2026-09-14T11:00:00Z'
  },
  {
    id: 'BPW-SR-2026-000004',
    clientId: 'usr-client-1',
    clientName: 'Rajesh Sharma',
    pumpId: 'pump-01',
    pumpName: 'Highway Star Petro Hub',
    pumpAddress: 'NH-91, Mile 42, Delhi-Kanpur Expressway, Bulandshahr',
    oilCompany: 'IOCL',
    categoryId: 'cat-tank-rehab',
    categoryName: 'Underground Tank Rehabilitation',
    problemType: 'Tank 3 High Water Sensor Warning & Internal Camera Inspection',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    preferredDate: '2026-09-10',
    description: 'ATG detected 4mm water column in diesel tank after heavy rainfall. Tank dewatering and endoscopic camera seal audit successfully completed.',
    isEmergency: false,
    locationShared: true,
    assignedEngineerId: 'eng-03',
    assignedEngineerName: 'Harish Chandra',
    estimatedCost: 19500,
    finalCost: 19500,
    photos: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'],
    createdAt: '2026-09-10T08:00:00Z',
    updatedAt: '2026-09-10T16:30:00Z'
  }
];

export const INITIAL_AMC_CONTRACTS: AMCContract[] = [
  {
    id: 'amc-01',
    contractNumber: 'BPW-AMC-2026-0042',
    pumpId: 'pump-01',
    pumpName: 'Highway Star Petro Hub',
    clientId: 'usr-client-1',
    clientName: 'Rajesh Sharma',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    packageType: 'Comprehensive',
    annualFee: 85000,
    visitsTotal: 12,
    visitsCompleted: 8,
    maintenanceFrequency: 'MONTHLY',
    status: 'ACTIVE',
    coveredServices: [
      'Dispenser Electronic Calibration (Monthly)',
      'Underground Tank Water Ingress Inspection',
      'STP Turbine Head & Capacitor Diagnostics',
      'Flame Arrester & Vent Pipe Cleansing',
      'Emergency Mobile Service Van Free Callouts (Up to 4)'
    ],
    terms: '24/7 Priority Emergency Dispatch within 60 minutes. Replacement of gaskets, filters, and standard O-rings included.',
    nextScheduledVisit: '2026-09-24'
  },
  {
    id: 'amc-02',
    contractNumber: 'BPW-AMC-2026-0089',
    pumpId: 'pump-02',
    pumpName: 'City Pride Fuel Station',
    clientId: 'usr-client-1',
    clientName: 'Rajesh Sharma',
    startDate: '2025-10-01',
    endDate: '2026-09-30',
    packageType: 'Preventive Gold',
    annualFee: 55000,
    visitsTotal: 4,
    visitsCompleted: 3,
    maintenanceFrequency: 'QUARTERLY',
    status: 'EXPIRING_SOON',
    coveredServices: [
      'Quarterly Mechanical & Electrical Comprehensive Audit',
      'Earthing Resistance Megger Testing',
      'DCP Extinguisher Refill Coordination',
      'Quarterly W&M Stamping Preparation'
    ],
    terms: 'Renewal due in 15 days. Early renewal receives 10% loyalty credit on genuine E-Market spares.',
    nextScheduledVisit: '2026-09-20'
  }
];

export const INITIAL_MAINTENANCE_SCHEDULE: MaintenanceSchedule[] = [
  {
    id: 'ms-01',
    pumpId: 'pump-01',
    pumpName: 'Highway Star Petro Hub',
    amcId: 'amc-01',
    scheduledDate: '2026-09-24',
    maintenanceType: 'PREVENTIVE',
    equipmentCategory: 'DISPENSER',
    status: 'SCHEDULED',
    assignedEngineerName: 'Amitabh Verma',
    checklist: [
      { item: 'Dispenser filter mesh cleansing', done: false },
      { item: 'Pulsar electronic seal integrity', done: false },
      { item: 'Breakaway valve breakaway force check', done: false },
      { item: 'Nozzle spout auto-shutoff trigger test', done: false }
    ]
  },
  {
    id: 'ms-02',
    pumpId: 'pump-02',
    pumpName: 'City Pride Fuel Station',
    amcId: 'amc-02',
    scheduledDate: '2026-09-20',
    maintenanceType: 'INSPECTION',
    equipmentCategory: 'ELECTRICAL',
    status: 'SCHEDULED',
    assignedEngineerName: 'Sunil Shekhawat',
    checklist: [
      { item: 'Main LT Panel busbar thermal scan', done: false },
      { item: 'Earthing pit resistance reading (< 2 Ohms)', done: false },
      { item: 'DG automatic transfer switch (AMF) test', done: false },
      { item: 'Canopy explosion-proof fitting seals check', done: false }
    ]
  }
];

export const INITIAL_INVENTORY_PARTS: InventoryPart[] = [
  {
    id: 'prt-01',
    partName: 'ZVA Slimline High-Flow Automatic Nozzle 3/4"',
    partCode: 'BPW-PRT-NZL-01',
    category: 'Dispenser Components',
    brand: 'Elaflex ZVA Genuine',
    supplier: 'Sundaram PetroEquip OEM Ltd',
    stock: 42,
    minStock: 10,
    purchasePrice: 4200,
    sellingPrice: 5800,
    unit: 'Units',
    status: 'IN_STOCK',
    lastRestocked: '2026-09-02'
  },
  {
    id: 'prt-02',
    partName: 'Red Jacket Submersible Turbine Pump (STP) 1.5 HP',
    partCode: 'BPW-PRT-STP-02',
    category: 'Mechanical / UST',
    brand: 'Veeder-Root Red Jacket',
    supplier: 'Apex Fuel Technologies',
    stock: 5,
    minStock: 4,
    purchasePrice: 68000,
    sellingPrice: 84000,
    unit: 'Sets',
    status: 'LOW_STOCK',
    lastRestocked: '2026-08-15'
  },
  {
    id: 'prt-03',
    partName: 'Breakaway Safety Coupling Double Poppet 3/4"',
    partCode: 'BPW-PRT-BRK-03',
    category: 'Safety Components',
    brand: 'OPW Engineered',
    supplier: 'Sundaram PetroEquip OEM Ltd',
    stock: 28,
    minStock: 8,
    purchasePrice: 2100,
    sellingPrice: 2950,
    unit: 'Units',
    status: 'IN_STOCK',
    lastRestocked: '2026-09-05'
  },
  {
    id: 'prt-04',
    partName: 'Veeder-Root Magnetostrictive ATG Tank Probe 3.5m',
    partCode: 'BPW-PRT-ATG-04',
    category: 'Automation & ATG',
    brand: 'Veeder-Root Mag Plus',
    supplier: 'Apex Fuel Technologies',
    stock: 3,
    minStock: 5,
    purchasePrice: 52000,
    sellingPrice: 64500,
    unit: 'Units',
    status: 'LOW_STOCK',
    lastRestocked: '2026-07-28'
  },
  {
    id: 'prt-05',
    partName: 'Conductive Rubber Dispenser Fuel Hose 4.5m with Ferrules',
    partCode: 'BPW-PRT-HSE-05',
    category: 'Dispenser Components',
    brand: 'Goodyear / Continental ContiTech',
    supplier: 'Bharat Petro Supplies Co',
    stock: 35,
    minStock: 12,
    purchasePrice: 1850,
    sellingPrice: 2600,
    unit: 'Hoses',
    status: 'IN_STOCK',
    lastRestocked: '2026-09-10'
  },
  {
    id: 'prt-06',
    partName: 'High-Efficiency 10 Micron Petrol Spin-on Filter',
    partCode: 'BPW-PRT-FLT-06',
    category: 'Consumables',
    brand: 'PetroClear Water Sensing',
    supplier: 'Bharat Petro Supplies Co',
    stock: 64,
    minStock: 20,
    purchasePrice: 850,
    sellingPrice: 1250,
    unit: 'Filters',
    status: 'IN_STOCK',
    lastRestocked: '2026-09-12'
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'sm-01',
    partId: 'prt-01',
    partName: 'ZVA Slimline High-Flow Automatic Nozzle 3/4"',
    movementType: 'OUT',
    quantity: 1,
    referenceId: 'BPW-SR-2026-000001',
    notes: 'Installed on Dispenser 2 Nozzle 3 during calibration overhaul',
    timestamp: '2026-09-15T03:30:00Z'
  },
  {
    id: 'sm-02',
    partId: 'prt-06',
    partName: 'High-Efficiency 10 Micron Petrol Spin-on Filter',
    movementType: 'OUT',
    quantity: 2,
    referenceId: 'BPW-SR-2026-000004',
    notes: 'Replaced post tank dewatering service',
    timestamp: '2026-09-10T14:15:00Z'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-01',
    invoiceNumber: 'BPW-INV-2026-0042',
    requestId: 'BPW-SR-2026-000004',
    clientId: 'usr-client-1',
    clientName: 'Rajesh Sharma',
    pumpName: 'Highway Star Petro Hub',
    issueDate: '2026-09-10',
    dueDate: '2026-09-25',
    subtotal: 19500,
    taxAmount: 3510, // 18% GST
    discount: 0,
    totalAmount: 23010,
    status: 'PAID',
    paymentMethod: 'UPI_QR (PhonePe Business)',
    paidAt: '2026-09-11T11:45:00Z',
    items: [
      { description: 'Tank Dewatering, Ultrasonic Scan & Endoscopy Labor', quantity: 1, unitPrice: 17000, amount: 17000 },
      { description: '10 Micron PetroClear Spin-on Replacement Filters', quantity: 2, unitPrice: 1250, amount: 2500 }
    ]
  },
  {
    id: 'inv-02',
    invoiceNumber: 'BPW-INV-2026-0043',
    requestId: 'BPW-SR-2026-000001',
    clientId: 'usr-client-1',
    clientName: 'Rajesh Sharma',
    pumpName: 'Highway Star Petro Hub',
    issueDate: '2026-09-15',
    dueDate: '2026-09-30',
    subtotal: 7200,
    taxAmount: 1296,
    discount: 0,
    totalAmount: 8496,
    status: 'PENDING',
    items: [
      { description: 'Dispenser Calibration & Pulsar Overhaul Service', quantity: 1, unitPrice: 4250, amount: 4250 },
      { description: 'Breakaway Coupling Valve Testing & Reseal Kit', quantity: 1, unitPrice: 2950, amount: 2950 }
    ]
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay-01',
    transactionRef: 'BPW-TXN-984210',
    invoiceNumber: 'BPW-INV-2026-0042',
    clientId: 'usr-client-1',
    amount: 23010,
    gateway: 'UPI_QR',
    status: 'SUCCESS',
    paymentDate: '2026-09-11T11:45:00Z'
  }
];

export const INITIAL_E_MARKET_PRODUCTS: EMarketProduct[] = [
  {
    id: 'prod-01',
    title: 'ZVA Slimline 2 Automatic Fuel Dispenser Nozzle (PESO Approved)',
    partCode: 'BPW-MKT-ZVA-01',
    category: 'Dispensers & Nozzles',
    sellerId: 'usr-seller-1',
    sellerName: 'Sundaram PetroEquip OEM Ltd',
    price: 5800,
    originalPrice: 6500,
    moq: 1,
    stock: 48,
    rating: 4.9,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1527018606416-a67ffec538ce?w=500&auto=format&fit=crop&q=80',
    specifications: {
      'Flow Rate': 'Up to 80 L/min',
      'Inlet Thread': '3/4" BSP / NPT',
      'Pressure Range': '0.5 to 3.5 bar',
      'Approval': 'PESO / ATEX Certified'
    },
    isRfqAllowed: true,
    description: 'Heavy duty automatic shut-off nozzle for commercial petroleum dispensing. Fitted with integral swivel and stainless steel tipped spout.'
  },
  {
    id: 'prod-02',
    title: 'Red Jacket 1.5HP Submersible Turbine Pump (STP) Fixed Speed',
    partCode: 'BPW-MKT-STP-02',
    category: 'Submersible Pumps & UST',
    sellerId: 'usr-seller-1',
    sellerName: 'Sundaram PetroEquip OEM Ltd',
    price: 84000,
    originalPrice: 92000,
    moq: 1,
    stock: 6,
    rating: 5.0,
    reviewsCount: 19,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
    specifications: {
      'Motor Power': '1.5 HP Single/Three Phase',
      'Discharge': 'High Flow 200+ LPM',
      'Riser Pipe': '4 Inch Telescopic',
      'Warranty': '2 Years Comprehensive'
    },
    isRfqAllowed: true,
    description: 'Gold standard petroleum fuel delivery pump designed specifically for underground storage tanks. Unmatched hydraulic reliability.'
  },
  {
    id: 'prod-03',
    title: 'Veeder-Root Mag Plus Magnetostrictive ATG Tank Gauge Probe',
    partCode: 'BPW-MKT-ATG-03',
    category: 'Automation & ATG',
    sellerId: 'usr-seller-1',
    sellerName: 'Sundaram PetroEquip OEM Ltd',
    price: 64500,
    originalPrice: 71000,
    moq: 1,
    stock: 4,
    rating: 4.9,
    reviewsCount: 22,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80',
    specifications: {
      'Height': '3.5 Meter (UST 20KL/40KL)',
      'Water Level Sensitivity': '0.25mm',
      'Compatibility': 'TLS-450, TLS-350, Colibri',
      'Housing': 'Stainless Steel 316L'
    },
    isRfqAllowed: true,
    description: 'Precision continuous inventory and leak-detection probe providing automated product level, water level, and temperature readings.'
  },
  {
    id: 'prod-04',
    title: 'Double-Wall Electrofusion HDPE Petroleum Pipe Coil (32mm / 50m)',
    partCode: 'BPW-MKT-PIP-04',
    category: 'Piping & Containment',
    sellerId: 'usr-seller-1',
    sellerName: 'Sundaram PetroEquip OEM Ltd',
    price: 24500,
    originalPrice: 28000,
    moq: 2,
    stock: 15,
    rating: 4.8,
    reviewsCount: 14,
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=500&auto=format&fit=crop&q=80',
    specifications: {
      'Standard': 'EN 14125 Certified',
      'Permeability': 'Zero Fuel Vapor Leakage',
      'Pressure Rating': '10 Bar PN10',
      'Internal Layer': 'Conductive EVOH Liner'
    },
    isRfqAllowed: true,
    description: 'Seamless co-extruded underground petroleum piping designed for modern suction and pressure pumping systems.'
  }
];

export const INITIAL_ORDERS: EMarketOrder[] = [
  {
    id: 'BPW-ORD-9041',
    orderNumber: 'BPW-ORD-9041',
    buyerId: 'usr-buyer-1',
    buyerName: 'Deepak Patel',
    items: [
      { productId: 'prod-01', productTitle: 'ZVA Slimline 2 Automatic Fuel Dispenser Nozzle', price: 5800, quantity: 2 }
    ],
    totalAmount: 11600,
    status: 'DISPATCHED',
    paymentStatus: 'PAID',
    shippingAddress: 'Sardar Fuels Outlet, Highway Bypass, Surat, Gujarat - 395006',
    createdAt: '2026-09-13T10:20:00Z'
  }
];

export const INITIAL_RFQS: RFQ[] = [
  {
    id: 'BPW-RFQ-2026-014',
    rfqNumber: 'BPW-RFQ-2026-014',
    productId: 'prod-02',
    productName: 'Red Jacket 1.5HP Submersible Turbine Pump (STP)',
    buyerId: 'usr-buyer-1',
    buyerName: 'Deepak Patel',
    requestedQty: 4,
    targetPrice: 78000,
    requirements: 'Require 4 units with 3-phase telemetry control boxes delivered to Vadodara Depot within 7 days.',
    status: 'QUOTED',
    quotesReceived: [
      {
        sellerId: 'usr-seller-1',
        sellerName: 'Sundaram PetroEquip OEM Ltd',
        quotedPrice: 79500,
        deliveryDays: 4,
        validUntil: '2026-09-25'
      }
    ],
    createdAt: '2026-09-14T15:00:00Z'
  }
];

export const INITIAL_JOBS: JobOpening[] = [
  {
    id: 'job-01',
    title: 'UST & Fuel Pipeline Site Engineer',
    department: 'Engineering & Field Projects',
    location: 'NCR & Uttar Pradesh / Regional Sites',
    type: 'Site-based',
    experienceRequired: '3-6 Years',
    openings: 4,
    salaryRange: '₹4.8L - ₹7.5L CTC + Site Allowances',
    description: 'Lead turnkey underground tank installation, double-wall piping hydrotests, electrofusion welding and PESO regulatory site sign-offs.',
    requirements: [
      'B.Tech / Diploma in Mechanical or Civil Engineering',
      'Minimum 3 years hands-on experience in retail petrol pump site erection',
      'Proficiency in HDPE electrofusion alignment and manifold testing',
      'Knowledge of OISD-141 guidelines and PESO safety rules'
    ],
    responsibilities: [
      'Supervise UST crane lowering, hold-down strap anchorage and backfill',
      'Conduct 5-bar hydrostatic pressure testing on product delivery loops',
      'Liaise with Oil Marketing Company (IOCL/BPCL/HPCL) inspection teams'
    ],
    status: 'ACTIVE',
    recommendedCourseId: 'acad-01',
    recommendedCourseTitle: 'Mastering Underground Storage Tanks (UST) & Double-Wall Piping',
    applicantsCount: 18
  },
  {
    id: 'job-02',
    title: 'HSE & Fire Safety Compliance Officer',
    department: 'Health, Safety & Environment',
    location: 'Delhi NCR / Bulandshahr Hub',
    type: 'Full-time',
    experienceRequired: '2-5 Years',
    openings: 2,
    salaryRange: '₹4.2L - ₹6.5L CTC',
    description: 'Ensure rigorous safety protocols across all Bharat PetroWork field maintenance, hot work permit (PTW) audits, and fire protection systems.',
    requirements: [
      'NEBOSH / RLI / CLI Diploma in Industrial Safety',
      'Working knowledge of Hazardous Area Classifications (Zone 0, 1, 2)',
      'Experience issuing Permit to Work (PTW), JSA, and HIRA logs'
    ],
    responsibilities: [
      'Conduct unannounced field audits on mobile service van personnel',
      'Audit DCP fire hydrant arrays and automatic flame detection loops',
      'Provide monthly safety refreshers to Bharat PetroWork engineers'
    ],
    status: 'ACTIVE',
    recommendedCourseId: 'acad-03',
    recommendedCourseTitle: 'PTW, JSA, HIRA & LOTO: Fuel Retail Station Safety Leadership',
    applicantsCount: 12
  },
  {
    id: 'job-03',
    title: 'Fuel Dispenser & ATG Automation Specialist',
    department: 'Electronics & Automation',
    location: 'Pan-India Highway Corridors',
    type: 'Full-time',
    experienceRequired: '2-4 Years',
    openings: 5,
    salaryRange: '₹3.8L - ₹5.8L CTC',
    description: 'Field diagnostic and electronic calibration specialist for multi-product dispensers (Gilbarco, Tokheim, Midco) and Veeder-Root ATG consoles.',
    requirements: [
      'Diploma / ITI in Electronics / Instrumentation',
      'Experience in electronic pulsar calibration and solenoid valve servicing',
      'Comfort with RS-485 / Modbus protocols connecting POS and ATGs'
    ],
    responsibilities: [
      'Respond to high-priority dispenser breakdown tickets within SLA',
      'Perform Weights & Measures (W&M) 5-liter stamping readiness checks',
      'Install and commission tank probe consoles and wireless leak sensors'
    ],
    status: 'ACTIVE',
    recommendedCourseId: 'acad-02',
    recommendedCourseTitle: 'Advanced Automatic Tank Gauging (ATG) & Station Automation',
    applicantsCount: 26
  }
];

export const INITIAL_JOB_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-01',
    jobId: 'job-01',
    jobTitle: 'UST & Fuel Pipeline Site Engineer',
    candidateId: 'usr-candidate-1',
    candidateName: 'Rahul Mishra',
    candidateEmail: 'rahul.mishra.eng@gmail.com',
    candidatePhone: '+91 95443 22110',
    experienceYears: 4,
    skills: ['HDPE Electrofusion', 'Hydro-testing', 'UST Anchoring', 'AutoCAD Site Layouts'],
    status: 'SHORTLISTED',
    appliedDate: '2026-09-08',
    interviewDate: '2026-09-18T11:00:00Z',
    feedback: 'Strong mechanical background with 3 IOCL turnkey installations completed. Recommended for Technical Round.'
  }
];

export const INITIAL_ACADEMY_COURSES: AcademyCourse[] = [
  {
    id: 'acad-01',
    title: 'Mastering Underground Storage Tanks (UST) & Double-Wall Piping',
    code: 'BPW-ACAD-UST-101',
    category: 'Civil & Mechanical Infrastructure',
    durationHours: 32,
    level: 'Advanced',
    price: 3499,
    rating: 4.95,
    enrolledCount: 340,
    modulesCount: 6,
    description: 'Comprehensive industry masterclass on UST excavation, geo-textile placement, deadman anchoring, interstitial vacuum testing, and electrofusion jointing conforming to OISD-141 and PESO specifications.',
    curriculum: [
      { title: 'Module 1: Geology & Soil Bearing Capacity for Fuel Storage', lessons: ['Soil compaction testing', 'Water table dewatering dynamics', 'Concrete foundation slab casting'] },
      { title: 'Module 2: UST Crane Rigging & Deadman Anchorage', lessons: ['Crane load ratings & sling angle safety', 'Fiberglass hold-down straps', 'Over-tilt prevention'] },
      { title: 'Module 3: Double-Wall Piping & Electrofusion Alignment', lessons: ['HDPE peeling & clamp preparation', 'Fusion voltage & cooling time curves', 'Secondary containment leak sensors'] },
      { title: 'Module 4: Hydrostatic & Vacuum Decay Testing', lessons: ['Nitrogen inerting protocols', 'Pressure hold charts & 0.05 bar leak thresholds', 'Statutory PESO test reports'] }
    ],
    connectedJobRole: 'UST & Fuel Pipeline Site Engineer',
    certificateOffered: true
  },
  {
    id: 'acad-02',
    title: 'Advanced Automatic Tank Gauging (ATG) & Station Automation',
    code: 'BPW-ACAD-ATG-202',
    category: 'Instrumentation & IoT',
    durationHours: 24,
    level: 'Intermediate',
    price: 2799,
    rating: 4.88,
    enrolledCount: 480,
    modulesCount: 5,
    description: 'Hands-on practical walkthrough covering magnetostrictive probes, water float calibration, console setup, RS-485 loop wiring, automatic delivery reconciliation, and tank leak alarms.',
    curriculum: [
      { title: 'Module 1: ATG Physics & Sensor Mechanics', lessons: ['Magnetostrictive wave propagation', 'Dual-float density detection', 'Temperature multi-point averaging'] },
      { title: 'Module 2: Console Programming (TLS-450 / Colibri)', lessons: ['Tank strapping table entry', 'Alarm threshold configuration', 'Automated reconciliation reports'] },
      { title: 'Module 3: Troubleshooting Probe Communication Faults', lessons: ['Shielded cable grounding errors', 'Intrinsic safety zener barriers', 'Firmware diagnostics'] }
    ],
    connectedJobRole: 'Fuel Dispenser & ATG Automation Specialist',
    certificateOffered: true
  },
  {
    id: 'acad-03',
    title: 'PTW, JSA, HIRA & LOTO: Fuel Retail Station Safety Leadership',
    code: 'BPW-ACAD-HSE-303',
    category: 'Safety & Regulatory Compliance',
    durationHours: 18,
    level: 'Master Certification',
    price: 1999,
    rating: 4.98,
    enrolledCount: 620,
    modulesCount: 4,
    description: 'The definitive gold-standard safety course covering Cold/Hot Work Permits (PTW), Job Safety Analysis (JSA), Hazard Identification & Risk Assessment (HIRA), and Lock-Out Tag-Out (LOTO) in explosive zone 0/1/2 atmospheres.',
    curriculum: [
      { title: 'Module 1: Hazardous Area Classification & Explosive Limits', lessons: ['LEL / UEL ranges of petrol & diesel', 'Zone 0, 1, 2 boundary demarcation', 'Static electricity dissipation'] },
      { title: 'Module 2: Permit to Work (PTW) Execution', lessons: ['Hot work authorization checklist', 'Confined space entry into tanks', 'Vapor-free certificate issuance'] },
      { title: 'Module 3: Lock-Out Tag-Out (LOTO) for Dispenser & STP Maintenance', lessons: ['Electrical isolation at Main LT Panel', 'Lock box & key custody protocols', 'Pre-restart integrity test'] }
    ],
    connectedJobRole: 'HSE & Fire Safety Compliance Officer',
    certificateOffered: true
  }
];

export const INITIAL_ENROLLMENTS: CourseEnrollment[] = [
  {
    id: 'enr-01',
    courseId: 'acad-01',
    courseTitle: 'Mastering Underground Storage Tanks (UST) & Double-Wall Piping',
    userId: 'usr-candidate-1',
    userName: 'Rahul Mishra',
    progressPercentage: 85,
    status: 'IN_PROGRESS',
    enrolledAt: '2026-09-02'
  }
];

export const INITIAL_DIGITAL_DOCUMENTS: DigitalDocument[] = [
  {
    id: 'doc-01',
    title: 'PESO Underground Petroleum Storage License (Form XIV)',
    fileName: 'PESO_License_RO10492_Valid2028.pdf',
    category: 'PUMP_LICENSE',
    entityId: 'pump-01',
    entityType: 'PUMP',
    fileSize: '2.4 MB',
    uploadedAt: '2026-01-15',
    isPrivate: true
  },
  {
    id: 'doc-02',
    title: 'Weights & Measures Dispenser Verification Certificate',
    fileName: 'WM_Verification_Stamping_Q3_2026.pdf',
    category: 'CALIBRATION',
    entityId: 'pump-01',
    entityType: 'PUMP',
    fileSize: '1.8 MB',
    uploadedAt: '2026-07-10',
    isPrivate: false
  },
  {
    id: 'doc-03',
    title: 'Signed Completion Slip - Tank Dewatering & Camera Inspection',
    fileName: 'WorkReport_BPW-SR-2026-000004_Signed.pdf',
    category: 'WORK_REPORT',
    entityId: 'BPW-SR-2026-000004',
    entityType: 'SERVICE_REQUEST',
    fileSize: '3.1 MB',
    uploadedAt: '2026-09-10',
    isPrivate: true
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    userId: 'usr-client-1',
    title: 'Engineer En Route to Site',
    message: 'Senior Technician Sunil Shekhawat has accepted emergency request BPW-SR-2026-000002. Estimated arrival: 18 mins.',
    type: 'EMERGENCY',
    channel: 'IN_APP',
    read: false,
    createdAt: '2026-09-15T03:12:00Z',
    actionUrl: 'service-tracking'
  },
  {
    id: 'notif-02',
    userId: 'usr-client-1',
    title: 'Invoice BPW-INV-2026-0043 Generated',
    message: 'An invoice for ₹8,496 for Dispenser Bay 2 calibration has been generated and is ready for payment.',
    type: 'INFO',
    channel: 'IN_APP',
    read: false,
    createdAt: '2026-09-15T03:50:00Z',
    actionUrl: 'invoices'
  },
  {
    id: 'notif-03',
    userId: 'usr-admin-1',
    title: 'Urgent: Emergency Service Raised',
    message: 'City Pride Fuel Station (BPCL) reported Total Dispense Failure - Submersible Pump Shutdown.',
    type: 'EMERGENCY',
    channel: 'WHATSAPP',
    read: true,
    createdAt: '2026-09-15T02:15:00Z'
  },
  {
    id: 'notif-04',
    userId: 'usr-admin-1',
    title: 'Low Stock Alert: Veeder-Root ATG Probe',
    message: 'Part BPW-PRT-ATG-04 stock is down to 3 units (below threshold of 5). Automated replenishment requisition prepared.',
    type: 'WARNING',
    channel: 'IN_APP',
    read: false,
    createdAt: '2026-09-14T18:00:00Z',
    actionUrl: 'inventory'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-01',
    timestamp: '2026-09-15T03:45:00Z',
    userId: 'usr-eng-1',
    userName: 'Amitabh Verma',
    userRole: 'engineer',
    action: 'SERVICE_STATUS_TRANSITION',
    entityType: 'service_requests',
    entityId: 'BPW-SR-2026-000001',
    fromStatus: 'INSPECTION',
    toStatus: 'WORK_IN_PROGRESS',
    details: 'Inspection concluded with 15ml pulsar flutter. Commenced electronic recalibration and breakaway valve inspection.',
    ipAddress: '103.21.144.98'
  },
  {
    id: 'aud-02',
    timestamp: '2026-09-15T03:30:00Z',
    userId: 'usr-eng-1',
    userName: 'Amitabh Verma',
    userRole: 'engineer',
    action: 'INVENTORY_STOCK_OUT',
    entityType: 'parts',
    entityId: 'prt-01',
    details: 'Deducted 1 unit of ZVA Slimline High-Flow Automatic Nozzle for job BPW-SR-2026-000001.',
    ipAddress: '103.21.144.98'
  },
  {
    id: 'aud-03',
    timestamp: '2026-09-15T03:10:00Z',
    userId: 'usr-admin-1',
    userName: 'Vikramaditya Rao (Chief Operations)',
    userRole: 'admin',
    action: 'ENGINEER_DISPATCH_CONFIRMED',
    entityType: 'service_requests',
    entityId: 'BPW-SR-2026-000002',
    fromStatus: 'NEW',
    toStatus: 'ON_THE_WAY',
    details: 'Dispatched Sunil Shekhawat with Rapid Mobile Service Van 04 to City Pride Fuel Station.',
    ipAddress: '182.74.22.10'
  },
  {
    id: 'aud-04',
    timestamp: '2026-09-11T11:45:00Z',
    userId: 'usr-client-1',
    userName: 'Rajesh Sharma',
    userRole: 'client',
    action: 'PAYMENT_RECEIVED',
    entityType: 'invoices',
    entityId: 'inv-01',
    fromStatus: 'PENDING',
    toStatus: 'PAID',
    details: 'Settled ₹23,010 via UPI QR transaction ref BPW-TXN-984210.',
    ipAddress: '49.36.120.45'
  }
];

export const INITIAL_DRIVERS: DeliveryDriver[] = [
  {
    id: 'drv-01',
    userId: 'usr-driver-1',
    name: 'Harvinder Singh',
    phone: '+91 98770 12345',
    licenseNumber: 'DL-04-2018-0994182 (HMV / HazMat Endorsed)',
    hazmatCertified: true,
    vehicleNumber: 'HR-55-AJ-4910',
    vehicleModel: 'Tata Ultra T.16 High-Capacity Transit Rig',
    currentLocation: 'NH-44 Highway Milepost 78, Palwal Corridor',
    status: 'ON_TRIP',
    rating: 4.95,
    tripsCompleted: 342,
    emergencyContact: '+91 98770 99881 (BPW 24/7 Logistics HQ)'
  },
  {
    id: 'drv-02',
    userId: 'usr-driver-2',
    name: 'Manoj Kumar Yadav',
    phone: '+91 98109 87654',
    licenseNumber: 'UP-14-2019-0112839 (Heavy Transport)',
    hazmatCertified: true,
    vehicleNumber: 'UP-16-BT-7720',
    vehicleModel: 'Eicher Pro 3019 Heavy Cargo Platform',
    currentLocation: 'BPW Greater Noida Central Warehouse Yard',
    status: 'AVAILABLE',
    rating: 4.88,
    tripsCompleted: 218,
    emergencyContact: '+91 98109 00112'
  },
  {
    id: 'drv-03',
    userId: 'usr-driver-3',
    name: 'Pradeep Rathore',
    phone: '+91 97234 11229',
    licenseNumber: 'GJ-01-2020-0553921 (PESO HazMat Carrier)',
    hazmatCertified: true,
    vehicleNumber: 'GJ-06-XX-8812',
    vehicleModel: 'BharatBenz 2823R Heavy Multi-Axle Hauler',
    currentLocation: 'Vadodara Petro Industrial Logistics Park',
    status: 'AVAILABLE',
    rating: 4.92,
    tripsCompleted: 195,
    emergencyContact: '+91 97234 99001'
  }
];

export const INITIAL_CONSIGNMENTS: DeliveryConsignment[] = [
  {
    id: 'cng-01',
    consignmentNumber: 'BPW-LOG-2026-8801',
    orderId: 'ord-01',
    orderNumber: 'BPW-ORD-9041',
    buyerName: 'Highway Petro Hub Network (Rajesh Sharma)',
    deliveryAddress: 'NH-48, KM Stone 142, Kotputli Bypass, Rajasthan - 303108',
    roCode: 'RO-10492',
    contactPerson: 'Suresh Meena (Station Manager)',
    contactPhone: '+91 98290 55432',
    driverId: 'drv-01',
    driverName: 'Harvinder Singh',
    driverPhone: '+91 98770 12345',
    vehicleNumber: 'HR-55-AJ-4910',
    vehicleType: 'Tata Ultra T.16 High-Capacity Heavy Platform',
    ewayBillNumber: 'EWB-2910-4491-0029',
    invoiceNumber: 'BPW-INV-2026-0941',
    items: [
      {
        title: 'Wayne Ovation Dual-Hose High-Flow Petroleum Dispenser',
        quantity: 2,
        weightKg: 850,
        serialNumbers: ['WO-2026-IN-4921', 'WO-2026-IN-4922']
      },
      {
        title: 'Red Jacket 1.5 HP Submersible Turbine Pump (STP)',
        quantity: 2,
        weightKg: 140,
        serialNumbers: ['RJ-STP-88012', 'RJ-STP-88013']
      }
    ],
    totalWeightKg: 990,
    hazmatClass: 'Class 3 Flammable Liquids Handling Protocol (PESO Approved)',
    status: 'IN_TRANSIT',
    currentCity: 'Palwal - Mathura Corridor (NH-19)',
    eta: 'Today, 04:30 PM (1 hr 45 mins)',
    originWarehouse: 'BPW Greater Noida Central Logistics Hub',
    destination: 'Highway Petro Hub, Kotputli, Rajasthan',
    dispatchedAt: '2026-09-16T02:15:00Z',
    deliveryOtp: '7419',
    safetyChecklistCompleted: true
  },
  {
    id: 'cng-02',
    consignmentNumber: 'BPW-LOG-2026-8802',
    orderId: 'ord-02',
    orderNumber: 'BPW-ORD-9042',
    buyerName: 'Sardar Fuels & Logistics (Deepak Patel)',
    deliveryAddress: 'Plot 44, Express Highway, Mehsana Toll, Gujarat - 384002',
    roCode: 'RO-20831',
    contactPerson: 'Ketan Patel (Forecourt Supervisor)',
    contactPhone: '+91 97123 44889',
    driverId: 'drv-03',
    driverName: 'Pradeep Rathore',
    driverPhone: '+91 97234 11229',
    vehicleNumber: 'GJ-06-XX-8812',
    vehicleType: 'BharatBenz 2823R Heavy Multi-Axle Hauler',
    ewayBillNumber: 'EWB-4412-9801-7712',
    invoiceNumber: 'BPW-INV-2026-0942',
    items: [
      {
        title: 'Franklin Fueling UPP 63mm Dual-Containment Electrofusion Pipe (100m roll)',
        quantity: 3,
        weightKg: 620
      },
      {
        title: 'OPW Fibrelite Watertight Composite Forecourt Manhole Covers (900mm)',
        quantity: 6,
        weightKg: 270
      }
    ],
    totalWeightKg: 890,
    hazmatClass: 'Industrial Petroleum Piping Standard OISD-141',
    status: 'FORECOURT_ARRIVED',
    currentCity: 'Mehsana Forecourt Retail Outlet Yard',
    eta: 'Arrived at destination site',
    originWarehouse: 'BPW Ahmedabad Regional Distribution Depot',
    destination: 'Sardar Fuels Forecourt, Mehsana, Gujarat',
    dispatchedAt: '2026-09-15T18:30:00Z',
    deliveryOtp: '3982',
    safetyChecklistCompleted: true
  },
  {
    id: 'cng-03',
    consignmentNumber: 'BPW-LOG-2026-8803',
    orderId: 'ord-03',
    orderNumber: 'BPW-ORD-9043',
    buyerName: 'Greenfield Kisan Seva Kendra',
    deliveryAddress: 'Rural Link Road, Bulandshahr, Uttar Pradesh - 203001',
    roCode: 'RO-30911',
    contactPerson: 'Dharmendra Singh',
    contactPhone: '+91 94120 66778',
    driverId: 'drv-02',
    driverName: 'Manoj Kumar Yadav',
    driverPhone: '+91 98109 87654',
    vehicleNumber: 'UP-16-BT-7720',
    vehicleType: 'Eicher Pro 3019 Heavy Cargo Platform',
    ewayBillNumber: 'EWB-1102-3344-9981',
    invoiceNumber: 'BPW-INV-2026-0943',
    items: [
      {
        title: 'ZVA Slimline 2 Automatic Fuel Dispensing Nozzle DN16',
        quantity: 8,
        weightKg: 28
      },
      {
        title: 'Veeder-Root Mag Plus Magnetostrictive ATG Probe',
        quantity: 2,
        weightKg: 35
      }
    ],
    totalWeightKg: 63,
    hazmatClass: 'Dispensing Components & Precision ATG Instrumentation',
    status: 'DELIVERED_POD',
    currentCity: 'Bulandshahr Outlet (Handover Completed)',
    eta: 'Delivered',
    originWarehouse: 'BPW Greater Noida Central Logistics Hub',
    destination: 'Greenfield KSK, Bulandshahr, UP',
    dispatchedAt: '2026-09-14T08:00:00Z',
    deliveredAt: '2026-09-14T14:40:00Z',
    deliveryOtp: '5120',
    receiverSignature: 'Dharmendra Singh (Authorized RO Manager)',
    safetyChecklistCompleted: true
  }
];
