-- ==============================================================================
-- MIGRATION 02 : INTEROPÉRABILITÉ D-SANTÉ <-> D-PHARMA & TÉLÉTRANSMISSION IPM
-- ==============================================================================

-- 1. Table des liaisons conventionnées entre structures de santé et officines
CREATE TABLE IF NOT EXISTS reseau_sante_pharmacie (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_sante_id UUID REFERENCES structures_sante(id) ON DELETE CASCADE,
  pharmacie_id TEXT NOT NULL, -- ID de l'officine D-Pharma
  pharmacie_nom TEXT NOT NULL,
  pharmacie_telephone TEXT,
  pharmacie_adresse TEXT,
  statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'suspendu', 'demande')),
  partage_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_reseau_sante_structure ON reseau_sante_pharmacie(structure_sante_id);
CREATE INDEX IF NOT EXISTS idx_reseau_sante_pharmacie ON reseau_sante_pharmacie(pharmacie_id);

-- 2. Table des échanges cliniques (Demandes de substitution, alertes ruptures, signaux prédictifs)
CREATE TABLE IF NOT EXISTS echanges_clinique_pharmacie (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_sante_id UUID REFERENCES structures_sante(id) ON DELETE CASCADE,
  pharmacie_id TEXT NOT NULL,
  pharmacie_nom TEXT NOT NULL,
  type_echange TEXT NOT NULL CHECK (type_echange IN ('substitution', 'alerte_rupture', 'signal_epidemique')),
  
  -- Références Patient & Prescription
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  patient_ipp TEXT,
  patient_nom TEXT,
  consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
  numero_ordonnance TEXT,
  
  -- Détails du médicament
  medicament_prescrit TEXT,
  medicament_propose TEXT, -- Substitut proposé par le pharmacien
  motif TEXT,              -- Ex: "Rupture fournisseur, molécule générique identique disponible"
  posologie_ajustee TEXT,
  niveau_urgence TEXT DEFAULT 'normal' CHECK (niveau_urgence IN ('normal', 'urgent', 'critique')),
  
  -- Cycle de validation médicale
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'approuve', 'rejete', 'clos')),
  reponse_medecin TEXT,
  valide_par_medecin_nom TEXT,
  valide_par_medecin_id UUID,
  date_reponse TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_echanges_structure ON echanges_clinique_pharmacie(structure_sante_id);
CREATE INDEX IF NOT EXISTS idx_echanges_statut ON echanges_clinique_pharmacie(statut);
CREATE INDEX IF NOT EXISTS idx_echanges_type ON echanges_clinique_pharmacie(type_echange);

-- 3. Table des bordereaux de télétransmission Tiers-Payant (IPM / CMU / Assurances privées)
CREATE TABLE IF NOT EXISTS bordereaux_teletransmission_ipm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_bordereau TEXT UNIQUE NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('clinique', 'pharmacie')),
  emetteur_id UUID NOT NULL, -- ID structure_sante ou pharmacie
  emetteur_nom TEXT NOT NULL,
  organisme_assurance_id UUID REFERENCES organismes_assurances(id),
  organisme_nom TEXT NOT NULL,
  
  periode_debut DATE NOT NULL,
  periode_fin DATE NOT NULL,
  nombre_factures INTEGER NOT NULL DEFAULT 0,
  montant_total_reclame NUMERIC(12, 2) NOT NULL DEFAULT 0,
  montant_total_admis NUMERIC(12, 2) DEFAULT 0,
  
  -- Statut d'audit et de règlement par l'IPM
  statut_organisme TEXT DEFAULT 'soumis' CHECK (statut_organisme IN ('soumis', 'en_audit', 'valide_partiel', 'rejete', 'regle')),
  reference_virement TEXT,
  date_reglement DATE,
  fichiers_justificatifs JSONB DEFAULT '[]'::jsonb,
  notes_audit TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bordereaux_organisme ON bordereaux_teletransmission_ipm(organisme_assurance_id);
CREATE INDEX IF NOT EXISTS idx_bordereaux_statut ON bordereaux_teletransmission_ipm(statut_organisme);

-- 4. Table des lignes de factures associées au bordereau
CREATE TABLE IF NOT EXISTS bordereau_factures_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bordereau_id UUID REFERENCES bordereaux_teletransmission_ipm(id) ON DELETE CASCADE,
  facture_id UUID,
  numero_facture TEXT NOT NULL,
  date_facture DATE NOT NULL,
  patient_nom TEXT NOT NULL,
  patient_ipp TEXT,
  patient_matricule_assurance TEXT,
  
  montant_total_brut NUMERIC(12, 2) NOT NULL DEFAULT 0,
  part_patient NUMERIC(12, 2) NOT NULL DEFAULT 0,
  part_assurance NUMERIC(12, 2) NOT NULL DEFAULT 0,
  
  statut_ligne TEXT DEFAULT 'en_attente' CHECK (statut_ligne IN ('en_attente', 'admis', 'rejete')),
  motif_rejet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_items_bordereau ON bordereau_factures_items(bordereau_id);

