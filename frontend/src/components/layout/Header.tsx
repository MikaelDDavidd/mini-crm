import { Menu } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface HeaderProps {
  title: string
  onMenuClick?: () => void
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { user, profile } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-[#EAECF0] px-4 md:px-8 py-4 bg-gradient-to-r from-[#7F56D9] to-[#6941C6]">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Menu hamburger - only visible on mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6 text-white" />
        </button>

        <h2 className="text-white text-lg md:text-xl font-bold leading-tight tracking-[-0.015em]">
          {title}
        </h2>
      </div>

      <div className="flex justify-end items-center">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          style={{
            backgroundImage: profile?.avatar_url
              ? `url(${profile.avatar_url})`
              : 'url(https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.email + ')',
          }}
        />
      </div>
    </header>
  )
}
