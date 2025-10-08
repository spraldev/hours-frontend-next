"use client"

import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GradientCard } from "@/components/ui/gradient-card"
import { MouseTrackingCard } from "@/components/ui/mouse-tracking-card"
import { PageTransition } from "@/components/ui/page-transition"
import { Clock, CheckCircle, TrendingUp, QrCode, Users, Shield, Sparkles, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  
  // Helper function to get dashboard URL based on user role
  const getDashboardUrl = () => {
    if (!user) return '/student/dashboard';
    
    switch (user.role) {
      case 'admin':
      case 'superadmin':
        return '/admin';
      case 'supervisor':
        return '/supervisor/dashboard';
      default:
        return '/student/dashboard';
    }
  };

  const features = [
    {
      icon: Clock,
      title: "Log Your Hours",
      description:
        "Easily track community service hours with our intuitive logging system. Add details, photos, and get instant confirmations.",
      badge: "Easy Tracking",
    },
    {
      icon: CheckCircle,
      title: "Get Approvals",
      description: "Submit hours for supervisor approval with automated notifications and real-time status updates.",
      badge: "Quick Approval",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description:
        "Monitor your progress toward graduation requirements with beautiful charts and milestone celebrations.",
      badge: "Visual Progress",
    },
    {
      icon: QrCode,
      title: "QR Code Scanning",
      description: "Scan QR codes at events for instant hour logging. No more paperwork or manual entry required.",
      badge: "Instant Scan",
    },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#0084ff]/20 via-[#4f46e5]/10 to-[#7c3aed]/20"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(0,132,255,0.2), rgba(79,70,229,0.1), rgba(124,58,237,0.2))",
                "linear-gradient(90deg, rgba(0,132,255,0.3), rgba(79,70,229,0.15), rgba(124,58,237,0.1))",
                "linear-gradient(135deg, rgba(0,132,255,0.2), rgba(79,70,229,0.1), rgba(124,58,237,0.2))",
              ],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0084ff]/30 via-transparent to-transparent" />

          <div className="relative container mx-auto px-4 py-24 text-center">
            {/* CVHS Logo/Brand */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "backOut" }}
            >
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#0084ff] to-[#4f46e5] flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-2xl">CV</span>
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6">
              CVHS Community Service
              <motion.span
                className="block text-[#0084ff]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Hours Tracker
              </motion.span>
            </h1>

            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto mb-12">
              The easiest way to log, track, and manage your community service hours. Built for CVHS students,
              supervisors, and administrators.
            </p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-[#0084ff] hover:bg-[#0070e6] text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isAuthenticated ? (
                    <Link href={getDashboardUrl()}>
                      <LayoutDashboard className="mr-2 h-5 w-5" />
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link href="/register">
                      <Users className="mr-2 h-5 w-5" />
                      Get Started
                    </Link>
                  )}
                </Button>
              </motion.div>
              {!isAuthenticated && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="ghost" size="lg" className="px-8 py-6 text-lg rounded-xl hover:bg-white/10">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Trust indicators */}
            
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance mb-4">
                Everything you need to manage service hours
              </h2>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                From logging hours to getting approvals, we've got you covered with modern tools and delightful
                experiences.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <MouseTrackingCard intensity="medium" className="p-6 h-full transition-all duration-200 bg-card/50 backdrop-blur-sm rounded-xl border">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-3">
                          <motion.div
                            className="h-12 w-12 rounded-xl bg-[#0084ff]/10 flex items-center justify-center"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon className="h-6 w-6 text-[#0084ff]" />
                          </motion.div>
                          <Badge variant="secondary" className="text-xs">
                            {feature.badge}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg text-balance">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-pretty leading-relaxed">{feature.description}</CardDescription>
                      </CardContent>
                    </MouseTrackingCard>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

      
        {/* Footer */}
        <footer className="border-t border-border/40 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0084ff] to-[#4f46e5] flex items-center justify-center">
                <span className="text-white font-bold">CV</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">Built with ❤️ for the CVHS community</p>
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/help" className="hover:text-[#0084ff] transition-colors">
                Help & Support
              </Link>
              <Link href="/contact" className="hover:text-[#0084ff] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}
