'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { OfflineStatusIndicator } from '@/components/OfflineStatusIndicator'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useTranslation } from '@/lib/i18n'
import { warmAppOfflineCache } from '@/lib/offline/warmer'
import {
  HeartPulse, LayoutDashboard, Users, Activity, Stethoscope,
  BedDouble, Syringe, Pill, Receipt, BookOpen, Wrench,
  UserCog, CreditCard, Settings, Menu, X, Bell, ChevronDown,
  LogOut, ShieldAlert, Sparkles, Building2, Network
} from 'lucide-react'

type NavItem = {
  key: string
  name: string
  href: string
  icon: any
  badgeKey?: string
  fallbackBadge?: string
}

export default function ClientLayout({
  children,
  structureName,
  structureType,
  role,
  subscriptionTier,
  devise,
}: {
  children: React.ReactNode
  structureName: string
  structureType: string
  role: string
  subscriptionTier: string
  devise: string
}) {
  const { t, isRTL } = useTranslation()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('theme-sante')

  useEffect(() => {
    const saved = localStorage.getItem('d-sante-theme') || 'theme-sante'
    setCurrentTheme(saved)
    document.documentElement.className = saved

    document.cookie = 'demba_offline_active=1; path=/; max-age=2592000; SameSite=Lax'
    if (typeof navigator !== 'undefined' && navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SET_OFFLINE_SESSION', active: true })
    }

    if (typeof navigator !== 'undefined' && navigator.onLine) {
      const routesToWarm = [
        '/dashboard',
        '/triage',
        '/consultations',
        '/hospitalisation',
        '/pharmacie',
        '/patients',
        '/soins',
        '/facturation',
        '/comptabilite',
      ]
      warmAppOfflineCache(routesToWarm, 'demba-offline-dsante-v4')
    }
  }, [])

  const changeTheme = (themeClass: string) => {
    setCurrentTheme(themeClass)
    localStorage.setItem('d-sante-theme', themeClass)
    document.documentElement.className = themeClass
  }

  const navItems: NavItem[] = [
    { key: 'nav.dashboard', name: 'Tableau de Bord', href: '/dashboard', icon: LayoutDashboard },
    { key: 'nav.patients', name: 'Patients (IPP)', href: '/patients', icon: Users },
    { key: 'nav.triage', name: 'Triage & Constantes', href: '/triage', icon: Activity, badgeKey: 'badges.urgent', fallbackBadge: 'Urgent' },
    { key: 'nav.consultations', name: 'Consultations', href: '/consultations', icon: Stethoscope },
    { key: 'nav.hospitalisation', name: 'Hospitalisation & Lits', href: '/hospitalisation', icon: BedDouble },
    { key: 'nav.soins', name: 'Soins Infirmiers', href: '/soins', icon: Syringe },
    { key: 'nav.pharmacie', name: 'Pharmacie & Stocks', href: '/pharmacie', icon: Pill },
    { key: 'nav.facturation', name: 'Caisse & Tiers-Payant', href: '/facturation', icon: Receipt },
    { key: 'nav.interop', name: 'Liaison Pharma & IPM', href: '/interop', icon: Network, badgeKey: 'badges.network', fallbackBadge: 'Réseau' },
    { key: 'nav.comptabilite', name: 'Comptabilité SYSCOHADA', href: '/comptabilite', icon: BookOpen },
    { key: 'nav.materiel', name: 'Matériel Biomédical', href: '/materiel', icon: Wrench },
    { key: 'nav.personnel', name: 'Personnel & Gardes', href: '/personnel', icon: UserCog },
    { key: 'nav.abonnement', name: 'Abonnement', href: '/abonnement', icon: CreditCard },
  ]

  const themes = [
    { id: 'theme-sante', label: 'Clinique', color: 'bg-teal-600' },
    { id: 'theme-hopital', label: 'Hôpital', color: 'bg-sky-600' },
    { id: 'theme-maternite', label: 'Maternité', color: 'bg-rose-500' },
  ]

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 start-0 z-50 w-72 bg-sidebar border-e border-surface-border flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 border-b border-surface-border flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/25">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-base font-black font-heading tracking-tight text-foreground flex items-center gap-1.5">
                D-SANTÉ
              </span>
              <p className="text-[10px] text-foreground-muted font-bold truncate max-w-[150px]">
                {structureName}
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-foreground-muted hover:text-foreground lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badge structure type */}
        <div className="px-6 py-2.5 bg-surface/50 border-b border-surface-border flex items-center justify-between text-[11px]">
          <span className="font-bold text-foreground-muted capitalize flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            {structureType.replace('_', ' ')}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase text-[9px]">
            {subscriptionTier}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const label = t(item.key, item.name)
            const badgeLabel = item.badgeKey ? t(item.badgeKey, item.fallbackBadge || '') : ''

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground-muted hover:text-foreground hover:bg-black/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-primary'}`} />
                  <span>{label}</span>
                </div>
                {badgeLabel && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                      active ? 'bg-white/20 text-white' : 'bg-danger/10 text-danger'
                    }`}
                  >
                    {badgeLabel}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Theme Switcher & Footer */}
        <div className="p-4 border-t border-surface-border bg-surface/40 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-foreground-muted font-medium">
            <span>{t('common.color_theme', 'Thème couleur')}</span>
            <div className="flex items-center gap-1.5">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => changeTheme(th.id)}
                  title={th.label}
                  className={`w-4 h-4 rounded-full ${th.color} transition-transform ${
                    currentTheme === th.id ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-surface-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center uppercase">
                {role.slice(0, 2)}
              </div>
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-foreground capitalize block">{role}</span>
                <span className="text-[10px] text-foreground-muted">{t('badges.in_service', 'En service')}</span>
              </div>
            </div>
            <Link
              href="/login"
              title={t('common.logout', 'Déconnexion')}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-danger hover:bg-danger/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ps-72">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur-md border-b border-surface-border px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-black/5 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-foreground">
                {structureName}
              </h1>
              <p className="text-[10px] text-foreground-muted">
                D-SANTÉ • {t('app.subtitle', 'Système Hospitalier Intégré')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sélecteur de langue FR / EN / العربية */}
            <LanguageSwitcher />

            <Link
              href="/triage"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-danger/10 text-danger text-xs font-bold hover:bg-danger/20 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>{t('actions.new_triage', 'Nouveau Triage')}</span>
            </Link>

            <Link
              href="/patients"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t('actions.new_patient', '+ Patient')}</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Témoin de connexion et synchronisation Hors-Ligne (Poste de santé isolé) */}
        <OfflineStatusIndicator />
      </div>
    </div>
  )
}
