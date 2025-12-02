import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sprout, Droplet, Wind, Mountain, Wheat } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden rounded-2xl mx-4 mt-6 md:mx-8">
        <img
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449"
          alt="Soil layers showing healthy earth"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Understanding Your Soil: The Foundation of a Great Harvest.
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Learn why soil health is the most critical factor for a successful farm and how you can leverage it for better yields.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:px-8">
        {/* What is Soil Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">What is Soil?</h2>
          <p className="text-muted-foreground text-lg max-w-4xl">
            Soil is a complex mixture of minerals, organic matter, water, and air, which forms the foundation of our ecosystem. Understanding its composition is the first step towards improving crop health and yield.
          </p>
        </section>

        {/* Four Major Components */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">The Four Major Components</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-4xl">
            Each component plays a vital role in the soil's structure, fertility, and ability to support plant life.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                <Mountain className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Minerals</h3>
              <p className="text-muted-foreground">
                The inorganic part, derived from rock, providing essential nutrients.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                <Sprout className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organic Matter</h3>
              <p className="text-muted-foreground">
                Decomposed plant and animal remains that enrich the soil.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                <Droplet className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Water</h3>
              <p className="text-muted-foreground">
                Held within pores, it dissolves nutrients for plant uptake.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                <Wind className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Air</h3>
              <p className="text-muted-foreground">
                Fills the spaces between soil particles, crucial for root respiration.
              </p>
            </Card>
          </div>
        </section>

        {/* Soil Horizons Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">Soil Horizons: The Profile</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-4xl">
            A vertical section of the soil from the ground surface downwards to where the soil meets the underlying rock.
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399"
                alt="Soil layers cross-section"
                className="rounded-lg shadow-lg w-full h-[400px] object-cover"
              />
            </div>

            <div className="space-y-4">
              {[
                { label: "O", title: "Organic", desc: "Loose and partly decayed organic matter." },
                { label: "A", title: "Topsoil", desc: "Mineral matter mixed with humus." },
                { label: "B", title: "Subsoil", desc: "Accumulation of clay transported from above." },
                { label: "C", title: "Parent Material", desc: "Partially altered parent material." },
                { label: "R", title: "Bedrock", desc: "Unweathered parent material." },
              ].map((horizon) => (
                <div key={horizon.label} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {horizon.label}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{horizon.title}:</h4>
                    <p className="text-muted-foreground">{horizon.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-accent rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to analyze your soil?</h2>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            Use our AI-powered tool to get personalized crop recommendations based on your unique soil profile and achieve better yields.
          </p>
          <Link to="/crop-recommender">
            <Button size="lg" className="text-base">
              Use Crop Recommender
            </Button>
          </Link>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Wheat className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">© 2024 AgroAI. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
