import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Building2, Wallet, Settings, LogOut, LayoutGrid, Activity } from 'lucide-react'
import { getSharedAdminUser } from '@/utils/supabase/admin-identity'
import { isAdminEmail } from '@/lib/admin/auth'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSharedAdminUser()

  if (!isAdminEmail(user?.email)) {
    redirect('/admin/login')
  }

  const navItems = [
    { href: '/admin', label: 'Accueil Hub', icon: LayoutGrid },
    { href: '/admin/sante', label: 'Tableau de bord D-SANTÉ', icon: LayoutDashboard },
    { href: '/admin/structures', label: 'Structures Médicales', icon: Building2 },
    { href: '/admin/abonnements', label: 'Abonnements & Licences', icon: Wallet },
    { href: '/admin/passerelles', label: 'Passerelles Maketou & Chariow', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      <aside className="w-full md:w-64 shrink-0 bg-background border-r border-surface-border flex flex-col">
        <div className="p-6 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold font-heading text-base leading-tight text-foreground">Demba Admin</p>
              <p className="text-[11px] text-emerald-600 font-semibold">SuperAdmin D-SANTÉ</p>
            </div>
          </div>
          <p className="text-xs text-foreground-muted mt-2 truncate font-mono">{user?.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-surface transition-colors"
            >
              <Icon className="w-4 h-4 text-emerald-600" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-surface-border">
          <a href="/admin/logout" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground-muted hover:bg-surface hover:text-danger transition-colors">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </a>
        </div>
      </aside>
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
