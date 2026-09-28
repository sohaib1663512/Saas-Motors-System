import React, { useState } from 'react';
import { 
  INITIAL_COMPANY_SETTINGS, 
  INITIAL_CUSTOMERS, 
  INITIAL_VEHICLES, 
  INITIAL_CONTRACTS, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { MasterContract, Vehicle, Customer, CompanySettings, PaymentRecord } from './types';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ContractWizard } from './components/ContractWizard';
import { ContractDocumentView } from './components/ContractDocumentView';
import { VehicleManager } from './components/VehicleManager';
import { CustomerManager } from './components/CustomerManager';
import { PaymentManager } from './components/PaymentManager';
import { SettingsView } from './components/SettingsView';
import { ReportsView } from './components/ReportsView';
import { QRVerificationModal } from './components/QRVerificationModal';

export default function App() {
  // Global ERP State
  const [settings, setSettings] = useState<CompanySettings>(INITIAL_COMPANY_SETTINGS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [contracts, setContracts] = useState<MasterContract[]>(INITIAL_CONTRACTS);

  // Active Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active View Details
  const [activeContract, setActiveContract] = useState<MasterContract | null>(contracts[0] || null);
  const [qrVerifyContract, setQrVerifyContract] = useState<MasterContract | null>(null);

  // Event Handlers
  const handleSaveContract = (newContract: MasterContract) => {
    setContracts([newContract, ...contracts]);
    setActiveContract(newContract);
    setActiveTab('contract-detail');
  };

  const handleAddVehicle = (newVeh: Vehicle) => {
    setVehicles([newVeh, ...vehicles]);
  };

  const handleAddCustomer = (newCust: Customer) => {
    setCustomers([newCust, ...customers]);
  };

  const handleAddPayment = (newPay: PaymentRecord, nextDueDate?: string, nextInstallmentAmount?: number) => {
    setContracts(prevContracts => prevContracts.map(c => {
      if (c.id === newPay.contractId) {
        const updatedBal = Math.max(0, c.saleDetails.remainingBalance - newPay.amount);
        const isFullyPaid = updatedBal === 0;
        const updatedContract: MasterContract = {
          ...c,
          status: isFullyPaid ? 'Completed' : c.status,
          saleDetails: {
            ...c.saleDetails,
            remainingBalance: updatedBal,
            dueDate: isFullyPaid ? 'Fully Paid / Cleared' : (nextDueDate || c.saleDetails.dueDate),
            installmentAmount: nextInstallmentAmount !== undefined ? nextInstallmentAmount : c.saleDetails.installmentAmount
          },
          paymentHistory: [newPay, ...c.paymentHistory]
        };
        setActiveContract(prevActive => prevActive?.id === c.id ? updatedContract : prevActive);
        return updatedContract;
      }
      return c;
    }));
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Navbar & Global Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        settings={settings}
        contracts={contracts}
        onViewContract={(c) => {
          setActiveContract(c);
          setActiveTab('contract-detail');
        }}
        pendingCount={contracts.filter(c => c.saleDetails.remainingBalance > 0).length}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            contracts={contracts}
            vehicles={vehicles}
            customers={customers}
            onNewContract={() => setActiveTab('contracts-new')}
            onViewContract={(c) => {
              setActiveContract(c);
              setActiveTab('contract-detail');
            }}
            onVerifyQR={(c) => setQrVerifyContract(c)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'contracts' && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-5 text-slate-900 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Master Vehicle Sale Agreements</h2>
                <p className="text-xs text-slate-600 font-medium">12-section official master agreements with digital signatures</p>
              </div>
              <button
                onClick={() => setActiveTab('contracts-new')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                + New Master Contract
              </button>
            </div>

            {contracts.length === 0 ? (
              <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
                <p className="text-sm font-bold text-slate-800">No master contracts generated yet.</p>
                <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                  Start by clicking the button below to fill out seller, buyer, vehicle details and issue a clean agreement.
                </p>
                <button
                  onClick={() => setActiveTab('contracts-new')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  + Create Master Contract
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contracts.map(c => (
                  <div key={c.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-sm font-bold text-slate-900">{c.agreementNumber}</span>
                        <p className="text-xs text-slate-500">{c.date}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        {c.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <p><strong>Buyer:</strong> {c.buyer.fullName} ({c.buyer.cnic})</p>
                      <p><strong>Vehicle:</strong> {c.vehicle.company} {c.vehicle.make} ({c.vehicle.registrationNumber})</p>
                      <p><strong>Net Price:</strong> PKR {c.saleDetails.netPrice.toLocaleString()}</p>
                      <p><strong>Remaining:</strong> PKR {c.saleDetails.remainingBalance.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <button
                        onClick={() => {
                          setActiveContract(c);
                          setActiveTab('contract-detail');
                        }}
                        className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        Open Master Agreement
                      </button>
                      <button
                        onClick={() => setQrVerifyContract(c)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 font-bold text-xs transition-all cursor-pointer"
                      >
                        Verify ID
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'contracts-new' && (
          <ContractWizard
            vehicles={vehicles}
            customers={customers}
            settings={settings}
            onSaveContract={handleSaveContract}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'contract-detail' && activeContract && (
          <ContractDocumentView
            contract={activeContract}
            settings={settings}
            onBack={() => setActiveTab('contracts')}
            onVerifyQR={(c) => setQrVerifyContract(c)}
            onAddPayment={handleAddPayment}
          />
        )}

        {activeTab === 'vehicles' && (
          <VehicleManager
            vehicles={vehicles}
            onAddVehicle={handleAddVehicle}
            onUpdateVehicle={(v) => setVehicles(vehicles.map(item => item.id === v.id ? v : item))}
          />
        )}

        {activeTab === 'customers' && (
          <CustomerManager
            customers={customers}
            onAddCustomer={handleAddCustomer}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentManager
            contracts={contracts}
            onAddPayment={handleAddPayment}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            contracts={contracts}
            vehicles={vehicles}
            customers={customers}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
          />
        )}
      </main>

      {/* QR Verification Modal */}
      <QRVerificationModal
        contract={qrVerifyContract}
        settings={settings}
        onClose={() => setQrVerifyContract(null)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-600 py-6 px-4 text-center text-xs space-y-1">
        <p className="font-semibold text-slate-800">{settings.companyName} — Enterprise Dealership Management ERP</p>
        <p className="text-[11px] text-slate-500">{settings.footerText}</p>
      </footer>
    </div>
  );
}
