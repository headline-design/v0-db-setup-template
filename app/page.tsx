import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Shield, Zap, Info } from "lucide-react"

export default function Home() {
  const isExampleMode = process.env.NEXT_PUBLIC_EXAMPLE_MODE === "true"

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">v0 Database Setup Template</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete authentication and database integration template for v0 projects with Supabase
            </p>
          </div>

          {/* Example Mode Notice */}
          {isExampleMode && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Running in <strong>Example Mode</strong>. Authentication is disabled to let you explore the template.
                Add your Supabase credentials to enable full functionality.
              </AlertDescription>
            </Alert>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Complete Auth System</CardTitle>
                <CardDescription>Pre-built login, signup, password reset, and protected routes</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Database className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Database Ready</CardTitle>
                <CardDescription>Supabase integration with schema scripts and RLS policies</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>Connect your Supabase project and start building immediately</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* What's Included */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
              <CardDescription>
                Everything you need to get started with authentication and database integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Authentication</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Email/password authentication</li>
                    <li>• Password reset flow</li>
                    <li>• Email confirmation</li>
                    <li>• Protected routes</li>
                    <li>• Session management</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Database Setup</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Supabase client utilities</li>
                    <li>• Database schema scripts</li>
                    <li>• Row Level Security policies</li>
                    <li>• Server and client helpers</li>
                    <li>• Middleware configuration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Follow these steps to set up your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm font-medium">1. Connect Supabase Integration</p>
                <p className="text-sm text-muted-foreground">
                  Add your Supabase project from the v0 integrations panel, or set{" "}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_EXAMPLE_MODE=true</code> to preview
                  without a database
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">2. Run Database Scripts</p>
                <p className="text-sm text-muted-foreground">
                  Execute the schema scripts in <code className="text-xs bg-muted px-1 py-0.5 rounded">/scripts</code>{" "}
                  to set up your database
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">3. Configure Environment Variables</p>
                <p className="text-sm text-muted-foreground">
                  Add NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL for local development
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">4. Start Building</p>
                <p className="text-sm text-muted-foreground">
                  Use the auth components and protected routes to build your app
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
