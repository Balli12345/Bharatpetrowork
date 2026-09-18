# BHARAT PETROWORK — COMPLETE SYSTEM AUDIT & ENTERPRISE ARCHITECTURE SPECIFICATION
**Phase 1 Deliverable — Lead Software Architect Blueprint**
*Source of Truth: https://bharatpetrowork.com/ & Official Bharat PetroWork Architecture Specifications*

---

## 1. System Architecture Diagram

```
                                  ==============================================
                                                BHARAT PETROWORK
                                       Unified Fuel Infrastructure Ecosystem
                                  ==============================================
                                                        |
      +-------------------------------------------------+---------------------------------------------+
      |                                                 |                                             |
      v                                                 v                                             v
[ PUMP MITRA ]                                    [ E-MARKET ]                              [ JOBS & CAREER ]
  Fuel Station Lifecycle Management                 B2B Petroleum Equipment Commerce          Workforce & Academy LMS
      |                                                 |                                             |
  +---+-----------------------------+                   +--------------------+                        +-----------------------+
  |                                 |                   |                    |                        |                       |
  v                                 v                   v                    v                        v                       v
CLIENT APP                    ENGINEER APP          BUYER PORTAL        SELLER PORTAL            CANDIDATE PORTAL      BPW ACADEMY (LMS)
(Pump Owners / O&M)           (Field Engineers)     (Procurement)       (OEMs/Suppliers)         (Job Applicants)      (Certified Modules)
  |                                 |                   |                    |                        |                       |
  +---------------------------------+-------------------+--------------------+------------------------+-----------------------+
                                                        |
                                                        v
                                        +--------------------------------+
                                        |   CENTRAL API GATEWAY / BFF    |
                                        |         Express.js / TS        |
                                        +--------------------------------+
                                                        |
                         +------------------------------+-------------------------------+
                         |                                                              |
                         v                                                              v
       +------------------------------------+                         +-----------------------------------+
       |       CENTRAL ADMIN WEB CRM        |                         |         ADMIN MOBILE APP          |
       |  /admin (Enterprise Management)    |                         |  Mobile Control Center (On-the-go)|
       +------------------------------------+                         +-----------------------------------+
                         |
                         v
       +------------------------------------+
       |          CORE ENGINES              |
       |  - 18-State Service Engine         |
       |  - Inventory & Stock-Out System    |
       |  - SLA & Escalation Engine         |
       |  - Multi-Gateway Payment Engine    |
       |  - Multi-Channel Notifications     |
       |  - Document & Signature Vault      |
       |  - CMS & Content Publisher         |
       |  - Comprehensive Audit Logger      |
       +------------------------------------+
                         |
                         v
       +------------------------------------+
       |       PERSISTENCE & STORAGE        |
       |  - Normalized MySQL / DB Engine    |
       |  - Private Secure Object Store     |
       +------------------------------------+
```

---

## 2. Module Map

1. **Public Web Portal**:
   - Official Bharat PetroWork Services Showcase (Civil, Mechanical, Electrical, Fire & Safety, O&M, Tank Rehabilitation).
   - Specialized Service Areas (Pipelines, Dispensers, Tanks, Mobile Service Vans, Tank Lining).
   - Industries Served (Petrol Pumps, Fuel Storage Facilities, Oil Terminals, Fuel Transporters, Industrial Fuel Systems).
   - Quick Access to all Sub-platforms.

2. **Pump Mitra Subsystem**:
   - **Client App**: Pump registration, RO Code linkage (IOCL, BPCL, HPCL, Reliance, Nayara, Shell), Service & Emergency requests, AMC tracking, live engineer tracking, invoices & digital payments.
   - **Engineer App**: Real-time dispatch, turn-by-turn navigation, geofenced job start, pre/post inspection checklists, photo/video uploads, parts used logging with automated stock-out, digital customer signatures, attendance & availability toggle.
   - **Admin Control Center**: Request triage, intelligent technician assignment based on proximity & skillset, SLA monitoring, review & invoice approval.

3. **E-Market Subsystem**:
   - Genuine Fuel Station Equipment, Dispensers, Nozzles, Pipes, ATG Probes, Safety Gear.
   - Buyer: Catalog, Specs, Cart, Purchase Order, RFQ (Request for Quote) engine, Quote review, Checkout.
   - Seller: Store management, Inventory management, RFQ response with competitive pricing, Order fulfillment.
   - Admin: Seller verification, catalog approval, dispute resolution, commission ledger.

4. **Jobs & Career Subsystem**:
   - Industry-specific technical openings (UST/Pipeline Site Engineer, HSE & Fire Safety Officer, Fuel Station Electrical Engineer, ATG Technician, STP Technician, Dispenser Technician).
   - Applicant tracking system (ATS) with 6-stage candidate pipeline: Applied → Screening → Shortlisted → Interview → Selected → Rejected.

5. **BPW Academy (Integrated LMS)**:
   - Industry certification programs (ATG Systems, UST Installation, Fuel Dispenser Calibration, STP Diagnostics, PTW/JSA/HIRA/LOTO, Tank Integrity, Corrosion Control, O&M Management).
   - Direct link between Job Openings and Recommended Courses for skill upskilling.
   - Course curriculum, module progress tracking, evaluation, verifiable digital certificates.

