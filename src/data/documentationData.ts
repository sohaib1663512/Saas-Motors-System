export const ARCHITECTURE_DOCUMENTATION = {
  title: "Naqeeb Motors Dealership ERP — Enterprise Software Architecture Specification (SRS)",
  author: "Senior Software Architect & Enterprise ERP Lead (20+ Years Automobile Experience)",
  version: "v4.2.0-PROD",
  date: "2026-08-07",
  
  businessAnalysis: `
### Executive Summary & Business Transformation
Naqeeb Motors & Property Advisor is transitioning from a legacy paper-based dealership operation to a 100% digital, paperless Enterprise Resource Planning (ERP) platform.

#### Key Objectives Solved:
1. **Single Data Entry Point**: Customer, seller, and vehicle parameters are entered exactly ONCE into the system.
2. **Unified Master Vehicle Sale Agreement**: Replaces fragmented separate forms (receipts, delivery slips, affidavits, declarations) with ONE master legally binding agreement containing all 12 unified operational sections.
3. **Legal Validity under ETO 2002**: Utilizes cryptographic digital signatures, SHA-256 hash checksums, and QR verification codes to guarantee non-repudiation in court.
4. **Auditability & Fraud Elimination**: Immutable activity logs, duplicate CNIC detection, and real-time payment reconciliation.
`,

  signatureComparison: [
    {
      technology: "Tablet / iPad Stylus & Finger Signature",
      hardwareReq: "iPad Pro / Android Tablet + Capacitive Stylus / Apple Pencil",
      costScore: "Medium ($200 - $600 per counter)",
      legalValidity: "HIGH — Captures smooth vector curves, speed, stroke pressure, and device telemetry.",
      userExperience: "EXCELLENT — Familiar physical signature experience for customers.",
      pros: "No extra driver installation required; works seamlessly on web HTML5 canvas touch events.",
      cons: "Requires modern tablet hardware at reception/sales desks.",
      recommendation: "TOP RECOMMENDATION (PRIMARY) — Best balance of user comfort and legal enforceability."
    },
    {
      technology: "Dedicated USB Digital Signature Pad",
      hardwareReq: "Topaz Systems / Wacom Signotec USB Pad",
      costScore: "High ($300 - $800 per unit)",
      legalValidity: "VERY HIGH — Forensic pen stroke data embedded in vector XML.",
      userExperience: "GOOD — Feels like signing credit card terminal at bank.",
      pros: "Extremely durable, built for 1,000,000+ signatures.",
      cons: "Requires native browser USB driver plugins (WebUSB API or local background agent service).",
      recommendation: "RECOMMENDED FOR HIGH-VOLUME BRANCHES — Ideal for desktop workstation sales desks."
    },
    {
      technology: "Biometric Fingerprint Scanner",
      hardwareReq: "NADRA-compliant Optical / Capacitive Fingerprint Reader (e.g. SecuGen, DigitalPersona)",
      costScore: "Low-Medium ($80 - $250)",
      legalValidity: "MAXIMUM (LEGAL GOLD STANDARD IN PAKISTAN) — Matches CNIC biometric thumbprint records.",
      userExperience: "EXCELLENT — Quick thumb scan.",
      pros: "Undeniable biometric proof of physical presence.",
      cons: "Needs NADRA / local SDK bridge for live CNIC verification.",
      recommendation: "HYBRID INTEGRATION — Store thumb impression graphic in Section 11 along with digital signature."
    },
    {
      technology: "Mouse / Desktop Trackpad Signature",
      hardwareReq: "Standard Desktop PC + Mouse / Trackpad",
      costScore: "Zero ($0)",
      legalValidity: "MODERATE — Legally admissible but harder to defend forensically than touch/stylus.",
      userExperience: "POOR — Awkward to draw smooth name using mouse.",
      pros: "Works on any desktop browser immediately without hardware purchase.",
      cons: "Rough visual appearance.",
      recommendation: "FALLBACK ONLY — Use when tablet is unavailable."
    }
  ],

  signatureStorageArchitecture: `
### Recommended Signature Storage Architecture
1. **Format**: Rendered on HTML5 Canvas using Bezier smoothing algorithm, exported as high-resolution **Base64 PNG Data URLs** and raw **SVG Path vectors**.
2. **Storage Strategy**:
   - **Primary**: Stored in Cloud Storage (AWS S3 / Cloudinary) with encrypted CDN URLs.
   - **Database**: Cryptographic SHA-256 hash of signature stored in MongoDB Atlas 'contracts.signatures' object.
3. **Immutability & Fraud Prevention**:
   - Once a contract is marked 'Active' or 'Completed', signature fields become write-locked.
   - Any attempt to alter signature payload invalidates the Contract Digital Hash ('digitalHash').
`,

  mongoDbSchemas: `
// =================================================================
// MONGODB ATLAS COLLECTION SCHEMAS FOR NAQEEB MOTORS ERP
// =================================================================

// 1. COLLECTION: company_settings
{
  "_id": ObjectId("..."),
  "companyName": "Naqeeb Motors & Property Advisor",
  "ntn": "7482910-3",
  "licenseNumber": "DLP-ISB-2024-9921",
  "logoUrl": "https://...",
  "stampUrl": "https://...",
  "ownerSignatureUrl": "https://...",
  "bankDetails": {
    "bankName": "Meezan Bank Limited",
    "accountTitle": "Naqeeb Motors & Property Advisor",
    "iban": "PK36MEZN0001020304050607"
  },
  "legalClauses": [ ...30 clauses... ],
  "updatedAt": ISODate("2026-08-07T09:00:00Z")
}

// 2. COLLECTION: customers
{
  "_id": ObjectId("..."),
  "fullName": "Chaudhry Tariq Mehmood",
  "cnic": "37405-1234567-1",
  "phone": "+923009876543",
  "address": "House 14, F-7/2, Islamabad",
  "cnicFrontUrl": "https://...",
  "cnicBackUrl": "https://...",
  "photoUrl": "https://...",
  "riskRating": "Low",
  "totalPurchases": 2,
  "pendingBalance": 4500000,
  "createdAt": ISODate("2026-01-15T10:00:00Z")
}
// INDEX: { "cnic": 1 } (UNIQUE), { "phone": 1 }, { "fullName": "text" }

// 3. COLLECTION: vehicles
{
  "_id": ObjectId("..."),
  "registrationNumber": "ICT-LEG-009",
  "vin": "JTEBH71J800192837",
  "engineNumber": "1GD-0928174",
  "chassisNumber": "GDJ150-004928",
  "company": "Toyota",
  "make": "Land Cruiser Prado",
  "model": "TX-L Package",
  "year": 2023,
  "status": "Reserved", // Available | Reserved | Sold | Transferred
  "price": 38500000,
  "documentsStatus": {
    "originalCard": true,
    "smartCard": true,
    "originalPlates": true,
    "transferLetter": true
  },
  "images": ["https://..."]
}
// INDEX: { "vin": 1 } (UNIQUE), { "registrationNumber": 1 }, { "status": 1 }

// 4. COLLECTION: master_contracts
{
  "_id": ObjectId("..."),
  "agreementNumber": "NM-2026-1042",
  "status": "Active",
  "date": ISODate("2026-03-02Z"),
  "seller": { ... },
  "buyer": { ... },
  "vehicle": { ... },
  "saleDetails": {
    "salePrice": 38500000,
    "discount": 500000,
    "netPrice": 38000000,
    "advancePaid": 33500000,
    "remainingBalance": 4500000,
    "dueDate": ISODate("2026-04-15Z")
  },
  "paymentHistory": [ ... ],
  "deliveryChecklist": { ... 15 items ... },
  "legalClauses": [ ... 30 clauses ... ],
  "signatures": {
    "buyerSignature": "data:image/svg+xml;...",
    "sellerSignature": "data:image/svg+xml;...",
    "witness1Signature": "...",
    "witness2Signature": "...",
    "dealerRepresentativeSignature": "...",
    "companyStampUrl": "...",
    "ownerSignatureUrl": "..."
  },
  "qrVerification": {
    "verificationUrl": "https://naqeebmotors.com/verify/NM-2026-1042",
    "digitalHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
}
// INDEX: { "agreementNumber": 1 } (UNIQUE), { "buyer.cnic": 1 }, { "vehicle.vin": 1 }
`,

  apiDocumentation: [
    { method: "POST", route: "/api/contracts", desc: "Creates a new Master Vehicle Sale Agreement with auto-generated agreement number & QR hash." },
    { method: "GET", route: "/api/contracts/:agreementNo", desc: "Fetches full contract details including all 12 sections." },
    { method: "POST", route: "/api/payments", desc: "Records new payment against a contract, recalculates balance, & updates customer ledger." },
    { method: "GET", route: "/api/verify/:agreementNo", desc: "Public verification endpoint returning QR validity, cryptographic signature match, & summary." },
    { method: "POST", route: "/api/ai/analyze-contract", desc: "Gemini AI check for missing CNIC scans, unverified chassis, or default risk calculation." },
    { method: "POST", route: "/api/ai/estimate-price", desc: "Gemini AI market valuation engine for trade-in / selling vehicle prices." }
  ],

  developmentRoadmap: [
    { phase: "Phase 1: Workflow & Master Contract Digital Engine", duration: "Weeks 1-3", status: "COMPLETED" },
    { phase: "Phase 2: Digital Signatures & QR Cryptographic Verification", duration: "Weeks 4-5", status: "COMPLETED" },
    { phase: "Phase 3: Customer, Vehicle Inventory & Payment Ledgers", duration: "Weeks 6-8", status: "COMPLETED" },
    { phase: "Phase 4: Gemini AI Audits & WhatsApp Integration", duration: "Weeks 9-10", status: "COMPLETED" },
    { phase: "Phase 5: Multi-Branch Cloud Deployment & NADRA Biometric Bridge", duration: "Weeks 11-12", status: "READY FOR DEPLOYMENT" }
  ]
};
