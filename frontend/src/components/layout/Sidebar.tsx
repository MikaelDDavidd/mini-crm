import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Settings, LogOut, Kanban, Upload, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/pipeline', icon: Kanban, label: 'Pipeline' },
  { path: '/import', icon: Upload, label: 'Import Leads' },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation()
  const { signOut } = useAuth()

  const handleLinkClick = () => {
    onClose?.()
  }

  return (
    <aside
      className={cn(
        'flex h-screen w-72 md:w-64 flex-shrink-0 flex-col border-r border-[#EAECF0] bg-white transition-transform duration-300 ease-in-out',
        'lg:translate-x-0 lg:static',
        'fixed top-0 left-0 z-50',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* Header - Fixed */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-8 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h1 className="text-[#101828] text-lg font-bold leading-normal">CRM Co.</h1>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Main Navigation - Scrollable */}
      <nav className="flex flex-col gap-2 p-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors touch-manipulation',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-[#667085] hover:bg-gray-100'
              )}
            >
              <Icon className={cn('h-6 w-6', isActive && 'text-primary')} />
              <p className={cn('text-sm font-medium', isActive && 'font-semibold')}>
                {item.label}
              </p>
            </Link>
          )
        })}
      </nav>

      {/* Footer - Fixed at bottom */}
      <div className="mt-auto border-t border-gray-200 p-4 flex-shrink-0">
        <div className="flex flex-col gap-2">
          <Link
            to="/settings"
            onClick={handleLinkClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors touch-manipulation',
              location.pathname === '/settings'
                ? 'bg-primary/10 text-primary'
                : 'text-[#667085] hover:bg-gray-100'
            )}
          >
            <Settings className={cn('h-6 w-6', location.pathname === '/settings' && 'text-primary')} />
            <p className={cn('text-sm font-medium', location.pathname === '/settings' && 'font-semibold')}>Settings</p>
          </Link>

          <button
            onClick={() => {
              handleLinkClick()
              signOut()
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#667085] hover:bg-red-50 hover:text-red-600 w-full transition-colors touch-manipulation"
          >
            <LogOut className="h-6 w-6" />
            <p className="text-sm font-medium">Log Out</p>
          </button>
        </div>
      </div>
    </aside>
  )
}
