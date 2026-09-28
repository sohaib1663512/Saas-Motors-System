import React, { useState } from 'react';
import { 
  FileText, 
  User, 
  Car, 
  DollarSign, 
  CheckSquare, 
  ShieldCheck, 
  Tablet, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Plus, 
  X,
  Upload,
  AlertCircle,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  FileCode2,
  Image as ImageIcon
} from 'lucide-react';
import { MasterContract, Vehicle, Customer, CompanySettings, DigitalSignatures } from '../types';
import { SignaturePadModal } from './SignaturePadModal';
import { DEFAULT_LEGAL_CLAUSES } from '../data/mockData';

interface ContractWizardProps {
  vehicles: Vehicle[];
  customers: Customer[];
  settings: CompanySettings;
  onSaveContract: (newContract: MasterContract) => void;
  onCancel: () => void;
}

export const ContractWizard: React.FC<ContractWizardProps> = ({
  vehicles,
  customers,
  settings,
  onSaveContract,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [agreementNumber] = useState<string>(`NM-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [contractDate, setContractDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Seller Details
  const [sellerFullName, setSellerFullName] = useState('Sardar Aurangzeb Khan');
  const [sellerFatherName, setSellerFatherName] = useState('Sardar Sher Baz Khan');
  const [sellerCnic, setSellerCnic] = useState('37402-9988776-5');
  const [sellerPhone, setSellerPhone] = useState('+92 312 5556677');
  const [sellerAddress, setSellerAddress] = useState('House 99, Sector F-6/1, Islamabad');

  // Buyer Details
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [buyerFullName, setBuyerFullName] = useState('');
  const [buyerFatherName, setBuyerFatherName] = useState('');
  const [buyerCnic, setBuyerCnic] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');

  // Vehicle Details
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [vehRegNo, setVehRegNo] = useState('');
  const [vehVin, setVehVin] = useState('');
  const [vehEngine, setVehEngine] = useState('');
  const [vehChassis, setVehChassis] = useState('');
  const [vehCompany, setVehCompany] = useState('Toyota');
  const [vehMake, setVehMake] = useState('Fortuner');
  const [vehModel, setVehModel] = useState('Sigma 4');
  const [vehVariant, setVehVariant] = useState('2.8L');
  const [vehYear, setVehYear] = useState(2024);
  const [vehColor, setVehColor] = useState('Attitude Black');
  const [vehMileage, setVehMileage] = useState(12000);
  const [vehFuel, setVehFuel] = useState('Petrol');
  const [vehTransmission, setVehTransmission] = useState('Automatic');
  const [vehOrigCard, setVehOrigCard] = useState(true);
  const [vehSmartCard, setVehSmartCard] = useState(true);
  const [vehOrigPlates, setVehOrigPlates] = useState(true);
  const [vehSecondKey, setVehSecondKey] = useState(true);
  const [vehTransferLetter, setVehTransferLetter] = useState(true);
  const [vehAccessories, setVehAccessories] = useState('Factory Standard, Floor Mats, Rear Spoiler');

  // Financials
  const [salePrice, setSalePrice] = useState<number>(18500000);
  const [discount, setDiscount] = useState<number>(200000);
  const [advancePaid, setAdvancePaid] = useState<number>(15000000);
  const [installmentsCount, setInstallmentsCount] = useState<number>(2);
  const [dueDate, setDueDate] = useState<string>('2026-05-01');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Cheque' | 'Online Transfer' | 'Bank Draft'>('Online Transfer');

  // Delivery Checklist
  const [checklist, setChecklist] = useState({
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
  });

  // Active Agreement Legal Clauses (Default to settings, full CRUD editable)
  const [activeClauses, setActiveClauses] = useState<string[]>([...settings.legalClauses]);

  // Signatures
  const [buyerSignature, setBuyerSignature] = useState("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='50'><path d='M10 30 Q 30 10, 50 35 T 90 20 T 130 40' stroke='%230f172a' stroke-width='2' fill='none'/></svg>");
  const [sellerSignature, setSellerSignature] = useState("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='50'><path d='M10 25 Q 40 40, 70 15 T 120 30' stroke='%230f172a' stroke-width='2' fill='none'/></svg>");
  const [witness1Signature, setWitness1Signature] = useState("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='50'><path d='M15 35 Q 45 10, 80 25 T 130 20' stroke='%230f172a' stroke-width='2' fill='none'/></svg>");
  const [witness2Signature, setWitness2Signature] = useState("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='50'><path d='M20 20 Q 50 40, 90 10 T 130 35' stroke='%230f172a' stroke-width='2' fill='none'/></svg>");
  const [dealerRepSignature] = useState("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='50'><path d='M10 20 Q 40 10, 80 30 T 140 15' stroke='%230f172a' stroke-width='2.5' fill='none'/></svg>");

  // Active Signature Pad Modal
  const [activeSigModal, setActiveSigModal] = useState<{ open: boolean; type: string; title: string; role: string; defaultMode?: 'draw' | 'upload' }>({
    open: false,
    type: '',
    title: '',
    role: '',
    defaultMode: 'draw'
  });

  // Clause CRUD Handlers
  const handleAddClause = () => {
    const nextNum = activeClauses.length + 1;
    const newClause = `${nextNum}. SPECIAL CLAUSE: Enter specific custom agreement condition details here.`;
    setActiveClauses([...activeClauses, newClause]);
  };

  const handleDeleteClause = (index: number) => {
    setActiveClauses(activeClauses.filter((_, i) => i !== index));
  };

  const handleClauseChange = (index: number, val: string) => {
    const updated = [...activeClauses];
    updated[index] = val;
    setActiveClauses(updated);
  };

  const handleMoveClause = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeClauses.length) return;
    const updated = [...activeClauses];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setActiveClauses(updated);
  };

  const handleResetClauses = () => {
    if (window.confirm("Reset contract clauses to dealership default master clauses?")) {
      setActiveClauses([...settings.legalClauses]);
    }
  };

  // Direct File Signature Upload
  const handleDirectSigUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setter(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Existing Customer Select
  const handleSelectCustomer = (cust: Customer) => {
    setSelectedCustomerId(cust.id);
    setBuyerFullName(cust.fullName);
    setBuyerFatherName(cust.fatherName);
    setBuyerCnic(cust.cnic);
    setBuyerPhone(cust.phone);
    setBuyerAddress(cust.address);
  };

  // Handle Existing Vehicle Select
  const handleSelectVehicle = (v: Vehicle) => {
    setSelectedVehicleId(v.id);
    setVehRegNo(v.registrationNumber);
    setVehVin(v.vin);
    setVehEngine(v.engineNumber);
    setVehChassis(v.chassisNumber);
    setVehCompany(v.company);
    setVehMake(v.make);
    setVehModel(v.model);
    setVehVariant(v.variant);
    setVehYear(v.year);
    setVehColor(v.color);
    setVehMileage(v.mileage);
    setVehFuel(v.fuel);
    setVehTransmission(v.transmission);
    setVehOrigCard(v.originalCard);
    setVehSmartCard(v.smartCard);
    setVehOrigPlates(v.originalPlates);
    setVehSecondKey(v.secondKey);
    setVehTransferLetter(v.transferLetter);
    setVehAccessories(v.accessories);
    setSalePrice(v.price);
  };

  const netPrice = Math.max(0, salePrice - discount);
  const remainingBalance = Math.max(0, netPrice - advancePaid);
  const installmentAmount = installmentsCount > 0 ? Math.round(remainingBalance / installmentsCount) : 0;

  const handleFinishContract = () => {
    const newContract: MasterContract = {
      id: `contract-${Date.now()}`,
      agreementNumber,
      date: contractDate,
      status: 'Active',
      companyInfo: {
        companyName: settings.companyName,
        address: settings.address,
        phone: settings.phonePrimary,
        email: settings.email,
        ntn: settings.ntn,
        licenseNumber: settings.licenseNumber,
        logoUrl: settings.logoUrl
      },
      seller: {
        fullName: sellerFullName,
        fatherName: sellerFatherName,
        cnic: sellerCnic,
        phone: sellerPhone,
        address: sellerAddress,
        cnicFrontUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
        cnicBackUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80"
      },
      buyer: {
        customerId: selectedCustomerId,
        fullName: buyerFullName || 'Custom Buyer',
        fatherName: buyerFatherName || 'Father Name',
        cnic: buyerCnic || '37405-0000000-0',
        phone: buyerPhone || '+92 300 0000000',
        address: buyerAddress || 'Islamabad, Pakistan',
        cnicFrontUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
        cnicBackUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80"
      },
      vehicle: {
        vehicleId: selectedVehicleId,
        registrationNumber: vehRegNo || 'ICT-NEW-001',
        vin: vehVin || 'JTEBH100029318',
        engineNumber: vehEngine || '1GD-992019',
        chassisNumber: vehChassis || 'GDJ150-10293',
        company: vehCompany,
        make: vehMake,
        model: vehModel,
        variant: vehVariant,
        year: Number(vehYear),
        color: vehColor,
        mileage: Number(vehMileage),
        fuel: vehFuel,
        transmission: vehTransmission,
        originalCard: vehOrigCard,
        smartCard: vehSmartCard,
        originalPlates: vehOrigPlates,
        secondKey: vehSecondKey,
        transferLetter: vehTransferLetter,
        accessories: vehAccessories,
        images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80"]
      },
      saleDetails: {
        salePrice,
        discount,
        netPrice,
        advancePaid,
        remainingBalance,
        installmentsCount,
        installmentAmount,
        dueDate,
        primaryPaymentMethod: paymentMethod,
        bankName: settings.bankName,
        accountTitle: settings.accountTitle
      },
      paymentHistory: [
        {
          id: `pay-${Date.now()}`,
          contractId: `contract-${Date.now()}`,
          agreementNumber,
          date: contractDate,
          amount: advancePaid,
          remainingBalanceAfter: remainingBalance,
          paymentMethod,
          receivedBy: 'Naqeeb Motors Reception',
          receiptNumber: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'Confirmed'
        }
      ],
      deliveryChecklist: checklist,
      legalClauses: activeClauses,
      declarations: {
        buyerDeclaration: `I, ${buyerFullName || 'Buyer'}, confirm purchasing vehicle ${vehCompany} ${vehMake} (${vehRegNo}) under Master Agreement ${agreementNumber}.`,
        sellerDeclaration: `I, ${sellerFullName}, confirm handing over possession and transfer letter of ${vehCompany} ${vehMake}.`,
        dealerDeclaration: `Naqeeb Motors verifies this digital agreement with verified CNIC & digital signatures.`,
        witnessDeclaration: `Executed voluntarily in our presence.`
      },
      attachments: {
        cnicFrontUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
        cnicBackUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
        vehiclePictureUrls: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80"],
        transferDocUrls: [],
        otherDocs: []
      },
      signatures: {
        buyerSignature,
        buyerSignedAt: `${contractDate} 15:30:00`,
        sellerSignature,
        sellerSignedAt: `${contractDate} 15:35:00`,
        witness1Signature,
        witness1Name: 'Witness 1',
        witness2Signature,
        witness2Name: 'Witness 2',
        dealerRepresentativeSignature: dealerRepSignature,
        dealerRepresentativeName: 'Naqeeb Ullah Khan',
        companyStampUrl: settings.stampUrl,
        ownerSignatureUrl: settings.ownerSignatureUrl
      },
      qrVerification: {
        qrCodeDataUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fnaqeebmotors.com%2Fverify%2F${agreementNumber}`,
        verificationUrl: `https://naqeebmotors.com/verify/${agreementNumber}`,
        digitalHash: `hash-${Math.random().toString(36).substring(2, 15)}`,
        verifiedCount: 1
      },
      createdAt: `${contractDate} 15:30:00`,
      updatedAt: `${contractDate} 15:30:00`,
      createdBy: 'Sales Manager'
    };

    onSaveContract(newContract);
  };

  const steps = [
    { num: 1, title: 'Buyer & Seller', icon: User },
    { num: 2, title: 'Vehicle Specs', icon: Car },
    { num: 3, title: 'Financial Terms', icon: DollarSign },
    { num: 4, title: 'Checklist & Clauses', icon: CheckSquare },
    { num: 5, title: 'Digital Signatures', icon: Tablet }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Wizard Header */}
      <div className="bg-gradient-to-r from-emerald-50 via-sky-50 to-emerald-50 rounded-2xl p-6 text-slate-900 border border-sky-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-mono text-xs font-bold mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            UNIFIED MASTER VEHICLE SALE AGREEMENT GENERATOR
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">New Agreement — {agreementNumber}</h2>
          <p className="text-xs text-slate-600 font-medium">Data entered ONCE automatically compiles into Section 1 through Section 12.</p>
        </div>

        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition-colors cursor-pointer"
        >
          Cancel & Exit
        </button>
      </div>

      {/* Stepper Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num;

          return (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`p-3 rounded-xl border text-left transition-all flex items-center space-x-2.5 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : isDone
                  ? 'bg-sky-50 text-sky-800 border-sky-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                isActive ? 'bg-white/20 text-white' : isDone ? 'bg-sky-200 text-sky-900' : 'bg-slate-100 text-slate-700'
              }`}>
                {s.num}
              </div>
              <div className="truncate">
                <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Step {s.num}</p>
                <p className="text-xs font-bold truncate">{s.title}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ================= STEP 1: BUYER & SELLER ================= */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Party Information (Enter Once)
            </h3>
            <span className="text-xs text-slate-400">Step 1 of 5</span>
          </div>

          {/* Quick Select Existing Customer */}
          {customers.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Optionally Pick Registered Customer:
              </label>
              <div className="flex flex-wrap gap-2">
                {customers.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCustomer(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selectedCustomerId === c.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {c.fullName} ({c.cnic})
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buyer Form */}
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-extrabold uppercase text-indigo-900 tracking-wider">
                BUYER DETAILS (SECTION 3)
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={buyerFullName}
                    onChange={(e) => setBuyerFullName(e.target.value)}
                    placeholder="e.g. Chaudhry Tariq Mehmood"
                    className="w-full bg-white p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Father / Husband Name *</label>
                  <input
                    type="text"
                    value={buyerFatherName}
                    onChange={(e) => setBuyerFatherName(e.target.value)}
                    placeholder="e.g. Muhammad Aslam"
                    className="w-full bg-white p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">CNIC Number *</label>
                  <input
                    type="text"
                    value={buyerCnic}
                    onChange={(e) => setBuyerCnic(e.target.value)}
                    placeholder="e.g. 37405-1234567-1"
                    className="w-full bg-white p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="e.g. +92 300 9876543"
                    className="w-full bg-white p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Address *</label>
                  <textarea
                    value={buyerAddress}
                    onChange={(e) => setBuyerAddress(e.target.value)}
                    rows={2}
                    placeholder="Complete residential address"
                    className="w-full bg-white p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Seller Form */}
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-extrabold uppercase text-slate-900 tracking-wider">
                SELLER DETAILS (SECTION 2)
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={sellerFullName}
                    onChange={(e) => setSellerFullName(e.target.value)}
                    className="w-full bg-white p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Father Name *</label>
                  <input
                    type="text"
                    value={sellerFatherName}
                    onChange={(e) => setSellerFatherName(e.target.value)}
                    className="w-full bg-white p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">CNIC Number *</label>
                  <input
                    type="text"
                    value={sellerCnic}
                    onChange={(e) => setSellerCnic(e.target.value)}
                    className="w-full bg-white p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    className="w-full bg-white p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Address *</label>
                  <textarea
                    value={sellerAddress}
                    onChange={(e) => setSellerAddress(e.target.value)}
                    rows={2}
                    className="w-full bg-white p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 2: VEHICLE SPECS ================= */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Car className="w-4 h-4 text-indigo-600" />
              Vehicle Specifications & Document Checklist (Section 4)
            </h3>
            <span className="text-xs text-slate-400">Step 2 of 5</span>
          </div>

          {/* Quick Select Inventory */}
          {vehicles.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Pick Vehicle from Available Showroom Stock:
              </label>
              <div className="flex flex-wrap gap-2">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleSelectVehicle(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selectedVehicleId === v.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {v.company} {v.make} ({v.registrationNumber}) — PKR {(v.price / 100000).toFixed(1)} Lakh
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Registration # *</label>
              <input
                type="text"
                value={vehRegNo}
                onChange={(e) => setVehRegNo(e.target.value)}
                placeholder="e.g. ICT-LEG-009"
                className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300 font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Chassis Number *</label>
              <input
                type="text"
                value={vehChassis}
                onChange={(e) => setVehChassis(e.target.value)}
                placeholder="e.g. GDJ150-004928"
                className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300 font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Engine Number *</label>
              <input
                type="text"
                value={vehEngine}
                onChange={(e) => setVehEngine(e.target.value)}
                placeholder="e.g. 1GD-0928174"
                className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300 font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Company / Brand *</label>
              <input
                type="text"
                value={vehCompany}
                onChange={(e) => setVehCompany(e.target.value)}
                placeholder="e.g. Toyota"
                className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Make / Model *</label>
              <input
                type="text"
                value={vehMake}
                onChange={(e) => setVehMake(e.target.value)}
                placeholder="e.g. Prado"
                className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Variant *</label>
              <input
                type="text"
                value={vehVariant}
                onChange={(e) => setVehVariant(e.target.value)}
                placeholder="e.g. TX-L 2.8L"
                className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Model Year *</label>
              <input
                type="number"
                value={vehYear}
                onChange={(e) => setVehYear(Number(e.target.value))}
                className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Color *</label>
              <input
                type="text"
                value={vehColor}
                onChange={(e) => setVehColor(e.target.value)}
                className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Mileage (KM) *</label>
              <input
                type="number"
                value={vehMileage}
                onChange={(e) => setVehMileage(Number(e.target.value))}
                className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 block mb-2">Original Documents Handover Checkboxes:</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <label className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer">
                <input type="checkbox" checked={vehOrigCard} onChange={(e) => setVehOrigCard(e.target.checked)} />
                <span>Original Card</span>
              </label>
              <label className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer">
                <input type="checkbox" checked={vehSmartCard} onChange={(e) => setVehSmartCard(e.target.checked)} />
                <span>Smart Card</span>
              </label>
              <label className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer">
                <input type="checkbox" checked={vehOrigPlates} onChange={(e) => setVehOrigPlates(e.target.checked)} />
                <span>Original Plates</span>
              </label>
              <label className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer">
                <input type="checkbox" checked={vehSecondKey} onChange={(e) => setVehSecondKey(e.target.checked)} />
                <span>Second Key</span>
              </label>
              <label className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer">
                <input type="checkbox" checked={vehTransferLetter} onChange={(e) => setVehTransferLetter(e.target.checked)} />
                <span>Transfer Letter</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 3: FINANCIAL TERMS ================= */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Sale Price, Advance Token & Installments Ledger (Section 5)
            </h3>
            <span className="text-xs text-slate-400">Step 3 of 5</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Gross Sale Price (PKR) *</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Discount (PKR)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 font-mono text-sm font-bold text-emerald-700 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Advance Token Received (PKR) *</label>
              <input
                type="number"
                value={advancePaid}
                onChange={(e) => setAdvancePaid(Number(e.target.value))}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 font-mono text-sm font-bold text-indigo-700 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Payment Method *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800"
              >
                <option value="Cash">Cash</option>
                <option value="Online Transfer">Online Transfer (Bank)</option>
                <option value="Cheque">Crossed Cheque</option>
                <option value="Bank Draft">Bank Draft / Pay Order</option>
              </select>
            </div>
          </div>

          {/* Auto Calculation Summary */}
          <div className="bg-gradient-to-r from-emerald-50 via-sky-50 to-emerald-50 text-slate-900 p-5 rounded-2xl border border-sky-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-slate-600 text-[11px] block uppercase font-bold">Net Price</span>
              <p className="text-xl font-extrabold font-mono text-slate-900">PKR {netPrice.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-emerald-700 text-[11px] block uppercase font-bold">Advance Token</span>
              <p className="text-xl font-extrabold font-mono text-emerald-700">PKR {advancePaid.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-amber-800 text-[11px] block uppercase font-bold">Remaining Balance</span>
              <p className="text-xl font-extrabold font-mono text-amber-700">PKR {remainingBalance.toLocaleString()}</p>
            </div>
          </div>

          {remainingBalance > 0 && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3 text-xs">
              <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Remaining Balance Installment Terms
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Number of Installments</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={installmentsCount}
                    onChange={(e) => setInstallmentsCount(Number(e.target.value))}
                    className="w-full bg-white p-2 rounded-lg border border-amber-300"
                  />
                  <p className="text-[11px] text-amber-800 mt-1">Per installment: PKR {installmentAmount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Final Balance Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-white p-2 rounded-lg border border-amber-300"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= STEP 4: CHECKLIST & CLAUSES ================= */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              Delivery Checklist & Legal Clauses Manager (Sections 7 & 8)
            </h3>
            <span className="text-xs text-slate-400 font-mono">Step 4 of 5</span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Physical Delivery Verification Checklist:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {Object.entries(checklist).map(([key, val]) => (
                <label key={key} className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={(e) => setChecklist({ ...checklist, [key]: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="capitalize text-slate-700 font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4 text-indigo-600" />
                  Master Legal Terms Review ({activeClauses.length} Clauses):
                </h4>
                <p className="text-[11px] text-slate-500">Edit, add, or delete clauses specifically for this agreement prior to execution</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetClauses}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset to Master Settings Clauses"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={handleAddClause}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Custom Clause
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs max-h-72 overflow-y-auto space-y-2 font-serif">
              {activeClauses.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-xs">No clauses attached. Click "Add Custom Clause" to add terms.</div>
              ) : (
                activeClauses.map((clause, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1 hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between font-sans text-[11px] text-slate-500">
                      <span className="font-bold text-slate-700">Clause #{idx + 1}</span>
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveClause(idx, 'up')}
                          className="p-1 rounded bg-slate-50 hover:bg-slate-200 disabled:opacity-30 border border-slate-200 text-slate-600 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === activeClauses.length - 1}
                          onClick={() => handleMoveClause(idx, 'down')}
                          className="p-1 rounded bg-slate-50 hover:bg-slate-200 disabled:opacity-30 border border-slate-200 text-slate-600 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClause(idx)}
                          className="p-1 rounded bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 cursor-pointer ml-1"
                          title="Delete Clause"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={clause}
                      onChange={(e) => handleClauseChange(idx, e.target.value)}
                      rows={2}
                      className="w-full p-2 bg-slate-50/50 rounded border border-slate-200 text-[11px] font-serif focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 5: DIGITAL SIGNATURES ================= */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Tablet className="w-4 h-4 text-indigo-600" />
              Capture Cryptographic Digital Signatures (Section 11)
            </h3>
            <span className="text-xs text-slate-400 font-mono">Step 5 of 5</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {/* Buyer Signature Box */}
            <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 space-y-2 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">BUYER SIGNATURE</p>
                <p className="text-[10px] text-slate-500">{buyerFullName || 'Buyer'}</p>
                <div className="h-20 bg-white rounded-lg border my-2 flex items-center justify-center p-1.5 overflow-hidden">
                  <img src={buyerSignature} alt="Buyer" className="max-h-16 object-contain" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveSigModal({ open: true, type: 'buyer', title: 'Buyer Digital Signature', role: buyerFullName || 'Buyer', defaultMode: 'draw' })}
                  className="py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Tablet className="w-3 h-3" />
                  Pad
                </button>
                <label 
                  onClick={(e) => e.stopPropagation()}
                  className="py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleDirectSigUpload(e, setBuyerSignature)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Seller Signature Box */}
            <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 space-y-2 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">SELLER SIGNATURE</p>
                <p className="text-[10px] text-slate-500">{sellerFullName}</p>
                <div className="h-20 bg-white rounded-lg border my-2 flex items-center justify-center p-1.5 overflow-hidden">
                  <img src={sellerSignature} alt="Seller" className="max-h-16 object-contain" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveSigModal({ open: true, type: 'seller', title: 'Seller Digital Signature', role: sellerFullName, defaultMode: 'draw' })}
                  className="py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Tablet className="w-3 h-3" />
                  Pad
                </button>
                <label 
                  onClick={(e) => e.stopPropagation()}
                  className="py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleDirectSigUpload(e, setSellerSignature)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Witness 1 Signature Box */}
            <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 space-y-2 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">WITNESS 1 SIGNATURE</p>
                <p className="text-[10px] text-slate-500">Malik Shahzad</p>
                <div className="h-20 bg-white rounded-lg border my-2 flex items-center justify-center p-1.5 overflow-hidden">
                  <img src={witness1Signature} alt="Witness 1" className="max-h-16 object-contain" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveSigModal({ open: true, type: 'witness1', title: 'Witness 1 Signature', role: 'Malik Shahzad', defaultMode: 'draw' })}
                  className="py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Tablet className="w-3 h-3" />
                  Pad
                </button>
                <label 
                  onClick={(e) => e.stopPropagation()}
                  className="py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleDirectSigUpload(e, setWitness1Signature)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Dealer Representative & Stamp */}
            <div className="p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50/50 space-y-2 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-indigo-950">DEALER OFFICIAL SEAL</p>
                <p className="text-[10px] text-indigo-700">Naqeeb Motors Exec</p>
                <div className="h-20 bg-white rounded-lg border border-indigo-200 my-2 flex items-center justify-center p-1 gap-1 overflow-hidden">
                  <img src={settings.stampUrl} alt="Stamp" className="h-12 w-12 object-contain" />
                  <img src={settings.ownerSignatureUrl} alt="Owner" className="h-10 object-contain" />
                </div>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 py-1 rounded">
                Pre-authenticated Seal Attached
              </span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Cryptographic Hash Ready:</strong> Upon finalizing, the system will construct SHA-256 fingerprint hash and compile the Master Contract with scannable QR verification link.
            </span>
          </div>
        </div>
      )}

      {/* Bottom Step Actions Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-semibold text-xs flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Step
        </button>

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            Next Step
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinishContract}
            className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl active:scale-95"
          >
            <Save className="w-4 h-4" />
            Finalize & Generate Master Contract
          </button>
        )}
      </div>

      {/* Signature Pad Modal Component */}
      <SignaturePadModal
        isOpen={activeSigModal.open}
        onClose={() => setActiveSigModal({ open: false, type: '', title: '', role: '' })}
        title={activeSigModal.title}
        roleLabel={activeSigModal.role}
        defaultMode={activeSigModal.defaultMode}
        onSave={(sigData) => {
          if (activeSigModal.type === 'buyer') setBuyerSignature(sigData);
          if (activeSigModal.type === 'seller') setSellerSignature(sigData);
          if (activeSigModal.type === 'witness1') setWitness1Signature(sigData);
          if (activeSigModal.type === 'witness2') setWitness2Signature(sigData);
        }}
      />
    </div>
  );
};
