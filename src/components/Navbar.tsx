import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Bell, 
  ShieldAlert, 
  UserCheck, 
  FileText, 
  Car, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Sparkles,
  CheckCircle2,
  Menu,
  X,
  AlertTriangle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { CompanySettings, MasterContract } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  settings: CompanySettings;
  contracts?: MasterContract[];
  onViewContract?: (contract: MasterContract) => void;
  pendingCount: number;
}

interface NotificationItem {
  id: string;
  contract: MasterContract;
  type: 'OVERDUE' | 'DUE_SOON' | 'UPCOMING';
  title: string;
  buyerName: string;
  agmtNo: string;
  vehicleDesc: string;
  amount: number;
  remainingBal: number;
  dueDate: string;
  daysDiff: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  settings,
  contracts = [],
  onViewContract,
  pendingCount
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'overdue' | 'duesoon'>('all');

  // Dynamic Installment Notifications Calculation
  const notifications: NotificationItem[] = useMemo(() => {
    if (!contracts || contracts.length === 0) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const items: NotificationItem[] = [];

    contracts.forEach(c => {
      if (c.saleDetails.remainingBalance > 0 && c.saleDetails.dueDate && c.saleDetails.dueDate !== 'Fully Paid / Cleared') {
        const due = new Date(c.saleDetails.dueDate);
        if (!isNaN(due.getTime())) {
          due.setHours(0, 0, 0, 0);
          const diffTime = due.getTime() - today.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

          let type: 'OVERDUE' | 'DUE_SOON' | 'UPCOMING' = 'UPCOMING';
          if (diffDays < 0) {
            type = 'OVERDUE';
          } else if (diffDays <= 15) {
            type = 'DUE_SOON';
          }

          items.push({
            id: c.id,
            contract: c,
            type,
            title: type === 'OVERDUE' 
              ? `OVERDUE by ${Math.abs(diffDays)} Days!` 
              : type === 'DUE_SOON' 
              ? `Due ${diffDays === 0 ? 'Today!' : `in ${diffDays} Days`}`
              : `Upcoming (${c.saleDetails.dueDate})`,
            buyerName: c.buyer.fullName,
            agmtNo: c.agreementNumber,
            vehicleDesc: `${c.vehicle.company} ${c.vehicle.make} (${c.vehicle.registrationNumber})`,
            amount: c.saleDetails.installmentAmount || c.saleDetails.remainingBalance,
            remainingBal: c.saleDetails.remainingBalance,
            dueDate: c.saleDetails.dueDate,
            daysDiff: diffDays
          });
        }
      }
    });

    return items.sort((a, b) => a.daysDiff - b.daysDiff);
  }, [contracts]);

  const overdueCount = notifications.filter(n => n.type === 'OVERDUE').length;
  const dueSoonCount = notifications.filter(n => n.type === 'DUE_SOON').length;
  const totalUrgent = overdueCount + dueSoonCount;

