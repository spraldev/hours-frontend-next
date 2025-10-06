"use client"

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"
import toast from "react-hot-toast"

interface StudentInfo {
  firstName: string;
  lastName: string;
  grade: number;
  graduatingYear: number;
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  
  // Prevent duplicate API calls in Strict Mode
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      // Prevent duplicate API calls (React Strict Mode calls useEffect twice)
      if (hasVerified.current) return;
      hasVerified.current = true;
      
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing');
        toast.error("Verification token is missing");
        return;
      }

      try {
        const response = await apiClient.get(`/auth/verify-email?token=${token}`);

        if (response.success) {
          setStatus('success');
          setMessage(response.message || 'Email verified successfully!');
          setStudentInfo(response.data?.student);
          
          toast.success("Your account has been successfully verified. You can now log in.");
          
          // Redirect to login after 5 seconds
          setTimeout(() => {
            router.push('/login');
          }, 5000);
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'An error occurred during verification. Please try again.');
        toast.error(error.message || "Please try again or contact support.");
        console.error('Verification error:', error);
      }
    };

    verifyEmail();
  }, [searchParams, router, toast]);

  const handleGoToLogin = () => {
    router.push('/login');
  };

  const handleResendVerification = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0084ff]/10 via-[#4f46e5]/5 to-[#7c3aed]/10" />

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#0084ff] to-[#4f46e5] flex items-center justify-center">
                <span className="text-white font-bold text-xl">CV</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-balance">Email Verification</CardTitle>
            <CardDescription className="text-pretty">
              {status === 'verifying' && 'Verifying your email address...'}
              {status === 'success' && 'Your email has been verified!'}
              {status === 'error' && 'Verification failed'}
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            {status === 'verifying' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Loader2 className="h-12 w-12 text-[#0084ff] animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Verifying your email...</h3>
                  <p className="text-muted-foreground">Please wait while we verify your email address.</p>
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                
                <Alert className="border-green-500/50 bg-green-500/10 text-left">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>

                {studentInfo && (
                  <div className="p-4 bg-muted/50 rounded-lg text-left">
                    <p className="font-semibold mb-1">
                      Welcome, {studentInfo.firstName} {studentInfo.lastName}!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Grade: {studentInfo.grade} | Class of {studentInfo.graduatingYear}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Redirecting to login page in 5 seconds...
                  </p>
                  <Button 
                    onClick={handleGoToLogin}
                    className="w-full bg-[#0084ff] hover:bg-[#0070e6] text-white"
                  >
                    Go to Login Now
                  </Button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                </div>
                
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button 
                      onClick={handleResendVerification}
                      variant="outline"
                      className="flex-1"
                    >
                      Back to Registration
                    </Button>
                    <Button 
                      onClick={handleGoToLogin}
                      className="flex-1 bg-[#0084ff] hover:bg-[#0070e6] text-white"
                    >
                      Try Login
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* School branding */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secure verification powered by CVHS IT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
