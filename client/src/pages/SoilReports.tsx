import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const SoilReports = () => {
  const reports = [
    {
      id: 1,
      location: "North Field - Section A",
      date: "March 15, 2024",
      status: "Completed",
      ph: 6.8,
      nitrogen: 92,
      phosphorus: 45,
      potassium: 48,
      organic: 3.2,
      health: "Good"
    },
    {
      id: 2,
      location: "South Field - Section B",
      date: "March 10, 2024",
      status: "Completed",
      ph: 6.5,
      nitrogen: 78,
      phosphorus: 38,
      potassium: 42,
      organic: 2.8,
      health: "Fair"
    },
    {
      id: 3,
      location: "East Field - Section C",
      date: "March 01, 2024",
      status: "Pending",
      ph: 7.1,
      nitrogen: 105,
      phosphorus: 52,
      potassium: 55,
      organic: 3.8,
      health: "Excellent"
    },
  ];

  const getHealthColor = (health: string) => {
    switch (health) {
      case "Excellent":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "Good":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Fair":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
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
            <Button size="lg">
              <FileText className="w-5 h-5 mr-2" />
              New Analysis
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm text-muted-foreground mb-2">Total Reports</h3>
            <p className="text-3xl font-bold text-foreground">{reports.length}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm text-muted-foreground mb-2">Average pH</h3>
            <p className="text-3xl font-bold text-foreground">
              {(reports.reduce((sum, r) => sum + r.ph, 0) / reports.length).toFixed(1)}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm text-muted-foreground mb-2">Fields Analyzed</h3>
            <p className="text-3xl font-bold text-foreground">3</p>
          </Card>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{report.location}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {report.date}
                        </span>
                        <Badge variant={report.status === "Completed" ? "default" : "secondary"}>
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">pH Level</p>
                      <p className="font-semibold text-foreground">{report.ph}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Nitrogen (N)</p>
                      <p className="font-semibold text-foreground">{report.nitrogen} kg/ha</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phosphorus (P)</p>
                      <p className="font-semibold text-foreground">{report.phosphorus} kg/ha</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Potassium (K)</p>
                      <p className="font-semibold text-foreground">{report.potassium} kg/ha</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Organic Matter</p>
                      <p className="font-semibold text-foreground">{report.organic}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <Badge className={getHealthColor(report.health)}>
                    {report.health}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SoilReports;
