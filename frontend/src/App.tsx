import React, { useState } from 'react';
import { Header, ActiveScreen, UserRole } from './components/Header';
import { MarketplaceView } from './components/MarketplaceView';
import { AdminView } from './components/AdminView';
import { VendorPanelView } from './components/VendorPanelView';
import { AuthPortalView } from './components/AuthPortalView';
import { QrCodeDetailModal } from './components/QrCodeDetailModal';
import { QrScannerModal } from './components/QrScannerModal';
import { NewPointModal } from './components/NewPointModal';
import { DossierModal } from './components/DossierModal';
import { AuditLogModal } from './components/AuditLogModal';
import { Toast } from './components/Toast';
import { INITIAL_VENDORS, INITIAL_AUDIT_LOGS } from './data/mockData';
import { Vendor, VendorStatus, CampusZone, FoodCategory, AuditLogEntry } from './types';

export default function App() {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('marketplace');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [qrModalVendor, setQrModalVendor] = useState<Vendor | null>(null);
  const [dossierVendor, setDossierVendor] = useState<Vendor | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isNewPointOpen, setIsNewPointOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Vendor status updates
  const handleUpdateVendorStatus = (vendorId: string, status: VendorStatus) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          return {
            ...v,
            status,
            statusText: status === 'regular' ? 'REGULAR' : status === 'pendente' ? 'PENDENTE' : 'SUSPENSO',
            isOpen: status === 'regular'
          };
        }
        return v;
      })
    );

    // Add audit log
    const updatedVendor = vendors.find((v) => v.id === vendorId);
    if (updatedVendor) {
      const newLog: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString('pt-BR'),
        actor: 'Fiscalização DAC / DACES',
        action: status === 'regular' ? 'Homologação Sanitária' : 'Suspensão Cautelar',
        details: `Vendedor ${updatedVendor.name} (${updatedVendor.pointName}) teve status alterado para ${status}.`,
        hash: updatedVendor.cryptoHash,
        seiReference: updatedVendor.seiProcessNumber
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }
  };

  // Approve a pending applicant
  const handleApproveCandidate = (vendorId: string) => {
    const alvNum = `DAC-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const hash = `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`;

    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          return {
            ...v,
            status: 'regular',
            statusText: 'REGULAR',
            alvaraNumber: alvNum,
            alvaraValidUntil: '24/09/2027',
            cryptoHash: hash,
            isOpen: true,
            daysRemainingOrExpired: 365,
            safetyChecklist: [
              'Alvará Sanitário Homologado (DIVISA)',
              'Certificado MEI Ativo',
              'Curso de Boas Práticas Concluído',
              'Selo QR Emitido pelo DAC'
            ]
          };
        }
        return v;
      })
    );

    const cand = vendors.find((v) => v.id === vendorId);
    showToast(`Candidato ${cand?.name || ''} homologado com sucesso! Selo QR Code gerado.`);

    // Record audit log
    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      actor: 'Comissão de Alimentação Comunitária DAC',
      action: 'Aprovação de Credenciamento & Emissão de QR',
      details: `Candidato ${cand?.name} aprovado com emissão de alvará ${alvNum}.`,
      hash,
      seiReference: cand?.seiProcessNumber || '23106.000000/2026-00'
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Reject candidate
  const handleRejectCandidate = (vendorId: string, reason: string) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          return {
            ...v,
            status: 'suspenso',
            statusText: 'INDEFERIDO',
            isOpen: false,
            description: `${v.description} [INDEFERIDO: ${reason}]`
          };
        }
        return v;
      })
    );
  };

  // Add a new homologated point
  const handleSaveNewPoint = (data: {
    name: string;
    zone: CampusZone;
    zoneLabel: string;
    category: string;
    seiProcess: string;
    facilities: string[];
  }) => {
    showToast(`Ponto "${data.name}" (${data.zoneLabel}) cadastrado no inventário espacial do DAC!`);
  };

  // Candidate registers from auth portal
  const handleRegisterCandidate = (data: {
    name: string;
    businessName: string;
    cpf: string;
    email: string;
    phone: string;
    zone: CampusZone;
    category: FoodCategory;
    dishDescription: string;
  }) => {
    const newVendor: Vendor = {
      id: `cand-${Date.now()}`,
      name: data.name,
      businessName: data.businessName,
      cpfMasked: `${data.cpf.slice(0, 3)}.***.***-**`,
      email: data.email,
      phoneWhatsapp: data.phone,
      pointId: `PONTO-NOVO-${Math.floor(10 + Math.random() * 90)}`,
      pointName: `Candidato • Polo ${data.zone.toUpperCase()}`,
      zone: data.zone,
      zoneLabel: `Campus Darcy Ribeiro (${data.zone.toUpperCase()})`,
      category: data.category,
      categoryLabel: data.category === 'marmitas' ? 'Almoço & Marmitas' : 'Lanches Rápidos',
      alvaraNumber: `DAC-PEND-${Math.floor(100 + Math.random() * 900)}`,
      alvaraValidUntil: 'Em Análise',
      cryptoHash: `0x${Math.random().toString(16).slice(2, 10)}`,
      status: 'pendente',
      statusText: 'PENDENTE',
      daysRemainingOrExpired: 0,
      isOpen: false,
      hours: 'Submetido agora',
      rating: 0,
      reviewsCount: 0,
      highlightDish: 'Carro-chefe em homologação',
      highlightPrice: 12.0,
      description: data.dishDescription,
      safetyChecklist: [
        'Formulário Submetido via Portal DAC',
        'Aguardando Análise Documental',
        'Comprovação MEI Anexada'
      ],
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8nQwOfRMrs7dVlAlMgFisp_gxm322BonUJfE_hhlPWGKi4H35BtRtl1x7SH-vrGitas_mHdNpYbx9uPSHvZm2_foEMV07-UygCgICMFQkP5gShzP9GjqZD7D6j8p6HHTK5c0dsQYujD0bO2TAh9qfbWlV6jhZXGXx9TiyhuoM5FJjo4SkojoWKN97Sxq1Zfz9gcnhkXjdjvC8a5F2xvlxiipgQieEmAbhoCowSWfq4mfP5wlZFbM',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLsyElrEvpb3MKXP7_bDx-26RR660_PApEZ5wH7pWxAnmGU5AmbXJLWTKWB8tJDDkxU3AvaOU_YPk4G3TVtSxuz_MNtI4nSevlXlHsatBW4syTLmKESoSfftwGGQTnqNpu9qMJM91y9adqvgm7HrQS9VOoZ-B8iyncNLP2iOtIgUoUxFeu9gnUDym9zMOnBjNEiQjBcEowTBRaIXj9hQNh5kdbTdD6k2t00Vasts74CI9f03-xcP4',
      seiProcessNumber: `23106.${Math.floor(100000 + Math.random() * 900000)}/2026-10`,
      menuItems: []
    };

    setVendors((prev) => [newVendor, ...prev]);

    // Record audit log
    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      actor: 'Protocolo Eletrônico Portal DAC',
      action: 'Nova Inscrição de Credenciamento',
      details: `Candidato ${data.name} solicitou credenciamento para ${data.businessName}.`,
      hash: newVendor.cryptoHash,
      seiReference: newVendor.seiProcessNumber
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Vendor updates (e.g. from VendorPanelView)
  const handleUpdateVendor = (updated: Vendor) => {
    setVendors((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  };

  // Active vendor for vendor panel (default to Tia Cida #1)
  const currentVendorData = vendors[0] || INITIAL_VENDORS[0];

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#111c2d] flex flex-col antialiased">
      {/* Top Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        userRole={userRole}
        onChangeRole={(role) => setUserRole(role)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Main Content Body */}
      <div className="pt-20 flex-1 flex flex-col">
        {currentScreen === 'marketplace' && (
          <MarketplaceView
            vendors={vendors}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenScanner={() => setIsScannerOpen(true)}
            onInspectVendorQr={(v) => setQrModalVendor(v)}
            onInspectVendorDossier={(v) => setDossierVendor(v)}
            onShowToast={showToast}
            onNavigateToAdmin={() => {
              setUserRole('dac_admin');
              setCurrentScreen('admin');
            }}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminView
            vendors={vendors}
            onOpenNewPoint={() => setIsNewPointOpen(true)}
            onOpenQrModal={(v) => setQrModalVendor(v)}
            onOpenDossier={(v) => setDossierVendor(v)}
            onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
            onUpdateVendorStatus={handleUpdateVendorStatus}
            onApproveCandidate={handleApproveCandidate}
            onRejectCandidate={handleRejectCandidate}
            onShowToast={showToast}
            onNavigateToScreen={(s) => setCurrentScreen(s)}
          />
        )}

        {currentScreen === 'vendor' && (
          <VendorPanelView
            vendor={currentVendorData}
            onUpdateVendor={handleUpdateVendor}
            onOpenQrModal={(v) => setQrModalVendor(v)}
            onShowToast={showToast}
            onNavigateToMarketplace={() => setCurrentScreen('marketplace')}
          />
        )}

        {currentScreen === 'auth' && (
          <AuthPortalView
            onLoginSuccess={(role) => {
              setUserRole(role);
              if (role === 'dac_admin') setCurrentScreen('admin');
              else if (role === 'vendor') setCurrentScreen('vendor');
              else setCurrentScreen('marketplace');
            }}
            onNavigateToMarketplace={() => setCurrentScreen('marketplace')}
            onRegisterCandidate={handleRegisterCandidate}
            onShowToast={showToast}
          />
        )}
      </div>

      {/* Modals */}
      <QrCodeDetailModal
        vendor={qrModalVendor}
        onClose={() => setQrModalVendor(null)}
        onCopyLink={showToast}
      />

      <QrScannerModal
        vendors={vendors}
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSelectVendor={(v) => setQrModalVendor(v)}
      />

      <NewPointModal
        isOpen={isNewPointOpen}
        onClose={() => setIsNewPointOpen(false)}
        onSave={handleSaveNewPoint}
      />

      <DossierModal
        vendor={dossierVendor}
        onClose={() => setDossierVendor(null)}
        onUpdateStatus={handleUpdateVendorStatus}
      />

      <AuditLogModal
        logs={auditLogs}
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
      />

      {/* Toast Feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
