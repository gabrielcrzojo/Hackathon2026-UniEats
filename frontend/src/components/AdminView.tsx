import React, { useState, useMemo } from 'react';
import { Vendor, CampusZone, VendorStatus } from '../types';
import { CAMPUS_ZONES } from '../data/mockData';

interface AdminViewProps {
  vendors: Vendor[];
  onOpenNewPoint: () => void;
  onOpenQrModal: (vendor: Vendor) => void;
  onOpenDossier: (vendor: Vendor) => void;
  onOpenAuditLogs: () => void;
  onUpdateVendorStatus: (vendorId: string, status: VendorStatus) => void;
  onApproveCandidate: (vendorId: string) => void;
  onRejectCandidate: (vendorId: string, reason: string) => void;
  onShowToast: (msg: string) => void;
  onNavigateToScreen: (screen: 'marketplace' | 'admin' | 'vendor' | 'auth') => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  vendors,
  onOpenNewPoint,
  onOpenQrModal,
  onOpenDossier,
  onOpenAuditLogs,
  onUpdateVendorStatus,
  onApproveCandidate,
  onRejectCandidate,
  onShowToast,
  onNavigateToScreen
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'regular' | 'pendente' | 'suspenso'>('all');
  const [selectedZone, setSelectedZone] = useState<CampusZone | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'admin' | 'licencas' | 'pontos'>('admin');

  // Filtered rows
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const q = filterQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.businessName.toLowerCase().includes(q) ||
        v.cpfMasked.toLowerCase().includes(q) ||
        v.pointName.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
      const matchesZone = selectedZone === 'all' || v.zone === selectedZone;

