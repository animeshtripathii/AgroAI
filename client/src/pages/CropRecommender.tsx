import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";

const CropRecommender = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send data to ML model API endpoint
    console.log("Form data for ML model:", formData);
    
    // Navigate to results page (to be created)
    navigate("/results", { state: { formData } });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI-Powered Crop Recommender
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enter your soil and environmental parameters to get personalized crop recommendations powered by machine learning.
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nitrogen">Nitrogen (N) - kg/ha</Label>
                <Input
                  id="nitrogen"
                  name="nitrogen"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 90"
                  value={formData.nitrogen}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phosphorus">Phosphorus (P) - kg/ha</Label>
                <Input
                  id="phosphorus"
                  name="phosphorus"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 42"
                  value={formData.phosphorus}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="potassium">Potassium (K) - kg/ha</Label>
                <Input
                  id="potassium"
                  name="potassium"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 43"
                  value={formData.potassium}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature - °C</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 20.8"
                  value={formData.temperature}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="humidity">Humidity - %</Label>
                <Input
                  id="humidity"
                  name="humidity"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 82"
                  value={formData.humidity}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ph">pH Value</Label>
                <Input
                  id="ph"
                  name="ph"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 6.5"
                  value={formData.ph}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="rainfall">Rainfall - mm</Label>
                <Input
                  id="rainfall"
                  name="rainfall"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 202.9"
                  value={formData.rainfall}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" size="lg" className="flex-1">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Recommendation
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => setFormData({
                nitrogen: "",
                phosphorus: "",
                potassium: "",
                temperature: "",
                humidity: "",
                ph: "",
                rainfall: "",
              })}>
                Reset
              </Button>
            </div>
          </form>
        </Card>

        <div className="mt-8 p-6 bg-accent/50 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">How it works:</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Enter your soil nutrient levels (N, P, K) from your soil test</li>
            <li>• Add environmental conditions (temperature, humidity, rainfall)</li>
            <li>• Include soil pH value</li>
            <li>• Our ML model analyzes the data and recommends the best crops</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CropRecommender;
