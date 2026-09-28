import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, Check, Tablet, ShieldCheck, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
  title: string;
  signeeName?: string;
  roleLabel: string;
  initialSignature?: string;
  defaultMode?: 'draw' | 'upload';
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  signeeName,
  roleLabel,
  initialSignature,
  defaultMode = 'draw'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState<'draw' | 'upload'>(defaultMode);
  
  // Draw State
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [penColor, setPenColor] = useState('#0f172a'); // midnight navy/black
  const [penWidth] = useState(2.5);

  // Upload State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultMode);
      setUploadedImage(null);
      if (defaultMode === 'draw') {
        setTimeout(() => {
          initCanvas();
        }, 100);
      }
    }
  }, [isOpen, defaultMode]);

  useEffect(() => {
    if (isOpen && activeTab === 'draw') {
      setTimeout(() => {
        initCanvas();
      }, 50);
    }
  }, [activeTab]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPR crisp quality
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Clear background to white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw baseline
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(30, rect.height - 35);
    ctx.lineTo(rect.width - 30, rect.height - 35);
    ctx.stroke();
    ctx.setLineDash([]);

    // Line text
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('SIGN HERE / SIGNATURE LINE', 30, rect.height - 18);

    setHasDrawn(false);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    initCanvas();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setUploadedImage(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
    } else if (activeTab === 'upload' && uploadedImage) {
      onSave(uploadedImage);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600/30 rounded-lg text-indigo-400">
              <Tablet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="text-xs text-slate-400">{roleLabel} {signeeName ? `— ${signeeName}` : ''}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option Tabs (Draw vs Upload) */}
        <div className="bg-slate-100 p-1.5 flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('draw')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'draw'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tablet className="w-4 h-4 text-indigo-600" />
            Draw on Digital Pad
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            Upload Signature Image
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {activeTab === 'draw' ? (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Touch / Stylus / Mouse Signature Capture
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setPenColor('#0f172a')}
                    className={`w-5 h-5 rounded-full bg-slate-900 border-2 cursor-pointer ${penColor === '#0f172a' ? 'border-indigo-500 scale-110' : 'border-transparent'}`}
                    title="Black Ink"
                  />
                  <button
                    type="button"
                    onClick={() => setPenColor('#1e40af')}
                    className={`w-5 h-5 rounded-full bg-blue-800 border-2 cursor-pointer ${penColor === '#1e40af' ? 'border-indigo-500 scale-110' : 'border-transparent'}`}
                    title="Blue Ink"
                  />
                </div>
              </div>

              {/* Canvas Wrapper */}
              <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 overflow-hidden shadow-inner touch-none">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-52 cursor-crosshair block"
                />
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                Upload a scanned signature, photo, or transparent PNG image file:
              </div>

              {uploadedImage ? (
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-emerald-300 flex flex-col items-center justify-center space-y-2">
                  <p className="text-[11px] font-bold text-emerald-800">Signature Image Preview:</p>
                  <div className="h-28 bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-center max-w-full">
                    <img src={uploadedImage} alt="Uploaded Signature" className="max-h-24 object-contain" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedImage(null)}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove & Upload Different Image
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/40 rounded-2xl cursor-pointer text-center space-y-3 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Click or Drag & Drop Signature File</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Supports PNG, JPG, JPEG, WEBP or SVG formats</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          )}

          <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-2">
            <span>By signing or uploading above, you confirm agreeing to Naqeeb Motors Master Vehicle Sale Agreement terms under ETO 2002.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          {activeTab === 'draw' ? (
            <button
              type="button"
              onClick={clearCanvas}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eraser className="w-4 h-4" />
              Clear Pad
            </button>
          ) : (
            <span className="text-[10px] text-slate-500 font-medium">Image Upload Mode</span>
          )}

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={activeTab === 'draw' ? !hasDrawn : !uploadedImage}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Apply Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

