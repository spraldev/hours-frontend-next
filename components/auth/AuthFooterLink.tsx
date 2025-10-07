'use client'

import Link from 'next/link'

interface AuthFooterLinkProps {
  text: string
  linkText: string
  linkHref: string
}

export function AuthFooterLink({ text, linkText, linkHref }: AuthFooterLinkProps) {
  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-muted-foreground">
        {text}{' '}
        <Link href={linkHref} className="text-[#0084ff] hover:underline font-medium">
          {linkText}
        </Link>
      </p>
    </div>
  )
}
