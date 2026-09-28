import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  FileText, 
  Calendar,
  DollarSign,
  Car,
  Users
} from 'lucide-react';
import { MasterContract, Vehicle, Customer } from '../types';

interface ReportsViewProps {
  contracts: MasterContract[];
  vehicles: Vehicle[];
  customers: Customer[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  contracts,
  vehicles,
  customers
}) => {
  const [reportType, setReportType] = useState<'sales' | 'payments' | 'vehicles' | 'customers'>('sales');

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (reportType === 'sales') {
      csvContent += "Agreement Number,Date,Buyer Name,CNIC,Vehicle,Net Price,Advance Paid,Remaining Balance\n";
      contracts.forEach(c => {
        csvContent += `"${c.agreementNumber}","${c.date}","${c.buyer.fullName}","${c.buyer.cnic}","${c.vehicle.company} ${c.vehicle.make}","${c.saleDetails.netPrice}","${c.saleDetails.advancePaid}","${c.saleDetails.remainingBalance}"\n`;
      });
    } else if (reportType === 'payments') {
      csvContent += "Receipt Number,Contract Number,Date,Customer Name,Amount (PKR),Payment Method,Recorded By\n";
      contracts.flatMap(c => c.paymentHistory || []).forEach(p => {
        csvContent += `"${p.receiptNumber}","${p.contractNumber}","${p.date}","${p.customerName}","${p.amount}","${p.paymentMethod}","${p.recordedBy}"\n`;
      });
    } else if (reportType === 'vehicles') {
      csvContent += "Stock ID,Company,Make,Year,Reg #,Chassis #,Engine #,Asking Price,Status\n";
      vehicles.forEach(v => {
        csvContent += `"${v.id}","${v.company}","${v.make}","${v.modelYear}","${v.registrationNumber}","${v.chassisNumber}","${v.engineNumber}","${v.price}","${v.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Naqeeb_Motors_${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  const allPayments = contracts.flatMap(c => c.paymentHistory || []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="bg-slate-50 rounded-2xl p-5 text-slate-900 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-800" />
            Admin Reports & Data Export Center
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Generate printable sales summaries, payment ledgers, & export clean CSV spreadsheets
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export to CSV / Excel
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Report Type Pills */}
      <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl">
        <button
          onClick={() => setReportType('sales')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            reportType === 'sales' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sales Agreements Report
        </button>
        <button
          onClick={() => setReportType('payments')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            reportType === 'payments' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Payment Ledger Report
        </button>
        <button
          onClick={() => setReportType('vehicles')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            reportType === 'vehicles' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Inventory Stock Report
        </button>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            NAQEEB MOTORS — OFFICIAL {reportType.toUpperCase()} REPORT
          </h3>
          <span className="text-xs text-slate-500 font-mono">Date: {new Date().toISOString().split('T')[0]}</span>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'sales' && (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Agreement #</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Buyer Name</th>
                  <th className="py-2.5 px-3">Vehicle Details</th>
                  <th className="py-2.5 px-3">Net Price</th>
                  <th className="py-2.5 px-3">Advance Paid</th>
                  <th className="py-2.5 px-3">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contracts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">No sales records available.</td>
                  </tr>
                ) : (
                  contracts.map((c) => (
                    <tr key={c.id}>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{c.agreementNumber}</td>
                      <td className="py-3 px-3 text-slate-500">{c.date}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{c.buyer.fullName}</td>
                      <td className="py-3 px-3 font-medium">{c.vehicle.company} {c.vehicle.make}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{formatPKR(c.saleDetails.netPrice)}</td>
                      <td className="py-3 px-3 font-semibold text-emerald-700">{formatPKR(c.saleDetails.advancePaid)}</td>
                      <td className="py-3 px-3 font-semibold text-amber-700">{formatPKR(c.saleDetails.remainingBalance)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {reportType === 'payments' && (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Receipt #</th>
                  <th className="py-2.5 px-3">Contract #</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Customer Name</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">No payment records available.</td>
                  </tr>
                ) : (
                  allPayments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{p.receiptNumber}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{p.contractNumber}</td>
                      <td className="py-3 px-3 text-slate-500">{p.date}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{p.customerName}</td>
                      <td className="py-3 px-3 font-bold text-emerald-700">{formatPKR(p.amount)}</td>
                      <td className="py-3 px-3 font-medium text-slate-700">{p.paymentMethod}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {reportType === 'vehicles' && (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Vehicle</th>
                  <th className="py-2.5 px-3">Reg #</th>
                  <th className="py-2.5 px-3">Chassis #</th>
                  <th className="py-2.5 px-3">Engine #</th>
                  <th className="py-2.5 px-3">Asking Price</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">No inventory records available.</td>
                  </tr>
                ) : (
                  vehicles.map((v) => (
                    <tr key={v.id}>
                      <td className="py-3 px-3 font-bold text-slate-900">{v.company} {v.make} ({v.modelYear})</td>
                      <td className="py-3 px-3 font-mono text-slate-700">{v.registrationNumber}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{v.chassisNumber}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{v.engineNumber}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{formatPKR(v.price)}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === 'In Stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
