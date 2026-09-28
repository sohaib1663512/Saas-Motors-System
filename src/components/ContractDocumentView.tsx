import React, { useState } from 'react';
import { 
  Printer, 
  Share2, 
  Send, 
  ShieldCheck, 
  Building2, 
  CheckSquare, 
  Square, 
  ArrowLeft, 
  FileCheck,
  Lock,
  Sparkles,
  Edit,
  Download,
  PlusCircle,
  Receipt,
  X,
  CheckCircle2
} from 'lucide-react';
import { MasterContract, CompanySettings, PaymentRecord } from '../types';

interface ContractDocumentViewProps {
  contract: MasterContract;
  settings: CompanySettings;
  onBack: () => void;
  onEdit?: (contract: MasterContract) => void;
  onVerifyQR: (contract: MasterContract) => void;
  onAddPayment?: (payment: PaymentRecord, nextDueDate?: string, nextInstallmentAmount?: number) => void;
}

export const ContractDocumentView: React.FC<ContractDocumentViewProps> = ({
  contract,
  settings,
  onBack,
  onEdit,
  onVerifyQR,
  onAddPayment
}) => {
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  
  // Installment Recording State
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(contract.saleDetails.installmentAmount || Math.min(contract.saleDetails.remainingBalance, 1000000));
  const [payMethod, setPayMethod] = useState<'Cash' | 'Online Transfer' | 'Cheque' | 'Bank Draft'>('Cash');
  const [receivedBy, setReceivedBy] = useState('Naqeeb Motors Owner');
  const [payNotes, setPayNotes] = useState('');

  // Next Installment Schedule State
  const [nextDueDate, setNextDueDate] = useState<string>(() => {
    const defaultNext = new Date();
    defaultNext.setDate(defaultNext.getDate() + 30);
    return defaultNext.toISOString().split('T')[0];
  });
  const [nextAmount, setNextAmount] = useState<number>(0);

  // Receipt Modal State
  const [activeReceipt, setActiveReceipt] = useState<PaymentRecord | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleSetDateOffset = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setNextDueDate(d.toISOString().split('T')[0]);
  };

  const handleConfirmInstallment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;
    const newBal = Math.max(0, contract.saleDetails.remainingBalance - payAmount);
    const dateStr = new Date().toISOString().split('T')[0];
    const receiptNum = `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      contractId: contract.id,
      agreementNumber: contract.agreementNumber,
      date: dateStr,
      amount: payAmount,
      remainingBalanceAfter: newBal,
      paymentMethod: payMethod,
      receivedBy: receivedBy || 'Naqeeb Motors Owner',
      receiptNumber: receiptNum,
      notes: payNotes,
      status: 'Confirmed'
    };

    if (onAddPayment) {
      onAddPayment(
        newPayment,
        newBal === 0 ? 'Fully Paid / Cleared' : (nextDueDate || contract.saleDetails.dueDate),
        newBal === 0 ? 0 : (nextAmount > 0 ? nextAmount : newBal)
      );
    }

    setShowRecordModal(false);
    setActiveReceipt(newPayment);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Naqeeb Motors Master Sale Agreement\nAgreement #: ${contract.agreementNumber}\nBuyer: ${contract.buyer.fullName}\nVehicle: ${contract.vehicle.company} ${contract.vehicle.make} (${contract.vehicle.registrationNumber})\nVerify online: ${contract.qrVerification.verificationUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShareSuccess('WhatsApp link opened!');
    setTimeout(() => setShareSuccess(null), 3000);
  };

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Top Action Header Bar (Hidden during printing) */}
      <div className="print:hidden bg-slate-900 rounded-2xl p-4 text-white border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Master Vehicle Sale Agreement
              <span className="font-mono text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded text-xs border border-indigo-500/30">
                {contract.agreementNumber}
              </span>
            </h2>
            <p className="text-xs text-slate-400">12 Unified Sections • QR Verified • ETO 2002 Compliant</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {shareSuccess && (
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30 animate-in fade-in">
              {shareSuccess}
            </span>
          )}

          <button
            onClick={() => onVerifyQR(contract)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verify Contract ID
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            Share WhatsApp
          </button>

          {onEdit && (
            <button
              onClick={() => onEdit(contract)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Edit className="w-4 h-4 text-indigo-400" />
              Edit
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* =========================================================================
          MASTER CONTRACT PRINT CONTAINER (A4 Layout styling)
         ========================================================================= */}
      <div className="bg-white text-slate-900 border border-slate-300 rounded-2xl p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto space-y-6 relative overflow-hidden print:border-none print:shadow-none print:p-0 print:max-w-none print:rounded-none">
        
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none transform -rotate-45">
          <span className="text-7xl font-black text-slate-900 tracking-widest text-center uppercase leading-tight">
            {settings.watermarkText || 'NAQEEB MOTORS OFFICIAL'}
          </span>
        </div>

        {/* TOP SYSTEM AUDIT VERIFICATION HEADER BAR */}
        <div className="bg-slate-900 text-white p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2 font-mono border border-slate-800 shadow-xs print:rounded-none break-inside-avoid">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-100">
              NAQEEB MOTORS ERP — OFFICIAL SYSTEM CONTRACT RECORD
            </span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">VERIFICATION ID:</span>
            <span className="px-3 py-1 bg-emerald-950 text-emerald-300 font-black text-xs rounded border border-emerald-500/50 tracking-widest">
              VER-{contract.agreementNumber.replace('NQM-', '')}
            </span>
          </div>
        </div>

        {/* ================= SECTION 1: COMPANY INFORMATION ================= */}
        <div className="border-b-2 border-slate-900 pb-5 space-y-4 break-inside-avoid">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo + Company */}
            <div className="flex items-center space-x-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-2xl shrink-0 shadow-md border-2 border-slate-800">
                N
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                  {contract.companyInfo.companyName}
                </h1>
                <p className="text-xs font-bold text-emerald-800 tracking-wide uppercase">
                  {settings.tagline}
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {contract.companyInfo.address}
                </p>
              </div>
            </div>

            {/* Contract Meta & Verification Token Badge */}
            <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-right">
              <div className="text-xs space-y-0.5">
                <p className="font-mono text-sm font-black text-slate-900">{contract.agreementNumber}</p>
                <p className="text-[11px] text-slate-600">Execution Date: <strong className="text-slate-900">{contract.date}</strong></p>
                <p className="text-[10px] text-slate-500 font-mono">NTN: {contract.companyInfo.ntn} | Lic: {contract.companyInfo.licenseNumber}</p>
              </div>
            </div>
          </div>

          <div className="text-center bg-slate-900 text-white py-1.5 px-4 rounded-lg font-extrabold text-xs tracking-widest uppercase shadow-xs">
            MASTER VEHICLE SALE AGREEMENT & OFFICIAL LEGAL CONTRACT
          </div>
        </div>

        {/* GRID: SELLER & BUYER (SECTIONS 2 & 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
          {/* ================= SECTION 2: SELLER INFORMATION ================= */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 break-inside-avoid">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-800" />
              SECTION 2 — SELLER INFORMATION
            </h3>
            <div className="text-xs space-y-1.5">
              <div className="grid grid-cols-3">
                <span className="text-slate-500 font-medium">Full Name:</span>
                <span className="col-span-2 font-bold text-slate-900">{contract.seller.fullName}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500 font-medium">Father Name:</span>
                <span className="col-span-2 font-semibold text-slate-800">{contract.seller.fatherName}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500 font-medium">CNIC Number:</span>
                <span className="col-span-2 font-mono font-bold text-slate-900">{contract.seller.cnic}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500 font-medium">Phone Number:</span>
                <span className="col-span-2 font-semibold text-slate-800">{contract.seller.phone}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500 font-medium">Full Address:</span>
                <span className="col-span-2 text-slate-700">{contract.seller.address}</span>
              </div>
            </div>
          </div>

          {/* ================= SECTION 3: BUYER INFORMATION ================= */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 break-inside-avoid">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              SECTION 3 — BUYER INFORMATION
            </h3>
            <div className="text-xs space-y-1.5">
              <div className="grid grid-cols-3">
                <span className="text-slate-500 font-medium">Full Name:</span>
                <span className="col-span-2 font-bold text-slate-900">{contract.buyer.fullName}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500 font-medium">Father Name:</span>
                <span className="col-span-2 font-semibold text-slate-800">{contract.buyer.fatherName}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500 font-medium">CNIC Number:</span>
                <span className="col-span-2 font-mono font-bold text-slate-900">{contract.buyer.cnic}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500 font-medium">Phone Number:</span>
                <span className="col-span-2 font-semibold text-slate-800">{contract.buyer.phone}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-500 font-medium">Full Address:</span>
                <span className="col-span-2 text-slate-700">{contract.buyer.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 4: VEHICLE SPECIFICATIONS ================= */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 break-inside-avoid">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <span>SECTION 4 — VEHICLE SPECIFICATIONS & DOCUMENTS STATUS</span>
            <span className="font-mono text-[10px] text-slate-500">REG: {contract.vehicle.registrationNumber}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Company & Make</span>
              <strong className="text-slate-900">{contract.vehicle.company} {contract.vehicle.make}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Model & Variant</span>
              <strong className="text-slate-900">{contract.vehicle.model} ({contract.vehicle.variant})</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Model Year & Color</span>
              <strong className="text-slate-900">{contract.vehicle.year} — {contract.vehicle.color}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Mileage & Fuel</span>
              <strong className="text-slate-900">{contract.vehicle.mileage.toLocaleString()} km ({contract.vehicle.fuel})</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Engine Number</span>
              <strong className="font-mono text-slate-900">{contract.vehicle.engineNumber}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Chassis / VIN</span>
              <strong className="font-mono text-slate-900">{contract.vehicle.chassisNumber}</strong>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 block text-[10px]">Factory & Aftermarket Accessories</span>
              <span className="text-slate-800 font-medium">{contract.vehicle.accessories || 'Standard Factory Package'}</span>
            </div>
          </div>

          {/* Document Verification Matrix */}
          <div className="pt-2 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
            <span className="flex items-center gap-1 font-semibold">
              {contract.vehicle.originalCard ? <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
              Original Card
            </span>
            <span className="flex items-center gap-1 font-semibold">
              {contract.vehicle.smartCard ? <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
              Smart Card
            </span>
            <span className="flex items-center gap-1 font-semibold">
              {contract.vehicle.originalPlates ? <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
              Original Plates
            </span>
            <span className="flex items-center gap-1 font-semibold">
              {contract.vehicle.secondKey ? <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
              Second Key
            </span>
            <span className="flex items-center gap-1 font-semibold">
              {contract.vehicle.transferLetter ? <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
              Transfer Letter
            </span>
          </div>
        </div>

        {/* GRID: SALE INFO & PAYMENT HISTORY (SECTIONS 5 & 6) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
          {/* ================= SECTION 5: FINANCIAL & SALE DETAILS ================= */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 break-inside-avoid">
            <div className="flex items-center justify-between border-b border-slate-300 pb-1.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                SECTION 5 — SALE FINANCIAL CONSIDERATION
              </h3>
              {contract.saleDetails.remainingBalance > 0 && (
                <button
                  type="button"
                  onClick={() => setShowRecordModal(true)}
                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3 h-3" />
                  + Receive Installment
                </button>
              )}
            </div>
            <div className="text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Sale Price:</span>
                <span className="font-semibold text-slate-900">{formatPKR(contract.saleDetails.salePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Discount Offered:</span>
                <span className="font-semibold text-emerald-700">- {formatPKR(contract.saleDetails.discount)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                <span className="text-slate-900">Net Agreed Price:</span>
                <span className="text-slate-900">{formatPKR(contract.saleDetails.netPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Advance Paid:</span>
                <span className="font-bold text-emerald-700">{formatPKR(contract.saleDetails.advancePaid)}</span>
              </div>
              <div className="flex justify-between font-bold text-amber-700 pt-1 border-t border-slate-200">
                <span>Remaining Balance Due:</span>
                <span>{formatPKR(contract.saleDetails.remainingBalance)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Balance Due Date:</span>
                <span className="font-semibold text-slate-800">{contract.saleDetails.dueDate}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Payment Method:</span>
                <span className="font-semibold text-slate-800">{contract.saleDetails.primaryPaymentMethod}</span>
              </div>

              {contract.saleDetails.remainingBalance > 0 ? (
                <button
                  type="button"
                  onClick={() => setShowRecordModal(true)}
                  className="w-full mt-2 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Collect Owner Installment Payment
                </button>
              ) : (
                <div className="mt-2 p-2 bg-emerald-100 text-emerald-900 rounded-lg text-[11px] font-bold text-center border border-emerald-200">
                  ✓ FULL PAYMENT CLEARANCE — ZERO REMAINING BALANCE
                </div>
              )}
            </div>
          </div>

          {/* ================= SECTION 6: PAYMENT HISTORY TIMELINE ================= */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 break-inside-avoid">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5 flex items-center justify-between">
              <span>SECTION 6 — PAYMENT LEDGER</span>
              <span className="text-[10px] text-slate-500">{contract.paymentHistory.length} Transactions</span>
            </h3>
            <div className="text-xs space-y-2 print:max-h-none print:overflow-visible pr-1">
              {contract.paymentHistory.map((pay) => (
                <div key={pay.id} className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] space-y-1 hover:border-slate-400 transition-colors break-inside-avoid">
                  <div className="flex justify-between items-center font-bold text-slate-900">
                    <span className="flex items-center gap-1 font-mono text-slate-900">
                      <Receipt className="w-3 h-3 text-emerald-700" />
                      {pay.receiptNumber}
                    </span>
                    <span className="text-emerald-700 font-extrabold">{formatPKR(pay.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 text-[10px]">
                    <span>{pay.date} • {pay.paymentMethod} ({pay.receivedBy || 'Owner'})</span>
                    <button
                      type="button"
                      onClick={() => setActiveReceipt(pay)}
                      className="print:hidden px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded border border-slate-200 text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Receipt className="w-2.5 h-2.5" />
                      View Receipt
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono text-right">
                    Bal After: {formatPKR(pay.remainingBalanceAfter)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= SECTION 7: VEHICLE DELIVERY CHECKLIST ================= */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 break-inside-avoid">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5">
            SECTION 7 — PHYSICAL HANDOVER & INSPECTION CHECKLIST
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            {Object.entries(contract.deliveryChecklist).map(([key, val]) => (
              <div key={key} className="flex items-center space-x-1.5">
                {val ? <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                <span className="capitalize text-slate-700">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= SECTION 8: LEGAL TERMS & CONDITIONS ================= */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 break-inside-avoid">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <span>SECTION 8 — MASTER LEGAL TERMS & CONDITIONS ({contract.legalClauses.length} CLAUSES)</span>
            <span className="text-[10px] text-slate-700 font-semibold uppercase">ETO 2002 ENFORCEABLE</span>
          </h3>
          <div className="text-[10px] text-slate-800 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-2 p-1 font-sans font-medium print:max-h-none print:overflow-visible">
            {contract.legalClauses.map((clause, idx) => (
              <p key={idx} className="bg-white p-2 rounded-lg border border-slate-200/80 break-inside-avoid">
                {clause}
              </p>
            ))}
          </div>
        </div>

        {/* ================= SECTION 9: DECLARATIONS ================= */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs break-inside-avoid">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5">
            SECTION 9 — OATH DECLARATIONS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-700">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <strong className="text-slate-900 block mb-1">BUYER DECLARATION:</strong>
              {contract.declarations.buyerDeclaration}
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <strong className="text-slate-900 block mb-1">SELLER DECLARATION:</strong>
              {contract.declarations.sellerDeclaration}
            </div>
          </div>
        </div>

        {/* ================= SECTION 10: ATTACHMENTS ================= */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs break-inside-avoid">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5">
            SECTION 10 — ATTACHED DOCUMENTS & PICTURES
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
              CNIC Front Scan Attached
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
              CNIC Back Scan Attached
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
              Vehicle HD Photos Attached
            </span>
          </div>
        </div>

        {/* ================= SECTION 11: DIGITAL SIGNATURES ================= */}
        <div className="border-2 border-slate-900 rounded-xl p-5 space-y-4 bg-slate-50 break-inside-avoid">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-2 text-center">
            SECTION 11 — CRYPTOGRAPHIC DIGITAL SIGNATURES & OFFICIAL SEAL
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {/* Buyer Sig */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 flex flex-col items-center justify-between">
              <div className="h-16 flex items-center justify-center">
                <img src={contract.signatures.buyerSignature} alt="Buyer Signature" className="max-h-14 max-w-full object-contain" />
              </div>
              <div className="border-t border-slate-200 w-full pt-1 text-[10px]">
                <p className="font-extrabold text-slate-900">{contract.buyer.fullName}</p>
                <p className="text-slate-500 font-semibold">BUYER SIGNATURE</p>
                <p className="text-[9px] text-slate-400">{contract.signatures.buyerSignedAt || contract.date}</p>
              </div>
            </div>

            {/* Seller Sig */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 flex flex-col items-center justify-between">
              <div className="h-16 flex items-center justify-center">
                <img src={contract.signatures.sellerSignature} alt="Seller Signature" className="max-h-14 max-w-full object-contain" />
              </div>
              <div className="border-t border-slate-200 w-full pt-1 text-[10px]">
                <p className="font-extrabold text-slate-900">{contract.seller.fullName}</p>
                <p className="text-slate-500 font-semibold">SELLER SIGNATURE</p>
                <p className="text-[9px] text-slate-400">{contract.signatures.sellerSignedAt || contract.date}</p>
              </div>
            </div>

            {/* Witness 1 Sig */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 flex flex-col items-center justify-between">
              <div className="h-16 flex items-center justify-center">
                <img src={contract.signatures.witness1Signature} alt="Witness Signature" className="max-h-14 max-w-full object-contain" />
              </div>
              <div className="border-t border-slate-200 w-full pt-1 text-[10px]">
                <p className="font-bold text-slate-900">{contract.signatures.witness1Name || 'Witness 1'}</p>
                <p className="text-slate-500">WITNESS 1</p>
              </div>
            </div>

            {/* Dealer Stamp & Owner Sig */}
            <div className="bg-white p-3 rounded-lg border border-slate-300 space-y-2 flex flex-col items-center justify-between">
              <div className="h-16 flex items-center justify-center space-x-1">
                <img src={contract.signatures.companyStampUrl} alt="Company Stamp" className="h-12 w-12 object-contain opacity-80" />
                <img src={contract.signatures.ownerSignatureUrl} alt="Owner Signature" className="h-12 object-contain" />
              </div>
              <div className="border-t border-slate-200 w-full pt-1 text-[10px]">
                <p className="font-black text-slate-900">NAQEEB MOTORS</p>
                <p className="text-slate-700 font-bold">DEALER STAMP & EXEC</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 12: COMPANY VERIFICATION & FOOTER ================= */}
        <div className="pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 break-inside-avoid">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-bold text-slate-900 flex items-center gap-1.5 justify-center sm:justify-start">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              SECTION 12 — OFFICIAL SYSTEM VERIFICATION & DIGITAL RECORD HASH
            </p>
            <p className="text-[10px] font-mono text-slate-500 break-all max-w-xl">
              SECURITY HASH: {contract.qrVerification.digitalHash}
            </p>
            <p className="text-[10px] text-slate-500">
              {settings.footerText}
            </p>
          </div>

          <div className="px-3.5 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 font-mono text-[10px] text-center shrink-0">
            <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">OFFICIAL SYSTEM VERIFICATION TOKEN</p>
            <p className="font-bold text-white text-xs mt-0.5">VER-{contract.agreementNumber}</p>
          </div>
        </div>

      </div>

      {/* ================= RECORD INSTALLMENT MODAL ================= */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-600/30 rounded-lg text-emerald-400">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Record Installment Payment</h3>
                  <p className="text-[11px] text-slate-400">Agmt: {contract.agreementNumber} • {contract.buyer.fullName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRecordModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmInstallment} className="p-5 space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <p className="text-amber-800 font-semibold">Current Balance Due:</p>
                  <p className="text-[10px] text-amber-700">{contract.vehicle.company} {contract.vehicle.make} ({contract.vehicle.registrationNumber})</p>
                </div>
                <span className="text-base font-extrabold text-amber-900">{formatPKR(contract.saleDetails.remainingBalance)}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Installment Amount Received (PKR)</label>
                <input
                  type="number"
                  min={1}
                  max={contract.saleDetails.remainingBalance}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex gap-1.5 mt-1.5">
                  {[200000, 500000, 1000000].map(amt => (
                    amt <= contract.saleDetails.remainingBalance && (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setPayAmount(amt)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-semibold border border-slate-300 transition-colors cursor-pointer"
                      >
                        {amt.toLocaleString()}
                      </button>
                    )
                  ))}
                  <button
                    type="button"
                    onClick={() => setPayAmount(contract.saleDetails.remainingBalance)}
                    className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded text-[10px] font-bold border border-emerald-300 transition-colors cursor-pointer"
                  >
                    Full Remaining
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Online Transfer">Online Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Bank Draft">Bank Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Received By</label>
                  <input
                    type="text"
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Bank Ref (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Bank Islam Slip # 882910"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* NEXT INSTALLMENT SCHEDULE & TIME CONFIRMATION SECTION */}
              {Math.max(0, contract.saleDetails.remainingBalance - payAmount) > 0 ? (
                <div className="bg-sky-50/80 p-3.5 rounded-2xl border border-sky-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-sky-200/80 pb-2">
                    <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                      Next Installment Schedule & Confirmation
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-200/80 text-sky-800">
                      Remaining: {formatPKR(Math.max(0, contract.saleDetails.remainingBalance - payAmount))}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-800">Next Installment Due Date *</label>
                      <span className="text-[10px] text-sky-700 font-semibold">Quick Offset:</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="date"
                        value={nextDueDate}
                        onChange={(e) => setNextDueDate(e.target.value)}
                        required
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSetDateOffset(15)}
                        className="px-2 py-1 bg-white hover:bg-sky-100 text-sky-800 rounded-lg text-[10px] font-bold border border-sky-200 transition-colors cursor-pointer"
                      >
                        +15 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetDateOffset(30)}
                        className="px-2 py-1 bg-white hover:bg-sky-100 text-sky-800 rounded-lg text-[10px] font-bold border border-sky-200 transition-colors cursor-pointer"
                      >
                        +30 Days (1 Month)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetDateOffset(60)}
                        className="px-2 py-1 bg-white hover:bg-sky-100 text-sky-800 rounded-lg text-[10px] font-bold border border-sky-200 transition-colors cursor-pointer"
                      >
                        +60 Days (2 Months)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetDateOffset(90)}
                        className="px-2 py-1 bg-white hover:bg-sky-100 text-sky-800 rounded-lg text-[10px] font-bold border border-sky-200 transition-colors cursor-pointer"
                      >
                        +90 Days (3 Months)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">Next Expected Installment Amount (PKR)</label>
                    <input
                      type="number"
                      value={nextAmount || Math.max(0, contract.saleDetails.remainingBalance - payAmount)}
                      onChange={(e) => setNextAmount(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <p className="text-[10px] text-sky-800 leading-tight">
                    🔔 Setting this confirmed date will trigger system bell alerts when the next installment approaches within 15 days or becomes overdue.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-emerald-900 text-xs space-y-1">
                  <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Full Balance Cleared!
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    This payment settles the total outstanding balance. Next installment status will automatically update to <strong>FULLY PAID & CLEARED</strong>.
                  </p>
                </div>
              )}

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] flex justify-between font-bold text-slate-800">
                <span>Remaining Balance After Payment:</span>
                <span className="text-emerald-700 font-extrabold">{formatPKR(Math.max(0, contract.saleDetails.remainingBalance - payAmount))}</span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= OFFICIAL INSTALLMENT RECEIPT MODAL ================= */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
            {/* Modal Control Bar */}
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">OFFICIAL INSTALLMENT RECEIPT — {activeReceipt.receiptNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReceipt(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Canvas Body */}
            <div className="p-6 space-y-4 text-slate-900 bg-white">
              {/* Receipt Header */}
              <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <img src={settings.companyLogoUrl} alt="Logo" className="w-12 h-12 object-contain" />
                  <div>
                    <h2 className="text-base font-black text-slate-900 tracking-wider uppercase">{settings.companyName}</h2>
                    <p className="text-[10px] text-slate-600">{settings.tagline}</p>
                    <p className="text-[9px] text-slate-500">{settings.address} • Ph: {settings.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-md text-[10px] font-black tracking-widest border border-emerald-300 uppercase">
                    RECEIPT
                  </span>
                  <p className="text-xs font-mono font-bold text-slate-900 mt-1">{activeReceipt.receiptNumber}</p>
                  <p className="text-[10px] text-slate-500">Date: {activeReceipt.date}</p>
                </div>
              </div>

              {/* Receipt Body Info */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">RECEIVED FROM (BUYER)</p>
                  <p className="font-extrabold text-slate-900">{contract.buyer.fullName}</p>
                  <p className="text-[10px] text-slate-600">CNIC: {contract.buyer.cnic}</p>
                  <p className="text-[10px] text-slate-600">Cell: {contract.buyer.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">VEHICLE DETAILS</p>
                  <p className="font-bold text-slate-900">{contract.vehicle.company} {contract.vehicle.make} ({contract.vehicle.year})</p>
                  <p className="text-[10px] font-mono text-slate-600">Reg #: {contract.vehicle.registrationNumber}</p>
                  <p className="text-[10px] font-mono text-slate-600">Agmt #: {contract.agreementNumber}</p>
                </div>
              </div>

              {/* Transaction Amount Highlight */}
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">INSTALLMENT PAYMENT RECEIVED</p>
                  <p className="text-xl font-black text-emerald-950">{formatPKR(activeReceipt.amount)}</p>
                  <p className="text-[10px] text-emerald-800 font-medium">Method: {activeReceipt.paymentMethod} {activeReceipt.notes ? `(${activeReceipt.notes})` : ''}</p>
                </div>
                <div className="text-right border-l border-emerald-200 pl-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">REMAINING BALANCE</p>
                  <p className="text-sm font-extrabold text-amber-900">{formatPKR(activeReceipt.remainingBalanceAfter)}</p>
                  <p className="text-[9px] text-slate-500">Status: Verified & Cleared</p>
                </div>
              </div>

              {/* Stamp and Signatures */}
              <div className="pt-2 grid grid-cols-2 gap-4 text-center items-end">
                <div className="p-2 border-t border-slate-300">
                  <p className="text-[10px] font-bold text-slate-800">{activeReceipt.receivedBy || 'Naqeeb Motors Owner'}</p>
                  <p className="text-[9px] text-slate-500 uppercase">RECEIVED BY / OWNER</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-1 h-10">
                    <img src={settings.stampUrl} alt="Stamp" className="h-10 w-10 object-contain opacity-80" />
                    <img src={settings.ownerSignatureUrl} alt="Sig" className="h-8 object-contain" />
                  </div>
                  <div className="border-t border-slate-300 w-full pt-1">
                    <p className="text-[9px] font-bold text-slate-800 uppercase">{settings.companyName} SEAL</p>
                  </div>
                </div>
              </div>

              {/* Verification Bar */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-400">
                <span>Computerized Official Ledger Receipt</span>
                <span>Security Token: {activeReceipt.id}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
