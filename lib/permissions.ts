export type ModuleName =
  | 'patients'
  | 'triage'
  | 'consultations'
  | 'prescriptions'
  | 'soins'
  | 'hospitalisation'
  | 'pharmacie'
  | 'stocks'
  | 'caisse'
  | 'facturation'
  | 'tiers_payant'
  | 'comptabilite'
  | 'materiel'
  | 'personnel'
  | 'parametres'

export type ActionType = 'read' | 'create' | 'update' | 'delete'

export type PermissionMap = {
  [K in ModuleName]?: {
    [A in ActionType]?: boolean
  }
}

export const ROLE_DEFAULT_PERMISSIONS: Record<string, PermissionMap> = {
  admin: {
    patients: { read: true, create: true, update: true, delete: true },
    triage: { read: true, create: true, update: true, delete: true },
    consultations: { read: true, create: true, update: true, delete: true },
    prescriptions: { read: true, create: true, update: true, delete: true },
    soins: { read: true, create: true, update: true, delete: true },
    hospitalisation: { read: true, create: true, update: true, delete: true },
    pharmacie: { read: true, create: true, update: true, delete: true },
    stocks: { read: true, create: true, update: true, delete: true },
    caisse: { read: true, create: true, update: true, delete: true },
    facturation: { read: true, create: true, update: true, delete: true },
    tiers_payant: { read: true, create: true, update: true, delete: true },
    comptabilite: { read: true, create: true, update: true, delete: true },
    materiel: { read: true, create: true, update: true, delete: true },
    personnel: { read: true, create: true, update: true, delete: true },
    parametres: { read: true, create: true, update: true, delete: true },
  },
  directeur: {
    patients: { read: true, create: true, update: true, delete: false },
    triage: { read: true, create: true, update: true, delete: false },
    consultations: { read: true, create: true, update: true, delete: false },
    prescriptions: { read: true, create: true, update: true, delete: false },
    soins: { read: true, create: true, update: true, delete: false },
    hospitalisation: { read: true, create: true, update: true, delete: false },
    pharmacie: { read: true, create: true, update: true, delete: false },
    stocks: { read: true, create: true, update: true, delete: false },
    caisse: { read: true, create: true, update: true, delete: false },
    facturation: { read: true, create: true, update: true, delete: false },
    tiers_payant: { read: true, create: true, update: true, delete: false },
    comptabilite: { read: true, create: true, update: true, delete: false },
    materiel: { read: true, create: true, update: true, delete: false },
    personnel: { read: true, create: true, update: true, delete: true },
    parametres: { read: true, create: true, update: true, delete: true },
  },
  medecin: {
    patients: { read: true, create: true, update: true, delete: false },
    triage: { read: true, create: true, update: true, delete: false },
    consultations: { read: true, create: true, update: true, delete: false },
    prescriptions: { read: true, create: true, update: true, delete: false },
    soins: { read: true, create: true, update: true, delete: false },
    hospitalisation: { read: true, create: true, update: true, delete: false },
    pharmacie: { read: true, create: false, update: false, delete: false },
    stocks: { read: true, create: false, update: false, delete: false },
    caisse: { read: false, create: false, update: false, delete: false },
    facturation: { read: true, create: false, update: false, delete: false },
    tiers_payant: { read: true, create: false, update: false, delete: false },
    comptabilite: { read: false, create: false, update: false, delete: false },
    materiel: { read: true, create: false, update: false, delete: false },
    personnel: { read: true, create: false, update: false, delete: false },
    parametres: { read: false, create: false, update: false, delete: false },
  },
  infirmier: {
    patients: { read: true, create: true, update: true, delete: false },
    triage: { read: true, create: true, update: true, delete: false },
    consultations: { read: true, create: false, update: false, delete: false },
    prescriptions: { read: true, create: false, update: false, delete: false },
    soins: { read: true, create: true, update: true, delete: false },
    hospitalisation: { read: true, create: true, update: true, delete: false },
    pharmacie: { read: true, create: false, update: false, delete: false },
    stocks: { read: true, create: false, update: false, delete: false },
    caisse: { read: false, create: false, update: false, delete: false },
    facturation: { read: false, create: false, update: false, delete: false },
    tiers_payant: { read: false, create: false, update: false, delete: false },
    comptabilite: { read: false, create: false, update: false, delete: false },
    materiel: { read: true, create: false, update: false, delete: false },
    personnel: { read: true, create: false, update: false, delete: false },
    parametres: { read: false, create: false, update: false, delete: false },
  },
  sage_femme: {
    patients: { read: true, create: true, update: true, delete: false },
    triage: { read: true, create: true, update: true, delete: false },
    consultations: { read: true, create: true, update: true, delete: false },
    prescriptions: { read: true, create: true, update: true, delete: false },
    soins: { read: true, create: true, update: true, delete: false },
    hospitalisation: { read: true, create: true, update: true, delete: false },
    pharmacie: { read: true, create: false, update: false, delete: false },
    stocks: { read: true, create: false, update: false, delete: false },
    caisse: { read: false, create: false, update: false, delete: false },
    facturation: { read: false, create: false, update: false, delete: false },
    tiers_payant: { read: false, create: false, update: false, delete: false },
    comptabilite: { read: false, create: false, update: false, delete: false },
    materiel: { read: true, create: false, update: false, delete: false },
    personnel: { read: true, create: false, update: false, delete: false },
    parametres: { read: false, create: false, update: false, delete: false },
  },
  pharmacien: {
    patients: { read: true, create: false, update: false, delete: false },
    triage: { read: false, create: false, update: false, delete: false },
    consultations: { read: false, create: false, update: false, delete: false },
    prescriptions: { read: true, create: false, update: false, delete: false },
    soins: { read: false, create: false, update: false, delete: false },
    hospitalisation: { read: false, create: false, update: false, delete: false },
    pharmacie: { read: true, create: true, update: true, delete: true },
    stocks: { read: true, create: true, update: true, delete: true },
    caisse: { read: true, create: true, update: false, delete: false },
    facturation: { read: true, create: true, update: false, delete: false },
    tiers_payant: { read: true, create: false, update: false, delete: false },
    comptabilite: { read: false, create: false, update: false, delete: false },
    materiel: { read: true, create: false, update: false, delete: false },
    personnel: { read: false, create: false, update: false, delete: false },
    parametres: { read: false, create: false, update: false, delete: false },
  },
  caissier: {
    patients: { read: true, create: true, update: false, delete: false },
    triage: { read: false, create: false, update: false, delete: false },
    consultations: { read: false, create: false, update: false, delete: false },
    prescriptions: { read: true, create: false, update: false, delete: false },
    soins: { read: false, create: false, update: false, delete: false },
    hospitalisation: { read: true, create: false, update: false, delete: false },
    pharmacie: { read: false, create: false, update: false, delete: false },
    stocks: { read: false, create: false, update: false, delete: false },
    caisse: { read: true, create: true, update: true, delete: false },
    facturation: { read: true, create: true, update: true, delete: false },
    tiers_payant: { read: true, create: true, update: true, delete: false },
    comptabilite: { read: true, create: false, update: false, delete: false },
    materiel: { read: false, create: false, update: false, delete: false },
    personnel: { read: false, create: false, update: false, delete: false },
    parametres: { read: false, create: false, update: false, delete: false },
  },
  receptionniste: {
    patients: { read: true, create: true, update: true, delete: false },
    triage: { read: true, create: false, update: false, delete: false },
    consultations: { read: true, create: false, update: false, delete: false },
    prescriptions: { read: false, create: false, update: false, delete: false },
    soins: { read: false, create: false, update: false, delete: false },
    hospitalisation: { read: true, create: false, update: false, delete: false },
    pharmacie: { read: false, create: false, update: false, delete: false },
    stocks: { read: false, create: false, update: false, delete: false },
    caisse: { read: false, create: false, update: false, delete: false },
    facturation: { read: false, create: false, update: false, delete: false },
    tiers_payant: { read: false, create: false, update: false, delete: false },
    comptabilite: { read: false, create: false, update: false, delete: false },
    materiel: { read: false, create: false, update: false, delete: false },
    personnel: { read: false, create: false, update: false, delete: false },
    parametres: { read: false, create: false, update: false, delete: false },
  },
}

export function hasPermission(
  userRole: string,
  userCustomPermissions: PermissionMap | null,
  module: ModuleName,
  action: ActionType
): boolean {
  if (userRole === 'admin') return true

  // 1. Vérification surcharge personnalisée
  if (userCustomPermissions?.[module]?.[action] !== undefined) {
    return !!userCustomPermissions[module]![action]
  }

  // 2. Vérification par défaut selon le rôle
  const defaultPerms = ROLE_DEFAULT_PERMISSIONS[userRole]
  return !!defaultPerms?.[module]?.[action]
}
