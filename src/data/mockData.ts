import { CompanySettings, Customer, Vehicle, MasterContract, AuditLog } from '../types';

export const DEFAULT_LEGAL_CLAUSES: string[] = [
  "1. Vehicle Inspection: The Buyer confirms that the vehicle, including the Engine Number, Chassis Number, and all related documents, has been inspected and accepted before purchase.",
  "2. Payment: The Buyer agrees to pay the agreed purchase price. Any remaining balance shall be paid according to the agreed payment terms.",
  "3. Delivery: The Seller shall deliver the vehicle along with all available documents, keys, and accessories. Any pending items shall be recorded in this Agreement.",
  "4. Transfer of Ownership: The Buyer is responsible for completing the ownership transfer within the applicable legal period and complying with all transport regulations.",
  "5. Dealer Disclaimer: The Dealership acts only as a facilitator and witness to this transaction and shall not be liable for any claims after the vehicle has been delivered.",
  "6. Signatures & Acceptance: The Buyer and Seller confirm that all information provided is true and that they voluntarily accept all terms of this Agreement by signing below.",
  "7. Governing Law: This Agreement shall be governed by the laws of Pakistan, and any dispute shall be subject to the jurisdiction of the competent courts."
];

export const INITIAL_COMPANY_SETTINGS: CompanySettings = {
  companyName: "Naqeeb Motors & Property Advisor",
  tagline: "Trusted Name in Premium Automobile Dealership & Real Estate",
  logoUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&q=80",
  stampUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&q=80",
  ownerSignatureUrl: "https://images.unsplash.com/photo-1562240020-ce31ceb0e70d?w=200&q=80",
  address: "Plot 42, Main GT Road, Opposite DHA Phase 2 Gate, Islamabad / Rawalpindi",
  phonePrimary: "+92 300 5551234",
  phoneSecondary: "+92 351 8889900",
  email: "info@naqeebmotors.com",
  website: "www.naqeebmotors.com",
  ntn: "7482910-3",
  licenseNumber: "DLP-ISB-2024-9921",
  bankName: "Meezan Bank Limited",
  accountTitle: "Naqeeb Motors & Property Advisor",
  accountNumber: "01020304050607",
  iban: "PK36MEZN0001020304050607",
  branchCode: "0102",
  headerText: "NAQEEB MOTORS & PROPERTY ADVISOR — OFFICIAL MASTER VEHICLE SALE AGREEMENT",
  footerText: "Computer Generated Legal Contract. QR Code Verification Available. Valid Without Manual Alteration.",
  watermarkText: "NAQEEB MOTORS OFFICIAL",
  legalClauses: DEFAULT_LEGAL_CLAUSES
};

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_VEHICLES: Vehicle[] = [];

const getRelativeDate = (offsetDays: number) => new Date(Date.now() + offsetDays * 86400000).toISOString().split('T')[0];

