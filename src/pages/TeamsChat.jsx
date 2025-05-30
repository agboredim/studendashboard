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
} from "lucide-react";
import { Client, Account, Databases, Query } from "appwrite";

// Appwrite configuration
const client = new Client()
  .setEndpoint(
    import.meta.env.REACT_APP_APPWRITE_ENDPOINT ||
      "https://cloud.appwrite.io/v1"
  )
  .setProject(
    import.meta.env.REACT_APP_APPWRITE_PROJECT_ID || "your-project-id"
  );
const account = new Account(client);
const databases = new Databases(client);

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

  useEffect(() => {
    if (userEmail) {
      checkUserAccount();
    }
  }, [userEmail]);

  const checkUserAccount = async () => {
    try {
      setLoading(true);
      setError(null);

      // Method 1: Try to get user by email from your users collection
      // Replace 'users' with your actual collection ID and 'email' with your email field name
      const response = await databases.listDocuments(
        import.meta.env.REACT_APP_APPWRITE_DATABASE_ID, // Replace with your database ID
        "users",
        [Query.equal("email", userEmail)]
      );

      setAccountExists(response.documents.length > 0);
    } catch (err) {
      console.error("Error checking user account:", err);

      try {
        const response = await fetch(`${TEAMS_CHAT_APP_URL}/api/check-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });

        if (response.ok) {
          const data = await response.json();
          setAccountExists(data.exists);
        } else {
          throw new Error("Failed to check user account");
        }
      } catch (apiError) {
        console.error("API check failed:", apiError);
        setError("Unable to verify account status. Please try again.");
        setAccountExists(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    try {
      setCreating(true);
      setError(null);

      const registrationUrl = `${TEAMS_CHAT_APP_URL}/signup?email=${encodeURIComponent(
        userEmail
      )}&name=${encodeURIComponent(
        currentUser?.first_name + " " + currentUser?.last_name
      )}`;

      // Open in new tab
      window.open(registrationUrl, "_blank");

      // Option 2: Create account directly via API (if your teams chat app supports it)
      /*
      const response = await fetch(`${TEAMS_CHAT_APP_URL}/api/create-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          name: currentUser?.first_name + ' ' + currentUser?.last_name,
          // Add any other required fields
        }),
      });
      
      if (response.ok) {
        setAccountExists(true);
      } else {
        throw new Error('Failed to create account');
      }
      */
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
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Teams Chat</h1>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircleIcon className="h-6 w-6" />
            Teams Chat
          </h1>
          <Button
            variant="outline"
            onClick={refreshAccountStatus}
            disabled={loading}
          >
            Refresh Status
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={accountExists ? "default" : "secondary"}>
                  {accountExists ? "Account Found" : "No Account"}
                </Badge>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Email: {userEmail}</p>
                {accountExists ? (
                  <p className="text-green-600 mt-2">
                    ✓ You have an account on our Teams Chat platform
                  </p>
                ) : (
                  <p className="text-amber-600 mt-2">
                    ⚠ We noticed you haven't created an account on our Teams
                    Chat platform yet
                  </p>
                )}
              </div>

              {!accountExists && (
                <Button
                  onClick={handleCreateAccount}
                  disabled={creating}
                  className="w-full"
                >
                  <ExternalLinkIcon className="h-4 w-4 mr-2" />
                  {creating
                    ? "Creating Account..."
                    : "Create Teams Chat Account"}
                </Button>
              )}

              {accountExists && (
                <Button
                  variant="outline"
                  onClick={() => window.open(TEAMS_CHAT_APP_URL, "_blank")}
                  className="w-full"
                >
                  <ExternalLinkIcon className="h-4 w-4 mr-2" />
                  Open Teams Chat
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Invite Link Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LockIcon className="h-5 w-5" />
                Team Invite Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  value={TEAM_INVITE_LINK}
                  readOnly
                  className={`pr-10 ${
                    !accountExists ? "blur-sm select-none" : ""
                  }`}
                  disabled={!accountExists}
                />
                {!accountExists && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <LockIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              {accountExists ? (
                <Button
                  onClick={handleCopyInviteLink}
                  disabled={copied}
                  className="w-full"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-4 w-4 mr-2" />
                      Copy Invite Link
                    </>
                  )}
                </Button>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Create an account to access the invite link
                  </p>
                  <Button variant="outline" disabled className="w-full">
                    <LockIcon className="h-4 w-4 mr-2" />
                    Invite Link Locked
                  </Button>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                {accountExists
                  ? "Share this link with team members to invite them to the chat"
                  : "The invite link will be available once you create your account"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Create Your Account</p>
                  <p className="text-muted-foreground">
                    Click "Create Teams Chat Account" to set up your profile on
                    our chat platform
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Access Invite Link</p>
                  <p className="text-muted-foreground">
                    Once your account is created, the team invite link will be
                    unlocked
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Join Team Chat</p>
                  <p className="text-muted-foreground">
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
