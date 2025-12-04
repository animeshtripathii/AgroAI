import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, Download, Sprout, Droplets, Thermometer, Wind, Beaker, Leaf, ShoppingBag, Tag, AlertCircle, Info, Loader2, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import { toast } from "sonner";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

// Map crops to Unsplash images
const cropImages: Record<string, string> = {
  rice: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=800&auto=format&fit=crop",
  maize: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=800&auto=format&fit=crop",
  chickpea: "https://images.unsplash.com/photo-1515543904379-3d757afe72e?q=80&w=800&auto=format&fit=crop",
  kidneybeans: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?q=80&w=800&auto=format&fit=crop",
  pigeonpeas: "https://images.unsplash.com/photo-1599579112558-8120689b7878?q=80&w=800&auto=format&fit=crop",
  mothbeans: "https://images.unsplash.com/photo-1599579112558-8120689b7878?q=80&w=800&auto=format&fit=crop",
  mungbean: "https://images.unsplash.com/photo-1515543904379-3d757afe72e?q=80&w=800&auto=format&fit=crop",
  blackgram: "https://images.unsplash.com/photo-1515543904379-3d757afe72e?q=80&w=800&auto=format&fit=crop",
  lentil: "https://images.unsplash.com/photo-1515543904379-3d757afe72e?q=80&w=800&auto=format&fit=crop",
  pomegranate: "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?q=80&w=800&auto=format&fit=crop",
  banana: "https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=800&auto=format&fit=crop",
  mango: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop",
  grapes: "https://images.unsplash.com/photo-1537640538965-1756fb179c26?q=80&w=800&auto=format&fit=crop",
  watermelon: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop",
  muskmelon: "https://images.unsplash.com/photo-1598025362874-49480f044805?q=80&w=800&auto=format&fit=crop",
  apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=800&auto=format&fit=crop",
  orange: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=800&auto=format&fit=crop",
  papaya: "https://images.unsplash.com/photo-1617117833203-c91b06061dad?q=80&w=800&auto=format&fit=crop",
  coconut: "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?q=80&w=800&auto=format&fit=crop",
  cotton: "https://images.unsplash.com/photo-1615485500920-3c4f2dae2184?q=80&w=800&auto=format&fit=crop",
  jute: "https://images.unsplash.com/photo-1615485500920-3c4f2dae2184?q=80&w=800&auto=format&fit=crop",
  coffee: "https://images.unsplash.com/photo-1552346989-e069318e20a5?q=80&w=800&auto=format&fit=crop",
};

// Fertilizer Data (Using Unsplash images for reliability)
const fertilizerData: Record<string, { image: string; npk: string; type: string; description: string }> = {
  "Urea": {
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=800&auto=format&fit=crop", // White powder/granules
    npk: "46-0-0",
    type: "Synthetic",
    description: "High nitrogen fertilizer for promoting green leafy growth."
  },
  "DAP": {
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800&auto=format&fit=crop", // Granules
    npk: "18-46-0",
    type: "Synthetic",
    description: "Excellent source of phosphorus and nitrogen for root development."
  },
  "14-35-14": {
    image: "https://images.unsplash.com/photo-1563514227146-8930d4f04494?q=80&w=800&auto=format&fit=crop", // Agriculture generic
    npk: "14-35-14",
    type: "Complex",
    description: "Balanced fertilizer with high phosphorus for flowering and fruiting."
  },
  "28-28": {
    image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=800&auto=format&fit=crop", // Field
    npk: "28-28-0",
    type: "Complex",
    description: "High nitrogen and phosphorus content for vigorous growth."
  },
  "17-17-17": {
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop", // Field
    npk: "17-17-17",
    type: "Balanced",
    description: "Equal balance of nutrients for general purpose crop maintenance."
  },
  "20-20": {
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop", // Field
    npk: "20-20-0",
    type: "Complex",
    description: "Balanced nitrogen and phosphorus for steady growth."
  },
  "10-26-26": {
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop", // Field
    npk: "10-26-26",
    type: "Complex",
    description: "High phosphorus and potassium for quality produce and disease resistance."
  }
};

