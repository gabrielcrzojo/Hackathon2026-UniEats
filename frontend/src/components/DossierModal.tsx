import React from 'react';
import { Vendor } from '../types';

interface DossierModalProps {
  vendor: Vendor | null;
  onClose: () => void;
  onUpdateStatus?: (vendorId: string, newStatus: 'regular' | 'suspenso') => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({
  vendor,
  onClose,
  onUpdateStatus
}) => {
  if (!vendor) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#263143]/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-200 my-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <img 
              src={vendor.avatarUrl} 
              alt={vendor.name} 
              className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-[#003366]/20"
            />
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Dossiê Sanitário & Cadastral
              </span>
              <h3 className="text-lg text-[#001e40] font-bold">
                {vendor.name}
              </h3>
              <p className="text-xs text-slate-500">
                {vendor.businessName} • {vendor.pointName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="space-y-4 mt-4 text-xs">
          {/* Status summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Status Sanitário</span>
              <span className={`font-bold mt-0.5 inline-block ${
                vendor.status === 'regular' ? 'text-green-700' :
                vendor.status === 'pendente' ? 'text-amber-700' : 'text-red-700'
              }`}>
                {vendor.statusText}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Alvará Número</span>
              <span className="font-semibold text-slate-800 mt-0.5 inline-block">{vendor.alvaraNumber}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Validade</span>
              <span className="font-semibold text-slate-800 mt-0.5 inline-block">{vendor.alvaraValidUntil}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Processo SEI</span>
              <span className="font-mono text-[10px] text-slate-700 mt-0.5 inline-block">{vendor.seiProcessNumber}</span>
            </div>
          </div>

          {/* Legal and Privacy Information */}
          <div className="bg-[#f0f3ff] rounded-xl p-3 border border-[#d8e3fb]">
            <h4 className="font-bold text-[#001e40] text-xs mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#003366]">fingerprint</span>
              <span>Identificação do Titular (LGPD Protegido)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              <div>
                <span className="text-slate-500">CPF Mascarado:</span>{' '}
                <span className="font-mono font-semibold">{vendor.cpfMasked}</span>
              </div>
              <div>
                <span className="text-slate-500">E-mail:</span>{' '}
                <span className="font-medium">{vendor.email}</span>
              </div>
              <div>
                <span className="text-slate-500">WhatsApp Oficial:</span>{' '}
                <span className="font-medium">+{vendor.phoneWhatsapp}</span>
              </div>
              <div>
                <span className="text-slate-500">Hash SHA-256:</span>{' '}
                <span className="font-mono text-[10px]">{vendor.cryptoHash.slice(0, 14)}...</span>
              </div>
            </div>
          </div>

          {/* Checklist of audited documents */}
          <div>
            <h4 className="font-bold text-[#001e40] text-xs mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-green-700">fact_check</span>
              <span>Laudos & Documentos Auditados pela DIVISA / DAC</span>
            </h4>
            <div className="space-y-1.5">
              {vendor.safetyChecklist.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                    <span className="text-slate-800 font-medium">{item}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Autenticado SEI-UnB</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="p-3 rounded-lg bg-slate-50 text-slate-600">
            <span className="font-semibold text-slate-700 block mb-0.5">Descrição Cadastral:</span>
            {vendor.description}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            {onUpdateStatus && vendor.status === 'regular' && (
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus(vendor.id, 'suspenso');
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 font-semibold hover:bg-red-100 transition-colors"
              >
                Suspender Cautelarmente
              </button>
            )}
            {onUpdateStatus && vendor.status === 'suspenso' && (
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus(vendor.id, 'regular');
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 font-semibold hover:bg-green-100 transition-colors"
              >
                Reativar Ponto
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#001e40] text-white font-semibold hover:bg-[#003366] transition-colors"
            >
              Fechar Dossiê
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
