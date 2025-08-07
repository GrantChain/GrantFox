import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bot,
  CreditCard,
  HelpCircle,
  MessageCircle,
  Settings,
  User,
} from "lucide-react";

export default function ChatTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto space-y-8 p-6 lg:p-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Eliza Chatbot Test
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test the GrantFox AI Assistant powered by Eliza framework. The
            chatbot can help with profile management, transaction status, and
            general platform questions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Chat Interface Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Floating Chat Interface
              </CardTitle>
              <CardDescription>
                Look for the floating chat button in the bottom-right corner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="text-center p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Floating chat button is available globally
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                The floating chat interface appears in the bottom-right corner
              </p>
            </CardContent>
          </Card>

          {/* Conversation Flows */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Conversation Flows
              </CardTitle>
              <CardDescription>
                Predefined conversation patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-start">
                  Profile Help
                </Badge>
                <p className="text-xs text-muted-foreground">
                  &quot;How do I update my profile?&quot;
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-start">
                  Transaction Status
                </Badge>
                <p className="text-xs text-muted-foreground">
                  &quot;Check my payment status&quot;
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-start">
                  General Help
                </Badge>
                <p className="text-xs text-muted-foreground">
                  &quot;I need help with the platform&quot;
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Context Injection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Context Injection
              </CardTitle>
              <CardDescription>
                Personalized responses based on user data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-full justify-start">
                  User Profile
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Name, role, wallet address
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="w-full justify-start">
                  Role-Specific
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Grantee or Payout Provider
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="w-full justify-start">
                  Session Management
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Conversation history
                </p>
              </div>
            </CardContent>
          </Card>

          {/* API Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                API Features
              </CardTitle>
              <CardDescription>RESTful API endpoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-start">
                  POST /api/chat
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Send messages and get responses
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-start">
                  GET /api/chat?action=greeting
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Get personalized greeting
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-start">
                  GET /api/chat?action=history
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Retrieve conversation history
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Fallback Responses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Fallback Responses
              </CardTitle>
              <CardDescription>
                Handle unrecognized inputs gracefully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Badge variant="destructive" className="w-full justify-start">
                  Unknown Queries
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Helpful suggestions and guidance
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="destructive" className="w-full justify-start">
                  Error Handling
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Graceful error recovery
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="destructive" className="w-full justify-start">
                  Suggestions
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Context-aware help options
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Testing Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Testing Guide
              </CardTitle>
              <CardDescription>How to test the chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Badge variant="default" className="w-full justify-start">
                  Step 1
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Click the chat button to open
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="default" className="w-full justify-start">
                  Step 2
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Try the conversation flows
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="default" className="w-full justify-start">
                  Step 3
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Test with different user roles
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle>Test Scenarios</CardTitle>
            <CardDescription>
              Try these conversation scenarios to test the chatbot functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold">Profile Management</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• &quot;How do I update my profile?&quot;</li>
                  <li>• &quot;I want to change my bio&quot;</li>
                  <li>•&quot;Where are my account settings?&quot; </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Transaction Status</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>•&quot;Check my payment status&quot; </li>
                  <li>•&quot;When will I receive my funds?&quot; </li>
                  <li>•&quot;Show me my transaction history&quot; </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">General Help</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>•&quot;I need help with the platform&quot; </li>
                  <li>•&quot;How does GrantFox work?&quot; </li>
                  <li>•&quot;What can you help me with?&quot; </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Role-Specific</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>•&quot;Show me my projects&quot;(Grantee) </li>
                  <li>•&quot;Manage my escrows&quot; (Provider)</li>
                  <li>•&quot;Check my milestones&quot;(Grantee) </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
