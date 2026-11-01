import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isSuperAdminAuthenticated, getSuperAdminUser } from '@/lib/admin/auth'
import {
  Activity,
  LayoutDashboard,
  Building2,
  CreditCard,
  LogOut,
  ExternalLink,
  BookOpen,
  Sparkles,
  HeartPulse,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuth = await isSuperAdminAuthenticated()
  if (!isAuth) {
    redirect('/admin/login')
  }

  const admin = await getSuperAdminUser()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block">
                  D-SANTÉ
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                  SuperAdmin Médical
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-sm">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              Vue d&apos;ensemble
            </Link>

            <Link
              href="/admin/structures"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              Structures de santé
            </Link>

            <Link
              href="/admin/abonnements"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Abonnements & Licences
            </Link>

            <div className="pt-4 pb-1">
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Ressources
              </span>
            </div>

            <Link
              href="/guide"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              Guide d&apos;utilisation
            </Link>

            <Link
              href="/decouvrir-dsante"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Démo interactive
            </Link>

            <Link
              href="/tarifs"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
            >
              <HeartPulse className="w-4 h-4 text-teal-400" />
              Grille tarifaire
            </Link>

            <a
              href="https://siggie.dembasolution.com/admin"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                Hub DEMBA Central
              </span>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-bold">
                HQ
              </span>
            </a>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <span className="block text-xs font-bold text-white truncate">
                {admin?.nom}
              </span>
              <span className="block text-[11px] text-slate-400 truncate">
                {admin?.email}
              </span>
            </div>
            <a
              href="/admin/logout"
              title="Déconnexion"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-slate-950 p-6 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  )
}

