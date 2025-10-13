import { Button } from "@/components/ui/button";
import plumbingHero from "@/assets/plumbing-hero.png";

interface HeroSectionProps {
  onGetStarted: () => void;
  onUploadFamily: () => void;
}

export const HeroSection = ({ onGetStarted, onUploadFamily }: HeroSectionProps) => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight typewriter">
            PLUMBING FAMILY'S
          </h1>
          <p className="text-xl text-muted-foreground dots">
            Simplify Projects with Ready-to-Use Plumbing Families{" "}         
    <span>.</span><span>.</span><span>.</span><span>.</span><span>
  </span>
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={onGetStarted}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              onClick={onUploadFamily}
            >
              Upload Family
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center h-full">
          <img 
            src={plumbingHero} 
            alt="Plumbing Tools" 
            className="w-full h-auto max-h-[70vh] object-contain animate-fade-in"
          />
        </div>
      </div>
    </section>
  );
};
