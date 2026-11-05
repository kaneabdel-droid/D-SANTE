-- ==============================================================================
-- MIGRATION 03 : PERSONNEL SOIGNANT & COLLABORATEURS D-SANTÉ
-- ==============================================================================

CREATE TABLE IF NOT EXISTS personnel_soignant (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id UUID REFERENCES structures_sante(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('medecin', 'infirmier', 'pharmacien', 'caissier', 'sage_femme', 'aide_soignant', 'laborantin', 'administrateur')),
  specialite TEXT,
  telephone TEXT,
  email TEXT,
  statut_garde TEXT DEFAULT 'En Service',
  en_garde_aujourdhui BOOLEAN DEFAULT false,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_personnel_structure ON personnel_soignant(structure_id);
