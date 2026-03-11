import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Home, Upload, BarChart3, HelpCircle, ShieldAlert, Phone, Book } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navigationItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Upload Notes', icon: Upload, href: '/notes' },
    { label: 'Summary', icon: Book, href: '/notes' },
    { label: 'Quiz', icon: BarChart3, href: '/quiz' },
    { label: 'Ask Doubt', icon: HelpCircle, href: '/doubt-solver' },
    { label: 'Safety Tips', icon: ShieldAlert, href: '/safety' },
    { label: 'Emergency Contacts', icon: Phone, href: '/emergency-contacts' },
  ]

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-40 flex items-center justify-between md:hidden">
        <h1 className="font-bold text-lg text-blue-600">SafeLearn</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6 transition-transform duration-300 z-50",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "md:top-0 md:relative"
        )}
      >
        {/* Logo */}
        <div className="mb-8 pt-4 md:pt-0">
          <h1 className="text-2xl font-bold text-blue-600">SafeLearn</h1>
          <p className="text-sm text-gray-500">Offline AI Assistant</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-blue-900">Learn Safe</p>
            <p className="text-xs text-blue-700 mt-1">Code Safer</p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content Offset */}
      <div className="md:ml-64 mt-16 md:mt-0">
        {/* Content goes here */}
      </div>
    </>
  )
}
