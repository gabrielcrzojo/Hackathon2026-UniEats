import React, { useState } from 'react';

export type ActiveScreen = 'marketplace' | 'admin' | 'vendor' | 'auth';
export type UserRole = 'student' | 'vendor' | 'dac_admin';

interface HeaderProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenScanner: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  userRole,
  onChangeRole,
  searchQuery,
  onSearchChange,
  onOpenScanner
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleLabels: Record<UserRole, { title: string; subtitle: string; icon: string }> = {
    student: { title: 'Comunidade UnB', subtitle: 'Estudante / Visitante', icon: 'school' },
    vendor: { title: 'Ana Paula Rocha', subtitle: 'Vendedora (Ponto #04)', icon: 'storefront' },
    dac_admin: { title: 'Fiscalização DAC', subtitle: 'Campus Gama', icon: 'verified_user' }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="w-full px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Left Section: Logo + Polo + Nav tabs + Search all shifted to the left */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Brand Logo only (without duplicate UniEats Campus UnB text) */}
          <button
            onClick={() => onNavigate('marketplace')}
            className="flex items-center focus:outline-none group shrink-0"
            title="UniEats Campus UnB"
          >
            <img
              src="/logo.png"
              alt="UniEats Campus Logo"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </button>

          {/* Polo Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-[#f0f3ff] rounded-full border border-slate-200/60 shrink-0">
            <span className="material-symbols-outlined text-[#006e22] text-sm">location_on</span>
            <span className="text-xs font-semibold text-[#001e40]">Campus Gama</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#006e22] ml-0.5"></span>
          </div>

          {/* Main Navigation tabs (positioned to the left right after logo/polo) */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            <button
              onClick={() => onNavigate('marketplace')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                currentScreen === 'marketplace'
                  ? 'bg-[#003366] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Marketplace (Alunos)
            </button>

            <button
              onClick={() => {
                onChangeRole('vendor');
                onNavigate('vendor');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                currentScreen === 'vendor'
                  ? 'bg-[#003366] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Painel do Vendedor
            </button>

            <button
              onClick={() => {
                onChangeRole('dac_admin');
                onNavigate('admin');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                currentScreen === 'admin'
                  ? 'bg-[#003366] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Administração UnB
            </button>
          </nav>

          {/* Search bar positioned compactly on the left */}
          <div className="hidden md:flex flex-1 max-w-xs min-w-[160px]">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar marmitas, lanches..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003366] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Action and Profile Section - Guaranteed space and comfort */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 pr-1">
          {/* Quick Scanner Action */}
          <button
            onClick={onOpenScanner}
            title="Validar QR de Ponto"
            className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#e7eeff] text-[#001e40] hover:bg-[#d8e3fb] text-xs font-bold transition-colors whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">qr_code_scanner</span>
            <span>Validar Selo</span>
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl relative transition-colors"
              aria-label="Notificações"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-xl border border-slate-200 p-4 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-bold text-[#001e40]">Notificações do Campus</span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">2 novas</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-900">
                    <span className="font-bold block">Aviso Sanitário (30 dias)</span>
                    Marcos Vinicius (Ponto #07) possui licença vencendo em 12 dias.
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-200/60 text-blue-900">
                    <span className="font-bold block">Novo Ponto Homologado</span>
                    Edital DAC 2025: 4 pontos liberados para inscrição no Campus Gama.
                  </div>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full mt-3 py-1.5 text-center text-slate-500 hover:text-slate-800 text-[11px] font-semibold"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {/* Login or Role Toggle */}
          <button
            onClick={() => onNavigate('auth')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              currentScreen === 'auth'
                ? 'bg-[#001e40] text-white'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">login</span>
            <span>Acessar</span>
          </button>

          {/* User Profile & Role Switcher - Clear room, never cut off */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full hover:bg-slate-100 border border-slate-200/80 bg-white transition-colors"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlmfFJAJMMf0Jk7qcZ7LvnB3xfQzRJJVJZN6R9ckwQ-g0e6udx7iVJFYCFpaC98_WWgRsuDj1PSjqJ2hbofhrMqkUYocg6WevBjjTEq36HGVOdhO44hQR2p3gKRf5fkPPYRoDo1xyGVuCzz5-JaBq8LHEzfDEV_J0rBys-UjN-e9H-q0ORznio3HHeV5RBBW5BMidT8VCOI9IUsTYHLA3sM6noqQd3Fd6xodBxZCSxsVHNSo7oEmE"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#003366]/20"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-[#001e40] leading-tight whitespace-nowrap">
                  {roleLabels[userRole].title}
                </span>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">
                  {roleLabels[userRole].subtitle}
                </span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-sm hidden sm:inline">
                expand_more
              </span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Alternar Modo de Demonstração:
                  </span>
                </div>
                <button
                  onClick={() => {
                    onChangeRole('student');
                    onNavigate('marketplace');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                    userRole === 'student' ? 'bg-[#f0f3ff] text-[#001e40] font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-base text-[#006e22]">school</span>
                  <div>
                    <span className="block font-semibold">Visão Aluno (Marketplace)</span>
                    <span className="text-[10px] text-slate-500">Consulta de cardápios e pedidos WhatsApp</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onChangeRole('vendor');
                    onNavigate('vendor');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                    userRole === 'vendor' ? 'bg-[#f0f3ff] text-[#001e40] font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-base text-[#003366]">storefront</span>
                  <div>
                    <span className="block font-semibold">Visão Vendedor (Meu Ponto)</span>
                    <span className="text-[10px] text-slate-500">Gestão de pratos e status operacional</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onChangeRole('dac_admin');
                    onNavigate('admin');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                    userRole === 'dac_admin' ? 'bg-[#f0f3ff] text-[#001e40] font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-base text-[#001e40]">admin_panel_settings</span>
                  <div>
                    <span className="block font-semibold">Visão DAC / Fiscalização UnB</span>
                    <span className="text-[10px] text-slate-500">Auditoria, alvarás e ocupação de pontos</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-2">
          <div className="mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar marmitas, lanches, Campus Gama..."
              className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs"
            />
          </div>
          <button
            onClick={() => {
              onNavigate('marketplace');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg font-semibold text-sm hover:bg-slate-50"
          >
            Marketplace (Alunos)
          </button>
          <button
            onClick={() => {
              onChangeRole('vendor');
              onNavigate('vendor');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg font-semibold text-sm hover:bg-slate-50"
          >
            Painel do Vendedor
          </button>
          <button
            onClick={() => {
              onChangeRole('dac_admin');
              onNavigate('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg font-semibold text-sm hover:bg-slate-50"
          >
            Administração UnB (DAC)
          </button>
          <button
            onClick={() => {
              onNavigate('auth');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg font-semibold text-sm text-[#003366] hover:bg-slate-50"
          >
            Portal de Acesso & Credenciamento
          </button>
        </div>
      )}
    </header>
  );
};
