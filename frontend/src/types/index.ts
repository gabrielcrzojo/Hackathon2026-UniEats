export type CampusZone = 
  | 'todos'
  | 'uac'
  | 'ued'
  | 'ldtea'
  | 'ru-mesp'
  | 'convivencia'
  | 'biblioteca'
  | 'estacionamento';

export type FoodCategory =
  | 'todos'
  | 'marmitas'
  | 'lanches'
  | 'doces'
  | 'bebidas'
  | 'vegano';

export type VendorStatus = 'regular' | 'pendente' | 'suspenso';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  category: FoodCategory;
  isPopular?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  businessName: string;
  cpfMasked: string;
  email: string;
  phoneWhatsapp: string;
  pointId: string;
  pointName: string;
  zone: CampusZone;
  zoneLabel: string;
  category: FoodCategory;
  categoryLabel: string;
  alvaraNumber: string;
  alvaraValidUntil: string;
  cryptoHash: string;
  status: VendorStatus;
  statusText: string;
  daysRemainingOrExpired: number; // positive = days until expiry, negative = days expired
  isOpen: boolean;
  hours: string;
  rating?: number;
  reviewsCount?: number;
  highlightDish: string;
  highlightPrice: number;
  description: string;
  safetyChecklist: string[];
  imageUrl: string;
  avatarUrl: string;
  menuItems: MenuItem[];
  seiProcessNumber: string;
}

export interface CampusPointZone {
  id: string;
  name: string;
  zoneCode: CampusZone;
  totalPoints: number;
  occupiedPoints: number;
  freePoints: number;
  inAnalysisPoints?: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  hash: string;
  seiReference: string;
}
