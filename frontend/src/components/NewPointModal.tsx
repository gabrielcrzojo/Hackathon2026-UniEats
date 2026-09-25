import React, { useState } from 'react';
import { CampusZone } from '../types';

interface NewPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pointData: {
    name: string;
    zone: CampusZone;
    zoneLabel: string;
    category: string;
    seiProcess: string;
    facilities: string[];
  }) => void;
}

export const NewPointModal: React.FC<NewPointModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [pointName, setPointName] = useState('');
  const [zone, setZone] = useState<CampusZone>('uac');
  const [category, setCategory] = useState('Alimentação Quente / Marmitas');
  const [seiProcess, setSeiProcess] = useState('23106.004921/2026-44');
  const [facilities, setFacilities] = useState<string[]>([
    'Ponto Elétrico 220V',
    'Área Coberta',
    'Descarte Sanitário Próximo'
  ]);

  if (!isOpen) return null;

  const toggleFacility = (item: string) => {
    if (facilities.includes(item)) {
      setFacilities(facilities.filter(f => f !== item));
    } else {
      setFacilities([...facilities, item]);
    }
  };

  const zoneNames: Record<CampusZone, string> = {
    'todos': 'Geral',
    'uac': 'UAC (Unidade Acadêmica)',
    'ued': 'UED (Docência & Labs)',
    'ldtea': 'LDTEA (Laboratórios)',
    'ru-mesp': 'RU / MESP',
    'convivencia': 'Centro de Convivência',
    'biblioteca': 'Biblioteca FGA',
    'estacionamento': 'Estacionamento Central'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pointName.trim()) return;

    onSave({
      name: pointName.trim(),
      zone,
      zoneLabel: zoneNames[zone],
      category,
      seiProcess,
      facilities
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#263143]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-lg text-[#001e40] font-bold">
              Cadastrar Novo Ponto de Venda
            </h3>
            <p className="text-xs text-slate-500">
              Homologação de espaço físico no Campus Gama (DAC / SINFRA)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Identificação do Ponto (Ex: Ponto #19)
            </label>
            <input
              type="text"
              required
              value={pointName}
              onChange={e => setPointName(e.target.value)}
              placeholder="Ex: Ponto #19 - UAC Pátio Central"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Zona / Setor do Campus
              </label>
              <select
                value={zone}
                onChange={e => setZone(e.target.value as CampusZone)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              >
                <option value="uac">UAC (Unidade Acadêmica)</option>
                <option value="ued">UED (Docência & Labs)</option>
                <option value="ldtea">LDTEA (Laboratórios)</option>
                <option value="ru-mesp">RU / MESP</option>
                <option value="convivencia">Centro de Convivência</option>
                <option value="biblioteca">Biblioteca FGA</option>
                <option value="estacionamento">Estacionamento Central</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Categoria Permitida
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              >
                <option>Alimentação Quente / Marmitas</option>
                <option>Lanches Naturais & Bebidas</option>
                <option>Confeitaria / Doces</option>
                <option>Frutas & Sucos</option>
                <option>Cafeteria & Padaria</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Estrutura Física Disponível
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
              {[
                'Ponto Elétrico 220V',
                'Ponto de Água Potável',
                'Área Coberta',
                'Descarte Sanitário Próximo'
              ].map(item => (
                <label key={item} className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={facilities.includes(item)}
                    onChange={() => toggleFacility(item)}
                    className="rounded text-[#001e40] focus:ring-[#003366]"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Despacho Autorizativo / Processo SEI
            </label>
            <input
              type="text"
              value={seiProcess}
              onChange={e => setSeiProcess(e.target.value)}
              placeholder="23106.004921/2026-44"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#001e40] text-white text-xs font-semibold hover:bg-[#003366] transition-colors shadow-sm"
            >
              Salvar e Disponibilizar Ponto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
