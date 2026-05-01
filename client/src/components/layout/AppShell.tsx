import { NavLink, Outlet } from "react-router-dom"
import { FileText, LayoutDashboard, ScanSearch, History, LogOut } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/resumes', label: 'My Resumes', icon: FileText },
  { to: '/ai-resume-builder', label: 'Builder', icon: FileText },
  { to: '/ai-ats-analysis', label: 'ATS Scanner', icon: ScanSearch},
  { to: '/scan-history', label: 'Scan History', icon: History },
];

export default function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_40%),linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,6,23,0.96))] p-6">
          <div className="mb-8">

            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">ResumeIQ</p>
            <h1 className="mt-2 text-2xl font-semibold">Workspace</h1>
            <p className="mt-2 text-sm text-slate-400">{user?.name}</p>

          </div>
          <nav className="space-y-2">
            {links.map(({ to , label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({isActive}) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  isActive
                  ? 'bg-cyan-500/15 text-cyan-300'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
              >
                <Icon size={18} />
                { label }
              </NavLink>
            ))}
          </nav>

          <button
            onClick={logout}
            className="mt-8 flex w-full items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/5"
          >
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        <main className="bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.08),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.08),_transparent_26%)] p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
