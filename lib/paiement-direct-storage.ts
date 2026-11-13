/**
 * Module d'Encaissement Direct sur Appareils & Comptes de la Structure de Santé (Zéro Agrégateur)
 * D-SANTÉ — Économie de 100% des frais de commission d'agrégateur (2% à 3.5% préservés)
 */

export interface CompteMarchandDirect {
  id: string;
  type: 'wave' | 'orange_money' | 'free_money' | 'tpe_banque';
  nom: string;
  numeroOuCode: string;
  banqueOuOperateur: string;
  pointDeVente: string;
  actif: boolean;
  qrCodeData?: string;
  instructions?: string;
}

export interface TransactionDirecte {
  id: string;
  date: string;
  heure: string;
  montant: number;
  devise: string;
  methode: 'wave' | 'orange_money' | 'free_money' | 'tpe_carte' | 'especes';
  methodeLibelle: string;
  referenceExterne: string; // ID transaction Wave, ID Orange Money, N° Autorisation STAN TPE
  terminalOuCompteNom: string;
  clientNom: string;
  commandeRef: string; // N° Facture Soins / N° Dossier Patient (IPP)
  pointDeVente: string;
  caissier: string;
  statut: 'valide' | 'annule';
  fraisAggregateurEconomises: number; // 2.5% du montant préservés
  notes?: string;
}

const STORAGE_KEY_COMPTES = 'dsante_comptes_marchands_directs';
const STORAGE_KEY_TRANSACTIONS = 'dsante_transactions_directes';

export const COMPTES_MARCHANDS_DEFAUT: CompteMarchandDirect[] = [
  {
    id: 'cpt-wave-sante',
    type: 'wave',
    nom: 'Wave Marchand Caisse Accueil & Consultations',
    numeroOuCode: '+221 77 820 00 00',
    banqueOuOperateur: 'Wave Business Sénégal',
    pointDeVente: 'Accueil & Facturation Centrale',
    actif: true,
    qrCodeData: 'https://pay.wave.com/m/M_sn_clinique_sante',
    instructions: 'Scanner le QR Wave ou envoyer au numéro marchand direct de la clinique',
  },
  {
    id: 'cpt-om-sante',
    type: 'orange_money',
    nom: 'Orange Money Marchand Clinique',
    numeroOuCode: '945120',
    banqueOuOperateur: 'Orange Money Sénégal',
    pointDeVente: 'Accueil & Facturation Centrale',
    actif: true,
    instructions: 'Composer #144#391*945120*Montant# ou scanner le QR code officiel de l’établissement',
  },
  {
    id: 'cpt-tpe-sante-cbao',
    type: 'tpe_banque',
    nom: 'TPE Bancaire Accueil CBAO #01',
    numeroOuCode: 'TPE-CBAO-CLINIQUE-01',
    banqueOuOperateur: 'CBAO Attijariwafa Bank (Visa / Mastercard / GIM-UEMOA)',
    pointDeVente: 'Accueil & Admissions',
    actif: true,
    instructions: 'Insérer ou approcher la carte bancaire sur le terminal CBAO de la réception',
  },
  {
    id: 'cpt-tpe-urgences',
    type: 'tpe_banque',
    nom: 'TPE Mobile Urgences & Nuit BOA #02',
    numeroOuCode: 'TPE-BOA-URGENCES-02',
    banqueOuOperateur: 'Bank of Africa (BOA) Sénégal',
    pointDeVente: 'Service Urgences 24/7',
    actif: true,
    instructions: 'Terminal mobile autonome pour règlements en urgences et hospitalisations de nuit',
  },
  {
    id: 'cpt-free-sante',
    type: 'free_money',
    nom: 'Free Money Marchand',
    numeroOuCode: '72140',
    banqueOuOperateur: 'Free Money Sénégal',
    pointDeVente: 'Accueil & Facturation Centrale',
    actif: false,
    instructions: 'Code Marchand Free Money direct',
  },
];

