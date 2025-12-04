import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, MapPin, Loader2, Sprout } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import api from "@/services/api";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface Report {
  _id: string;
  fieldName: string;
  createdAt: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  predictedCrop: string;
}

const SoilReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await api.get("/predict/history");
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async (report: Report) => {
    try {
      setGeneratingId(report._id);
      const { data } = await api.post("/predict/report", report);

      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(40, 167, 69); // Green color
      doc.text("Soil Analysis & Crop Report", 20, 20);

      // Meta Info
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Field Name: ${report.fieldName}`, 20, 35);
      doc.text(`Date: ${new Date(report.createdAt).toLocaleDateString()}`, 20, 42);
      doc.text(`Recommended Crop: ${report.predictedCrop}`, 20, 49);

      // Parameters Table-like structure
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 55, 190, 55);

      doc.setFontSize(10);
      doc.text(`Nitrogen: ${report.nitrogen}`, 20, 62);
      doc.text(`Phosphorus: ${report.phosphorus}`, 70, 62);
      doc.text(`Potassium: ${report.potassium}`, 120, 62);

      doc.text(`pH Level: ${report.ph}`, 20, 69);
      doc.text(`Temperature: ${report.temperature}°C`, 70, 69);
      doc.text(`Humidity: ${report.humidity}%`, 120, 69);

      doc.line(20, 75, 190, 75);

      // AI Analysis Content
      doc.setFontSize(14);
      doc.setTextColor(40, 167, 69);
      doc.text("Detailed Analysis", 20, 85);

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);

      // Split text to fit page
      const splitText = doc.splitTextToSize(data.report, 170);
      let y = 95;

      // Add text with pagination
      for (let i = 0; i < splitText.length; i++) {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(splitText[i], 20, y);
        y += 7;
      }

      doc.save(`Soil_Report_${report.fieldName.replace(/\s+/g, '_')}.pdf`);
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate report");
    } finally {
      setGeneratingId(null);
    }
  };

  const getAverage = (key: keyof Report) => {
    if (reports.length === 0) return 0;
    const sum = reports.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
    return (sum / reports.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Soil Test Reports</h1>
            <p className="text-muted-foreground">
              View and download your soil analysis reports
            </p>
          </div>
          <Link to="/crop-recommender">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <FileText className="w-5 h-5 mr-2" />
              New Analysis
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-l-4 border-l-green-500">
            <h3 className="text-sm text-muted-foreground mb-2">Total Reports</h3>
            <p className="text-3xl font-bold text-foreground">{reports.length}</p>
          </Card>
          <Card className="p-6 border-l-4 border-l-blue-500">
            <h3 className="text-sm text-muted-foreground mb-2">Avg Nitrogen</h3>
            <p className="text-3xl font-bold text-foreground">{getAverage('nitrogen')}</p>
          </Card>
          <Card className="p-6 border-l-4 border-l-purple-500">
            <h3 className="text-sm text-muted-foreground mb-2">Avg Phosphorus</h3>
            <p className="text-3xl font-bold text-foreground">{getAverage('phosphorus')}</p>
          </Card>
          <Card className="p-6 border-l-4 border-l-orange-500">
            <h3 className="text-sm text-muted-foreground mb-2">Avg Potassium</h3>
            <p className="text-3xl font-bold text-foreground">{getAverage('potassium')}</p>
          </Card>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No reports found. Start by creating a new analysis.
            </div>
          ) : (
            reports.map((report) => (
              <Card key={report._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Sprout className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{report.fieldName}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {report.predictedCrop}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">pH Level</p>
                        <p className="font-semibold text-foreground">{report.ph}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Nitrogen</p>
                        <p className="font-semibold text-foreground">{report.nitrogen}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phosphorus</p>
                        <p className="font-semibold text-foreground">{report.phosphorus}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Potassium</p>
                        <p className="font-semibold text-foreground">{report.potassium}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Temp</p>
                        <p className="font-semibold text-foreground">{report.temperature}°C</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Humidity</p>
                        <p className="font-semibold text-foreground">{report.humidity}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => handleGenerateReport(report)}
                      disabled={generatingId === report._id}
                    >
                      {generatingId === report._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {generatingId === report._id ? "Generating..." : "AI Report"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SoilReports;
