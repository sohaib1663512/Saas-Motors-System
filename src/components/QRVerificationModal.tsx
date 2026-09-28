import React from 'react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  Building2, 
  Lock, 
  FileText,
  Clock
} from 'lucide-react';
import { MasterContract, CompanySettings } from '../types';

interface QRVerificationModalProps {
  contract: MasterContract | null;
  settings: CompanySettings;
  onClose: () => void;
}

export const QRVerificationModal: React.FC<QRVerificationModalProps> = ({
  contract,
  settings,
  onClose
}) => {
  if (!contract) return null;

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
        {/* Banner */}
        <div className="bg-slate-900 text-white p-6 relative text-center space-y-2 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <span className="inline-block px-3 py-0.5 rounded-md bg-slate-800 text-emerald-400 text-[10px] font-mono font-bold tracking-widest uppercase border border-slate-700">
            OFFICIAL COMPANY RECORD VERIFIED
          </span>

          <h3 className="text-base font-black uppercase tracking-tight text-white">
            MASTER CONTRACT SYSTEM VERIFICATION
          </h3>
          <p className="text-xs text-slate-300 font-mono">
            {contract.agreementNumber} • VER-{contract.agreementNumber.replace('NQM-', '')}
          </p>
        </div>

        {/* Details Content */}
        <div className="p-6 space-y-4 text-xs text-slate-800">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1 text-emerald-950 text-center">
            <p className="font-bold flex items-center justify-center gap-1.5 text-xs text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Contract Genuine & Registered in Naqeeb Motors ERP
            </p>
            <p className="text-[10px] font-mono text-emerald-800 break-all">
              HASH: {contract.qrVerification.digitalHash}
            </p>
          </div>

          <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Dealership Branch:</span>
              <strong className="text-slate-900">{settings.companyName}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Execution Date:</span>
              <strong className="text-slate-900">{contract.date}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Buyer Name:</span>
              <strong className="text-slate-900">{contract.buyer.fullName} (CNIC: {contract.buyer.cnic})</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Vehicle Specs:</span>
              <strong className="text-slate-900">{contract.vehicle.company} {contract.vehicle.make} ({contract.vehicle.registrationNumber})</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Chassis / VIN:</span>
              <strong className="font-mono text-slate-900">{contract.vehicle.chassisNumber}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Net Sale Price:</span>
              <strong className="font-mono text-emerald-700">{formatPKR(contract.saleDetails.netPrice)}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Verification Audit Status:</span>
              <span className="font-bold text-emerald-800">Verified & Active ({contract.qrVerification.verifiedCount + 1} Audits)</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 text-center leading-relaxed">
            This system record confirms that this contract is genuinely registered in Naqeeb Motors ERP database with non-repudiable signatures under Electronic Transactions Ordinance 2002.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Close Verification Window
          </button>
        </div>
      </div>
    </div>
  );
};

