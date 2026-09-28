import React, { useState, useRef } from 'react';
import { 
  Car, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  X, 
  FileText, 
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Vehicle, VehicleStatus } from '../types';

interface VehicleManagerProps {
  vehicles: Vehicle[];
  onAddVehicle: (vehicle: Vehicle) => void;
  onUpdateVehicle: (vehicle: Vehicle) => void;
}

export const VehicleManager: React.FC<VehicleManagerProps> = ({
  vehicles,
  onAddVehicle,
  onUpdateVehicle
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // New Vehicle Form State
  const [regNo, setRegNo] = useState('');
  const [vin, setVin] = useState('');
  const [engine, setEngine] = useState('');
  const [chassis, setChassis] = useState('');
  const [company, setCompany] = useState('Toyota');
  const [make, setMake] = useState('Land Cruiser Prado');
  const [model, setModel] = useState('TX-L');
  const [variant, setVariant] = useState('2.8L Diesel');
  const [year, setYear] = useState(2024);
  const [color, setColor] = useState('Pearl White');
  const [mileage, setMileage] = useState(15000);
  const [fuel, setFuel] = useState<'Petrol' | 'Diesel' | 'Hybrid' | 'EV'>('Diesel');
  const [transmission, setTransmission] = useState<'Automatic' | 'Manual'>('Automatic');
  const [price, setPrice] = useState(38000000);
  const [status, setStatus] = useState<VehicleStatus>('Available');
  const [vehiclePhotoUrl, setVehiclePhotoUrl] = useState("https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80");
  const vehiclePhotoInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setVehiclePhotoUrl(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesStatus = filterStatus === 'ALL' || v.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      v.registrationNumber.toLowerCase().includes(q) ||
      v.chassisNumber.toLowerCase().includes(q) ||
      v.make.toLowerCase().includes(q) ||
      v.company.toLowerCase().includes(q) ||
      v.vin.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const handleSaveNewVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const newVeh: Vehicle = {
      id: `veh-${Date.now()}`,
      registrationNumber: regNo || 'ICT-2026-991',
      vin: vin || `VIN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      engineNumber: engine || '1GD-992019',
      chassisNumber: chassis || 'GDJ150-10293',
      company,
      make,
      model,
      variant,
      year: Number(year),
      color,
      mileage: Number(mileage),
      fuel,
      transmission,
      price: Number(price),
      status,
      originalCard: true,
      smartCard: true,
      originalPlates: true,
      secondKey: true,
      transferLetter: true,
      accessories: 'Factory standard package, alloy wheels, floor mats',
      images: [vehiclePhotoUrl],
      history: [
        { date: new Date().toISOString().split('T')[0], note: 'Vehicle added to showroom inventory.', user: 'Inventory Officer' }
      ]
    };

    onAddVehicle(newVeh);
    setShowAddModal(false);
  };

  const formatPKR = (val: number) => {
    if (val >= 10000000) return `PKR ${(val / 10000000).toFixed(2)} Crore`;
    if (val >= 100000) return `PKR ${(val / 100000).toFixed(2)} Lakh`;
    return `PKR ${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-emerald-50 via-sky-50 to-emerald-50 rounded-2xl p-5 text-slate-900 border border-sky-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Car className="w-5 h-5 text-emerald-600" />
            Showroom Vehicle Inventory
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Real-time stock control, specs verification, & document checklists
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          + Add Vehicle to Inventory
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'Available', 'Reserved', 'Sold', 'Maintenance'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search make, reg #, VIN, chassis..."
            className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
            <p className="text-sm font-bold text-slate-800">No vehicles found in inventory.</p>
            <p className="text-xs text-slate-500 font-medium">Click below to add a new vehicle to the showroom stock.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              + Add Vehicle to Inventory
            </button>
          </div>
        ) : (
          filteredVehicles.map((v) => (
          <div 
            key={v.id} 
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            {/* Image Banner */}
            <div className="relative h-48 bg-slate-900 overflow-hidden">
              <img
                src={v.images[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80'}
                alt={v.make}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono font-bold text-xs border border-slate-700">
                {v.registrationNumber}
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md ${
                  v.status === 'Available' ? 'bg-emerald-500 text-slate-950' :
                  v.status === 'Reserved' ? 'bg-amber-500 text-slate-950' :
                  v.status === 'Sold' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-white'
                }`}>
                  {v.status}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md p-2 rounded-xl text-white flex justify-between items-center text-xs">
                <span className="font-bold">{v.company} {v.make}</span>
                <span className="font-mono text-emerald-400 font-extrabold">{formatPKR(v.price)}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Model / Year</span>
                  <strong className="text-slate-800">{v.model} ({v.year})</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Mileage / Fuel</span>
                  <strong className="text-slate-800">{v.mileage.toLocaleString()} km • {v.fuel}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Chassis #</span>
                  <strong className="font-mono text-slate-900 truncate block">{v.chassisNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Engine #</span>
                  <strong className="font-mono text-slate-900 truncate block">{v.engineNumber}</strong>
                </div>
              </div>

              {/* Documents Status Pills */}
              <div className="flex flex-wrap gap-1 text-[10px]">
                {v.smartCard && <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">✓ Smart Card</span>}
                {v.originalCard && <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">✓ Orig Card</span>}
                {v.originalPlates && <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">✓ Orig Plates</span>}
                {v.secondKey && <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">✓ 2nd Key</span>}
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedVehicle(v)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                Inspect Full Specs
              </button>
              <span className="text-[10px] text-slate-400 font-mono">ID: {v.id}</span>
            </div>
          </div>
        )))}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                Add Vehicle to Showroom Stock
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Company / Brand *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Make / Model *</label>
                  <input
                    type="text"
                    required
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Variant *</label>
                  <input
                    type="text"
                    required
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Registration # *</label>
                  <input
                    type="text"
                    required
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Chassis Number *</label>
                  <input
                    type="text"
                    required
                    value={chassis}
                    onChange={(e) => setChassis(e.target.value)}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Engine Number *</label>
                  <input
                    type="text"
                    required
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Vehicle Photo Upload Section */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-slate-800 font-bold mb-1">Vehicle Main Display Photo</label>
                <div className="h-36 bg-slate-900 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center overflow-hidden mb-2 relative group">
                  <img src={vehiclePhotoUrl} alt="Vehicle Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => vehiclePhotoInputRef.current?.click()}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <Upload className="w-4 h-4" />
                      Change Photo
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={vehiclePhotoUrl}
                    onChange={(e) => setVehiclePhotoUrl(e.target.value)}
                    placeholder="Enter image URL or upload image file..."
                    className="w-full bg-slate-50 p-2 rounded-lg border border-slate-300 text-xs"
                  />
                  <label 
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                    <input
                      ref={vehiclePhotoInputRef}
                      type="file"
                      accept="image/*"
                      onClick={(e) => e.stopPropagation()}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
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
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vehicle Inspection Detail Drawer */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedVehicle.company} {selectedVehicle.make}</h3>
                <p className="text-xs text-slate-500 font-mono">REG: {selectedVehicle.registrationNumber}</p>
              </div>
              <button onClick={() => setSelectedVehicle(null)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">VIN</span>
                  <strong className="font-mono text-slate-900">{selectedVehicle.vin}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Asking Price</span>
                  <strong className="font-mono text-emerald-700 text-sm">{formatPKR(selectedVehicle.price)}</strong>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Inspection & Activity History:</h4>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {selectedVehicle.history.map((h, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-lg text-[11px]">
                      <span className="text-slate-400 text-[10px] block">{h.date} • {h.user}</span>
                      <p className="text-slate-700 font-medium">{h.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedVehicle(null)}
              className="w-full py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
