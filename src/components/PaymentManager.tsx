import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  X, 
  DollarSign, 
  FileText
} from 'lucide-react';
import { MasterContract, PaymentRecord, PaymentMethod } from '../types';

interface PaymentManagerProps {
  contracts: MasterContract[];
  onAddPayment: (payment: PaymentRecord, nextDueDate?: string, nextInstallmentAmount?: number) => void;
}

export const PaymentManager: React.FC<PaymentManagerProps> = ({
  contracts,
  onAddPayment
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  // Add Payment Form
  const [selectedContractId, setSelectedContractId] = useState(contracts[0]?.id || '');
  const [payAmount, setPayAmount] = useState(1000000);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Online Transfer');
  const [payNotes, setPayNotes] = useState('Installment payment received');
  const [nextDueDate, setNextDueDate] = useState<string>(() => {
    const defaultNext = new Date();
    defaultNext.setDate(defaultNext.getDate() + 30);
    return defaultNext.toISOString().split('T')[0];
  });

  // Collect all payments across all contracts
  const allPayments = contracts.flatMap(c => c.paymentHistory);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetContract = contracts.find(c => c.id === selectedContractId);
    if (!targetContract) return;

    const currentBal = targetContract.saleDetails.remainingBalance;
    const newBal = Math.max(0, currentBal - payAmount);

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      contractId: targetContract.id,
      agreementNumber: targetContract.agreementNumber,
      date: new Date().toISOString().split('T')[0],
      amount: payAmount,
      remainingBalanceAfter: newBal,
      paymentMethod: payMethod,
      receivedBy: 'Accounts Officer',
      receiptNumber: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: payNotes,
      status: 'Confirmed'
    };

    onAddPayment(
      newPayment,
      newBal === 0 ? 'Fully Paid / Cleared' : (nextDueDate || targetContract.saleDetails.dueDate),
      newBal
    );
    setShowAddModal(false);
  };

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-emerald-50 via-sky-50 to-emerald-50 rounded-2xl p-5 text-slate-900 border border-sky-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            Financial Payment Ledger & Receipts
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Advance token tracking, installment schedule reconciliation, & official receipts
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          + Record New Payment
        </button>
      </div>

      {/* Payment Records Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            Payment Transactions Feed
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            Total Logged: {allPayments.length} Receipts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Receipt #</th>
                <th className="py-2.5 px-3">Agreement #</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Amount Paid</th>
                <th className="py-2.5 px-3">Remaining Bal After</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{p.receiptNumber}</td>
                  <td className="py-3 px-3 font-mono text-indigo-700 font-semibold">{p.agreementNumber}</td>
                  <td className="py-3 px-3 text-slate-500">{p.date}</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">{formatPKR(p.amount)}</td>
                  <td className="py-3 px-3 font-semibold text-amber-700">{formatPKR(p.remainingBalanceAfter)}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedReceipt(p)}
                      className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium text-xs flex items-center gap-1 ml-auto"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Record Customer Payment</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Select Agreement # *</label>
                <select
                  value={selectedContractId}
                  onChange={(e) => setSelectedContractId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-semibold text-slate-900"
                >
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.agreementNumber} — {c.buyer.fullName} (Bal: PKR {c.saleDetails.remainingBalance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Amount Paid (PKR) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-mono font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Payment Method *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="Cash">Cash</option>
                  <option value="Online Transfer">Online Transfer</option>
                  <option value="Cheque">Crossed Cheque</option>
                  <option value="Bank Draft">Bank Draft / Pay Order</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Notes / Reference</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Confirm & Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="text-center border-b pb-3 space-y-1">
              <h3 className="font-extrabold text-base uppercase tracking-tight">NAQEEB MOTORS & PROPERTY ADVISOR</h3>
              <p className="text-[10px] text-slate-500">Official Payment Receipt • Computer Generated</p>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt #:</span>
                <strong className="font-mono">{selectedReceipt.receiptNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Agreement #:</span>
                <strong className="font-mono text-indigo-700">{selectedReceipt.agreementNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span>{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-slate-200">
                <span>Amount Received:</span>
                <span className="text-emerald-700">{formatPKR(selectedReceipt.amount)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Remaining Balance:</span>
                <span className="font-semibold text-amber-700">{formatPKR(selectedReceipt.remainingBalanceAfter)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Receipt
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
