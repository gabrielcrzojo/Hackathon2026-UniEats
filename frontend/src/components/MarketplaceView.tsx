import React, { useState, useMemo } from 'react';
import { Vendor, CampusZone, FoodCategory } from '../types';

interface MarketplaceViewProps {
  vendors: Vendor[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenScanner: () => void;
  onInspectVendorQr: (vendor: Vendor) => void;
  onInspectVendorDossier: (vendor: Vendor) => void;
  onShowToast: (msg: string) => void;
  onNavigateToAdmin: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  vendors,
  searchQuery,
  onSearchChange,
  onOpenScanner,
  onInspectVendorQr,
  onShowToast,
  onNavigateToAdmin
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('todos');
  const [selectedZone, setSelectedZone] = useState<CampusZone>('todos');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'recent'>('rating');

  // Filter & sort
  const filteredVendors = useMemo(() => {
    return vendors
      .filter((v) => {
        // Only active/regular vendors are visible to students, exactly as stated in the university compliance rule
        if (v.status !== 'regular') return false;

        const matchesCat = selectedCategory === 'todos' || v.category === selectedCategory;
        const matchesZone = selectedZone === 'todos' || v.zone === selectedZone;
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          v.name.toLowerCase().includes(q) ||
          v.businessName.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.pointName.toLowerCase().includes(q) ||
          v.highlightDish.toLowerCase().includes(q);

        return matchesCat && matchesZone && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price') return a.highlightPrice - b.highlightPrice;
        return 0;
      });
  }, [vendors, selectedCategory, selectedZone, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('todos');
    setSelectedZone('todos');
    setSortBy('rating');
    onSearchChange('');
    onShowToast('Filtros restaurados!');
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero & Discovery Section */}
      <section className="relative w-full bg-gradient-to-b from-[#dee8ff]/60 via-[#f0f3ff]/40 to-[#f9f9ff] overflow-hidden pt-8 pb-10 px-4 lg:px-8">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#d5e3ff]/30 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-[#80fd88]/15 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb & Direct Access Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <span className="font-semibold text-[#001e40]">UnB Darcy Ribeiro</span>
              <span className="text-slate-300">/</span>
              <span>Rede Gastronômica Universitária</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#006e22] font-semibold">Credenciamento Ativo</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-slate-700 shadow-xs text-xs">
              <span className="w-2 h-2 rounded-full bg-[#006e22] animate-ping"></span>
              <span className="font-semibold text-slate-800">Acesso Livre sem Login para Estudantes</span>
            </div>
          </div>

          {/* Headline & Campus Narrative */}
          <div className="max-w-3xl mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#e7eeff] text-[#001e40] text-xs font-bold mb-3">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>DAC • Decanato de Assuntos Comunitários</span>
            </div>
            <h1 className="text-2xl sm:text-4xl text-[#001e40] font-bold tracking-tight mb-2">
              Alimentação autorizada e segura no Campus Darcy Ribeiro
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Encontre vendedores ambulantes e quiosques com selo sanitário oficial da UnB. Peça direto no WhatsApp sem taxas adicionais e com procedência comprovada.
            </p>
          </div>

          {/* Live Search Box with Instant Action */}
          <div className="bg-white p-2.5 rounded-2xl shadow-md border border-slate-200/80 mb-4">
            <div className="flex flex-col md:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-slate-400 text-xl">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Busque por marmitas, lanches, açaí, café, ICC Norte, BSAN, etc..."
                  className="w-full pl-12 pr-4 py-3 bg-[#f0f3ff]/60 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003366] transition-all"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-between md:justify-start">
                <button
                  type="button"
                  onClick={onOpenScanner}
                  className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#001e40] text-white text-xs font-bold shadow-sm hover:bg-[#003366] transition-all"
                >
                  <span className="material-symbols-outlined text-base">qr_code_scanner</span>
                  <span>Validar QR do Ponto</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  title="Limpar Filtros"
                  className="p-3 rounded-xl bg-[#e7eeff] text-slate-700 hover:text-slate-900 hover:bg-[#d8e3fb] transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">tune</span>
                </button>
              </div>
            </div>
          </div>

          {/* Food Categories Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-nowrap scrollbar-none">
            {[
              { id: 'todos', label: 'Todos', icon: 'restaurant' },
              { id: 'marmitas', label: 'Marmitas & Almoço', icon: 'lunch_dining' },
              { id: 'lanches', label: 'Lanches Rápidos', icon: 'fastfood' },
              { id: 'doces', label: 'Doces & Sobremesas', icon: 'cake' },
              { id: 'bebidas', label: 'Bebidas & Sucos Naturais', icon: 'local_cafe' },
              { id: 'vegano', label: 'Vegano & Saudável', icon: 'eco' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as FoodCategory)}
                className={`px-4 py-2 rounded-full text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#001e40] text-white'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Strict Compliance Notification Bar */}
      <section className="w-full bg-[#f0f3ff] border-y border-slate-200/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#80fd88]/30 flex items-center justify-center shrink-0 text-[#007525]">
              <span className="material-symbols-outlined text-lg">gavel</span>
            </div>
            <div>
              <span className="text-xs font-bold text-[#001e40] block">
                Regra de Segurança Alimentar Ativa (Edital 2025/UnB)
              </span>
              <p className="text-xs text-slate-600">
                Apenas vendedores com status <strong className="text-[#006e22]">REGULAR</strong> e <strong className="text-[#006e22]">ABERTO AGORA</strong> estão visíveis. Pontos pendentes ou notificados são suspensos do mapa automaticamente.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006e22]"></span>
            <span className="text-xs font-bold text-[#006e22] uppercase tracking-wider">
              Auditado em Tempo Real
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Filter Toolbar & Sector Pills */}
      <section className="w-full py-4 px-4 lg:px-8 bg-[#f9f9ff]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Sector Zone Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-nowrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Polos:
            </span>
            {[
              { id: 'todos', label: 'Todos os Polos' },
              { id: 'icc-norte', label: 'ICC Norte' },
              { id: 'icc-sul', label: 'ICC Sul' },
              { id: 'bsa', label: 'Bolsão da BSA' },
              { id: 'ft', label: 'Faculdade de Tecnologia (FT)' },
              { id: 'bce', label: 'Biblioteca Central (BCE)' },
              { id: 'pat', label: 'Pavilhão Anísio Teixeira (PAT)' }
            ].map((zone) => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone.id as CampusZone)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedZone === zone.id
                    ? 'bg-[#003366] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {zone.label}
              </button>
            ))}
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2 justify-end shrink-0">
            <span className="text-xs text-slate-500">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs border border-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="rating">Maior Avaliação (Alunos)</option>
              <option value="price">Menor Preço Universitário</option>
              <option value="recent">Credenciamento Mais Recente</option>
            </select>
          </div>
        </div>
      </section>

      {/* Marketplace Vendor Cards Grid */}
      <section className="w-full pb-16 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#001e40]">
                Pontos de Venda Abertos
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#80fd88]/30 text-[#007525] text-xs font-bold">
                {filteredVendors.length} Ativo{filteredVendors.length !== 1 ? 's' : ''}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Sincronizado com DAC / Portaria UnB nº 0418/2024
            </span>
          </div>

          {filteredVendors.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">store_mall_directory</span>
              <h3 className="text-base font-bold text-slate-800 mb-1">Nenhum ponto encontrado</h3>
              <p className="text-xs text-slate-500 mb-4">Tente selecionar outro polo ou alterar os termos de busca.</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#003366] text-white rounded-xl text-xs font-bold"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <article
                  key={vendor.id}
                  className="group bg-white rounded-2xl shadow-xs hover:shadow-md border border-slate-200/80 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Image Container with Badges */}
                  <div className="relative w-full h-48 overflow-hidden bg-slate-100">
                    <img
                      src={vendor.imageUrl}
                      alt={vendor.businessName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback container
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001e40]/75 via-transparent to-transparent pointer-events-none"></div>

                    {/* Floating Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-sm shadow-xs">
                      <span className="material-symbols-outlined text-[#001e40] text-sm">place</span>
                      <span className="text-xs font-bold text-[#001e40]">{vendor.pointName}</span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#006e22] text-white text-[11px] font-bold shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        REGULAR
                      </span>
                    </div>

                    {/* Price & Hours Badge on Image Base */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="material-symbols-outlined text-sm text-[#80fd88]">schedule</span>
                        <span>{vendor.hours}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs bg-[#001e40]/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
                        <span className="material-symbols-outlined text-[#80fd88] text-sm">star</span>
                        <span className="font-bold">{vendor.rating.toFixed(1)}</span>
                        <span className="text-slate-300 text-[10px]">({vendor.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-base text-[#001e40] font-bold tracking-tight">
                          {vendor.businessName}
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-[#e7eeff] text-[#001e40] text-[10px] font-semibold shrink-0">
                          {vendor.categoryLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                        {vendor.description}
                      </p>

                      {/* Special Offer Strip */}
                      <div className="bg-[#f0f3ff] p-3 rounded-xl mb-3 flex items-center justify-between border border-slate-100">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500 font-medium">Prato Universitário do Dia</span>
                          <span className="text-xs font-bold text-slate-800">{vendor.highlightDish}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-bold text-[#006e22]">
                            R$ {vendor.highlightPrice.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>

                      {/* Sanitary Quick Details */}
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-3">
                        <span className="material-symbols-outlined text-[#006e22] text-sm">verified</span>
                        <span>
                          Alvará UnB: <strong className="text-slate-800">{vendor.alvaraNumber}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 pt-1">
                      <a
                        href={`https://wa.me/${vendor.phoneWhatsapp}?text=Ol%C3%A1%20${encodeURIComponent(
                          vendor.name
                        )},%20vi%20pelo%20UniEats%20UnB%20e%20gostaria%20de%20pedir%20o%20${encodeURIComponent(
                          vendor.highlightDish
                        )}!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#006e22] text-white text-xs font-bold hover:bg-[#005318] shadow-xs transition-all"
                      >
                        <span className="material-symbols-outlined text-base">chat</span>
                        <span>Chamar no WhatsApp</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => onInspectVendorQr(vendor)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-[#e7eeff] hover:bg-[#dee8ff] text-[#001e40] text-xs font-semibold transition-all"
                      >
                        <span className="material-symbols-outlined text-base">qr_code_2</span>
                        <span>Ver Cardápio & QR de Segurança</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Campus Map & Zones Overview Banner */}
      <section className="w-full bg-[#f0f3ff] py-12 px-4 lg:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xs border border-slate-200 flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d5e3ff] text-[#001b3c] text-xs mb-3 font-semibold">
                <span className="material-symbols-outlined text-sm">map</span>
                <span>Mapeamento Geográfico Oficial</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#001e40] mb-2">
                Coma com tranquilidade em pontos mapeados pelo DAC
              </h3>
              <p className="text-xs md:text-sm text-slate-600 mb-6 leading-relaxed">
                Cada barraquinha física conta com um totem ou adesivo com QR Code exclusivo. Ao apontar sua câmera, você consulta em tempo real se o ambulante está autorizado a operar no Darcy Ribeiro.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#f0f3ff] text-center sm:text-left">
                  <span className="text-lg md:text-xl font-bold text-[#001e40] block">6 Polos</span>
                  <span className="text-[11px] text-slate-500">Homologados</span>
                </div>
                <div className="p-3 rounded-xl bg-[#f0f3ff] text-center sm:text-left">
                  <span className="text-lg md:text-xl font-bold text-[#006e22] block">100%</span>
                  <span className="text-[11px] text-slate-500">Alvarás Ativos</span>
                </div>
                <div className="p-3 rounded-xl bg-[#f0f3ff] text-center sm:text-left">
                  <span className="text-lg md:text-xl font-bold text-[#001e40] block">Zero Taxa</span>
                  <span className="text-[11px] text-slate-500">Ao Estudante</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#001e40] text-white text-xs font-bold hover:bg-[#003366] transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-base">policy</span>
                <span>Consultar Lista Oficial de Credenciados (Painel DAC)</span>
              </button>
            </div>

            <div className="w-full lg:w-1/2 shrink-0">
              <div className="w-full h-64 md:h-72 rounded-2xl bg-gradient-to-tr from-[#001e40] to-[#003366] shadow-inner relative overflow-hidden flex flex-col justify-end p-4 text-white">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#80fd88_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                <div className="relative z-10 bg-white/90 backdrop-blur-md p-3.5 rounded-xl shadow-md flex items-center justify-between text-[#001e40]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006e22]">fmd_good</span>
                    <span className="text-xs font-bold">Campus Darcy Ribeiro • Asa Norte</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#006e22] bg-[#80fd88]/30 px-2.5 py-0.5 rounded-full">
                    Monitoramento Ativo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="w-full bg-white text-slate-600 border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1Xtwe0ZpdCMLXIjydUKzUWlTHadDe2Mx_9itSNFuiChhAUb-wBMO3H4h8N9mbIKL4wxuH1OyKk00iu5ydeN9_SS5xnoztBouQEnzojDmF45c4RabCkCKFi4TsjNokmAHgxjpe0iAYcV0yRYlAIuhGian6xXpkC_cRT5TOF9bJFNQM9rY1Glt1zoARh8VKWuFkmrUFPu4LJK21BacaSRkyOdziB2NsdX1WlJmDJe_wqk9HbgOqdoCoYB"
                  alt="UniEats Logo"
                  className="h-7 w-auto object-contain"
                />
                <span className="text-lg font-bold text-[#001e40] tracking-tight">UniEats</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Plataforma institucional de alimentação sustentável, mapeamento de vendedores credenciados e convivência no Campus Darcy Ribeiro - Universidade de Brasília.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#80fd88]/30 text-[#007525] text-[11px] font-bold">
                <span className="material-symbols-outlined text-xs">verified</span>
                <span>Regulação Ativa UnB</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#001e40] uppercase tracking-wider">Polos & Setores</h4>
              <ul className="space-y-1.5 text-xs text-slate-500">
                <li className="hover:text-[#001e40] cursor-pointer">ICC Norte e ICC Sul</li>
                <li className="hover:text-[#001e40] cursor-pointer">Restaurante Universitário (RU)</li>
                <li className="hover:text-[#001e40] cursor-pointer">Faculdade de Tecnologia (FT)</li>
                <li className="hover:text-[#001e40] cursor-pointer">Pavilhão Anísio Teixeira (PAT)</li>
                <li className="hover:text-[#001e40] cursor-pointer">Biblioteca Central (BCE)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#001e40] uppercase tracking-wider">Governança e Apoio</h4>
              <ul className="space-y-1.5 text-xs text-slate-500">
                <li className="hover:text-[#001e40] cursor-pointer">Edital de Credenciamento Formal</li>
                <li className="hover:text-[#001e40] cursor-pointer">Validação Sanitária & Documental</li>
                <li className="hover:text-[#001e40] cursor-pointer">Ouvidoria Geral UnB</li>
                <li className="hover:text-[#001e40] cursor-pointer">Suporte Técnico WhatsApp</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#001e40] uppercase tracking-wider">Conformidade & Privacidade</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tratamento de dados em conformidade com a LGPD (Lei nº 13.709/2018). Monitoramento de padrões de higiene e vigilância sanitária em prol da comunidade acadêmica.
              </p>
              <div className="flex items-center gap-1.5 pt-1 text-slate-500 text-xs">
                <span className="material-symbols-outlined text-[#006e22] text-sm">shield</span>
                <span className="font-semibold text-slate-700">Ambiente Seguro Certificado</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 UniEats UnB • Decanato de Assuntos Comunitários (DAC/UnB) • Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-600 transition-colors">Termos de Uso</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-600 transition-colors">Política de Privacidade LGPD</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-600 transition-colors">Diretrizes Sanitárias</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
