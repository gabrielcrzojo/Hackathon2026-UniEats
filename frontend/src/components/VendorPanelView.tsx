import React, { useState } from 'react';
import { Vendor, MenuItem } from '../types';

interface VendorPanelViewProps {
  vendor: Vendor;
  onUpdateVendor: (updated: Vendor) => void;
  onOpenQrModal: (vendor: Vendor) => void;
  onShowToast: (msg: string) => void;
  onNavigateToMarketplace: () => void;
}

export const VendorPanelView: React.FC<VendorPanelViewProps> = ({
  vendor,
  onUpdateVendor,
  onOpenQrModal,
  onShowToast,
  onNavigateToMarketplace
}) => {
  const [activeTab, setActiveTab] = useState<'ponto' | 'cardapio' | 'documentos'>('ponto');
  const [isEditingDish, setIsEditingDish] = useState<MenuItem | null>(null);
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');

  const handleToggleOpen = () => {
    const updated = { ...vendor, isOpen: !vendor.isOpen };
    onUpdateVendor(updated);
    onShowToast(
      updated.isOpen
        ? 'Ponto ABERTO! Seus produtos já estão visíveis no Marketplace dos alunos.'
        : 'Ponto marcado como FECHADO temporariamente.'
    );
  };

  const handleToggleDishAvailability = (dishId: string) => {
    const updatedMenu = vendor.menuItems.map((item) =>
      item.id === dishId ? { ...item, available: !item.available } : item
    );
    const updated = { ...vendor, menuItems: updatedMenu };
    onUpdateVendor(updated);
    onShowToast('Disponibilidade do item atualizada.');
  };

  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim() || !newDishPrice) return;

    const newItem: MenuItem = {
      id: `m-${Date.now()}`,
      name: newDishName.trim(),
      description: newDishDesc.trim(),
      price: parseFloat(newDishPrice.replace(',', '.')) || 10.0,
      available: true,
      category: vendor.category
    };

    const updated = {
      ...vendor,
      menuItems: [...vendor.menuItems, newItem]
    };

    onUpdateVendor(updated);
    setNewDishName('');
    setNewDishPrice('');
    setNewDishDesc('');
    setIsEditingDish(null);
    onShowToast('Novo prato adicionado ao cardápio com sucesso!');
  };

  const handleDeleteDish = (dishId: string) => {
    const updatedMenu = vendor.menuItems.filter((m) => m.id !== dishId);
    onUpdateVendor({ ...vendor, menuItems: updatedMenu });
    onShowToast('Item removido do cardápio.');
  };

  return (
    <div className="w-full min-h-screen bg-[#f9f9ff] py-8 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Vendor Profile Banner */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={vendor.avatarUrl}
              alt={vendor.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#003366]/15 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#e7eeff] text-[#001e40]">
                  {vendor.pointName}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#80fd88]/30 text-[#007525] text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006e22]"></span>
                  {vendor.statusText}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-[#001e40]">{vendor.name}</h1>
              <p className="text-xs text-slate-500 font-medium">
                {vendor.businessName} • Alvará UnB: <strong>{vendor.alvaraNumber}</strong> (Válido até{' '}
                {vendor.alvaraValidUntil})
              </p>
            </div>
          </div>

          {/* Quick Open/Close Toggle & Actions */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleToggleOpen}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                vendor.isOpen
                  ? 'bg-[#006e22] text-white hover:bg-[#005318]'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${vendor.isOpen ? 'bg-white animate-pulse' : 'bg-slate-500'}`}></span>
              <span>{vendor.isOpen ? 'PONTO ABERTO AGORA' : 'PONTO FECHADO'}</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenQrModal(vendor)}
              className="px-3.5 py-2.5 rounded-xl bg-[#001e40] text-white text-xs font-bold hover:bg-[#003366] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-base">qr_code_2</span>
              <span>Emitir / Imprimir Selo</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('ponto')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ponto'
                ? 'bg-[#003366] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-base">storefront</span>
            <span>Meu Ponto de Venda</span>
          </button>

          <button
            onClick={() => setActiveTab('cardapio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'cardapio'
                ? 'bg-[#003366] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-base">restaurant_menu</span>
            <span>Cardápio e Preços ({vendor.menuItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('documentos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'documentos'
                ? 'bg-[#003366] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-base">verified_user</span>
            <span>Conformidade Sanitária</span>
          </button>
        </div>

        {/* TAB 1: MEU PONTO */}
        {activeTab === 'ponto' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
                <h3 className="text-base font-bold text-[#001e40]">Dados Operacionais do Ponto</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Localização Homologada</span>
                    <span className="text-sm font-bold text-slate-800">{vendor.pointName}</span>
                    <span className="text-slate-500 block mt-0.5">{vendor.zoneLabel}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Horário Cadastrado</span>
                    <span className="text-sm font-bold text-slate-800">{vendor.hours}</span>
                    <span className="text-slate-500 block mt-0.5">Segunda a Sexta</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">WhatsApp de Pedidos</span>
                    <span className="text-sm font-bold text-slate-800 font-mono">+{vendor.phoneWhatsapp}</span>
                    <span className="text-slate-500 block mt-0.5">Recebe pedidos diretos sem taxa</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Avaliação dos Estudantes</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                      <span className="text-sm font-bold text-slate-800">{vendor.rating.toFixed(1)}</span>
                      <span className="text-slate-500">({vendor.reviewsCount} avaliações)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f0f3ff] text-xs text-slate-600 border border-[#d8e3fb]">
                  <span className="font-bold text-[#001e40] block mb-1">Como os alunos visualizam seu ponto:</span>
                  <p className="mb-3">{vendor.description}</p>
                  <button
                    type="button"
                    onClick={onNavigateToMarketplace}
                    className="px-3.5 py-1.5 rounded-lg bg-white text-[#003366] font-bold border border-slate-200 hover:bg-slate-50 transition-colors inline-flex items-center gap-1"
                  >
                    <span>Ver no Catálogo dos Alunos</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick QR Card */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 text-center space-y-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Totem de Fiscalização
                </span>
                <div
                  onClick={() => onOpenQrModal(vendor)}
                  className="p-4 bg-white rounded-2xl border-2 border-dashed border-slate-300 inline-block cursor-pointer hover:border-[#003366] transition-colors"
                >
                  <span className="material-symbols-outlined text-6xl text-[#001e40]">qr_code_2</span>
                  <span className="text-[10px] text-slate-500 block mt-1 font-mono">{vendor.cryptoHash.slice(0, 10)}...</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Selo Oficial DAC/UnB</h4>
                  <p className="text-[11px] text-slate-500">
                    Obrigatório estar visível no balcão de atendimento conforme a Portaria nº 0418/2024.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenQrModal(vendor)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#001e40] text-white text-xs font-bold hover:bg-[#003366] transition-colors"
                >
                  Visualizar e Imprimir Selo A4
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CARDÁPIO E PREÇOS */}
        {activeTab === 'cardapio' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-[#001e40]">Cardápio Homologado no Campus</h3>
                  <p className="text-xs text-slate-500">
                    Os itens ativos aparecem instantaneamente no catálogo aberto para a comunidade UnB.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingDish({} as any)}
                  className="px-4 py-2 rounded-xl bg-[#003366] text-white text-xs font-bold hover:bg-[#001e40] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>+ Adicionar Novo Item</span>
                </button>
              </div>

              {/* Add dish form modal / inline */}
              {isEditingDish && (
                <form
                  onSubmit={handleAddDish}
                  className="p-4 rounded-2xl bg-[#f0f3ff] border border-[#d8e3fb] mb-6 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#001e40] text-sm">Cadastrar Novo Item no Cardápio</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingDish(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Nome do Prato / Lanche *</label>
                      <input
                        type="text"
                        required
                        value={newDishName}
                        onChange={(e) => setNewDishName(e.target.value)}
                        placeholder="Ex: Marmita Especial de Frango Grelhado"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Preço Universitário (R$) *</label>
                      <input
                        type="text"
                        required
                        value={newDishPrice}
                        onChange={(e) => setNewDishPrice(e.target.value)}
                        placeholder="14,00"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Ingredientes & Descrição</label>
                    <input
                      type="text"
                      value={newDishDesc}
                      onChange={(e) => setNewDishDesc(e.target.value)}
                      placeholder="Arroz, feijão, frango, legumes ao vapor e farofa"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingDish(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#006e22] text-white text-xs font-bold hover:bg-[#005318]"
                    >
                      Salvar Item
                    </button>
                  </div>
                </form>
              )}

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#f0f3ff] text-slate-600 font-bold border-b border-slate-200">
                      <th className="py-3 px-4">Item do Cardápio</th>
                      <th className="py-3 px-4">Preço</th>
                      <th className="py-3 px-4">Disponibilidade Hoje</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vendor.menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {item.isPopular && (
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                Destaque
                              </span>
                            )}
                            <span className="font-bold text-slate-900">{item.name}</span>
                          </div>
                          {item.description && (
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              {item.description}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleDishAvailability(item.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                              item.available
                                ? 'bg-[#80fd88]/30 text-[#007525] hover:bg-red-50 hover:text-red-700'
                                : 'bg-slate-200 text-slate-600 hover:bg-green-50 hover:text-green-700'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.available ? 'bg-[#006e22]' : 'bg-slate-400'
                              }`}
                            ></span>
                            <span>{item.available ? 'Disponível Agora' : 'Esgotado'}</span>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteDish(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Remover"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENTOS & CONFORMIDADE */}
        {activeTab === 'documentos' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-[#001e40]">Situação Sanitária & Alvará</h3>
            <p className="text-xs text-slate-500">
              Documentação sincronizada com a DIVISA e o Decanato de Assuntos Comunitários da UnB.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#f0f3ff] border border-[#d8e3fb]">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Número da Portaria</span>
                <span className="font-bold text-[#001e40] text-sm mt-0.5 block">{vendor.alvaraNumber}</span>
                <span className="text-[11px] text-[#006e22] font-semibold block mt-1">✓ Homologação Plena</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f0f3ff] border border-[#d8e3fb]">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Validade Vigente</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{vendor.alvaraValidUntil}</span>
                <span className="text-[11px] text-slate-500 block mt-1">{vendor.daysRemainingOrExpired} dias restantes</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f0f3ff] border border-[#d8e3fb]">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Autenticação SEI-UnB</span>
                <span className="font-mono text-xs text-slate-800 mt-0.5 block">{vendor.seiProcessNumber}</span>
                <span className="text-[11px] text-slate-500 block mt-1">DTI / UnB Certificado</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="font-bold text-[#001e40] text-xs block mb-2">Comprovações de Higiene Aprovadas:</span>
              <div className="space-y-2">
                {vendor.safetyChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006e22] text-sm">verified</span>
                      <span className="font-semibold text-slate-800">{item}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Homologado</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
