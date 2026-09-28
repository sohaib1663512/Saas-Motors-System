export type VehicleStatus = 'Available' | 'Reserved' | 'Sold' | 'Transferred' | 'Maintenance';

export type PaymentMethod = 'Cash' | 'Cheque' | 'Online Transfer' | 'Bank Draft' | 'Pay Order';

export type UserRole = 'Owner' | 'Manager' | 'Sales Executive' | 'Accountant' | 'Receptionist' | 'Viewer';

export interface CompanySettings {
  companyName: string;
  tagline: string;
  logoUrl: string;
  stampUrl: string;
  ownerSignatureUrl: string;
  address: string;
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  website: string;
  ntn: string;
  licenseNumber: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  branchCode: string;
  headerText: string;
  footerText: string;
  watermarkText: string;
  legalClauses: string[];
}

export interface Customer {
  id: string;
  fullName: string;
  fatherName: string;
  cnic: string;
  phone: string;
  address: string;
  cnicFrontUrl?: string;
  cnicBackUrl?: string;
  photoUrl?: string;
  notes?: string;
  createdAt: string;
  riskRating?: 'Low' | 'Medium' | 'High';
  totalPurchases: number;
  pendingBalance: number;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  vin: string;
  engineNumber: string;
  chassisNumber: string;
  company: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  color: string;
  mileage: number;
  fuel: 'Petrol' | 'Diesel' | 'Hybrid' | 'EV' | 'LPG';
  transmission: 'Automatic' | 'Manual';
  price: number;
  status: VehicleStatus;
  originalCard: boolean;
  smartCard: boolean;
  originalPlates: boolean;
  secondKey: boolean;
  transferLetter: boolean;
  accessories: string;
  images: string[];
  history: { date: string; note: string; user: string }[];
}

export interface PaymentRecord {
  id: string;
  contractId: string;
  agreementNumber: string;
  date: string;
  amount: number;
  remainingBalanceAfter: number;
  paymentMethod: PaymentMethod;
  chequeDetails?: string;
  bankDetails?: string;
  onlineTransferRef?: string;
  receivedBy: string;
  receiptNumber: string;
  notes?: string;
  status: 'Confirmed' | 'Pending Verification';
}

export interface VehicleDeliveryChecklist {
  vehicleDelivered: boolean;
  originalCardDelivered: boolean;
  smartCardDelivered: boolean;
  originalPlatesDelivered: boolean;
  secondKeyDelivered: boolean;
  transferLetterDelivered: boolean;
  serviceBookDelivered: boolean;
  ownerManualDelivered: boolean;
  accessoriesDelivered: boolean;
  vehicleInspected: boolean;
  engineChecked: boolean;
  chassisChecked: boolean;
  vinVerified: boolean;
  mileageVerified: boolean;
  customerSatisfactionConfirmed: boolean;
}

export interface DigitalSignatures {
  buyerSignature: string; // Base64 or SVG data string
  buyerSignedAt?: string;
  sellerSignature: string;
  sellerSignedAt?: string;
  witness1Signature: string;
  witness1Name?: string;
  witness1Cnic?: string;
  witness2Signature: string;
  witness2Name?: string;
  witness2Cnic?: string;
  dealerRepresentativeSignature: string;
  dealerRepresentativeName?: string;
  thumbImpression?: string;
  companyStampUrl: string;
  ownerSignatureUrl: string;
}

export interface MasterContract {
  id: string;
  agreementNumber: string; // e.g. NM-2026-1042
  date: string;
  status: 'Draft' | 'Active' | 'Completed' | 'Cancelled' | 'Disputed';
  
  // Section 1: Company Info Snapshot
  companyInfo: {
    companyName: string;
    address: string;
    phone: string;
    email: string;
    ntn: string;
    licenseNumber: string;
    logoUrl: string;
  };

  // Section 2: Seller Info
  seller: {
    fullName: string;
    fatherName: string;
    cnic: string;
    phone: string;
    address: string;
    cnicFrontUrl?: string;
    cnicBackUrl?: string;
    photoUrl?: string;
  };

  // Section 3: Buyer Info
  buyer: {
    customerId?: string;
    fullName: string;
    fatherName: string;
    cnic: string;
    phone: string;
    address: string;
    cnicFrontUrl?: string;
    cnicBackUrl?: string;
    photoUrl?: string;
  };

  // Section 4: Vehicle Info
  vehicle: {
    vehicleId?: string;
    registrationNumber: string;
    vin: string;
    engineNumber: string;
    chassisNumber: string;
    company: string;
    make: string;
    model: string;
    variant: string;
    year: number;
    color: string;
    mileage: number;
    fuel: string;
    transmission: string;
    originalCard: boolean;
    smartCard: boolean;
    originalPlates: boolean;
    secondKey: boolean;
    transferLetter: boolean;
    accessories: string;
    images: string[];
  };

  // Section 5: Sale Information
  saleDetails: {
    salePrice: number;
    discount: number;
    netPrice: number;
    advancePaid: number;
    remainingBalance: number;
    installmentsCount: number;
    installmentAmount: number;
    dueDate: string;
    primaryPaymentMethod: PaymentMethod;
    chequeNumber?: string;
    bankName?: string;
    accountTitle?: string;
  };

  // Section 6: Payment History Timeline
  paymentHistory: PaymentRecord[];

  // Section 7: Vehicle Delivery Checklist
  deliveryChecklist: VehicleDeliveryChecklist;

  // Section 8: Legal Terms & Conditions (Master Terms)
  legalClauses: string[];

  // Section 9: Declarations
  declarations: {
    buyerDeclaration: string;
    sellerDeclaration: string;
    dealerDeclaration: string;
    witnessDeclaration: string;
  };

  // Section 10: Attachments
  attachments: {
    cnicFrontUrl?: string;
    cnicBackUrl?: string;
    vehiclePictureUrls: string[];
    transferDocUrls: string[];
    otherDocs: { title: string; url: string }[];
  };

  // Section 11: Digital Signatures
  signatures: DigitalSignatures;

  // Section 12: QR Verification
  qrVerification: {
    qrCodeDataUrl: string;
    verificationUrl: string;
    digitalHash: string; // SHA-256 fingerprint simulation
    verifiedCount: number;
    lastVerifiedAt?: string;
  };

  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  details: string;
  targetId?: string;
}
