"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Users, Building } from 'lucide-react';
import { toast } from 'sonner';

export default function InviteAcceptancePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptanceStatus, setAcceptanceStatus] = useState<'pending' | 'success' | 'error'>('pending');

  const token = params.token as string;
  const acceptInvitation = useMutation(api.platformTeam.acceptPlatformInvitation);

  const handleAcceptInvitation = async () => {
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      toast.error('Please sign in to accept the invitation');
      return;
    }

    setIsAccepting(true);
    try {
      await acceptInvitation({ inviteToken: token });
      setAcceptanceStatus('success');
      toast.success('Welcome to the Franchiseen team!');
      
      // Redirect to admin dashboard after 2 seconds
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setAcceptanceStatus('error');
      toast.error(error instanceof Error ? error.message : 'Failed to accept invitation');
    } finally {
      setIsAccepting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Team Invitation</h1>
            <p className="text-gray-600 mb-6">
              Please sign in to accept your invitation to join the Franchiseen team.
            </p>
            <Button 
              onClick={() => router.push('/sign-in')}
              className="w-full"
            >
              Sign In to Continue
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {acceptanceStatus === 'pending' && (
            <>
              <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Join Franchiseen Team</h1>
              <p className="text-gray-600 mb-2">
                You've been invited to join the Franchiseen platform team.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Signed in as: {user.emailAddresses?.[0]?.emailAddress}
              </p>
              <Button 
                onClick={handleAcceptInvitation}
                disabled={isAccepting}
                className="w-full"
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Accepting Invitation...
                  </>
                ) : (
                  'Accept Invitation'
                )}
              </Button>
            </>
          )}

          {acceptanceStatus === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-600 mb-2">Welcome to the Team!</h1>
              <p className="text-gray-600 mb-6">
                Your invitation has been accepted successfully. You now have access to the Franchiseen admin dashboard.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard...
              </p>
            </>
          )}

          {acceptanceStatus === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-600 mb-2">Invitation Error</h1>
              <p className="text-gray-600 mb-6">
                There was an error accepting your invitation. The invitation may have expired or already been used.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={handleAcceptInvitation}
                  disabled={isAccepting}
                  variant="outline"
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={() => router.push('/admin')}
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
