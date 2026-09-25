import React from 'react';
import { Vendor } from '../types';

interface QrCodeDetailModalProps {
  vendor: Vendor | null;
  onClose: () => void;
  onCopyLink: (text: string) => void;
}

export const QrCodeDetailModal: React.FC<QrCodeDetailModalProps> = ({
  vendor,
  onClose,
  onCopyLink
}) => {
  if (!vendor) return null;

  const isRegular = vendor.status === 'regular';

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = `https://unibeats.unb.br/fiscalizacao/validar/${vendor.cryptoHash}`;
    navigator.clipboard?.writeText(url);
    onCopyLink(`Link de validação copiado: ${vendor.cryptoHash.slice(0, 10)}...`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#263143]/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200/80 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
          type="button"
          aria-label="Fechar"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#e7eeff] text-[#001e40] mx-auto mb-1">
            <span className="material-symbols-outlined text-2xl text-[#003366]">verified_user</span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Selo Oficial de Fiscalização DAC / UnB
            </span>
            <h3 className="text-xl text-[#001e40] font-bold mt-0.5">
              {vendor.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {vendor.pointName} • {vendor.businessName}
            </p>
          </div>

          {/* QR Code SVG */}
          <div className="p-4 bg-white rounded-xl shadow-inner border-2 border-dashed border-slate-300 inline-block my-1">
            <svg className="w-44 h-44 mx-auto" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <rect fill="white" height="200" width="200" />
              {/* Corner Markers */}
              <rect fill="#001e40" height="45" rx="6" width="45" x="15" y="15" />
              <rect fill="white" height="25" rx="3" width="25" x="25" y="25" />
              <rect fill="#001e40" height="15" rx="2" width="15" x="30" y="30" />
              
              <rect fill="#001e40" height="45" rx="6" width="45" x="140" y="15" />
              <rect fill="white" height="25" rx="3" width="25" x="150" y="25" />
              <rect fill="#001e40" height="15" rx="2" width="15" x="155" y="30" />
              
              <rect fill="#001e40" height="45" rx="6" width="45" x="15" y="140" />
              <rect fill="white" height="25" rx="3" width="25" x="25" y="150" />
              <rect fill="#001e40" height="15" rx="2" width="15" x="30" y="155" />
              
              {/* Data Bits */}
              <rect fill="#001e40" height="12" rx="2" width="12" x="70" y="20" />
              <rect fill="#001e40" height="12" rx="2" width="12" x="90" y="20" />
              <rect fill="#001e40" height="12" rx="2" width="12" x="110" y="20" />
              <rect fill="#001e40" height="12" rx="2" width="12" x="70" y="40" />
              <rect fill="#001e40" height="12" rx="2" width="12" x="110" y="40" />
              <rect fill="#001e40" height="12" rx="2" width="24" x="70" y="60" />
              <rect fill="#001e40" height="12" rx="2" width="12" x="105" y="60" />
              
              {/* Center UnB Crest Marker */}
              <rect fill="#003366" height="40" rx="8" width="40" x="80" y="80" />
              <circle cx="100" cy="100" fill="#80fd88" r="12" />
              <path d="M96 100L99 103L105 97" stroke="#001e40" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              
              <rect fill="#001e40" height="12" rx="2" width="12" x="20" y="70" />
              <rect fill="#001e40" height="12" rx="2" width="12" x="40" y="70" />
              <rect fill="#001e40" height="12" rx="2" width="12" x="140" y="70" />
              <rect fill="#001e40" height="12" rx="2" width="12" x="165" y="70" />
              <rect fill="#001e40" height="12" rx="2" width="12" x="140" y="90" />
              <rect fill="#001e40" height="24" rx="2" width="12" x="70" y="130" />
              <rect fill="#001e40" height="12" rx="2" width="24" x="90" y="140" />
              <rect fill="#001e40" height="12" rx="2" width="12" x="125" y="130" />
              <rect fill="#001e40" height="12" rx="2" width="20" x="140" y="140" />
              <rect fill="#001e40" height="12" rx="2" width="12" x="170" y="140" />
              <rect fill="#001e40" height="20" rx="2" width="12" x="150" y="160" />
              <rect fill="#001e40" height="12" rx="2" width="12" x="170" y="170" />
              <rect fill="#001e40" height="12" rx="2" width="20" x="70" y="170" />
              <rect fill="#001e40" height="12" rx="2" width="15" x="100" y="170" />
            </svg>
          </div>

          {/* Verification Details */}
          <div className="bg-[#f0f3ff] rounded-xl p-3.5 space-y-2 text-left text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Status do QR:</span>
              {isRegular ? (
                <span className="font-bold text-[#006e22] flex items-center gap-1.5 bg-[#80fd88]/30 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006e22]"></span> ATIVO / REGULAR
                </span>
              ) : vendor.status === 'pendente' ? (
                <span className="font-bold text-amber-700 flex items-center gap-1.5 bg-amber-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> EM ANÁLISE
                </span>
              ) : (
                <span className="font-bold text-[#ba1a1a] flex items-center gap-1.5 bg-[#ffdad6] px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span> SUSPENSO / INATIVO
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Número do Alvará:</span>
              <span className="font-semibold text-[#001e40]">{vendor.alvaraNumber}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Hash Criptográfico:</span>
              <span className="font-mono text-[11px] text-[#003366] bg-white px-2 py-0.5 rounded border border-slate-200">
                {vendor.cryptoHash}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Validade do Selo:</span>
              <span className="font-semibold text-slate-800">{vendor.alvaraValidUntil}</span>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 text-slate-400">
              <span className="text-[11px]">Carimbo de Tempo:</span>
              <span className="text-[11px] font-mono">2026-09-24 16:24:00 UTC-3</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handlePrint}
              type="button"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#001e40] text-white text-sm font-semibold hover:bg-[#003366] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Imprimir Selo A4</span>
            </button>
            <button
              onClick={handleShare}
              type="button"
              title="Copiar URL de Fiscalização Externa"
              className="p-2.5 rounded-xl bg-[#e7eeff] text-[#001e40] hover:bg-[#d8e3fb] transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg">share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