      return matchesSearch && matchesStatus && matchesZone;
    });
  }, [vendors, filterQuery, statusFilter, selectedZone]);

  const handleNotifyAllExpiring = () => {
    onShowToast('Disparadas 3 notificações preventivas para os vendedores com licenças a vencer em até 30 dias.');
  };

  const handleNotifyIndividual = (vendorName: string) => {
    onShowToast(`E-mail e WhatsApp institucional abertos para contato prioritário com ${vendorName}.`);
  };

  const handleExportRelatorio = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Vendedor,Nome Fantasia,Ponto,Zona,Status,Alvara,Validade,CPF\n' +
      vendors
        .map(
          (v) =>
            `"${v.id}","${v.name}","${v.businessName}","${v.pointName}","${v.zone}","${v.status}","${v.alvaraNumber}","${v.alvaraValidUntil}","${v.cpfMasked}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_dac_unb_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Relatório DAC/UnB consolidado (CSV) exportado com sucesso!');
  };

  const handleConfirmSuspension = (vendor: Vendor) => {
    if (
      window.confirm(
        `Confirma a suspensão cautelar de ${vendor.name}? O ponto será desativado e o vendedor ocultado imediatamente do Marketplace dos alunos.`
      )
    ) {
      onUpdateVendorStatus(vendor.id, 'suspenso');
      onShowToast(`Vendedor ${vendor.name} suspenso administrativamente.`);
    }
  };

  const handleRejectPrompt = (vendor: Vendor) => {
    const motivo = window.prompt(
      `Digite a justificativa de indeferimento para ${vendor.name}:`,
      'Documentação sanitária incompleta ou em desacordo com as diretrizes da DIVISA.'
    );
    if (motivo) {
      onRejectCandidate(vendor.id, motivo);
      onShowToast(`Submissão de ${vendor.name} indeferida com parecer formal.`);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-[#f9f9ff]">
      {/* Lateral Institutional Sidebar (Matches HTML prototype 1) */}
      <aside className="hidden lg:flex w-72 bg-[#f0f3ff] flex-col pt-6 pb-8 border-r border-slate-200/80 shrink-0">
        <div className="px-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1Xtwe0ZpdCMLXIjydUKzUWlTHadDe2Mx_9itSNFuiChhAUb-wBMO3H4h8N9mbIKL4wxuH1OyKk00iu5ydeN9_SS5xnoztBouQEnzojDmF45c4RabCkCKFi4TsjNokmAHgxjpe0iAYcV0yRYlAIuhGian6xXpkC_cRT5TOF9bJFNQM9rY1Glt1zoARh8VKWuFkmrUFPu4LJK21BacaSRkyOdziB2NsdX1WlJmDJe_wqk9HbgOqdoCoYB"
              alt="UniEats Logo"
              className="h-7 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="text-base font-bold text-[#001e40] leading-none">UniEats</span>
              <span className="text-[11px] text-slate-500 font-medium">Gestão & Controle</span>
            </div>
          </div>
        </div>

        <div className="px-4 mb-4">
          <div className="px-3 py-1.5 bg-[#e7eeff] rounded-xl flex items-center justify-between border border-[#d8e3fb]">
            <span className="text-xs text-slate-500 font-medium">Polo UnB:</span>
            <span className="text-xs text-[#001e40] font-bold">Campus Gama</span>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Operação Vendedor
          </div>
          <button
            onClick={() => onNavigateToScreen('vendor')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-[#dee8ff] hover:text-[#001e40] text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-lg">storefront</span>
            <span>Meu Ponto de Venda</span>
          </button>
          <button
            onClick={() => onNavigateToScreen('vendor')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-[#dee8ff] hover:text-[#001e40] text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-lg">restaurant_menu</span>
            <span>Cardápio e Preços</span>
          </button>

          <div className="px-3 pt-4 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Auditoria e Campus
          </div>
          <button
            onClick={() => setActiveTab('admin')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'admin'
                ? 'bg-[#003366] text-white shadow-xs'
                : 'text-slate-600 hover:bg-[#dee8ff] hover:text-[#001e40]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
            <span>Administração UnB</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('licencas');
              setStatusFilter('pendente');
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'licencas'
                ? 'bg-[#003366] text-white'
                : 'text-slate-600 hover:bg-[#dee8ff] hover:text-[#001e40]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">verified_user</span>
            <span>Validação e Licenças</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('pontos');
              onOpenNewPoint();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-[#dee8ff] hover:text-[#001e40] text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-lg">qr_code_2</span>
            <span>Pontos e Selo QR Code</span>
          </button>

          <div className="px-3 pt-4 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Navegação Geral
          </div>
          <button
            onClick={() => onNavigateToScreen('marketplace')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-[#dee8ff] hover:text-[#001e40] text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-lg">shopping_bag</span>
            <span>Ver Marketplace Alunos</span>
          </button>
        </nav>

        {/* Footer Sanitary Badge */}
        <div className="p-3 mt-auto border-t border-slate-200">
          <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#006e22] text-xl">shield_with_heart</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#001e40]">Vigilância Sanitária</span>
              <span className="text-[10px] text-slate-500">Selo Aprovado UnB</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Administrative Viewport */}
      <main className="flex-1 flex flex-col min-w-0 p-4 lg:p-8 space-y-6">
        {/* Top Administrative Header & System Operational Status */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#001e40]/10 text-[#001e40] text-[11px] uppercase tracking-wider font-bold">
                DAC / DACES - Decanato de Assuntos Comunitários
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#006e22]"></span>
              <span className="text-xs text-[#006e22] font-semibold">Portaria UnB nº 0418/2024</span>
            </div>
            <h1 className="text-2xl lg:text-3xl text-[#001e40] font-bold tracking-tight">
              Administração Campus UnB
            </h1>
            <p className="text-xs lg:text-sm text-slate-600 max-w-2xl mt-0.5">
              Painel central de conformidade sanitária, ocupação de espaço público e auditoria de alvarás no Campus Universitário Gama (FGA/FCTE).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
            <button
              type="button"
              onClick={onOpenNewPoint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#003366] text-white text-xs font-bold shadow-xs hover:bg-[#001e40] transition-all"
            >
              <span className="material-symbols-outlined text-base">add_location_alt</span>
              <span>+ Cadastrar Novo Ponto</span>
            </button>

            <button
              type="button"
              onClick={handleExportRelatorio}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-bold"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Relatório DAC (CSV)</span>
            </button>
          </div>
        </div>

        {/* 5 Key Performance Indicators (Directly matching HTML prototype 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* KPI 1 */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Regulares Ativos
              </span>
              <span className="w-8 h-8 rounded-lg bg-[#80fd88]/30 flex items-center justify-center text-[#006e22]">
                <span className="material-symbols-outlined text-lg">verified</span>
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">42</span>
                <span className="text-xs text-[#006e22] font-semibold flex items-center">
                  <span className="material-symbols-outlined text-sm">trending_up</span> +3 este mês
                </span>
              </div>
              <span className="text-xs text-slate-500 block mt-0.5">No campus com selo válido</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#006e22]"></div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pendentes Análise
              </span>
              <span className="w-8 h-8 rounded-lg bg-[#d8e3fb] flex items-center justify-center text-[#003366]">
                <span className="material-symbols-outlined text-lg">assignment_late</span>
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#003366]">7</span>
                <span className="text-xs text-slate-500 font-medium">Aguardando comissão</span>
              </div>
              <span className="text-xs text-slate-500 block mt-0.5">Tempo médio: 48 horas</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#003366]"></div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Alertas de Validade
              </span>
              <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                <span className="material-symbols-outlined text-lg">schedule</span>
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-amber-700">3</span>
                <span className="text-xs text-slate-500 font-semibold">≤ 30 dias</span>
              </div>
              <span className="text-xs text-slate-500 block mt-0.5">Ações preventivas ativas</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400"></div>
          </div>

          {/* KPI 4 */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Suspensos / Bloqueio
              </span>
              <span className="w-8 h-8 rounded-lg bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
                <span className="material-symbols-outlined text-lg">block</span>
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#ba1a1a]">2</span>
                <span className="text-xs text-[#ba1a1a] font-medium">QR desativado</span>
              </div>
              <span className="text-xs text-slate-500 block mt-0.5">Ocultos no marketplace</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ba1a1a]"></div>
          </div>

          {/* KPI 5 */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pontos Homologados
              </span>
              <span className="w-8 h-8 rounded-lg bg-[#80fd88]/30 flex items-center justify-center text-[#006e22]">
                <span className="material-symbols-outlined text-lg">storefront</span>
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">18</span>
                <span className="text-xs text-[#006e22] font-semibold">14 ocupados</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden flex">
                <div className="bg-[#006e22] h-full" style={{ width: '77.7%' }}></div>
                <div className="bg-slate-300 h-full" style={{ width: '22.3%' }}></div>
              </div>
              <span className="text-xs text-slate-500 block mt-1">4 pontos disponíveis</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#80fd88]"></div>
          </div>
        </div>

        {/* Alerta Crítico de Vencimento de Licenças (Automação de 30 dias) */}
        <div className="bg-[#f0f3ff] rounded-2xl p-5 border border-[#d8e3fb] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 max-w-3xl">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-800 mt-0.5">
                <span className="material-symbols-outlined text-xl">warning</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base text-[#001e40] font-bold">
                    Alerta Preventivo de Conformidade Sanitária
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white text-[#003366] text-[11px] font-bold border border-slate-200">
                    Automação Ativa
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  3 vendedores possuem licenças sanitárias ou alvarás com vencimento nos próximos 30 dias. Notificação automática enviada via e-mail institucional e canais homologados do campus.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-end">
              <button
                type="button"
                onClick={handleNotifyAllExpiring}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#001e40] text-xs font-bold border border-slate-200 shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">forward_to_inbox</span>
                <span>Reenviar Notificações em Lote</span>
              </button>
            </div>
          </div>

          {/* Quick Action Warning Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200">
            {/* Warning Item 1 */}
            <div className="bg-white rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs border border-slate-200">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#f0f3ff] flex items-center justify-center font-bold text-[#001e40] shrink-0 text-xs">
                  MV
                </div>
                <div className="truncate">
                  <p className="text-xs text-slate-900 font-bold truncate">
                    Marcos Vinicius (Doces da Colina)
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>Ponto #07 - ICC Sul</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-[#ba1a1a] font-semibold">Vence em 12 dias</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleNotifyIndividual('Marcos Vinicius')}
                  title="Notificar Vendedor"
                  className="p-2 text-[#003366] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">mail</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const mv = vendors.find((v) => v.name.includes('Marcos Vinicius'));
                    if (mv) onOpenDossier(mv);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#e7eeff] text-[#001e40] hover:bg-[#d8e3fb] transition-colors"
                >
                  Examinar
                </button>
              </div>
            </div>

            {/* Warning Item 2 */}
            <div className="bg-white rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs border border-slate-200">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#f0f3ff] flex items-center justify-center font-bold text-[#001e40] shrink-0 text-xs">
                  LF
                </div>
                <div className="truncate">
                  <p className="text-xs text-slate-900 font-bold truncate">
                    Luzia Ferreira (Salgados ICC)
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>Ponto #02 - ICC Centro</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-[#ba1a1a] font-semibold">Vence em 22 dias</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleNotifyIndividual('Luzia Ferreira')}
                  title="Notificar Vendedora"
                  className="p-2 text-[#003366] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">mail</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const lf = vendors.find((v) => v.name.includes('Luzia Ferreira'));
                    if (lf) onOpenDossier(lf);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#e7eeff] text-[#001e40] hover:bg-[#d8e3fb] transition-colors"
                >
                  Examinar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gestão de Pontos de Venda no Campus UnB (Visual Sector Mosaic) */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-[#001e40]">
                Ocupação Espacial • Campus Gama
              </h2>
              <p className="text-xs text-slate-500">
                Zonas delimitadas por resolução conjunta DAC/SINFRA para pontos de alimentação ambulante e quiosques.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#006e22] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006e22]"></span> 14 Ocupados
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> 4 Livres
              </span>
            </div>
          </div>

          {/* Sector Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {CAMPUS_ZONES.map((zone) => {
              const isSelected = selectedZone === zone.zoneCode;
              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(isSelected ? 'all' : zone.zoneCode)}
                  className={`rounded-2xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#003366] text-white border-[#003366] shadow-sm'
                      : 'bg-white hover:bg-[#f0f3ff] border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#e7eeff] text-[#001e40]'
                      }`}
                    >
                      {zone.name}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        zone.occupiedPoints === zone.totalPoints ? 'bg-[#006e22]' : 'bg-slate-300'
                      }`}
                    ></span>
                  </div>
                  <span className="text-sm font-bold block">{zone.totalPoints} Pontos</span>
                  <span
                    className={`text-[11px] font-medium ${
                      isSelected
                        ? 'text-white/80'
                        : zone.occupiedPoints === zone.totalPoints
                        ? 'text-[#006e22]'
                        : 'text-slate-500'
                    }`}
                  >
                    {zone.occupiedPoints === zone.totalPoints
                      ? '100% Ocupado'
                      : zone.inAnalysisPoints
                      ? '1 vago • 1 análise'
                      : `${zone.occupiedPoints} ocup. • ${zone.freePoints} livre`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Painel de Gestão e Análise de Documentos (Interactive Table Section) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#001e40]">
                Painel de Gestão e Análise de Documentos
              </h2>
              <p className="text-xs text-slate-500">
                Conformidade individual de fornecedores, verificação cadastral e auditoria de alvarás.
              </p>
            </div>

            {/* Filter and Search controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  search
                </span>
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filtrar por nome, CPF ou ponto..."
                  className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#003366]"
              >
                <option value="all">Todos os Status</option>
                <option value="regular">Regular</option>
                <option value="pendente">Pendente</option>
                <option value="suspenso">Suspenso</option>
              </select>

              {selectedZone !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedZone('all')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300"
                >
                  Limpar Zona: {selectedZone}
                </button>
              )}
            </div>
          </div>

          {/* Main Interactive Table Card */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f0f3ff] text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-3 px-4">Vendedor & CPF (LGPD)</th>
                    <th className="py-3 px-4">Ponto Designado</th>
                    <th className="py-3 px-4">Documentos Enviados</th>
                    <th className="py-3 px-4">Validade Mais Próxima</th>
                    <th className="py-3 px-4">Status Atual</th>
                    <th className="py-3 px-4 text-right">Ações Administrativas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVendors.map((vendor) => {
                    const isRegular = vendor.status === 'regular';
                    const isPendente = vendor.status === 'pendente';
                    const isSuspenso = vendor.status === 'suspenso';

                    return (
                      <tr
                        key={vendor.id}
                        className={`hover:bg-[#f0f3ff]/50 transition-colors ${
                          isSuspenso ? 'bg-red-50/40' : ''
                        }`}
                      >
                        {/* Column 1: Vendedor & CPF */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={vendor.avatarUrl}
                              alt={vendor.name}
                              className={`w-10 h-10 rounded-full object-cover shadow-xs border ${
                                isSuspenso ? 'grayscale border-red-200' : 'border-slate-200'
                              }`}
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">{vendor.name}</span>
                              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                                <span>{vendor.businessName}</span>
                                <span>•</span>
                                <span className="font-mono">{vendor.cpfMasked}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: Ponto */}
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold inline-block ${
                              isSuspenso
                                ? 'bg-red-100 text-red-800'
                                : isPendente
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-[#e7eeff] text-[#001e40]'
                            }`}
                          >
                            {vendor.pointName}
                          </span>
                          <span
                            className={`block text-[11px] mt-0.5 ${
                              isSuspenso ? 'text-red-600' : 'text-slate-500'
                            }`}
                          >
                            {isSuspenso ? 'Espaço retido temporariamente' : vendor.categoryLabel}
                          </span>
                        </td>

                        {/* Column 3: Documentos */}
                        <td className="py-4 px-4">
                          <div className="space-y-0.5">
                            {vendor.safetyChecklist.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                                <span
                                  className={`material-symbols-outlined text-sm ${
                                    isSuspenso
                                      ? 'text-red-500'
                                      : isPendente
                                      ? 'text-amber-500'
                                      : 'text-[#006e22]'
                                  }`}
                                >
                                  {isSuspenso ? 'cancel' : isPendente ? 'schedule' : 'check_circle'}
                                </span>
                                <span className="text-[11px]">{item}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Column 4: Validade */}
                        <td className="py-4 px-4">
                          <span
                            className={`font-bold block text-xs ${
                              isSuspenso
                                ? 'text-red-700'
                                : isPendente
                                ? 'text-amber-700'
                                : 'text-slate-900'
                            }`}
                          >
                            {vendor.alvaraValidUntil}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {isSuspenso
                              ? 'Bloqueio automatizado'
                              : isPendente
                              ? 'Submetido há 2 dias'
                              : 'Válido • Renovado'}
                          </span>
                        </td>

                        {/* Column 5: Status */}
                        <td className="py-4 px-4">
                          {isRegular && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#80fd88]/30 text-[#007525] text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#006e22]"></span>
                              REGULAR
                            </span>
                          )}
                          {isPendente && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              PENDENTE
                            </span>
                          )}
                          {isSuspenso && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                              SUSPENSO
                            </span>
                          )}
                        </td>

                        {/* Column 6: Ações Administrativas */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isRegular && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => onOpenQrModal(vendor)}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#e7eeff] text-[#001e40] hover:bg-[#d8e3fb] transition-colors font-semibold flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-base">qr_code_2</span>
                                  <span>Ver QR</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleConfirmSuspension(vendor)}
                                  className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors font-semibold"
                                >
                                  Suspender
                                </button>
                              </>
                            )}

                            {isPendente && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => onApproveCandidate(vendor.id)}
                                  className="px-3 py-1.5 rounded-lg bg-[#006e22] text-white hover:bg-[#005318] transition-colors font-semibold flex items-center gap-1 shadow-xs"
                                >
                                  <span className="material-symbols-outlined text-base">how_to_reg</span>
                                  <span>Aprovar e Emitir QR</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRejectPrompt(vendor)}
                                  className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors font-semibold"
                                >
                                  Reprovar
                                </button>
                              </>
                            )}

                            {isSuspenso && (
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateVendorStatus(vendor.id, 'regular');
                                  onShowToast(`Vendedor ${vendor.name} reativado pós-envio de laudo.`);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#003366] text-white hover:bg-[#001e40] transition-colors font-semibold flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-base">restore</span>
                                <span>Reativar pós-envio</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => onOpenDossier(vendor)}
                              title="Dossiê Completo"
                              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                            >
                              <span className="material-symbols-outlined text-lg">info</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-4 py-3 bg-[#f0f3ff] border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span>
                  Exibindo {filteredVendors.length} de {vendors.length} registros cadastrais
                </span>
                <span>•</span>
                <span className="text-[#006e22] font-semibold">Sincronizado com SEI-UnB</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="px-2.5 py-0.5 rounded bg-white text-[#001e40] font-bold border border-slate-200">
                  Página 1 de 1
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security, Cripto Hash & LGPD Audit Log Banner */}
        <div className="rounded-2xl bg-[#e7eeff] p-5 border border-[#d8e3fb] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#001e40] flex items-center justify-center text-white shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-xl">security</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-[#001e40]">
                  Arquitetura de Segurança & Conformidade LGPD
                </h3>
                <span className="px-2 py-0.5 rounded bg-white text-[#003366] text-[10px] font-bold border border-slate-200">
                  ISO/IEC 27001
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Dados sensíveis (CPF, laudos médicos e comprovantes fiscais) são criptografados em repouso com algoritmo AES-256 e hashes SHA-256. Unicidade de registro assegurada pela infraestrutura DTI/UnB.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
              Hash: 9a7f...e304b1c
            </span>
            <button
              type="button"
              onClick={onOpenAuditLogs}
              className="px-3.5 py-1.5 rounded-lg bg-white text-[#001e40] hover:bg-slate-50 transition-colors text-xs font-bold border border-slate-200"
            >
              Ver Log Auditoria
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