6. **Enterprise Core Services**:
   - **Service Status Engine**: Strict state machine with 18 distinct states.
   - **Inventory Management**: Real-time parts deduction on job report submission, low-stock alerts.
   - **Billing & Accounting**: Automated invoice generation from labor + parts, GST compliant (18%), payment tracking.
   - **Document Vault**: Encrypted storage for explosive licenses, PESO clearances, calibration certificates, work photos, and signed completion slips.
   - **Audit Logger**: Tamper-proof append-only ledger of every role action, status change, and payment transaction.

---

## 3. User-Role Matrix

| Role | Portal Access | Permissions & Capabilities |
|---|---|---|
| **Super Admin / Ops Admin** | `/admin`, Mobile Admin App | Full read/write access across all modules, assign engineers, override statuses, generate invoices, manage CMS, view financial reports, audit logs. |
| **Client / Pump Owner** | `/pump-mitra/client` | Register retail outlets (RO), raise standard & emergency service tickets, track assigned technician, approve job completion, view AMC & pay invoices. |
| **Field Engineer / Technician**| `/engineer` | View assigned jobs, update location & availability (Online/Offline/Busy), record site arrival, submit inspection findings, log parts used, capture customer sign-off. |
| **E-Market Buyer** | `/e-market` | Browse catalog, create orders, initiate RFQs for bulk parts, track shipments, leave reviews. |
| **E-Market Seller / OEM** | `/seller` | List petroleum components, manage warehouse stock, reply to RFQs with customized quotations, process orders. |
| **Job Candidate** | `/jobs-career/candidate` | Search vacancies, upload resumes/certificates, submit job applications, track status, view recommended courses. |
| **Academy Student / Trainee** | `/academy` | Enroll in technical fuel infrastructure courses, complete interactive training modules, download verified certifications. |

---

## 4. Database ER Structure (Normalized Schema)

```
[users] 1 -- * [user_roles] * -- 1 [roles]
   |
   +-- 1 -- 1 [profiles]
   +-- 1 -- * [notifications]
   +-- 1 -- * [audit_logs]

[clients] (FK: user_id) 1 -- * [petrol_pumps]
   |
   +-- 1 -- * [service_requests]
   |            |
   |            +-- 1 -- * [service_request_files]
   |            +-- 1 -- 1 [engineer_assignments] * -- 1 [engineers] (FK: user_id)
   |            +-- 1 -- 1 [job_reports]
   |            |            +-- 1 -- * [job_photos]
   |            |            +-- 1 -- * [job_parts] * -- 1 [parts]
   |            |            +-- 1 -- 1 [customer_signatures]
   |            +-- 1 -- 1 [invoices]
   |                         +-- 1 -- * [invoice_items]
   |                         +-- 1 -- * [payments]
   |
   +-- 1 -- * [amc_contracts] 1 -- * [maintenance_schedules]

[parts] * -- 1 [suppliers]
   |
   +-- 1 -- * [stock_movements]

[products] * -- 1 [sellers] (FK: user_id)
   |
   +-- 1 -- * [cart_items] * -- 1 [carts] (FK: buyer_id)
   +-- 1 -- * [order_items] * -- 1 [orders] (FK: buyer_id)
   +-- 1 -- * [rfqs] 1 -- * [quotes]

[jobs] 1 -- * [applications] * -- 1 [candidates] (FK: user_id)
   |                |
   |                +-- 1 -- * [interviews]
   |
   +-- [recommended_course_id] -> [courses] 1 -- * [enrollments] (FK: user_id)
                                                    |
                                                    +-- 1 -- 1 [certificates]
```

---

## 5. API Structure

- `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`, `POST /api/auth/logout`
- `GET /api/client/pumps`, `POST /api/client/pumps`, `GET /api/client/dashboard`
- `GET /api/engineer/jobs`, `POST /api/engineer/jobs/:id/status`, `POST /api/engineer/jobs/:id/report`, `POST /api/engineer/status`
- `GET /api/pump-mitra/requests`, `POST /api/pump-mitra/requests`, `POST /api/pump-mitra/emergency`
- `GET /api/services/categories`, `GET /api/services/history`
- `GET /api/amc/contracts`, `POST /api/amc/renew`, `GET /api/amc/schedule`
- `GET /api/inventory/parts`, `POST /api/inventory/stock-movement`, `GET /api/inventory/low-stock`
- `GET /api/invoices`, `GET /api/invoices/:id`, `POST /api/invoices/generate`
- `POST /api/payments/create-order`, `POST /api/payments/verify`, `GET /api/payments/receipt/:id`
- `GET /api/e-market/products`, `POST /api/e-market/cart`, `POST /api/e-market/orders`, `POST /api/e-market/rfq`
- `GET /api/jobs`, `POST /api/applications`, `GET /api/applications/my`
- `GET /api/academy/courses`, `POST /api/academy/enroll`, `GET /api/academy/certificates`
- `GET /api/notifications`, `PUT /api/notifications/:id/read`
- `GET /api/admin/metrics`, `POST /api/admin/assign-engineer`, `POST /api/admin/approve-job`, `GET /api/admin/audit-logs`
- `GET /api/cms/content`, `PUT /api/cms/content`

