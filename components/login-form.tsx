"use client";

import { useState, useEffect } from "react";
import { useSignIn, useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import Image from "next/image"

type AuthStep = 'email' | 'otp' | 'success';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if already signed in
  useEffect(() => {
    if (authLoaded && isSignedIn) {
      router.push('/admin/dashboard');
    }
  }, [authLoaded, isSignedIn, router]);

  // Validate email domain
  const validateEmailDomain = (email: string): boolean => {
    return email.toLowerCase().endsWith('@franchiseen.com');
  };

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    // If already signed in, redirect to dashboard
    if (isSignedIn) {
      router.push('/admin/dashboard');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    // Validate email domain
    if (!validateEmailDomain(email)) {
      setError('Only @franchiseen.com email addresses are allowed to access the admin area.');
      setLoading(false);
      return;
    }

    try {
      // Start the sign-in process with email code strategy
      const signInAttempt = await signIn.create({
        identifier: email,
      });

      // Send the email code
      const emailFactor = signInAttempt.supportedFirstFactors?.find(
        (factor) => factor.strategy === 'email_code'
      );

      if (!emailFactor?.emailAddressId) {
        throw new Error('Email verification not supported for this account');
      }

      await signInAttempt.prepareFirstFactor({
        strategy: 'email_code',
        emailAddressId: emailFactor.emailAddressId,
      });

      setSuccess('OTP sent to your email address. Please check your inbox.');
      setStep('otp');
    } catch (err: any) {
      console.error('Email submission error:', err);
      if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP submission
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      // Attempt to complete the sign-in with the OTP
      const completeSignIn = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code: otp,
      });

      if (completeSignIn.status === 'complete') {
        // Set the active session
        await setActive({ session: completeSignIn.createdSessionId });
        setSuccess('Login successful! Redirecting...');
        setStep('success');

        // Redirect to admin dashboard after a short delay
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 1500);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err: any) {
      console.error('OTP verification error:', err);
      if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      const emailFactor = signIn.supportedFirstFactors?.find(
        (factor) => factor.strategy === 'email_code'
      );

      if (!emailFactor?.emailAddressId) {
        throw new Error('Email verification not supported for this account');
      }

      await signIn.prepareFirstFactor({
        strategy: 'email_code',
        emailAddressId: emailFactor.emailAddressId,
      });

      setSuccess('New OTP sent to your email address.');
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while authentication is being checked
  if (!authLoaded) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-6 items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </div>
            <div className="relative hidden bg-muted md:block">
              <Image
                src="/placeholder.svg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                width={1920}
                height={1080}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show sign out option if already signed in (for testing)
  if (isSignedIn) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-6 items-center justify-center min-h-[400px]">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Already Signed In</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    You are already authenticated. Redirecting to dashboard...
                  </p>
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  className="mt-4"
                >
                  Sign Out (For Testing)
                </Button>
              </div>
            </div>
            <div className="relative hidden bg-muted md:block">
              <Image
                src="/placeholder.svg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                width={1920}
                height={1080}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <Image
                src="logo.svg"
                alt="logo"
                width={35}
                height={35}
                className="z-0"
              />
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">Franchiseen</h1>
                <p className="text-muted-foreground text-balance">
                  {step === 'email' && 'Login to company account'}
                  {step === 'otp' && 'Enter the OTP sent to your email'}
                  {step === 'success' && 'Login successful!'}
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Email Step */}
              {step === 'email' && (
                <form onSubmit={handleEmailSubmit}>
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@franchiseen.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Only @franchiseen.com email addresses are allowed
                    </p>
                  </div>
                  <Button type="submit" className="w-full mt-4" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </form>
              )}

              {/* OTP Step */}
              {step === 'otp' && (
                <form onSubmit={handleOtpSubmit}>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="otp">OTP</Label>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="ml-auto text-sm underline-offset-2 hover:underline disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    </div>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Check your email for the 6-digit verification code
                    </p>
                  </div>
                  <div className="grid gap-2 mt-4">
                    <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify OTP'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setStep('email');
                        setOtp('');
                        setError('');
                        setSuccess('');
                      }}
                      disabled={loading}
                    >
                      Back to Email
                    </Button>
                  </div>
                </form>
              )}

              {/* Success Step */}
              {step === 'success' && (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Redirecting to admin dashboard...
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="text-center text-sm">
                Not registered?
                <a href="#" className="underline underline-offset-4 pl-3">
                  Job Openings
                </a>
              </div>
            </div>
          </div>
          <div className="bg-muted relative hidden md:block ">
            <Image
              src="/images/1.svg"
              alt="logo"
              width={600}
              height={600}
              className="z-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"

            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Non Disclosure</a>{" "}
        and <a href="#">Employment Policy</a>.
      </div>
    </div>
  )
}