export const INITIAL_CONTRACTS: MasterContract[] = [
  {
    id: 'contract-1',
    agreementNumber: 'NM-2026-1042',
    date: getRelativeDate(-30),
    status: 'Active',
    companyInfo: {
      companyName: INITIAL_COMPANY_SETTINGS.companyName,
      address: INITIAL_COMPANY_SETTINGS.address,
      phone: INITIAL_COMPANY_SETTINGS.phonePrimary,
      email: INITIAL_COMPANY_SETTINGS.email,
      ntn: INITIAL_COMPANY_SETTINGS.ntn,
      licenseNumber: INITIAL_COMPANY_SETTINGS.licenseNumber,
      logoUrl: INITIAL_COMPANY_SETTINGS.logoUrl
    },
    seller: {
      fullName: 'Naqeeb Motors Dealership',
      fatherName: 'Muhammad Naqeeb',
      cnic: '37405-9988771-1',
      phone: '+92 300 5551234',
      address: 'Plot 42, Main GT Road, Opposite DHA Phase 2 Gate, Islamabad'
    },
    buyer: {
      fullName: 'Chaudhry Tariq Mehmood',
      fatherName: 'Chaudhry Ghulam Rasool',
      cnic: '37405-1234567-1',
      phone: '+92 300 9876543',
      address: 'House 14-A, Street 9, F-7/2, Islamabad'
    },
    vehicle: {
      registrationNumber: 'LEG-24-9910',
      vin: 'MR0EX38J90048123',
      engineNumber: '1GD-8839210',
      chassisNumber: 'GUN125R-0048123',
      company: 'Toyota',
      make: 'Fortuner',
      model: 'Sigma 4 2.8 Diesel',
      variant: 'Automatic',
      year: 2024,
      color: 'Attitude Black Pearl',
      mileage: 12500,
      fuel: 'Diesel',
      transmission: 'Automatic',
      originalCard: true,
      smartCard: true,
      originalPlates: true,
      secondKey: true,
      transferLetter: true,
      accessories: 'Floor mats, Spare wheel, First aid kit',
      images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&q=80']
    },
    saleDetails: {
      salePrice: 18500000,
      discount: 0,
      netPrice: 18500000,
      advancePaid: 10000000,
      remainingBalance: 8500000,
      installmentsCount: 2,
      installmentAmount: 4250000,
      dueDate: getRelativeDate(-3), // 3 days overdue
      primaryPaymentMethod: 'Online Transfer',
      bankName: 'Meezan Bank Limited',
      accountTitle: 'Chaudhry Tariq Mehmood'
    },
    paymentHistory: [
      {
        id: 'pay-init-1',
        contractId: 'contract-1',
        agreementNumber: 'NM-2026-1042',
        date: getRelativeDate(-30),
        amount: 10000000,
        remainingBalanceAfter: 8500000,
        paymentMethod: 'Online Transfer',
        receivedBy: 'Naqeeb Motors Owner',
        receiptNumber: 'RCP-2026-1001',
        notes: 'Initial Advance Token Payment',
        status: 'Confirmed'
      }
    ],
    deliveryChecklist: {
      vehicleDelivered: true,
      originalCardDelivered: true,
      smartCardDelivered: true,
      originalPlatesDelivered: true,
      secondKeyDelivered: true,
      transferLetterDelivered: true,
      serviceBookDelivered: true,
      ownerManualDelivered: true,
      accessoriesDelivered: true,
      vehicleInspected: true,
      engineChecked: true,
      chassisChecked: true,
      vinVerified: true,
      mileageVerified: true,
      customerSatisfactionConfirmed: true
    },
    legalClauses: DEFAULT_LEGAL_CLAUSES,
    declarations: {
      buyerDeclaration: 'I Chaudhry Tariq Mehmood declare under oath that funds originate from legitimate sources.',
      sellerDeclaration: 'Naqeeb Motors confirms clear title and ownership of vehicle LEG-24-9910.',
      dealerDeclaration: 'Executed at Naqeeb Motors Islamabad Branch.',
      witnessDeclaration: 'Witnessed and verified.'
    },
    attachments: {
      vehiclePictureUrls: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&q=80'],
      transferDocUrls: [],
      otherDocs: []
    },
    signatures: {
      buyerSignature: 'Chaudhry Tariq',
      buyerSignedAt: getRelativeDate(-30),
      sellerSignature: 'Naqeeb Motors',
      sellerSignedAt: getRelativeDate(-30),
      witness1Signature: 'Malik Asad',
      witness1Name: 'Malik Asad',
      witness1Cnic: '37405-9988112-3',
      witness2Signature: 'Raja Imran',
      witness2Name: 'Raja Imran',
      witness2Cnic: '37405-7766554-1',
      dealerRepresentativeSignature: 'Dealer Manager',
      dealerRepresentativeName: 'Dealer Manager',
      companyStampUrl: INITIAL_COMPANY_SETTINGS.stampUrl,
      ownerSignatureUrl: INITIAL_COMPANY_SETTINGS.ownerSignatureUrl
    },
    qrVerification: {
      qrCodeDataUrl: '',
      verificationUrl: 'https://naqeebmotors.com/verify?agmt=NM-2026-1042',
      digitalHash: 'SHA256-8A91B74C992D81FE2211',
      verifiedCount: 4,
      lastVerifiedAt: getRelativeDate(-1)
    },
    createdAt: getRelativeDate(-30),
    updatedAt: getRelativeDate(-3),
    createdBy: 'Admin System'
  },
  {
    id: 'contract-2',
    agreementNumber: 'NM-2026-1038',
    date: getRelativeDate(-15),
    status: 'Active',
    companyInfo: {
      companyName: INITIAL_COMPANY_SETTINGS.companyName,
      address: INITIAL_COMPANY_SETTINGS.address,
      phone: INITIAL_COMPANY_SETTINGS.phonePrimary,
      email: INITIAL_COMPANY_SETTINGS.email,
      ntn: INITIAL_COMPANY_SETTINGS.ntn,
      licenseNumber: INITIAL_COMPANY_SETTINGS.licenseNumber,
      logoUrl: INITIAL_COMPANY_SETTINGS.logoUrl
    },
    seller: {
      fullName: 'Naqeeb Motors Dealership',
      fatherName: 'Muhammad Naqeeb',
      cnic: '37405-9988771-1',
      phone: '+92 300 5551234',
      address: 'Plot 42, Main GT Road, Islamabad'
    },
    buyer: {
      fullName: 'Malik Kamran Khan',
      fatherName: 'Malik Jahangir Khan',
      cnic: '38403-8822910-3',
      phone: '+92 321 4433221',
      address: 'House 88, Sector G-11/3, Islamabad'
    },
    vehicle: {
      registrationNumber: 'LEE-23-4401',
      vin: 'KNAFX8122M592011',
      engineNumber: 'G4FJ-2049182',
      chassisNumber: 'KNAFX8122M592011',
      company: 'Kia',
      make: 'Sportage',
      model: 'AWD 2.0',
      variant: 'Automatic',
      year: 2023,
      color: 'Clear White',
      mileage: 28000,
      fuel: 'Petrol',
      transmission: 'Automatic',
      originalCard: true,
      smartCard: true,
      originalPlates: true,
      secondKey: true,
      transferLetter: true,
      accessories: 'Floor mats, Spare wheel',
      images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&q=80']
    },
    saleDetails: {
      salePrice: 7800000,
      discount: 0,
      netPrice: 7800000,
      advancePaid: 4800000,
      remainingBalance: 3000000,
      installmentsCount: 2,
      installmentAmount: 1500000,
      dueDate: getRelativeDate(4), // Due in 4 days
      primaryPaymentMethod: 'Cash'
    },
    paymentHistory: [
      {
        id: 'pay-init-2',
        contractId: 'contract-2',
        agreementNumber: 'NM-2026-1038',
        date: getRelativeDate(-15),
        amount: 4800000,
        remainingBalanceAfter: 3000000,
        paymentMethod: 'Cash',
        receivedBy: 'Naqeeb Motors Owner',
        receiptNumber: 'RCP-2026-1002',
        notes: 'Initial Advance Token Payment',
        status: 'Confirmed'
      }
    ],
    deliveryChecklist: {
      vehicleDelivered: true,
      originalCardDelivered: true,
      smartCardDelivered: true,
      originalPlatesDelivered: true,
      secondKeyDelivered: true,
      transferLetterDelivered: true,
      serviceBookDelivered: true,
      ownerManualDelivered: true,
      accessoriesDelivered: true,
      vehicleInspected: true,
      engineChecked: true,
      chassisChecked: true,
      vinVerified: true,
      mileageVerified: true,
      customerSatisfactionConfirmed: true
    },
    legalClauses: DEFAULT_LEGAL_CLAUSES,
    declarations: {
      buyerDeclaration: 'I Malik Kamran Khan declare under oath that funds originate from legitimate sources.',
      sellerDeclaration: 'Naqeeb Motors confirms clear title.',
      dealerDeclaration: 'Executed at Naqeeb Motors Islamabad Branch.',
      witnessDeclaration: 'Witnessed and verified.'
    },
    attachments: {
      vehiclePictureUrls: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&q=80'],
      transferDocUrls: [],
      otherDocs: []
    },
    signatures: {
      buyerSignature: 'Malik Kamran',
      buyerSignedAt: getRelativeDate(-15),
      sellerSignature: 'Naqeeb Motors',
      sellerSignedAt: getRelativeDate(-15),
      witness1Signature: 'Zahid Khan',
      witness1Name: 'Zahid Khan',
      witness1Cnic: '38403-1122334-5',
      witness2Signature: 'Usman Ali',
      witness2Name: 'Usman Ali',
      witness2Cnic: '38403-5566778-9',
      dealerRepresentativeSignature: 'Dealer Manager',
      dealerRepresentativeName: 'Dealer Manager',
      companyStampUrl: INITIAL_COMPANY_SETTINGS.stampUrl,
      ownerSignatureUrl: INITIAL_COMPANY_SETTINGS.ownerSignatureUrl
    },
    qrVerification: {
      qrCodeDataUrl: '',
      verificationUrl: 'https://naqeebmotors.com/verify?agmt=NM-2026-1038',
      digitalHash: 'SHA256-11C2382D019AA7741001',
      verifiedCount: 2,
      lastVerifiedAt: getRelativeDate(-5)
    },
    createdAt: getRelativeDate(-15),
    updatedAt: getRelativeDate(-15),
    createdBy: 'Admin System'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