---

## 6. Authentication Architecture
- Unified User Model with polymorphic roles.
- Dedicated login portals with contextual branding and automated role-based routing.
- JWT/Bearer Session Token stored in secure client state with expiration checks.
- Granular permission middleware protecting routes based on entity ownership (e.g. clients can only access their pumps; engineers can only update their assigned jobs).

---

## 7. Pump Mitra Workflow
1. Client registers petrol pump (RO Code, Oil Company, Tank count, Dispenser count, GPS).
2. Service or Emergency Request initiated with photos, category, and issue description.
3. System assigns Unique ID (`BPW-SR-2026-XXXXXX`) and dispatches notification.
4. Admin reviews ticket and assigns qualified technician.
5. Engineer accepts job, navigates to location via GPS, and checks in upon arrival.
6. Inspection conducted, before photos uploaded, repair work carried out, replacement parts deducted from stock.
7. Post-work testing, after photos uploaded, and digital client sign-off captured.
8. Admin reviews comprehensive work dossier, approves completion, and triggers invoice generation.
9. Client pays via integrated payment gateway; invoice and compliance certificates archived in document vault.

---

## 8. E-Market Workflow
1. Buyer searches OEM components (dispenser nozzles, submersible turbine pumps, ATG probes, flame arrestors).
2. For standard items: Add to Cart → Select Delivery Outlet → Checkout → Payment → Dispatch.
3. For bulk/specialized gear: Submit RFQ specifying quantity and site parameters → Sellers receive alert → Submit competitive quotes → Buyer selects winning quote → Order confirmed.

---

## 9. Jobs Workflow
1. Candidate browses technical fuel infrastructure vacancies.
2. Candidate creates profile, inputs certifications (e.g. PESO/OISD standards), attaches CV.
3. If candidate lacks specific technical competencies, the platform suggests the matching BPW Academy program.
4. Application moves through 6 stages (Applied → Screening → Shortlisted → Interview → Selected → Rejected) with real-time candidate notifications.

---

## 10. Academy Workflow
1. Candidate or Pump Engineer enrolls in specialized training modules.
2. Trainee accesses video lessons, safety manuals (PTW, HIRA, LOTO), and interactive diagnostic assessments.
3. Upon 100% completion and passing threshold, a cryptographically verifiable Bharat PetroWork certificate is generated.
4. Certificate directly enhances the applicant's profile for BPW Technical Job placements.

---

## 11. Admin Module Structure
- Desktop Sidebar: Dashboard, Clients, Engineers, Pump Mitra, Jobs, Billing, Inventory, Reports, Communication, CMS, Settings, Audit Logs.
- Real-time KPI monitors: Active Requests, Emergency Alerts, Engineer Availability, Monthly Revenue, Low Stock warnings.
- One-click actions: Emergency Dispatch, Engineer Reassignment, Stock Replenishment, Invoice Generation.

---

## 12. File & Document Architecture
- Classified storage categories: Public (catalog images, brochures, banners) vs. Private (explosive licenses, calibration reports, customer signatures, invoices, job photos).
- Strict access token validation on private assets; direct public links forbidden for sensitive compliance artifacts.

---

## 13. Notification Architecture
- Events: Request Created, Emergency Raised, Engineer Dispatched, Work Started, Approval Required, Invoice Ready, Payment Completed, AMC Renewal Due.
- Channels: In-App notification badge, Automated Email Dispatch, Instant WhatsApp Business API payloads.

---

## 14. Payment Architecture
- Modular Gateway Adapter: Razorpay, UPI QR, NEFT/RTGS wire support.
- Status Lifecycle: `PENDING` → `INITIATED` → `SUCCESS` / `FAILED` / `CANCELLED` → `REFUNDED`.
- Cryptographic signature check on webhooks to prevent spoofed settlement.

---

## 15. Security Architecture
- Robust input sanitization and XSS protection.
- Strict parameter binding to eliminate SQL injection.
- Role-based authorization guard rails.
- Tamper-evident audit logging for all status transitions.

---

## 16. Deployment Architecture
- Node.js / Express backend bundled via `esbuild` to CommonJS (`dist/server.cjs`).
- Vite builds optimized React production bundle into `dist/`.
- Containerized execution on Cloud Run behind reverse proxy binding exclusively to host `0.0.0.0` and port `3000`.

---

## 17. Migration Strategy from Existing Software
- Extraction & schema normalization script for existing pump databases.
- De-duplication of customer RO records against official oil marketing company (OMC) codes.
- Backward-compatible API shim for legacy mobile apps during phased cutover.

---

## 18. Testing & Verification Strategy
- Automated type-checking with `tsc --noEmit`.
- Comprehensive API route integration tests.
- State-machine invariant assertions (e.g. no job completed without customer signature and parts verification).
- Responsive UI viewport testing on Mobile (375px), Tablet (768px), and Desktop (1280px+).
