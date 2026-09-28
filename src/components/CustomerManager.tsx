import React, { useState, useRef } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  FileText, 
  AlertCircle, 
  X,
  CreditCard,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Customer } from '../types';

interface CustomerManagerProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
}

export const CustomerManager: React.FC<CustomerManagerProps> = ({
  customers,
  onAddCustomer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [cnicFrontUrl, setCnicFrontUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80");
  const [cnicBackUrl, setCnicBackUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80");

  const cnicFrontInputRef = useRef<HTMLInputElement | null>(null);
  const cnicBackInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
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

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.cnic.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    );
  });

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      fullName,
      fatherName,
      cnic,
      phone,
      address,
      notes,
      createdAt: new Date().toISOString().split('T')[0],
      riskRating: 'Low',
      totalPurchases: 0,
      pendingBalance: 0,
      cnicFrontUrl,
      cnicBackUrl
    };

    onAddCustomer(newCust);
    setShowAddModal(false);
    setFullName('');
    setFatherName('');
    setCnic('');
    setPhone('');
    setAddress('');
  };

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-emerald-50 via-sky-50 to-emerald-50 rounded-2xl p-5 text-slate-900 border border-sky-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Customer Directory & Legal Dossiers
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Single-entry profiles, CNIC verification records, & payment ledgers
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          + Add New Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, CNIC number, or phone..."
            className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Total Directory: <strong>{customers.length} Clients</strong>
        </span>
      </div>

      {/* Customers List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
            <p className="text-sm font-bold text-slate-800">No customers registered in directory.</p>
            <p className="text-xs text-slate-500 font-medium">Click below to add a new customer profile.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              + Add New Customer
            </button>
          </div>
        ) : (
          filteredCustomers.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold text-lg flex items-center justify-center shrink-0">
                    {c.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{c.fullName}</h3>
                    <p className="text-[11px] text-slate-500">S/O {c.fatherName}</p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  c.riskRating === 'Low' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {c.riskRating || 'Low Risk'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="font-mono font-bold">{c.cnic}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{c.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-600 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{c.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-100 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block font-medium">Purchases</span>
                  <strong className="text-slate-900">{c.totalPurchases} Vehicles</strong>
                </div>
                <div className="bg-amber-50 p-2 rounded-xl border border-amber-100">
                  <span className="text-[10px] text-amber-600 uppercase block font-medium">Pending Bal</span>
                  <strong className="text-amber-700 font-mono">{formatPKR(c.pendingBalance)}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedCustomer(c)}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              View Full Profile & CNIC Scans
            </button>
          </div>
        )))}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Add Customer Profile</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Chaudhry Tariq Mehmood"
                  className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Father / Husband Name *</label>
                <input
                  type="text"
                  required
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="e.g. Muhammad Aslam"
                  className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">CNIC Number *</label>
                <input
                  type="text"
                  required
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  placeholder="e.g. 37405-1234567-1"
                  className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +92 300 9876543"
                  className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Residential Address *</label>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300"
                />
              </div>

              {/* CNIC Image Scans Upload */}
              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[11px]">CNIC Front Scan Image</label>
                  <div className="h-20 bg-slate-50 border border-slate-300 rounded-lg flex items-center justify-center p-1 mb-1.5 overflow-hidden">
                    <img src={cnicFrontUrl} alt="CNIC Front" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={cnicFrontUrl}
                      onChange={(e) => setCnicFrontUrl(e.target.value)}
                      placeholder="Image URL"
                      className="w-full p-1.5 bg-slate-50 rounded border text-[10px]"
                    />
                    <label 
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      Upload
                      <input
                        ref={cnicFrontInputRef}
                        type="file"
                        accept="image/*"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleFileUpload(e, setCnicFrontUrl)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[11px]">CNIC Back Scan Image</label>
                  <div className="h-20 bg-slate-50 border border-slate-300 rounded-lg flex items-center justify-center p-1 mb-1.5 overflow-hidden">
                    <img src={cnicBackUrl} alt="CNIC Back" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={cnicBackUrl}
                      onChange={(e) => setCnicBackUrl(e.target.value)}
                      placeholder="Image URL"
                      className="w-full p-1.5 bg-slate-50 rounded border text-[10px]"
                    />
                    <label 
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      Upload
                      <input
                        ref={cnicBackInputRef}
                        type="file"
                        accept="image/*"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleFileUpload(e, setCnicBackUrl)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Customer Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Full Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedCustomer.fullName}</h3>
                <p className="text-xs text-slate-500">S/O {selectedCustomer.fatherName}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p><strong>CNIC:</strong> {selectedCustomer.cnic}</p>
                <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                <p><strong>Address:</strong> {selectedCustomer.address}</p>
                <p><strong>Registered Date:</strong> {selectedCustomer.createdAt}</p>
                {selectedCustomer.notes && <p className="text-slate-600 italic mt-1">"{selectedCustomer.notes}"</p>}
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-2">Attached CNIC Scans:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border p-2 rounded-lg text-center bg-slate-50">
                    <span className="text-[10px] text-slate-500 block">CNIC Front</span>
                    <img src={selectedCustomer.cnicFrontUrl} alt="Front" className="h-20 object-contain mx-auto mt-1" />
                  </div>
                  <div className="border p-2 rounded-lg text-center bg-slate-50">
                    <span className="text-[10px] text-slate-500 block">CNIC Back</span>
                    <img src={selectedCustomer.cnicBackUrl} alt="Back" className="h-20 object-contain mx-auto mt-1" />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
