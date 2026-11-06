-- 04_abonnement_paiements.sql
-- Table des règlements d'abonnements SaaS D-SANTÉ (Maketou, Chariow, Caisse, Virement)

alter table public.structures_sante add column if not exists compte_verrouille boolean default false;
alter table public.structures_sante add column if not exists essai_expire_le timestamptz default (now() + interval '30 days');

create table if not exists public.abonnement_paiements (
  id uuid primary key default gen_random_uuid(),
  structure_id uuid references public.structures_sante(id) on delete cascade,
  niveau varchar(50) not null, -- poste_sante, clinique, hopital
  montant numeric not null,
  devise varchar(10) not null default 'XOF',
  provider varchar(30) not null, -- maketou, chariow, virement, caisse
  moyen_paiement varchar(30) not null, -- mobile_money, carte, virement, caisse
  provider_reference text,
  checkout_url text,
  statut varchar(20) not null default 'pending', -- pending, completed, failed
  structure_nom text,
  structure_telephone text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_sante_abonnement_structure on public.abonnement_paiements (structure_id);
create index if not exists idx_sante_abonnement_statut on public.abonnement_paiements (statut);
