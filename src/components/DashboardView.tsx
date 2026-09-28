import React from 'react';
import { 
  DollarSign, 
  Car, 
  FileText, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ArrowUpRight, 
  Sparkles,
  QrCode,
  Share2,
  Printer,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { MasterContract, Vehicle, Customer } from '../types';

interface DashboardViewProps {
  contracts: MasterContract[];
  vehicles: Vehicle[];
  customers: Customer[];
  onNewContract: () => void;
  onViewContract: (contract: MasterContract) => void;
  onVerifyQR: (contract: MasterContract) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  contracts,
  vehicles,
  customers,
  onNewContract,
  onViewContract,
  onVerifyQR,
  onNavigateTab
}) => {
  // Calculations
  const totalVehiclesAvailable = vehicles.filter(v => v.status === 'Available').length;
  const totalVehiclesSold = vehicles.filter(v => v.status === 'Sold').length;
  const totalVehiclesReserved = vehicles.filter(v => v.status === 'Reserved').length;

  const totalRevenue = contracts.reduce((acc, c) => acc + (c.saleDetails.netPrice || 0), 0);
  const totalAdvanceCollected = contracts.reduce((acc, c) => acc + (c.saleDetails.advancePaid || 0), 0);
  const totalPendingPayments = contracts.reduce((acc, c) => acc + (c.saleDetails.remainingBalance || 0), 0);

  // Chart data
  const monthlySalesData = [
    { month: 'Oct 2025', Sales: 22000000, Revenue: 18000000 },
    { month: 'Nov 2025', Sales: 35000000, Revenue: 31000000 },
    { month: 'Dec 2025', Sales: 48000000, Revenue: 42000000 },
    { month: 'Jan 2026', Sales: 29000000, Revenue: 25000000 },
    { month: 'Feb 2026', Sales: 42000000, Revenue: 38000000 },
    { month: 'Mar 2026', Sales: 38000000, Revenue: 33500000 },
  ];

  const inventoryDistribution = [
    { name: 'Available', value: totalVehiclesAvailable, color: '#10b981' },
    { name: 'Reserved', value: totalVehiclesReserved, color: '#f59e0b' },
    { name: 'Sold', value: totalVehiclesSold, color: '#3b82f6' },
    { name: 'Maintenance', value: vehicles.filter(v => v.status === 'Maintenance').length, color: '#ef4444' },
  ];

  const topBrandsData = [
    { brand: 'Toyota', count: 8 },
    { brand: 'Honda', count: 6 },
    { brand: 'Kia', count: 4 },
    { brand: 'Suzuki', count: 5 },
    { brand: 'Hyundai', count: 3 },
  ];

  const formatPKR = (val: number) => {
    if (val >= 10000000) return `PKR ${(val / 10000000).toFixed(2)} Crore`;
    if (val >= 100000) return `PKR ${(val / 100000).toFixed(2)} Lakh`;
    return `PKR ${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-slate-50 rounded-2xl p-6 text-slate-900 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold">
            Naqeeb Motors ERP — System Control Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Vehicle Dealership Management System
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl font-medium">
            Manage vehicle sales, print official agreements, verify QR codes, and track customer payments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onNewContract}
            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + New Sale Agreement
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-700" />
            View Reports
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Contract Volume</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{contracts.length} Agreements</p>
            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              100% Digitized & QR Verified
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-sky-300 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sales Turnover</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl border border-sky-100">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{formatPKR(totalRevenue)}</p>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Advance: <strong className="text-emerald-700">{formatPKR(totalAdvanceCollected)}</strong>
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-amber-300 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Balance</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-700">{formatPKR(totalPendingPayments)}</p>
            <p className="text-xs text-amber-800 font-medium mt-1">
              Automated Due Alerts Active
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-sky-300 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Showroom Inventory</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl border border-sky-100">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{totalVehiclesAvailable} Available</p>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Reserved: {totalVehiclesReserved} | Sold: {totalVehiclesSold}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Revenue & Sales Trend</h3>
              <p className="text-xs text-slate-500">Gross deal volume across last 6 months</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              PKR Million
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `${(val/1000000).toFixed(0)}M`} />
                <Tooltip 
                  formatter={(value: any) => [formatPKR(Number(value)), 'Amount']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="Sales" fill="#0284c7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Pie Chart (1 col) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Inventory Status Breakdown</h3>
            <p className="text-xs text-slate-500">Live showroom stock distribution</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {inventoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {inventoryDistribution.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-medium">{item.name}:</span>
                <strong className="text-slate-900">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Master Contracts Table Row */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Recent Master Vehicle Sale Agreements
            </h3>
            <p className="text-xs text-slate-500">Legally executed digital contracts with embedded QR verification</p>
          </div>
          <button
            onClick={() => onNavigateTab('contracts')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            View All Contracts →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Agreement #</th>
                <th className="py-2.5 px-3">Buyer / CNIC</th>
                <th className="py-2.5 px-3">Vehicle Details</th>
                <th className="py-2.5 px-3">Net Price</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    No agreements found in system. Click "+ New Sale Agreement" to create one.
                  </td>
                </tr>
              ) : (
                contracts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-slate-900 block">{c.agreementNumber}</span>
                      <span className="text-[10px] text-slate-400">{c.date}</span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{c.buyer.fullName}</p>
                      <p className="text-[10px] text-slate-400">{c.buyer.cnic}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-800">{c.vehicle.company} {c.vehicle.make}</p>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] rounded font-semibold">
                        {c.vehicle.registrationNumber}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {formatPKR(c.saleDetails.netPrice)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        c.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onViewContract(c)}
                          className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer"
                          title="Open Master Agreement"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onVerifyQR(c)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                          title="Verify QR Code"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
