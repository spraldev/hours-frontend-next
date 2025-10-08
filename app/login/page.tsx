'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { AuthPageContainer } from '@/components/auth/AuthPageContainer'
import { BackButton } from '@/components/auth/BackButton'
import { AuthCardHeader } from '@/components/auth/AuthCardHeader'
import { AuthTabs } from '@/components/auth/AuthTabs'
import { AuthFooterLink } from '@/components/auth/AuthFooterLink'
import { AuthSecurityBadge } from '@/components/auth/AuthSecurityBadge'
import { StudentLoginForm } from './components/StudentLoginForm'
import { StaffLoginForm } from './components/StaffLoginForm'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('student')

  return (
    <AuthPageContainer>
      <BackButton />
      <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur">
        <AuthCardHeader title="Welcome Back" description="Sign in to your CVHS Community Service account" />
        <CardContent>
          <AuthTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            studentContent={<StudentLoginForm />}
            staffContent={<StaffLoginForm />}
          />
          <AuthFooterLink text="Don't have an account?" linkText="Register here" linkHref="/register" />
        </CardContent>
      </Card>
      <AuthSecurityBadge text="Secure login powered by CVHS IT" />
    </AuthPageContainer>
  )
}
