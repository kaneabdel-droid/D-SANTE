# D-SANTÉ 🏥

> **Système d'Information Hospitalier, Clinique & Soins Médicaux SaaS**  
> Solution intégrée pour hôpitaux, polycliniques, centres de santé et postes médicaux isolés en Afrique de l'Ouest (Sénégal).

---

## 🌟 Présentation

**D-Santé** fait partie de l'écosystème **DEMBA**. Il digitalise l'intégralité du parcours de soins et la gestion administrative, financière et logistique d'une structure de santé :

- **Parcours Patient & Triage** : Fiche d'identification avec Identifiant Patient Permanent (**IPP**), constantes vitales en temps réel, tri selon les codes de gravité internationaux (🔴 Détresse, 🟡 Urgence, 🟢 Consultation ordinaire).
- **Dossier Médical Partagé 360°** : Antécédents médicaux/chirurgicaux, alertes allergies médicamenteuses, terrain à risque (HTA, Diabète, Drépanocytose).
- **Consultations & Prescriptions** : Diagnostic codifié CIM-10 / ICD-10, moteur d'ordonnance multi-lignes avec génération automatique d'**Ordonnances Médicales PDF sécurisées**.
- **Hospitalisation & Lits** : Visualisation en temps réel de l'occupation des lits par service (Médecine, Chirurgie, Maternité, Soins Intensifs).
- **Soins Infirmiers** : Feuille d'administration des soins, perfusions et pansements.
- **Pharmacie & Gestion des Stocks** : DCI, gestion par lots et dates de péremption, alertes péremption et seuils de réapprovisionnement.
- **Facturation & Tiers-Payant** : Prise en charge automatique **IPM, CMU, Mutuelles et Assurances privées** avec calcul séparé de la part patient (ticket modérateur) et de la créance organisme. Générateur de **Factures Médicales / Reçus de Soins PDF**.
- **Comptabilité Hospitalière SYSCOHADA** : Livre-journal conforme avec présentation stricte Débit avant Crédit et aucune superposition d'écritures.
- **Biomédical & Personnel** : Registre des équipements médicaux et maintenance préventive/curative, gestion des soignants et plannings de garde.
- **Portail Patient Dédié** : Espace en ligne pour les patients permettant de consulter leurs ordonnances et rendez-vous via leur numéro IPP.
- **Résilience Hors-Ligne (PWA)** : Conçu pour les postes de santé en zone rurale sans connexion internet permanente, avec synchronisation automatique en tâche de fond (`OfflineSyncEngine`).
- **Monétisation SaaS** : Abonnements intégrés avec paiement prioritaire via **Maketou** et secours automatique sur **Chariow**.

---

## 🛠️ Stack Technique

- **Framework** : Next.js 16 (App Router, Turbopack)
- **Langage** : TypeScript 5
- **Style** : Tailwind CSS v4 avec thèmes médicaux interchangeables (Santé, Hôpital, Maternité)
- **Base de données & Auth** : Supabase PostgreSQL avec Row Level Security (RLS) multi-tenant cloisonné par `structure_id`
- **Composants & Icônes** : Lucide React
- **Documents & Exports** : jsPDF + jspdf-autotable (Ordonnances A5 et Factures A4)
- **PWA & Offline** : Service Worker natif, Web App Manifest et file d'attente d'actions locales

---

## 🚀 Démarrage Rapide

```bash
# Cloner le projet
git clone https://github.com/kaneabdel-droid/D-Sante.git
cd D-Sante

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Compiler pour la production
npm run build
```

---

## 🔒 Sécurité & Conformité

- Cloisonnement strict multi-tenant par structure de santé (`structure_id`) via les politiques RLS PostgreSQL.
- RBAC médical granulaire : Médecins, Infirmiers, Sages-femmes, Pharmaciens, Caissiers, Directeurs.
- Sauvegarde sécurisée des données de santé et traçabilité des consultations.
