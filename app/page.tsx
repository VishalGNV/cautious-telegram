import { ThemeSwitcher } from "@/components/theme-switcher";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { WaitlistStats } from "@/components/waitlist/waitlist-stats";
import { FeatureGrid } from "@/components/waitlist/feature-grid";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Navigation */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-6xl flex justify-between items-center p-3 px-5">
            <div className="flex gap-2 items-center font-bold text-xl">
              <span className="text-2xl">�</span>
              <span>WaitlistHub</span>
            </div>
            <ThemeSwitcher />
          </div>
        </nav>

        {/* Hero Section */}
        <section className="w-full flex flex-col items-center gap-8 px-4 py-20 md:py-32 bg-gradient-to-b from-background to-primary/5">
          <div className="text-center space-y-6 max-w-3xl">
            <Badge variant="secondary" className="px-4 py-1">
              Coming Soon 🚀
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your Digital Identity,
              <br />
              <span className="text-primary">Simplified</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              One link for all your content. Share smarter, not harder.
            </p>
          </div>

          {/* Waitlist Form */}
          <div className="w-full flex flex-col items-center gap-6 mt-8">
            <WaitlistForm />
            <WaitlistStats />
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 md:py-32 px-4 bg-muted/30">
          <FeatureGrid />
        </section>

        {/* Social Proof Section */}
        <section className="w-full py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-2xl font-semibold text-muted-foreground">
              Trusted by creators, influencers, and brands
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: "💼", label: "Business" },
                { icon: "🎭", label: "Artists" },
                { icon: "🎵", label: "Musicians" },
                { icon: "📸", label: "Creators" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 p-6 rounded-lg border-2 hover:border-primary/50 transition-colors"
                >
                  <span className="text-4xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-sm gap-8 py-16 text-muted-foreground">
          <p>© 2025 WaitlistHub. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