// Branded Products Data (Using Unsplash/Placeholder images for reliability)
const brandedProducts: Record<string, Array<{ id: string; brand: string; name: string; price: string; weight: string; image: string }>> = {
  "Urea": [
    { id: "u1", brand: "IFFCO", name: "Neem Coated Urea", price: "₹266.50", weight: "45 kg", image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=400&auto=format&fit=crop" },
    { id: "u2", brand: "Coromandel", name: "Gromor Urea", price: "₹300.00", weight: "50 kg", image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=400&auto=format&fit=crop" },
    { id: "u3", brand: "Yara", name: "YaraVera Urea", price: "₹350.00", weight: "50 kg", image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=400&auto=format&fit=crop" }
  ],
  "DAP": [
    { id: "d1", brand: "IFFCO", name: "DAP 18-46-0", price: "₹1,350.00", weight: "50 kg", image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=400&auto=format&fit=crop" },
    { id: "d2", brand: "Coromandel", name: "Gromor DAP", price: "₹1,400.00", weight: "50 kg", image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=400&auto=format&fit=crop" }
  ]
};

const Results = () => {
  const location = useLocation();
  const formData = location.state?.formData;
  const resultType = location.state?.type; // 'crop' or 'fertilizer'
  const resultRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Parse prediction
  const rawPrediction = location.state?.prediction?.prediction;
  const predictionName = Array.isArray(rawPrediction) ? rawPrediction[0] : rawPrediction;
  const formattedName = predictionName ? predictionName.charAt(0).toUpperCase() + predictionName.slice(1) : "Unknown";

  // --- FERTILIZER VIEW ---
  if (resultType === 'fertilizer') {
    // Case-insensitive lookup
    const fertilizerKey = Object.keys(fertilizerData).find(key => key.toLowerCase() === predictionName?.toLowerCase()) || "Urea";
    const fertilizer = fertilizerData[fertilizerKey] || fertilizerData["Urea"];

    const products = brandedProducts[fertilizerKey] || brandedProducts["Urea"]; // Fallback for demo

    // Prepare chart data
    const npkValues = fertilizer.npk.split('-').map(Number);
    const chartData = [
      { name: 'Nitrogen', value: npkValues[0] || 0, fill: '#60a5fa' },
      { name: 'Phosphorus', value: npkValues[1] || 0, fill: '#c084fc' },
      { name: 'Potassium', value: npkValues[2] || 0, fill: '#f472b6' },
      { name: 'Soil pH', value: Number(formData?.ph) || 0, fill: '#34d399' },
    ];

    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-6">
            <Link to="/fertilizer-prediction">
              <Button variant="ghost" className="hover:bg-slate-200 text-slate-600 mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Predictor
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Recommended Fertilizer: {formattedName}</h1>
            <p className="text-slate-500">Based on analysis for your soil conditions</p>
          </div>

          {/* Hero Section */}
          <div className="w-full h-64 md:h-80 rounded-3xl overflow-hidden relative mb-8 shadow-md">
            <img
              src={fertilizer.image}
              alt={formattedName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <div className="text-white">
                <Badge className="bg-green-500 text-white border-none mb-2 text-lg px-4 py-1">
                  Best Match
                </Badge>
                <h2 className="text-4xl font-bold">{formattedName}</h2>
                <p className="text-white/90 text-lg">{fertilizer.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats & Guide */}
            <div className="lg:col-span-2 space-y-8">

              {/* Nutrient Levels Card */}
              <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800">Nutrient Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          cursor={{ fill: '#f1f5f9' }}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Application Guide */}
              <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800">Fertilizer Application Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { title: "Measure Correctly", desc: "Calculate the required amount based on your field size. Avoid over-application." },
                      { title: "Apply Evenly", desc: "Broadcast granules uniformly across the soil surface or use a spreader." },
                      { title: "Incorporate into Soil", desc: "Lightly rake the soil to mix the fertilizer into the top layer." },
                      { title: "Water Thoroughly", desc: "Water the field immediately after application to help nutrients dissolve." }
                    ].map((step, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{step.title}</h4>
                          <p className="text-slate-600 text-sm">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Available Products List */}
              {products.length > 0 && (
                <div className="pt-4">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-green-600" />
                    Available Brands & Prices
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all flex"
                      >
                        <div className="w-1/3 bg-slate-50 p-4 flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="w-2/3 p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{product.brand}</p>
                              <Badge variant="outline" className="text-xs">{product.weight}</Badge>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mt-1">{product.name}</h3>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-lg font-bold text-green-700">{product.price}</span>
                            <Button size="sm" variant="secondary" className="h-8 text-xs">View</Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Side Cards */}
            <div className="space-y-6">
              <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800">Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Promotes rapid growth</span>
                    </li>
                    <li className="flex gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Increases crop yield</span>
                    </li>
                    <li className="flex gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Improves soil health</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800">Precautions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <div className="flex gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-amber-800 text-sm">Handle with Care</span>
                    </div>
                    <p className="text-xs text-amber-700">
                      Store in a cool, dry place. Keep away from children and pets. Wear gloves during application.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800">Market Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Current market trends show stable prices for {formattedName}. Consider buying in bulk for better rates.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Info className="w-3 h-3" />
                    <span>Updated today</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- CROP RECOMMENDATION VIEW (EXISTING) ---

  // Get image or default
  const cropImage = cropImages[predictionName?.toLowerCase()] || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop";

  // Data for Radar Chart (Environmental Profile)
  const radarData = formData ? [
    { subject: 'Temp', A: (Number(formData.temperature) / 50) * 100, fullMark: 100 },
    { subject: 'Humidity', A: Number(formData.humidity), fullMark: 100 },
    { subject: 'pH', A: (Number(formData.ph) / 14) * 100, fullMark: 100 },
    { subject: 'Rainfall', A: (Number(formData.rainfall) / 300) * 100, fullMark: 100 },
  ] : [];

  // Data for Bar Chart (Nutrients)
  const nutrientData = formData ? [
    { name: 'N', value: Number(formData.nitrogen), color: '#3b82f6' },
    { name: 'P', value: Number(formData.phosphorus), color: '#8b5cf6' },
    { name: 'K', value: Number(formData.potassium), color: '#ec4899' },
  ] : [];

  const [isGenerating, setIsGenerating] = useState(false);

  const [aiReportText, setAiReportText] = useState<string>("");

  const handleAIReport = async () => {
    try {
      setIsGenerating(true);

      const payload = {
        ...formData,
        nitrogen: Number(formData.nitrogen),
        phosphorus: Number(formData.phosphorus),
        potassium: Number(formData.potassium),
        temperature: Number(formData.temperature),
        humidity: Number(formData.humidity),
        ph: Number(formData.ph),
        rainfall: Number(formData.rainfall),
        predictedCrop: predictionName,
        fieldName: formData.fieldName || "Field"
      };

      // 1. Get AI Report Text
      const { data } = await api.post("/predict/report", payload);
      setAiReportText(data.report);
      toast.success("AI Report generated! Click 'Save Result' to download PDF.");

    } catch (error: any) {
      console.error("Error generating AI report:", error);
      toast.error(error.response?.data?.message || "Failed to generate AI report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!aiReportText) {
      toast.error("Please generate the AI report first.");
      return;
    }
    setIsDownloading(true);

    try {
      const payload = {
        cropName: formattedName,
        soilData: {
          N: formData.nitrogen,
          P: formData.phosphorus,
          K: formData.potassium,
          ph: formData.ph,
          humidity: formData.humidity,
          temperature: formData.temperature,
          rainfall: formData.rainfall
        },
        aiReport: aiReportText
      };

      const response = await api.post('/predict/download-report', payload, {
        responseType: 'blob'
      });

      // Create a URL for the file and trigger download
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Soil_Report_${formattedName}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">No Data Found</h2>
          <Link to="/crop-recommender">
            <Button>Go Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50 font-sans flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-4 max-w-7xl h-full overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <Link to="/crop-recommender">
            <Button variant="ghost" className="hover:bg-slate-200 text-slate-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAIReport}
              disabled={isGenerating}
              className="border-green-600 text-green-700 hover:bg-green-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
              AI Report
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-slate-900 hover:bg-slate-800 text-white shadow-md"
            >
              {isDownloading ? "Generating..." : <><Download className="w-4 h-4 mr-2" /> Save Result</>}
            </Button>
          </div>
        </div>

        {/* Main Content Area to be Captured */}
        <div ref={resultRef} className="flex-1 bg-white rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-full">

          {/* Left Column: Image & Key Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 relative h-full"
          >
            <div className="absolute inset-0">
              <img
                src={cropImage}
                alt={formattedName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
                <Badge className="self-start mb-4 px-3 py-1 bg-green-500 text-white border-none">
                  <CheckCircle className="w-3 h-3 mr-1" /> Best Match
                </Badge>
                <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">
                  {formattedName}
                </h1>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  Optimal growth conditions detected based on your soil profile.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-blue-100 font-medium">Water</span>
                    </div>
                    <p className="text-white font-bold">Moderate</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Sprout className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-100 font-medium">Growth</span>
                    </div>
                    <p className="text-white font-bold">Fast</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Charts & Data */}
          <div className="lg:col-span-8 p-6 lg:p-8 flex flex-col h-full overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 shrink-0">
              {/* Radar Chart */}
              <Card className="border-none shadow-lg bg-slate-50/50 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-slate-500" /> Environmental Profile
                </h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Conditions" dataKey="A" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.2} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '12px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Bar Chart */}
              <Card className="border-none shadow-lg bg-slate-50/50 rounded-2xl p-4">
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-slate-500" /> Nutrient Analysis
                </h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={nutrientData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '12px' }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                        {nutrientData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Detailed Stats Grid */}
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-700 mb-4">Detailed Parameters</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { label: "N", value: formData.nitrogen, unit: "kg/ha", color: "text-blue-500", bg: "bg-blue-50" },
                  { label: "P", value: formData.phosphorus, unit: "kg/ha", color: "text-purple-500", bg: "bg-purple-50" },
                  { label: "K", value: formData.potassium, unit: "kg/ha", color: "text-pink-500", bg: "bg-pink-50" },
                  { label: "Temp", value: formData.temperature, unit: "°C", color: "text-orange-500", bg: "bg-orange-50" },
                  { label: "Humid", value: formData.humidity, unit: "%", color: "text-cyan-500", bg: "bg-cyan-50" },
                  { label: "pH", value: formData.ph, unit: "", color: "text-teal-500", bg: "bg-teal-50" },
                  { label: "Rain", value: formData.rainfall, unit: "mm", color: "text-indigo-500", bg: "bg-indigo-50" },
                ].map((item, index) => (
                  <div key={index} className={`p-3 rounded-xl text-center ${item.bg}`}>
                    <p className={`text-xs font-bold ${item.color} mb-1`}>{item.label}</p>
                    <p className="font-bold text-slate-800 text-sm">{item.value}</p>
                    <p className="text-[10px] text-slate-400">{item.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
