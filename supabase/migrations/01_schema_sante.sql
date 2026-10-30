-- ==============================================================================
-- D-SANTÉ : Schéma Relationnel Complet Multi-Tenant (Structures de Santé)
-- Hôpitaux, Cliniques, Centres & Postes de Santé
-- ==============================================================================

-- 1. Table des Structures de Santé (Multi-Tenancy)
CREATE TABLE IF NOT EXISTS structures_sante (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  type_structure TEXT NOT NULL DEFAULT 'clinique' CHECK (type_structure IN ('hopital', 'clinique', 'poste_sante', 'cabinet', 'maternite')),
  region TEXT,
  departement TEXT,
  adresse TEXT,
  telephone TEXT,
  email TEXT,
  directeur_nom TEXT,
  subscription_tier TEXT DEFAULT 'gratuit' CHECK (subscription_tier IN ('gratuit', 'poste_sante', 'centre_medical', 'hopital', 'illimite')),
  devise TEXT DEFAULT 'FCFA',
  compte_verrouille BOOLEAN DEFAULT false,
  essai_expire_le TIMESTAMPTZ DEFAULT (now() + interval '30 days'),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Rétro-compatibilité : vue ou alias si nécessaire
CREATE INDEX IF NOT EXISTS idx_structures_sante_type ON structures_sante(type_structure);

-- 2. Services Médicaux & Pavillons
CREATE TABLE IF NOT EXISTS services_medicaux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id UUID NOT NULL REFERENCES structures_sante(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  code TEXT,
  chef_service_id UUID,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_medicaux_structure ON services_medicaux(structure_id);

-- 3. Lits & Chambres d'Hospitalisation
CREATE TABLE IF NOT EXISTS lits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id UUID NOT NULL REFERENCES structures_sante(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services_medicaux(id) ON DELETE CASCADE,
  numero_lit TEXT NOT NULL,
  chambre TEXT NOT NULL,
  categorie TEXT DEFAULT 'standard' CHECK (categorie IN ('standard', 'vip', 'soins_intensifs', 'couveuse', 'isolement')),
  tarif_journalier NUMERIC(12,2) DEFAULT 0,
  statut TEXT DEFAULT 'libre' CHECK (statut IN ('libre', 'occupe', 'nettoyage', 'maintenance')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lits_structure_statut ON lits(structure_id, statut);

-- 4. Organismes d'Assurances, Mutuelles & Tiers-Payant (IPM, CMU, etc.)
CREATE TABLE IF NOT EXISTS organismes_assurances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id UUID NOT NULL REFERENCES structures_sante(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  type_organisme TEXT DEFAULT 'ipm' CHECK (type_organisme IN ('ipm', 'cmu', 'assurance_privee', 'mutuelle_communautaire', 'societe')),
  taux_couverture_defaut NUMERIC(5,2) DEFAULT 80.00,
  delai_reglement_jours INT DEFAULT 30,
  contact_nom TEXT,
  contact_telephone TEXT,
  email_facturation TEXT,
  adresse TEXT,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assurances_structure ON organismes_assurances(structure_id);

-- 5. Patients (Fichier d'Identification Patient Unique - IPP)
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id UUID NOT NULL REFERENCES structures_sante(id) ON DELETE CASCADE,
  ipp TEXT NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  date_naissance DATE,
  sexe TEXT NOT NULL CHECK (sexe IN ('M', 'F')),
  groupe_sanguin TEXT CHECK (groupe_sanguin IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  rhesus TEXT,
  telephone TEXT,
  email TEXT,
  adresse TEXT,
  profession TEXT,
  situation_matrimoniale TEXT,
  personne_contact_nom TEXT,
  personne_contact_telephone TEXT,
  personne_contact_lien TEXT,
  organisme_assurance_id UUID REFERENCES organismes_assurances(id) ON DELETE SET NULL,
  numero_assure TEXT,
  taux_couverture NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_patient_ipp_structure UNIQUE (structure_id, ipp)
);

CREATE INDEX IF NOT EXISTS idx_patients_structure_nom ON patients(structure_id, nom, prenom);
CREATE INDEX IF NOT EXISTS idx_patients_ipp ON patients(structure_id, ipp);

-- 6. Dossiers Médicaux Partagés
CREATE TABLE IF NOT EXISTS dossiers_medicaux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE UNIQUE,
  structure_id UUID NOT NULL REFERENCES structures_sante(id) ON DELETE CASCADE,
  allergies JSONB DEFAULT '[]'::jsonb,
  antecedents_medicaux TEXT,
  antecedents_chirurgicaux TEXT,
  antecedents_familiaux TEXT,
  traitements_chroniques TEXT,
  facteurs_risque TEXT,
  remarques_praticien TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Constantes Vitales (Triage & Surveillance au Chevet)
CREATE TABLE IF NOT EXISTS constantes_vitales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  structure_id UUID NOT NULL REFERENCES structures_sante(id) ON DELETE CASCADE,
  pris_par UUID,
  tension_systolique INT,
  tension_diastolique INT,
  temperature NUMERIC(4,1),
  pouls INT,
  saturation_o2 INT,
  frequence_respiratoire INT,
  glycemie NUMERIC(5,2),
  poids_kg NUMERIC(5,2),
  taille_cm NUMERIC(5,1),
  imc NUMERIC(4,1),
  douleur_eva INT DEFAULT 0 CHECK (douleur_eva BETWEEN 0 AND 10),
  niveau_triage TEXT DEFAULT 'vert' CHECK (niveau_triage IN ('vert', 'jaune', 'orange', 'rouge')),
  observations TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_constantes_patient ON constantes_vitales(patient_id, created_at DESC);

-- 8. Consultations Médicales
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id UUID NOT NULL REFERENCES structures_sante(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  praticien_id UUID,
  service_id UUID REFERENCES services_medicaux(id),
  numero_consultation TEXT NOT NULL,
  date_consultation DATE DEFAULT CURRENT_DATE,
  type_consultation TEXT DEFAULT 'generale' CHECK (type_consultation IN ('generale', 'urgence', 'prenatale', 'pediatrique', 'specialiste', 'postnatale')),
  motif TEXT NOT NULL,
  anamnese TEXT,
  examen_clinique TEXT,
  diagnostic_principal TEXT,
  code_cim10 TEXT,
  diagnostics_associes TEXT,
  conduite_a_tenir TEXT,
  statut TEXT DEFAULT 'en_cours' CHECK (statut IN ('en_attente', 'en_cours', 'terminee')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consultations_patient ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_date ON consultations(structure_id, date_consultation DESC);

-- 9. Prescriptions & Ordonnances
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  structure_id UUID NOT NULL REFERENCES structures_sante(id) ON DELETE CASCADE,
  praticien_id UUID,
  numero_ordonnance TEXT NOT NULL,
  date_prescription DATE DEFAULT CURRENT_DATE,
  instructions_generales TEXT,
  statut TEXT DEFAULT 'active' CHECK (statut IN ('active', 'dispensee_partielle', 'dispensee_totale', 'annulee')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lignes_prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  type_prescription TEXT DEFAULT 'medicament' CHECK (type_prescription IN ('medicament', 'examen_biologique', 'imagerie', 'soin_infirmier')),
  designation TEXT NOT NULL,
  dosage TEXT,
  forme TEXT,
  posologie TEXT,
  duree_jours INT,
  instructions TEXT,
  delivree BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);

-- 10. Soins Infirmiers & Actes au Chevet
CREATE TABLE IF NOT EXISTS soins_infirmiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  structure_id UUID NOT NULL REFERENCES structures_sante(id) ON DELETE CASCADE,
  soignant_id UUID,
  consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
  type_soin TEXT NOT NULL CHECK (type_soin IN ('injection', 'perfusion', 'pansement', 'nebulisation', 'sondage', 'prelevement', 'autre')),
  description TEXT NOT NULL,
  date_soin TIMESTAMPTZ DEFAULT now(),
  statut TEXT DEFAULT 'effectue' CHECK (statut IN ('planifie', 'effectue', 'annule')),
  observations TEXT
);

-- 11. Hospitalisation & Gestion des Séjours
CREATE TABLE IF NOT EXISTS hospitalisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id UUID NOT NULL REFERENCES structures_sante(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  lit_id UUID REFERENCES lits(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services_medicaux(id) ON DELETE SET NULL,
  medecin_traitant_id UUID,
  numero_sejour TEXT NOT NULL,
  date_entree TIMESTAMPTZ DEFAULT now(),
  date_sortie_prevue DATE,
  date_sortie_reelle TIMESTAMPTZ,
  motif_admission TEXT NOT NULL,
  mode_sortie TEXT CHECK (mode_sortie IN ('guerison', 'amelioration', 'transfert', 'deces', 'contre_avis')),
  resume_sortie TEXT,
  statut TEXT DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'cloturee', 'annulee')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hosp_structure_statut ON hospitalisations(structure_id, statut);

-- 12. Catalogue des Actes Médicaux & Tarifs
CREATE TABLE IF NOT EXISTS tarifs_actes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id UUID NOT NULL REFERENCES structures_sante(id) ON DELETE CASCADE,
  code_acte TEXT NOT NULL,
  categorie TEXT NOT NULL CHECK (categorie IN ('consultation', 'soin', 'maternite', 'chirurgie', 'laboratoire', 'imagerie', 'sejour')),
  libelle TEXT NOT NULL,
  prix_standard NUMERIC(12,2) NOT NULL DEFAULT 0,
  prix_mutuelle NUMERIC(12,2),
  prix_cmu NUMERIC(12,2),
  actif BOOLEAN DEFAULT true
);

-- 13. Facturation Santé & Tiers-Payant
CREATE TABLE IF NOT EXISTS factures_sante (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id UUID NOT NULL REFERENCES structures_sante(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
  hospitalisation_id UUID REFERENCES hospitalisations(id) ON DELETE SET NULL,
  organisme_assurance_id UUID REFERENCES organismes_assurances(id) ON DELETE SET NULL,
  numero_facture TEXT NOT NULL,
  date_facture DATE DEFAULT CURRENT_DATE,
  montant_total_brut NUMERIC(12,2) NOT NULL DEFAULT 0,
  part_patient NUMERIC(12,2) NOT NULL DEFAULT 0,
  part_assurance NUMERIC(12,2) NOT NULL DEFAULT 0,
  montant_regle_patient NUMERIC(12,2) DEFAULT 0,
  statut_paiement_patient TEXT DEFAULT 'en_attente' CHECK (statut_paiement_patient IN ('en_attente', 'partiel', 'paye', 'exonere')),
  statut_paiement_assurance TEXT DEFAULT 'en_attente' CHECK (statut_paiement_assurance IN ('en_attente', 'depose', 'rembourse', 'rejete')),
  moyen_paiement TEXT CHECK (moyen_paiement IN ('especes', 'wave', 'orange_money', 'cheque', 'carte', 'prise_en_charge')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lignes_factures_sante (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facture_id UUID NOT NULL REFERENCES factures_sante(id) ON DELETE CASCADE,
  libelle TEXT NOT NULL,
  quantite INT DEFAULT 1,
  prix_unitaire NUMERIC(12,2) NOT NULL DEFAULT 0,
  montant_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  part_patient NUMERIC(12,2) NOT NULL DEFAULT 0,
  part_assurance NUMERIC(12,2) NOT NULL DEFAULT 0
);

-- 14. Pharmacie Interne & Dépôt de Médicaments
CREATE TABLE IF NOT EXISTS pharmacie_stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id UUID NOT NULL REFERENCES structures_sante(id) ON DELETE CASCADE,
  code_medicament TEXT,
  dci TEXT NOT NULL,
  nom_commercial TEXT,
  forme TEXT DEFAULT 'comprime',
  dosage TEXT,
  quantite_en_stock INT NOT NULL DEFAULT 0,
  seuil_alerte INT DEFAULT 10,
  prix_achat NUMERIC(12,2) DEFAULT 0,
  prix_vente NUMERIC(12,2) NOT NULL DEFAULT 0,
  numero_lot TEXT,
  date_peremption DATE,
  actif BOOLEAN DEFAULT true
);

-- 15. Matériel Biomédical & Équipements
CREATE TABLE IF NOT EXISTS materiel_biomedical (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id UUID NOT NULL REFERENCES structures_sante(id) ON DELETE CASCADE,
  code_materiel TEXT NOT NULL,
  nom TEXT NOT NULL,
  service_id UUID REFERENCES services_medicaux(id) ON DELETE SET NULL,
  marque TEXT,
  modele TEXT,
  numero_serie TEXT,
  date_mise_en_service DATE,
  etat TEXT DEFAULT 'operationnel' CHECK (etat IN ('operationnel', 'en_panne', 'maintenance', 'hors_service')),
  prochaine_maintenance DATE,
  valeur_acquisition NUMERIC(12,2) DEFAULT 0
);
