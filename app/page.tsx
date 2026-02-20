import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Printer, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header with primary color accent */}
      <header className="px-6 h-16 flex items-center justify-between border-b bg-card shadow-sm">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Printer className="h-6 w-6" />
          <span>CUET Print</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section with gradient using primary colors */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-foreground">
                  Print Smart. Skip the Queue.
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  The hassle-free printing service for CUET students. Upload your files from your room, pick them up when ready. No USBs, no viruses.
                </p>
              </div>
              <div className="space-x-4 pt-4">
                <Link href="/login">
                  <Button className="h-11 px-8 rounded-full text-lg" size="lg">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="secondary" className="h-11 px-8 rounded-full text-lg">
                    Register Shop
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with semantic colors */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1: Primary Blue */}
              <div className="flex flex-col items-center space-y-2 border border-border bg-card p-6 rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Instant Upload</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Upload PDFs directly from your phone or laptop. No need to carry pen drives or log into public PCs.
                </p>
              </div>
              
              {/* Feature 2: Success Green */}
              <div className="flex flex-col items-center space-y-2 border border-border bg-card p-6 rounded-xl shadow-sm hover:shadow-md hover:border-success/50 transition-all">
                <div className="p-3 bg-success/10 rounded-full">
                  <ShieldCheck className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Virus Free</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Protect your data. Since you don't plug in USB drives, you are safe from the infamous shop shortcuts virus.
                </p>
              </div>
              
              {/* Feature 3: Accent Orange */}
              <div className="flex flex-col items-center space-y-2 border border-border bg-card p-6 rounded-xl shadow-sm hover:shadow-md hover:border-accent/50 transition-all">
                <div className="p-3 bg-accent/10 rounded-full">
                  <Printer className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Real-time Status</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Track your print job status. Only go to the shop when you see the "Completed" badge.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-card">
        <p className="text-xs text-muted-foreground">© 2026 CUET Print Service. Built by Students.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground hover:text-primary" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground hover:text-primary" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}