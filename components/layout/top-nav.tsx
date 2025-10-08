"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Bell, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface TopNavProps {
  userRole?: "student" | "supervisor" | "admin" | "superadmin"
}

export function TopNav({ userRole }: TopNavProps) {
  const { user, logout } = useAuth()
  const router = useRouter()


  const actualRole = user?.role 

  const handleSettings = () => {
    switch (actualRole) {
      case 'student':
        router.push('/student/settings')
        break
      case 'admin':
      case 'superadmin':
        router.push('/admin/settings')
        break
      case 'supervisor':
        router.push('/supervisor/settings')
        break
      default:
        router.push('/student/settings')
    }
  }

  const handleBrandClick = () => {
    switch (actualRole) {
      case 'student':
        router.push('/student/dashboard')
        break
      case 'admin':
      case 'superadmin':
        router.push('/admin')
        break
      case 'supervisor':
        router.push('/supervisor/dashboard')
        break
      default:
        router.push('/')
    }
  }

  const handleLogout = () => {
    logout()
  }

  // Generate initials from user data
  const getInitials = () => {
    if (user && user.firstName && user.lastName) {
      return (user.firstName[0] + user.lastName[0]).toUpperCase()
    }
    return "US" // Default fallback
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Brand */}
        <div className="flex items-center space-x-4">
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleBrandClick}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#0084ff] to-[#4f46e5] flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">CVHS Community Service</h1>
              {actualRole && <p className="text-xs text-muted-foreground capitalize">{actualRole} Portal</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-4 w-4" />
          </Button>

          {/* Show profile dropdown for students and supervisors */}
          {(actualRole === 'student' || actualRole === 'supervisor') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white">{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={handleSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Show logout button for admins and superadmins */}
          {(actualRole === 'admin' || actualRole === 'superadmin') && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="h-8 w-8"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
