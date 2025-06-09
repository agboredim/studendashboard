import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "@/components/portal/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MessageCircleIcon,
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
  AlertCircleIcon,
  UsersIcon,
  LockIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  ZapIcon,
  ArrowRightIcon,
  ClockIcon,
} from "lucide-react";
import { Client, Account, Databases, Query } from "appwrite";
import { useCallback } from "react";

// Appwrite configuration
const client = new Client()
  .setEndpoint(
    import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
  )
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || "your-project-id");
const databases = new Databases(client);
const database_id = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const memberCollectionId = import.meta.env.VITE_MEMBERS_COLLECTION_ID;

export default function TeamsChat() {
  const [accountExists, setAccountExists] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const currentUser = useSelector((state) => state.auth.user);
  const userEmail = currentUser?.email;

  // Replace with your actual invite link
  const TEAM_INVITE_LINK = "https://your-teams-chat-app.com/invite/team-123";
  const TEAMS_CHAT_APP_URL = "https://titans-career-pm.vercel.app/";

  const checkUserAccount = useCallback(async () => {
    console.log("Checking user account for email:", userEmail);
    try {
      setLoading(true);
      setError(null);

      // Method 1: Try to get user by email from your users collection
      // Replace 'users' with your actual collection ID and 'email' with your email field name
      const response = await databases.listDocuments(
        database_id,
        memberCollectionId,
        [Query.equal("email", userEmail)]
      );
      console.log("User account check response:", response);

      setAccountExists(response.documents.length > 0);
    } catch (err) {
      console.error("Error checking user account:", err);
      setError("Unable to check account status. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
      checkUserAccount();
    }
  }, [checkUserAccount, userEmail]);

  const handleCreateAccount = async () => {
    try {
      setCreating(true);
      setError(null);

      const registrationUrl = `${TEAMS_CHAT_APP_URL}/sign-up?email=${encodeURIComponent(
        userEmail
      )}&name=${encodeURIComponent(
        currentUser?.first_name + " " + currentUser?.last_name
      )}`;

      // Open in new tab
      window.open(registrationUrl, "_blank");
    } catch (err) {
      console.error("Error creating account:", err);
      setError("Failed to create account. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(TEAM_INVITE_LINK);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = TEAM_INVITE_LINK;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const refreshAccountStatus = () => {
    checkUserAccount();
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-48" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageCircleIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  TITANS CAREER Teams Chat
                </h1>
                <p className="text-sm text-muted-foreground">
                  Connect and collaborate with your intructors
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={refreshAccountStatus}
              disabled={loading}
              className="self-start md:self-center"
            >
              <RefreshCwIcon
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh Status
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                !accountExists
                  ? "bg-primary text-primary-foreground"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {accountExists ? <CheckIcon className="h-4 w-4" /> : "1"}
            </div>
            <div
              className={`h-1 w-12 ${
                accountExists ? "bg-green-200" : "bg-muted"
              }`}
            />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                accountExists
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {accountExists ? "2" : <ClockIcon className="h-4 w-4" />}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Account Status Card */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <UsersIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-base">Account Status</div>
                  <div className="text-sm font-normal text-muted-foreground">
                    Your Teams Chat profile
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Info */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
                    {currentUser?.first_name?.[0]}
                    {currentUser?.last_name?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {currentUser?.first_name} {currentUser?.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                </div>
                <Badge variant={accountExists ? "default" : "secondary"}>
                  {accountExists ? "Active" : "Pending"}
                </Badge>
              </div>

              {/* Status Message */}
              <div
                className={`p-4 rounded-lg border ${
                  accountExists
                    ? "bg-green-50 border-green-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {accountExists ? (
                    <CheckIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <ClockIcon className="h-4 w-4 text-amber-600" />
                  )}
                  <p
                    className={`text-sm font-medium ${
                      accountExists ? "text-green-900" : "text-amber-900"
                    }`}
                  >
                    {accountExists ? "Account Ready" : "Setup Required"}
                  </p>
                </div>
                <p
                  className={`text-sm ${
                    accountExists ? "text-green-700" : "text-amber-700"
                  }`}
                >
                  {accountExists
                    ? "Your Teams Chat account is active and ready to use."
                    : "Create your Teams Chat account to access team features."}
                </p>
              </div>

              {/* Action Button */}
              {!accountExists ? (
                <Button
                  onClick={handleCreateAccount}
                  disabled={creating}
                  className="w-full"
                  size="lg"
                >
                  {creating ? (
                    <>
                      <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <ZapIcon className="h-4 w-4 mr-2" />
                      Create Teams Chat Account
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => window.open(TEAMS_CHAT_APP_URL, "_blank")}
                  className="w-full"
                  size="lg"
                >
                  <ExternalLinkIcon className="h-4 w-4 mr-2" />
                  Open Teams Chat
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Invite Link Card */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <LockIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-base">Team Invite Link</div>
                  <div className="text-sm font-normal text-muted-foreground">
                    Secure access to your team
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {accountExists ? (
                <>
                  <div className="relative">
                    <Input
                      value={TEAM_INVITE_LINK}
                      readOnly
                      className="pr-12 font-mono text-xs"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyInviteLink}
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                    >
                      {copied ? (
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      ) : (
                        <CopyIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <Button
                    onClick={handleCopyInviteLink}
                    disabled={copied}
                    className="w-full"
                    variant={copied ? "secondary" : "default"}
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-4 w-4 mr-2" />
                        Copy Invite Link
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Share this link with team members to invite them to the chat
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                    <LockIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Create an account to access the invite link
                  </p>
                  <Button variant="outline" disabled className="w-full">
                    <LockIcon className="h-4 w-4 mr-2" />
                    Invite Link Locked
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why Teams Chat?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
                  <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Secure Communication</h4>
                  <p className="text-sm text-muted-foreground">
                    End-to-end encryption keeps your conversations private and
                    secure.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                  <ZapIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Real-time Messaging</h4>
                  <p className="text-sm text-muted-foreground">
                    Instant messaging with typing indicators and read receipts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg flex-shrink-0">
                  <UsersIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Team Collaboration</h4>
                  <p className="text-sm text-muted-foreground">
                    Channels, file sharing, and integration with your workflow.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium mb-1">Create Your Account</p>
                  <p className="text-sm text-muted-foreground">
                    Click "Create Teams Chat Account" to set up your profile on
                    our chat platform
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium mb-1">Access Invite Link</p>
                  <p className="text-sm text-muted-foreground">
                    Once your account is created, the team invite link will be
                    unlocked
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium mb-1">Join Team Chat</p>
                  <p className="text-sm text-muted-foreground">
                    Use the invite link to join your team's chat room and start
                    collaborating
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