export const TRANSACTIONS_DIRECTES_DEFAUT: TransactionDirecte[] = [
  {
    id: 'TX-SAN-2026-001',
    date: '2026-11-13',
    heure: '08:50',
    montant: 25000,
    devise: 'XOF',
    methode: 'wave',
    methodeLibelle: 'Wave Direct Marchand (0% agrégateur)',
    referenceExterne: 'W-991820419',
    terminalOuCompteNom: 'Wave Marchand Caisse Accueil & Consultations',
    clientNom: 'Mamadou Ndiaye (IPP: P-2026-041)',
    commandeRef: 'FAC-2026-00184 (Consultation Cardiologie & ECG)',
    pointDeVente: 'Accueil & Facturation Centrale',
    caissier: 'Awa Cissé',
    statut: 'valide',
    fraisAggregateurEconomises: 625, // 25 000 * 2.5%
    notes: 'Paiement direct Wave vérifié sur smartphone marchand réception',
  },
  {
    id: 'TX-SAN-2026-002',
    date: '2026-11-13',
    heure: '09:40',
    montant: 48000,
    devise: 'XOF',
    methode: 'orange_money',
    methodeLibelle: 'Orange Money Direct (Code 945120)',
    referenceExterne: 'MP261113.0940.F12093',
    terminalOuCompteNom: 'Orange Money Marchand Clinique',
    clientNom: 'Aissatou Sarr (IPP: P-2026-078)',
    commandeRef: 'FAC-2026-00185 (Bilan sanguin complet & Échographie)',
    pointDeVente: 'Accueil & Facturation Centrale',
    caissier: 'Ibrahima Gueye',
    statut: 'valide',
    fraisAggregateurEconomises: 1200,
    notes: 'Code marchand composé à l’accueil, SMS de validation reçu sur téléphone caisse',
  },
  {
    id: 'TX-SAN-2026-003',
    date: '2026-11-13',
    heure: '10:30',
    montant: 350000,
    devise: 'XOF',
    methode: 'tpe_carte',
    methodeLibelle: 'TPE Carte Bancaire CBAO (STAN: 062149)',
    referenceExterne: 'STAN-062149 / AUTH-881029',
    terminalOuCompteNom: 'TPE Bancaire Accueil CBAO #01',
    clientNom: 'Oumar Diop (IPP: P-2026-012)',
    commandeRef: 'FAC-2026-00186 (Forfait Chirurgie Ambulatoire & Séjour)',
    pointDeVente: 'Accueil & Admissions',
    caissier: 'Awa Cissé',
    statut: 'valide',
    fraisAggregateurEconomises: 8750, // 350 000 * 2.5%
    notes: 'Carte bancaire Visa sur TPE CBAO de la clinique. Ticket agrafé au dossier médical.',
  },
  {
    id: 'TX-SAN-2026-004',
    date: '2026-11-13',
    heure: '11:05',
    montant: 10000,
    devise: 'XOF',
    methode: 'especes',
    methodeLibelle: 'Espèces / Caisse Directe',
    referenceExterne: 'ESP-1105-SAN',
    terminalOuCompteNom: 'Tiroir-Caisse Accueil',
    clientNom: 'Khadija Ba (IPP: P-2026-095)',
    commandeRef: 'FAC-2026-00187 (Ticket modérateur consultation pédiatrique)',
    pointDeVente: 'Accueil & Facturation Centrale',
    caissier: 'Ibrahima Gueye',
    statut: 'valide',
    fraisAggregateurEconomises: 0,
    notes: 'Règlement espèces, reçu délivré au patient.',
  },
];

export function getComptesMarchandsDirects(): CompteMarchandDirect[] {
  if (typeof window === 'undefined') return COMPTES_MARCHANDS_DEFAUT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPTES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_COMPTES, JSON.stringify(COMPTES_MARCHANDS_DEFAUT));
      return COMPTES_MARCHANDS_DEFAUT;
    }
    return JSON.parse(raw);
  } catch {
    return COMPTES_MARCHANDS_DEFAUT;
  }
}

export function saveCompteMarchandDirect(compte: CompteMarchandDirect): void {
  if (typeof window === 'undefined') return;
  const existants = getComptesMarchandsDirects();
  const index = existants.findIndex((c) => c.id === compte.id);
  let maj: CompteMarchandDirect[];
  if (index >= 0) {
    maj = [...existants];
    maj[index] = compte;
  } else {
    maj = [compte, ...existants];
  }
  localStorage.setItem(STORAGE_KEY_COMPTES, JSON.stringify(maj));
}

export function supprimerCompteMarchandDirect(id: string): void {
  if (typeof window === 'undefined') return;
  const existants = getComptesMarchandsDirects();
  const maj = existants.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY_COMPTES, JSON.stringify(maj));
}

export function getTransactionsDirectes(): TransactionDirecte[] {
  if (typeof window === 'undefined') return TRANSACTIONS_DIRECTES_DEFAUT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(TRANSACTIONS_DIRECTES_DEFAUT));
      return TRANSACTIONS_DIRECTES_DEFAUT;
    }
    return JSON.parse(raw);
  } catch {
    return TRANSACTIONS_DIRECTES_DEFAUT;
  }
}

export function enregistrerTransactionDirecte(tx: Omit<TransactionDirecte, 'id' | 'fraisAggregateurEconomises'>): TransactionDirecte {
  const fraisAggregateurEconomises = tx.methode === 'especes' ? 0 : Math.round(tx.montant * 0.025);
  const nouvelle: TransactionDirecte = {
    ...tx,
    id: `TX-SAN-${Date.now().toString().slice(-6)}`,
    fraisAggregateurEconomises,
  };

  if (typeof window !== 'undefined') {
    const existantes = getTransactionsDirectes();
    const maj = [nouvelle, ...existantes];
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(maj));
  }
  return nouvelle;
}

export function getTotalEconomiesAggregateurs(): { totalEncaisseDirect: number; totalEconomise: number; nombreTransactions: number } {
  const txs = getTransactionsDirectes();
  const valides = txs.filter((t) => t.statut === 'valide');
  const totalEncaisseDirect = valides.reduce((sum, t) => sum + t.montant, 0);
  const totalEconomise = valides.reduce((sum, t) => sum + t.fraisAggregateurEconomises, 0);
  return {
    totalEncaisseDirect,
    totalEconomise,
    nombreTransactions: valides.length,
  };
}