  const filteredNotifications = useMemo(() => {
    if (filterType === 'overdue') return notifications.filter(n => n.type === 'OVERDUE');
    if (filterType === 'duesoon') return notifications.filter(n => n.type === 'DUE_SOON');
    return notifications;
  }, [notifications, filterType]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'contracts', label: 'Master Contracts', icon: FileText, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'vehicles', label: 'Vehicle Inventory', icon: Car },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'payments', label: 'Payment Ledger', icon: CreditCard },
    { id: 'reports', label: 'Reports & Export', icon: BarChart3 },
    { id: 'settings', label: 'Company Settings', icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-xs">
      {/* Top Meta Bar */}
      <div className="bg-slate-50/80 px-4 py-1.5 border-b border-slate-200 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1 text-slate-800 font-semibold">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            {settings.companyName}
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline text-slate-600">
            NTN: <strong className="text-slate-900">{settings.ntn}</strong>
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline text-slate-600">
            Lic #: <strong className="text-slate-900">{settings.licenseNumber}</strong>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            GT Road Main Branch (Islamabad)
          </span>

          {/* Admin User Label */}
          <div className="flex items-center space-x-1.5 bg-slate-100 border border-slate-200 rounded-md px-2.5 py-0.5 text-[11px] font-bold text-slate-800">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Admin System</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 p-0.5 shadow-sm flex items-center justify-center font-extrabold text-white text-lg group-hover:scale-105 transition-transform">
            N
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
              Naqeeb Motors
              <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                ERP v4.2
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 leading-none">
              Master Sale Agreement & Inventory Engine
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Agreement #, CNIC, Phone, Reg #, Chassis, Engine..."
            className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-slate-400 hover:text-slate-800 text-xs p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Create Master Contract Shortcut Button */}
          <button
            onClick={() => setActiveTab('contracts-new')}
            className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <FileText className="w-4 h-4" />
            + New Master Contract
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
                overdueCount > 0 
                  ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' 
                  : dueSoonCount > 0 
                  ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-200'
              }`}
              title="Installment Notifications & System Alerts"
            >
              <Bell className={`w-4 h-4 ${overdueCount > 0 ? 'text-red-600 animate-bounce' : ''}`} />
              {notifications.length > 0 && (
                <span className={`absolute -top-1 -right-1 min-w-[18px] h-4 px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-white ${
                  overdueCount > 0 ? 'bg-red-600 animate-pulse' : dueSoonCount > 0 ? 'bg-amber-600' : 'bg-sky-600'
                }`}>
                  {totalUrgent > 0 ? totalUrgent : notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute -right-2 sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-800 z-50 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className={`w-4 h-4 ${overdueCount > 0 ? 'text-red-600' : 'text-emerald-600'}`} />
                    <span className="text-xs font-bold text-slate-900">
                      Installment Notifications
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-800 text-xs font-bold px-1.5 py-0.5 rounded hover:bg-slate-100"
                  >
                    ✕
                  </button>
                </div>

                {/* Filter Pills */}
                <div className="flex gap-1.5 text-[10px] font-bold">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      filterType === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilterType('overdue')}
                    className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      filterType === 'overdue' ? 'bg-red-600 text-white border-red-600' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                    }`}
                  >
                    Overdue ({overdueCount})
                  </button>
                  <button
                    onClick={() => setFilterType('duesoon')}
                    className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      filterType === 'duesoon' ? 'bg-amber-600 text-white border-amber-600' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    Due Soon ({dueSoonCount})
                  </button>
                </div>

                {/* Notifications List Feed */}
                <div className="space-y-2 max-h-80 overflow-y-auto text-xs pr-1">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-500 text-xs">
                      No installment alerts found for this filter.
                    </div>
                  ) : (
                    filteredNotifications.map((n) => (
                      <div 
                        key={n.id}
                        className={`p-3 rounded-xl border space-y-1.5 transition-all ${
                          n.type === 'OVERDUE'
                            ? 'bg-red-50/80 border-red-200 text-red-950 hover:bg-red-100/80'
                            : n.type === 'DUE_SOON'
                            ? 'bg-amber-50/80 border-amber-200 text-amber-950 hover:bg-amber-100/80'
                            : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-slate-600">
                            {n.agmtNo}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                            n.type === 'OVERDUE'
                              ? 'bg-red-200 text-red-900 border-red-300 animate-pulse'
                              : n.type === 'DUE_SOON'
                              ? 'bg-amber-200 text-amber-900 border-amber-300'
                              : 'bg-sky-200 text-sky-900 border-sky-300'
                          }`}>
                            {n.title}
                          </span>
                        </div>

                        <div>
                          <p className="font-bold text-slate-900 text-xs">{n.buyerName}</p>
                          <p className="text-[11px] text-slate-600">{n.vehicleDesc}</p>
                        </div>

                        <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-200/60 font-semibold">
                          <span className="text-slate-600">
                            Due Date: <strong className="text-slate-900">{n.dueDate}</strong>
                          </span>
                          <span className="text-emerald-700 font-bold">
                            PKR {n.remainingBal.toLocaleString()}
                          </span>
                        </div>

                        {onViewContract && (
                          <button
                            onClick={() => {
                              onViewContract(n.contract);
                              setShowNotifications(false);
                            }}
                            className="w-full mt-1 py-1.5 bg-white hover:bg-slate-900 hover:text-white text-slate-800 rounded-lg text-[10px] font-bold border border-slate-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Record Payment / View Contract</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Bar (Desktop) */}
      <div className="hidden lg:block bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1 overflow-x-auto scrollbar-none py-1.5">
          {navItems.map((item: { id: string; label: string; icon: any; badge?: any; highlight?: boolean }) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'contracts' && activeTab.startsWith('contracts'));

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
                    : item.highlight
                    ? 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : item.highlight ? 'text-sky-600' : 'text-slate-500'}`} />
                {item.label}
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 p-4 space-y-2 text-xs">
          <div className="mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contracts, CNIC, VIN..."
              className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-left flex items-center gap-2 font-semibold ${
                    isActive ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
