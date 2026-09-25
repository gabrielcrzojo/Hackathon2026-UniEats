import React, { useState } from 'react';
import { UserRole } from './Header';
import { CampusZone, FoodCategory } from '../types';

interface AuthPortalViewProps {
  onLoginSuccess: (role: UserRole) => void;
  onNavigateToMarketplace: () => void;
  onRegisterCandidate: (candidateData: {
    name: string;
    businessName: string;
    cpf: string;
    email: string;
    phone: string;
    zone: CampusZone;
    category: FoodCategory;
    dishDescription: string;
  }) => void;
  onShowToast: (msg: string) => void;
}

export const AuthPortalView: React.FC<AuthPortalViewProps> = ({
  onLoginSuccess,
  onNavigateToMarketplace,
  onRegisterCandidate,
  onShowToast
}) => {
  const [activeRole, setActiveRole] = useState<'vendor' | 'dac'>('vendor');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [cpf, setCpf] = useState('000.000.000-00');
  const [email, setEmail] = useState('vendedor@campus.unb.br');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);

  // Application form state
  const [candName, setCandName] = useState('');
  const [candBusiness, setCandBusiness] = useState('');
  const [candCpf, setCandCpf] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candPhone, setCandPhone] = useState('619');
  const [candZone, setCandZone] = useState<CampusZone>('icc-norte');
  const [candCategory, setCandCategory] = useState<FoodCategory>('lanches');
  const [candDescription, setCandDescription] = useState('');

  const handleRoleChange = (role: 'vendor' | 'dac') => {
    setActiveRole(role);
    if (role === 'dac') {
      setEmail('fiscalizacao.dac@campus.unb.br');
    } else {
      setEmail('vendedor@campus.unb.br');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole === 'dac') {
      onLoginSuccess('dac_admin');
      onShowToast('Bem-vindo, Fiscal do DAC! Painel de auditoria carregado.');
    } else {
      onLoginSuccess('vendor');
      onShowToast('Acesso concedido ao Ponto de Venda #04 (Tia Cida).');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName.trim() || !candCpf.trim()) {
      onShowToast('Preencha os campos obrigatórios para solicitar o credenciamento.');
      return;
    }

    onRegisterCandidate({
      name: candName.trim(),
      businessName: candBusiness.trim() || `${candName} Alimentos`,
      cpf: candCpf.trim(),
      email: candEmail.trim() || `${candName.toLowerCase().replace(/\s+/g, '')}@aluno.unb.br`,
      phone: candPhone.trim() || '61999990099',
      zone: candZone,
      category: candCategory,
      dishDescription: candDescription.trim() || 'Lanches artesanais e bebidas saudáveis.'
    });

    onShowToast('Inscrição enviada com sucesso ao DAC! Dossiê sob análise.');
    setActiveTab('login');
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] flex flex-col justify-between py-6 px-4">
      {/* Top Simple Nav */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-8">
        <button
          onClick={onNavigateToMarketplace}
          className="flex items-center gap-2.5 focus:outline-none"
        >
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1Xtwe0ZpdCMLXIjydUKzUWlTHadDe2Mx_9itSNFuiChhAUb-wBMO3H4h8N9mbIKL4wxuH1OyKk00iu5ydeN9_SS5xnoztBouQEnzojDmF45c4RabCkCKFi4TsjNokmAHgxjpe0iAYcV0yRYlAIuhGian6xXpkC_cRT5TOF9bJFNQM9rY1Glt1zoARh8VKWuFkmrUFPu4LJK21BacaSRkyOdziB2NsdX1WlJmDJe_wqk9HbgOqdoCoYB"
            alt="UniEats"
            className="h-8 w-auto object-contain"
          />
          <div className="flex flex-col text-left">
            <span className="text-lg font-bold text-[#001e40] leading-none">UniEats</span>
            <span className="text-[10px] text-slate-500 font-medium">Campus UnB</span>
          </div>
        </button>

        <button
          onClick={onNavigateToMarketplace}
          className="px-4 py-2 rounded-xl bg-[#d5e3ff] hover:bg-[#cce5ff] text-[#001b3c] text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <span>Catálogo Aberto</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      {/* Main Authentication Card (Matches Image 5) */}
      <div className="max-w-xl mx-auto w-full bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-slate-200/90 my-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <span>PORTAL OFICIAL DE ACESSO</span>
            <span>•</span>
            <span className="text-[#006e22]">Campus Darcy Ribeiro</span>
          </div>
          <h2 className="text-2xl font-bold text-[#001e40] tracking-tight">
            Credenciamento & Operação
          </h2>
        </div>

        {/* Top Role Selector Buttons */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#f0f3ff] rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => handleRoleChange('vendor')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeRole === 'vendor'
                ? 'bg-white text-[#001e40] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">storefront</span>
            <span>Vendedor Credenciado</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('dac')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeRole === 'dac'
                ? 'bg-white text-[#001e40] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">admin_panel_settings</span>
            <span>Administração DAC / UnB</span>
          </button>
        </div>

        {/* Sub-tabs: Entrar na Conta vs Solicitar Credenciamento */}
        {activeRole === 'vendor' && (
          <div className="flex items-center gap-4 border-b border-slate-200 pb-2 mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex items-center gap-1.5 pb-2 -mb-2 border-b-2 transition-all ${
                activeTab === 'login'
                  ? 'border-[#003366] text-[#003366]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Entrar na Conta</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex items-center gap-1.5 pb-2 -mb-2 border-b-2 transition-all ${
                activeTab === 'register'
                  ? 'border-[#003366] text-[#003366]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">app_registration</span>
              <span>Solicitar Credenciamento</span>
            </button>
          </div>
        )}

        {/* Institutional notice box */}
        <div className="bg-[#f0f3ff] rounded-2xl p-3.5 mb-6 flex items-start gap-2.5 text-xs text-slate-600 border border-[#d8e3fb]">
          <span className="material-symbols-outlined text-[#003366] text-lg shrink-0 mt-0.5">info</span>
          <p>
            {activeRole === 'vendor'
              ? 'Acesso exclusivo para quiosques, ambulantes registrados e cantinas homologadas pelo Decanato de Assuntos Comunitários (DAC).'
              : 'Acesso restrito para auditores, fiscais sanitários e equipe do Decanato (DACES / DAC / UnB).'}
          </p>
        </div>

        {/* LOGIN FORM */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CPF do Titular
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    badge
                  </span>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#f0f3ff]/70 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail Comercial de Contato
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vendedor@campus.unb.br"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#f0f3ff]/70 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Senha de Acesso
                </label>
                <button
                  type="button"
                  onClick={() => onShowToast('Link de recuperação enviado ao e-mail institucional cadastrado.')}
                  className="text-[11px] text-[#003366] hover:underline font-semibold"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha cadastrada"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#f0f3ff]/70 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-base">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#006e22] text-white text-sm font-bold hover:bg-[#005318] shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span className="material-symbols-outlined text-lg">login</span>
              <span>Entrar no Sistema</span>
            </button>
          </form>
        ) : (
          /* REGISTRATION / SOLICITAR CREDENCIAMENTO FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome Completo do Responsável *
                </label>
                <input
                  type="text"
                  required
                  value={candName}
                  onChange={(e) => setCandName(e.target.value)}
                  placeholder="Ex: Maria Clara Souza"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome Fantasia do Negócio *
                </label>
                <input
                  type="text"
                  required
                  value={candBusiness}
                  onChange={(e) => setCandBusiness(e.target.value)}
                  placeholder="Ex: Tapiocas do Cerrado"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  CPF *
                </label>
                <input
                  type="text"
                  required
                  value={candCpf}
                  onChange={(e) => setCandCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  E-mail Comercial
                </label>
                <input
                  type="email"
                  value={candEmail}
                  onChange={(e) => setCandEmail(e.target.value)}
                  placeholder="contato@negocio.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  WhatsApp com DDD
                </label>
                <input
                  type="text"
                  value={candPhone}
                  onChange={(e) => setCandPhone(e.target.value)}
                  placeholder="61999990000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Polo de Interesse
                </label>
                <select
                  value={candZone}
                  onChange={(e) => setCandZone(e.target.value as CampusZone)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="icc-norte">ICC Norte</option>
                  <option value="icc-sul">ICC Sul</option>
                  <option value="bsa">Bolsão da BSA</option>
                  <option value="ft">Faculdade de Tecnologia (FT)</option>
                  <option value="bce">Biblioteca Central (BCE)</option>
                  <option value="pat">Pavilhão Anísio Teixeira (PAT)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Categoria Gastronômica
                </label>
                <select
                  value={candCategory}
                  onChange={(e) => setCandCategory(e.target.value as FoodCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="marmitas">Marmitas & Almoço</option>
                  <option value="lanches">Lanches Rápidos & Salgados</option>
                  <option value="doces">Doces & Confeitaria</option>
                  <option value="bebidas">Bebidas & Cafeteria</option>
                  <option value="vegano">Vegano & Saudável</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Resumo dos Produtos e Procedência
              </label>
              <textarea
                rows={2}
                value={candDescription}
                onChange={(e) => setCandDescription(e.target.value)}
                placeholder="Descreva como prepara os alimentos, local de produção e diferenciais sanitários."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center">
              <span className="material-symbols-outlined text-slate-400 text-xl block mb-0.5">upload_file</span>
              <span className="text-[11px] text-slate-600 block">
                Comprovante MEI + Laudo Sanitário Prévio (PDF / Imagem)
              </span>
              <span className="text-[10px] text-[#006e22] font-semibold mt-1 inline-block">
                ✓ 3 Documentos prontos para envio
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#001e40] text-white text-xs font-bold hover:bg-[#003366] transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-base">send</span>
              <span>Submeter Candidatura para Comissão DAC/UnB</span>
            </button>
          </form>
        )}

        {/* Bottom Student Direct Shortcut (Matches Image 5 bottom banner) */}
        <div className="mt-8 pt-5 border-t border-slate-200">
          <div className="bg-[#f0f3ff] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#003366] shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-base">calendar_month</span>
              </div>
              <div>
                <span className="font-bold text-[#001e40] block">
                  É discente, docente ou visitante?
                </span>
                <span className="text-slate-500 text-[11px]">
                  Consulte quiosques abertos, horários e cardápios livres.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToMarketplace}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#001e40] text-white font-bold hover:bg-[#003366] transition-colors shrink-0 text-xs shadow-xs"
            >
              Acessar Sem Senha
            </button>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-slate-400 mt-6">
        © 2026 UniEats UnB • Sistema Integrado de Governança Alimentar Comunitária
      </div>
    </div>
  );
};
