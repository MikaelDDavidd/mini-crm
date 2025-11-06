import { ReactNode, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface AppLayoutProps {
  children: ReactNode
  title: string
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Desktop: sempre visível, Mobile: drawer */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} onMenuClick={toggleSidebar} />
        <div className="flex-1 overflow-y-auto bg-[#F5F7FA] p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
