import React, { useState } from 'react';
import { Vendor } from '../types';

interface QrScannerModalProps {
  vendors: Vendor[];
  isOpen: boolean;
  onClose: () => void;
  onSelectVendor: (vendor: Vendor) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  vendors,
  isOpen,
  onClose,
  onSelectVendor
}) => {
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleaned = query.trim().toLowerCase();
    
    if (!cleaned) {
      setErrorMessage('Digite o número do alvará, hash ou nome do vendedor.');
      return;
    }

    const found = vendors.find(v => 
      v.alvaraNumber.toLowerCase().includes(cleaned) ||
      v.cryptoHash.toLowerCase().includes(cleaned) ||
      v.name.toLowerCase().includes(cleaned) ||
      v.businessName.toLowerCase().includes(cleaned)
    );

    if (found) {
      onSelectVendor(found);
      onClose();
    } else {
      setErrorMessage('Nenhum registro sanitário oficial encontrado com este identificador.');
    }
  };

  const handleSimulateScan = (vendor: Vendor) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onSelectVendor(vendor);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#001e40]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-[#001e40] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-[#80fd88]">
              <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
            </div>
            <div>
              <h4 className="text-base font-bold">Validação de Selo QR Code</h4>
              <p className="text-xs text-slate-300">Auditoria Sanitária e Procedência em Tempo Real</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Simulated Scanner Viewport */}
          <div className="relative rounded-2xl bg-slate-900 overflow-hidden h-44 flex flex-col items-center justify-center text-center p-4 border border-slate-700">
            {isScanning ? (
              <div className="flex flex-col items-center gap-2 text-white">
                <span className="w-8 h-8 border-3 border-[#80fd88] border-t-transparent rounded-full animate-spin"></span>
                <span className="text-xs font-mono text-[#80fd88]">Decodificando assinatura criptográfica SHA-256...</span>
              </div>
            ) : (
              <>
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-[#80fd88] shadow-[0_0_12px_#80fd88] animate-pulse"></div>
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">center_focus_strong</span>
                <p className="text-xs text-slate-300 max-w-xs">
                  Aponte para o totem de fiscalização adesivado na barraca ou digite os dados abaixo.
                </p>
              </>
            )}
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Ou consulte por Alvará / Hash / Nome
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ex: DAC-2025-0819 ou 0x8f4c2e..."
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366] transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#003366] text-white rounded-xl text-sm font-semibold hover:bg-[#001e40] transition-colors"
              >
                Verificar
              </button>
            </div>
            {errorMessage && (
              <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
            )}
          </form>

          {/* Quick presets for test */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Pontos Cadastrados no Campus Gama (Teste Rápido):
            </span>
            <div className="grid grid-cols-2 gap-2">
              {vendors.slice(0, 4).map(v => (
                <button
                  key={v.id}
                  onClick={() => handleSimulateScan(v)}
                  className="p-2.5 rounded-xl border border-slate-200 text-left hover:border-[#003366] hover:bg-[#f0f3ff] transition-all text-xs"
                >
                  <span className="font-bold text-[#001e40] block truncate">{v.name}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{v.pointName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
