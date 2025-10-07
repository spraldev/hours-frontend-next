'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { AuthPageContainer } from '@/components/auth/AuthPageContainer'
import { BackButton } from '@/components/auth/BackButton'
import { AuthCardHeader } from '@/components/auth/AuthCardHeader'
import { AuthTabs } from '@/components/auth/AuthTabs'
import { AuthFooterLink } from '@/components/auth/AuthFooterLink'
import { AuthSecurityBadge } from '@/components/auth/AuthSecurityBadge'
import { StudentRegistrationForm } from './components/StudentRegistrationForm'
import { StaffRegistrationForm } from './components/StaffRegistrationForm'

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState('student')

  return (
    <AuthPageContainer>
      <BackButton />
      <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur">
        <AuthCardHeader title="Join CVHS Community Service" description="Create your account to start tracking service hours" />
        <CardContent>
          <AuthTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            studentContent={<StudentRegistrationForm />}
            staffContent={<StaffRegistrationForm />}
          />
          <AuthFooterLink text="Already have an account?" linkText="Sign in here" linkHref="/login" />
        </CardContent>
      </Card>
      <AuthSecurityBadge text="Secure registration powered by CVHS ❤️" />
    </AuthPageContainer>
  )
}
