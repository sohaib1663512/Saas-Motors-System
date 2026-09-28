import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Upload, 
  RotateCcw, 
  Save, 
  FileCode2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { CompanySettings } from '../types';
import { DEFAULT_LEGAL_CLAUSES } from '../data/mockData';

interface SettingsViewProps {
  settings: CompanySettings;
  onUpdateSettings: (newSettings: CompanySettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings
}) => {
  const [formData, setFormData] = useState<CompanySettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Legal Clauses CRUD
  const handleClauseChange = (index: number, value: string) => {
    const updated = [...formData.legalClauses];
    updated[index] = value;
    setFormData({ ...formData, legalClauses: updated });
  };

  const handleAddClause = () => {
    const nextNum = formData.legalClauses.length + 1;
    const newClause = `${nextNum}. NEW CLAUSE: Enter specific legal agreement clause terms and condition details here.`;
    setFormData({ ...formData, legalClauses: [...formData.legalClauses, newClause] });
  };

  const handleDeleteClause = (index: number) => {
    const updated = formData.legalClauses.filter((_, i) => i !== index);
    setFormData({ ...formData, legalClauses: updated });
  };

  const handleMoveClause = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.legalClauses.length) return;
    
    const updated = [...formData.legalClauses];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    
    setFormData({ ...formData, legalClauses: updated });
  };

  const handleResetClauses = () => {
    if (window.confirm("Are you sure you want to reset to the default master legal clauses? Any custom clause edits will be replaced.")) {
      setFormData({ ...formData, legalClauses: [...DEFAULT_LEGAL_CLAUSES] });
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'stampUrl' | 'ownerSignatureUrl') => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setFormData(prev => ({ ...prev, [field]: evt.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="bg-slate-50 rounded-2xl p-5 text-slate-900 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-800" />
            Dealership Configuration & Master Legal Terms
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Manage company branding, stamp graphics, owner signatures, & master legal clauses
          </p>
        </div>

        {saveSuccess && (
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs animate-in fade-in">
            ✓ Settings Updated Successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: BRANDING & IMAGES */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-indigo-600" />
            Branding, Company Stamps & Owner Signatures
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Logo */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-800">Company Logo Graphic</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center h-28 relative group overflow-hidden">
                <img src={formData.logoUrl} alt="Logo" className="max-h-20 object-contain" />
                <label 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  <span className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-md">
                    <Upload className="w-3.5 h-3.5" />
                    Upload Image File
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleImageUpload(e, 'logoUrl')}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="Image URL"
                  className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 text-[11px]"
                />
                <label 
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleImageUpload(e, 'logoUrl')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Stamp */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-800">Official Company Stamp</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center h-28 relative group overflow-hidden">
                <img src={formData.stampUrl} alt="Stamp" className="max-h-20 object-contain opacity-80" />
                <label 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  <span className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-md">
                    <Upload className="w-3.5 h-3.5" />
                    Upload Image File
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleImageUpload(e, 'stampUrl')}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.stampUrl}
                  onChange={(e) => setFormData({ ...formData, stampUrl: e.target.value })}
                  placeholder="Image URL"
                  className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 text-[11px]"
                />
                <label 
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleImageUpload(e, 'stampUrl')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Owner Sig */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-800">Owner Exec Signature</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center h-28 relative group overflow-hidden">
                <img src={formData.ownerSignatureUrl} alt="Owner Sig" className="max-h-20 object-contain" />
                <label 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  <span className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-md">
                    <Upload className="w-3.5 h-3.5" />
                    Upload Image File
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleImageUpload(e, 'ownerSignatureUrl')}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.ownerSignatureUrl}
                  onChange={(e) => setFormData({ ...formData, ownerSignatureUrl: e.target.value })}
                  placeholder="Image URL or Base64"
                  className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 text-[11px]"
                />
                <label 
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleImageUpload(e, 'ownerSignatureUrl')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: COMPANY META & BANK DETAILS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Company Metadata & Bank Account Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">NTN Number</label>
              <input
                type="text"
                value={formData.ntn}
                onChange={(e) => setFormData({ ...formData, ntn: e.target.value })}
                className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">License Number</label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Account Title</label>
              <input
                type="text"
                value={formData.accountTitle}
                onChange={(e) => setFormData({ ...formData, accountTitle: e.target.value })}
                className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">IBAN Number</label>
              <input
                type="text"
                value={formData.iban}
                onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: MASTER LEGAL TERMS CRUD EDITOR */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-indigo-600" />
                Master Legal Terms & Conditions Manager (CRUD)
              </h3>
              <p className="text-xs text-slate-500">Edit existing clauses, add custom terms, or reorder agreement clauses</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-bold text-xs border border-indigo-200">
                Total: {formData.legalClauses.length} Clauses
              </span>

              <button
                type="button"
                onClick={handleResetClauses}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reset to default 30 legal terms"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>

              <button
                type="button"
                onClick={handleAddClause}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add New Clause
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 text-xs">
            {formData.legalClauses.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500">
                No legal clauses available. Click <strong>Add New Clause</strong> above or <strong>Reset Defaults</strong>.
              </div>
            ) : (
              formData.legalClauses.map((clause, idx) => (
                <div key={idx} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2 hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-extrabold text-slate-700">
                      Clause #{idx + 1}
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveClause(idx, 'up')}
                        className="p-1 rounded bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30 border border-slate-200 transition-colors cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === formData.legalClauses.length - 1}
                        onClick={() => handleMoveClause(idx, 'down')}
                        className="p-1 rounded bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30 border border-slate-200 transition-colors cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClause(idx)}
                        className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer ml-1"
                        title="Delete Clause"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={clause}
                    onChange={(e) => handleClauseChange(idx, e.target.value)}
                    rows={2}
                    className="w-full p-2.5 bg-white rounded-lg border border-slate-300 text-xs font-serif text-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};

