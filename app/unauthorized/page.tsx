"use client"

import { useAuth } from "@/contexts/AuthContext"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UnauthorizedPage() {
  const { user } = useAuth()
  const router = useRouter()

  const getDashboardUrl = () => {
    if (!user) return "/login"
    
    switch (user.role) {
      case "admin":
      case "superadmin":
        return "/admin"
      case "supervisor":
        return "/supervisor/dashboard"
      case "student":
        return "/student/dashboard"
      default:
        return "/login"
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleGoToDashboard = () => {
    router.push(getDashboardUrl())
  }

  return (
    <AppShell userRole={user?.role || "student"}>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription className="text-base">
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {user ? (
                <>
                  You are logged in as a <strong>{user.role}</strong>, but this page is restricted to a different role.
                  Please contact an administrator if you believe this is an error.
                </>
              ) : (
                "You need to be logged in to access this page."
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={handleGoBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Button 
                onClick={handleGoToDashboard}
                className="flex items-center gap-2 bg-[#0084ff] hover:bg-[#0070e6] text-white"
              >
                <Home className="h-4 w-4" />
                {user ? "Go to Dashboard" : "Go to Login"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
