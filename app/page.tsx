"use client"
import { GigaCaptcha } from "@/components/giga-captcha"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Laugh, Github, Code, Puzzle, CastleIcon as ChessKnight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-amber-50 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Laugh className="h-6 w-6 text-yellow-500" />
            <span className="text-xl font-bold">GigaCaptcha</span>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Fun Edition</span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="#features" className="text-sm font-medium">
              Features
            </a>
            <a href="#demo" className="text-sm font-medium">
              Demo
            </a>
            <a href="#challenges" className="text-sm font-medium">
              Challenges
            </a>
            <Button variant="outline" size="sm">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </nav>
        </div>
      </header>

      <main className="container py-12">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-yellow-100 px-3 py-1 text-sm text-yellow-800 mb-4">
                    The World's Most Hilarious CAPTCHA! 🤣
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Make Bots Cry and Humans Laugh
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Tired of boring CAPTCHAs? GigaCaptcha challenges users with the most ridiculous verification tasks
                    ever created!
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600">
                    Get Started
                  </Button>
                  <Button variant="outline" size="lg">
                    View Documentation
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <GigaCaptcha
                  onVerify={(success, result) => {
                    console.log("Verification result:", success, result)
                  }}
                  enabledChallenges={["chess"]}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-12 md:py-24 lg:py-32 bg-white rounded-lg">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Why GigaCaptcha?</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Because security should be fun, not boring!
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-yellow-100 p-3">
                  <Laugh className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">No More Lame CAPTCHAs</h3>
                  <p className="text-sm text-muted-foreground">
                    We make you work for it with challenges that are actually entertaining. No more boring "select all
                    traffic lights."
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-yellow-100 p-3">
                  <Code className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Production Ready</h3>
                  <p className="text-sm text-muted-foreground">
                    Built with React + Tailwind, with proper error handling, accessibility features, and robust
                    configuration options.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-yellow-100 p-3">
                  <Puzzle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Super Simple Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Import, use, and watch people struggle (and laugh). Easy to add to any React project.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Try It Out</h2>
                <p className="mx-auto max-w-[700px] text-muted-foregroun md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Experience the most ridiculous CAPTCHA challenges ever created
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl py-12">
              <Tabs defaultValue="chess">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chess">Chess Challenge</TabsTrigger>
                  <TabsTrigger value="dark">Dark Theme</TabsTrigger>
                </TabsList>
                <TabsContent value="chess" className="mt-6 flex justify-center">
                  <GigaCaptcha
                    onVerify={(success, result) => {
                      console.log("Verification result:", success, result)
                    }}
                    enabledChallenges={["chess"]}
                  />
                </TabsContent>
                <TabsContent value="dark" className="mt-6 flex justify-center">
                  <GigaCaptcha
                    theme="dark"
                    onVerify={(success, result) => {
                      console.log("Verification result:", success, result)
                    }}
                    enabledChallenges={["chess"]}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        <section id="challenges" className="py-12 md:py-24 lg:py-32 bg-white rounded-lg">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ridiculous Challenges</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our collection of absurd verification tasks
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:gap-12">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-yellow-100 p-2">
                      <ChessKnight className="h-4 w-4 text-yellow-600" />
                    </div>
                    <CardTitle>Chess Challenge</CardTitle>
                  </div>
                  <CardDescription>Play a full chess game with checkmate puzzles</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our enhanced chess challenge uses a full chess engine to let you play real chess games and solve
                    checkmate puzzles. Perfect for testing strategic thinking!
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-yellow-100 p-2">
                      <Puzzle className="h-4 w-4 text-yellow-600" />
                    </div>
                    <CardTitle>Coming Soon: More Challenges</CardTitle>
                  </div>
                  <CardDescription>We're working on more ridiculous challenges</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Stay tuned for more absurd verification tasks that will make you question your humanity while having
                    fun!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Production-Ready Integration</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get up and running with GigaCaptcha in minutes
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl py-12">
              <Card>
                <CardHeader>
                  <CardTitle>Installation</CardTitle>
                  <CardDescription>Add GigaCaptcha to your project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md bg-slate-950 p-4">
                    <pre className="text-sm text-white">
                      <code>npm install chess.js react-chessboard</code>
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Basic Usage</h3>
                    <div className="rounded-md bg-slate-950 p-4">
                      <pre className="text-sm text-white">
                        <code>{`import { GigaCaptcha } from '@/components/giga-captcha'

export default function MyForm() {
  return (
    <form>
      {/* Your form fields */}
      
      <GigaCaptcha 
        onVerify={(success, result) => {
          if (success) {
            // Allow form submission
          }
        }}
        onError={(error) => {
          console.error("CAPTCHA error:", error);
        }}
        // Only show chess challenges
        enabledChallenges={["chess"]}
      />
      
      <button type="submit">Submit</button>
    </form>
  )
}`}</code>
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Advanced Configuration</h3>
                    <div className="rounded-md bg-slate-950 p-4">
                      <pre className="text-sm text-white">
                        <code>{`<GigaCaptcha 
  theme="dark"
  difficulty="hard"
  autoRefresh={false}
  accessibilityLabels={{
    title: "Custom CAPTCHA Verification",
    loading: "Loading your challenge",
    success: "You passed!",
    failure: "Try again",
    refresh: "Get a new puzzle"
  }}
  onVerify={(success, result) => {
    console.log("Session ID:", result.sessionId);
    console.log("Challenge type:", result.challengeType);
  }}
/>`}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} GigaCaptcha Fun Edition. Making bots cry since 2023.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <a href="#" className="text-xs hover:underline underline-offset-4">
              Terms
            </a>
            <a href="#" className="text-xs hover:underline underline-offset-4">
              Privacy
            </a>
            <a href="#" className="text-xs hover:underline underline-offset-4">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
