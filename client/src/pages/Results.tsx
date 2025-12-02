import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, Download } from "lucide-react";
import Navbar from "@/components/Navbar";

const Results = () => {
  const location = useLocation();
  const formData = location.state?.formData;

  // TODO: Replace with actual ML model predictions
  const mockRecommendations = [
    {
      crop: "Rice",
      confidence: 95,
      image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6",
      reason: "High humidity and adequate rainfall make rice cultivation ideal for your conditions.",
      yield: "5-6 tons/hectare"
    },
    {
      crop: "Cotton",
      confidence: 87,
      image: "https://images.unsplash.com/photo-1615485500920-3c4f2dae2184",
      reason: "Temperature and soil pH are optimal for cotton production.",
      yield: "2-3 tons/hectare"
    },
    {
      crop: "Sugarcane",
      confidence: 82,
      image: "https://images.unsplash.com/photo-1580918319695-001c7bb9f6e6",
      reason: "Balanced NPK ratio and moisture levels support sugarcane growth.",
      yield: "60-70 tons/hectare"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Link to="/crop-recommender">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Form
          </Button>
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Your Crop Recommendations
          </h1>
          <p className="text-muted-foreground text-lg">
            Based on your soil and environmental parameters
          </p>
        </div>

        {/* Input Summary */}
        {formData && (
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-4">Input Parameters</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Nitrogen:</span>
                <span className="font-medium ml-2">{formData.nitrogen} kg/ha</span>
              </div>
              <div>
                <span className="text-muted-foreground">Phosphorus:</span>
                <span className="font-medium ml-2">{formData.phosphorus} kg/ha</span>
              </div>
              <div>
                <span className="text-muted-foreground">Potassium:</span>
                <span className="font-medium ml-2">{formData.potassium} kg/ha</span>
              </div>
              <div>
                <span className="text-muted-foreground">Temperature:</span>
                <span className="font-medium ml-2">{formData.temperature}°C</span>
              </div>
              <div>
                <span className="text-muted-foreground">Humidity:</span>
                <span className="font-medium ml-2">{formData.humidity}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">pH:</span>
                <span className="font-medium ml-2">{formData.ph}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Rainfall:</span>
                <span className="font-medium ml-2">{formData.rainfall} mm</span>
              </div>
            </div>
          </Card>
        )}

        {/* Recommendations */}
        <div className="space-y-6 mb-8">
          {mockRecommendations.map((rec, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row">
                <img
                  src={rec.image}
                  alt={rec.crop}
                  className="w-full md:w-64 h-48 object-cover"
                />
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{rec.crop}</h3>
                      <p className="text-muted-foreground">Expected Yield: {rec.yield}</p>
                    </div>
                    <Badge className="text-lg px-4 py-1 bg-green-100 text-green-700 hover:bg-green-100">
                      {rec.confidence}% Match
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{rec.reason}</p>
                  <Button variant="outline">View Full Details</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button size="lg">
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </Button>
          <Link to="/crop-recommender">
            <Button variant="outline" size="lg">
              Try Again
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;
