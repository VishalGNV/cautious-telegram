import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: "📊",
    title: "Real-time Analytics",
    description: "Track clicks, views, and engagement with detailed insights",
  },
  {
    icon: "🎨",
    title: "Beautiful Designs",
    description: "Customizable pages that match your brand perfectly",
  },
  {
    icon: "⚡",
    title: "Connect Everything",
    description: "Link all your platforms and content in one place",
  },
  {
    icon: "🌐",
    title: "Custom Domains",
    description: "Use your own domain for a professional touch",
  },
  {
    icon: "📱",
    title: "Mobile Optimized",
    description: "Perfect experience on every device and screen size",
  },
  {
    icon: "🔐",
    title: "Enterprise Security",
    description: "Bank-level security to protect your data and links",
  },
];

export function FeatureGrid() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">🎯 What You&apos;ll Get</h2>
        <p className="text-muted-foreground">
          Everything you need to build your digital presence
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
          >
            <CardContent className="pt-6">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
