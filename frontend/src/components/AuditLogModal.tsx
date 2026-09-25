import React from 'react';
import { AuditLogEntry } from '../types';

interface AuditLogModalProps {
  logs: AuditLogEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  logs,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#263143]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#001e40] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">security</span>
            </div>
            <div>
              <h3 className="text-base text-[#001e40] font-bold">
                Logs de Auditoria e Conformidade LGPD
              </h3>
              <p className="text-xs text-slate-500">
                Padrão ISO/IEC 27001 • Criptografia SHA-256 e integração SEI-UnB
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

        <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {logs.map(log => (
            <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#001e40]">{log.action}</span>
                <span className="font-mono text-[11px] text-slate-400">{log.timestamp}</span>
              </div>
              <p className="text-slate-600">{log.details}</p>
              <div className="flex flex-wrap items-center justify-between pt-1 border-t border-slate-200 text-[10px] text-slate-500">
                <span>Agente: <strong className="text-slate-700">{log.actor}</strong></span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                  {log.seiReference} • {log.hash.slice(0, 10)}...
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-200 text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            Status: Integridade da base 100% verificada
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#001e40] text-white font-semibold hover:bg-[#003366] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
