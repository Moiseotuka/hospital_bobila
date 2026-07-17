export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  phone?: string;
  photo?: string;
  derniere_connexion?: string;
  created_at: string;
  updated_at: string;
}

export interface Grade {
  id: number;
  code: string;
  nom: string;
  salaire_base: number;
  prime?: number;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Fonction {
  id: number;
  code: string;
  nom: string;
  prime_fonction: number;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Departement {
  id: number;
  code: string;
  nom: string;
  description?: string;
  chef_departement_id?: number;
  chef?: Agent | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: number;
  code: string;
  nom: string;
  description?: string;
  departement_id: number;
  departement?: Departement;
  chef_service_id?: number;
  chef?: Agent | null;
  created_at?: string;
  updated_at?: string;
}

export interface CategorieSalariale {
  id: number;
  code: string;
  nom: string;
  salaire_base: number;
  indemnites: number;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Prime {
  id: number;
  code: string;
  nom: string;
  type: string;
  montant: number;
  pourcentage?: number;
  est_pourcentage: boolean;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Retenue {
  id: number;
  code: string;
  nom: string;
  type: string;
  montant: number;
  pourcentage?: number;
  est_pourcentage: boolean;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PeriodePaie {
  id: number;
  mois: number;
  annee: number;
  date_debut: string;
  date_fin: string;
  statut: string;
  total_brut?: number;
  total_primes?: number;
  total_retenues?: number;
  total_net?: number;
  nombre_agents?: number;
  created_by?: number;
  valide_by?: number;
  verrouille_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Agent {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  lieu_naissance?: string;
  sexe: string;
  etat_civil?: string;
  nationalite?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  photo?: string;
  type_agent: string;
  categorie_salariale_id?: number;
  categorie_salariale?: CategorieSalariale;
  grade_id?: number;
  grade?: Grade;
  fonction_id?: number;
  fonction?: Fonction;
  departement_id?: number;
  departement?: Departement;
  service_id?: number;
  service?: Service;
  date_recrutement: string;
  date_prise_service?: string;
  date_fin_contrat?: string;
  statut: string;
  numero_compte?: string;
  banque?: string;
  numero_securite_sociale?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BulletinPaie {
  id: number;
  agent_id: number;
  periode_paie_id: number;
  matricule: string;
  nom_complet: string;
  grade_nom: string;
  fonction_nom: string;
  departement_nom: string;
  service_nom: string;
  salaire_base: number;
  total_primes: number;
  total_retenues: number;
  salaire_brut: number;
  salaire_net: number;
  net_a_payer: number;
  primes_detail?: any;
  retenues_detail?: any;
  date_generation: string;
  est_valide: boolean;
  est_verrouille: boolean;
  qr_code?: string;
  agent?: Agent;
  periode?: PeriodePaie;
  created_at?: string;
  updated_at?: string;
}

export interface Paiement {
  id: number;
  bulletin_paie_id: number;
  agent_id: number;
  periode_paie_id: number;
  montant: number;
  date_paiement: string;
  mode_paiement: string;
  reference?: string;
  banque?: string;
  statut: string;
  motif_annulation?: string;
  traite_par?: number;
  traitePar?: User;
  agent?: Agent;
  bulletin?: BulletinPaie;
  created_at?: string;
  updated_at?: string;
}

export interface AuditLog {
  id: number;
  user_id?: number;
  user?: User;
  action: string;
  module: string;
  description: string;
  model_type?: string;
  model_id?: number;
  anciennes_valeurs?: any;
  nouvelles_valeurs?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface HospitalSetting {
  id: number;
  key: string;
  value: string;
  type: string;
  group: string;
}

export interface DashboardData {
  total_agents: number;
  total_militaires: number;
  total_civils: number;
  masse_salariale_mois: number;
  paiements_effectues: number;
  paiements_attente: number;
  retenues_totales: number;
  primes_totales: number;
  evolution_mensuelle: any[];
  repartition_grade: any[];
  repartition_departement: any[];
  derniers_paiements: any[];
  alertes: any[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}
