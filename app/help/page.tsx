import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I log my community service hours?",
      answer:
        "After logging in, go to your dashboard and click 'Add Hours'. Fill in the details including date, organization, hours worked, and a brief description of your activities. You can also upload photos as proof if needed.",
    },
    {
      question: "How long does it take to get hours approved?",
      answer:
        "Most hours are approved within 2-3 business days. Supervisors receive automatic notifications when new hours are submitted. You'll get an email notification once your hours are approved or if more information is needed.",
    },
    {
      question: "Can I edit hours after submitting them?",
      answer:
        "You can edit hours that are still pending approval. Once hours are approved, you'll need to contact your supervisor or an administrator to make changes.",
    },
    {
      question: "What if I forgot to log hours from a while ago?",
      answer:
        "You can still log hours from past activities, but make sure to include as much detail as possible and any documentation you have. Supervisors may require additional verification for older entries.",
    },
    {
      question: "How do I use the QR code scanner?",
      answer:
        "At participating events, look for QR codes provided by supervisors. Open the app, tap 'Scan', and point your camera at the QR code. Your hours will be automatically logged with event details.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-balance mb-4">Help & Support</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Get help with your CVHS Community Service Hours account
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#0084ff] to-[#4f46e5] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">CV</span>
                  </div>
                  Contact Us
                </CardTitle>
                <CardDescription>Need direct assistance? Reach out by email.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#0084ff]" />
                  <div>
                    <p className="font-medium">email placeholder</p>
                    <p className="text-sm text-muted-foreground">support@cvhs.edu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about the community service hours system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left text-balance">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-pretty text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2 overflow-hidden animate-epic-entrance relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0084ff]/10 via-transparent to-[#4f46e5]/10 animate-shimmer" />
            <CardContent className="pt-8 pb-8 relative">
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center animate-glow-pulse">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-r from-[#0084ff] to-[#4f46e5] blur-xl" />
                  </div>
                  <div className="relative w-32 h-32 flex items-center justify-center animate-float">
                    <Image
                      src="/spral-logo.png"
                      alt="Spral Logo"
                      width={128}
                      height={128}
                      className="object-contain animate-pulse-slow drop-shadow-2xl"
                    />
                  </div>
                </div>
                <div className="text-center space-y-2 animate-fade-slide-up">
                  <p className="text-sm text-muted-foreground">
                    Developed by{" "}
                    <Link 
                      href="https://spral.dev" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0084ff] underline decoration-2 underline-offset-4 hover:text-[#0070e6] transition-all hover:decoration-4 font-medium inline-flex items-center gap-1"
                    >
                      spral
                    </Link>{" "}
                    <span className="text-muted-foreground/70">(spursh deshpande)</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
