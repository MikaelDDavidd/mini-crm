import { Menu } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface HeaderProps {
  title: string
  onMenuClick?: () => void
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { user, profile } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-[#EAECF0] px-4 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#7F56D9] to-[#6941C6] min-h-[64px] md:min-h-[72px]">
      <div className="flex items-center gap-3 md:gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 hover:bg-white/10 rounded-lg transition-colors -ml-1 touch-manipulation"
          aria-label="Open menu"
        >
          <Menu className="h-7 w-7 text-white" />
        </button>

        <h2 className="text-white text-base md:text-xl font-bold leading-tight tracking-[-0.015em] truncate">
          {title}
        </h2>
      </div>

      <div className="flex justify-end items-center flex-shrink-0 ml-2">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 md:size-11 ring-2 ring-white/20"
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
