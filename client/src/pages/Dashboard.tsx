import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Sparkles, FileText, Cloud, MessageSquare, UserCog, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import api from "@/services/api";
import axios from "axios";

interface Recommendation {
  _id: string;
  crop: string;
  date: string;
  status: string;
  image: string;
  fieldName: string;
  predictedCrop: string;
  createdAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string; image?: string } | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [healthSummary, setHealthSummary] = useState<string>("Loading insights...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Weather
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
            const weatherRes = await axios.get(
              `${import.meta.env.VITE_OPENWEATHER_API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            setWeather(weatherRes.data);
          });
        }

        // 2. Fetch Recommendations History
        const { data: historyData } = await api.get("/predict/history");

        // Map history to display format
        const formattedRecs = historyData.map((rec: any) => ({
          _id: rec._id,
          crop: rec.predictedCrop,
          date: new Date(rec.createdAt).toLocaleDateString(),
          status: "Completed", // Assuming all saved are completed
          image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df", // Placeholder or dynamic
          fieldName: rec.fieldName,
          predictedCrop: rec.predictedCrop,
          ...rec
        }));

        setRecommendations(formattedRecs);

        // 3. Get Health Summary for the latest recommendation
        if (historyData.length > 0) {
          const latestRec = historyData[0];
          try {
            const { data: summaryData } = await api.post("/predict/health-summary", latestRec);
            setHealthSummary(summaryData.summary);
          } catch (err) {
            console.error("Failed to fetch health summary", err);
            setHealthSummary("Health insights unavailable.");
          }
        } else {
          setHealthSummary("No soil data available yet.");
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 min-h-[calc(100vh-64px)] border-r border-border bg-card hidden md:block">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              {user.image ? (
                <img
                  src={user.image}
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                  {user.name?.charAt(0).toUpperCase() || " "}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-foreground">{user.name}</h3>
                <p className="text-sm text-muted-foreground">Farmer</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Link to="/dashboard">
                <Button variant="secondary" className="w-full justify-start gap-3">
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/crop-recommender">
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <Sparkles className="w-5 h-5" />
                  Get Recommendation
                </Button>
              </Link>
              <Link to="/soil-reports">
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <FileText className="w-5 h-5" />
                  Soil Reports
                </Button>
              </Link>
              <Link to="/weather">
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <Cloud className="w-5 h-5" />
                  Weather Insights
                </Button>
              </Link>
              <Link to="/feedback">
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <MessageSquare className="w-5 h-5" />
                  Feedback
                </Button>
              </Link>
            </nav>

            <div className="mt-auto pt-8">
              <Link to="/profile">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-muted-foreground"
                >
                  <UserCog className="w-5 h-5" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user.name?.split(' ')[0] || "Farmer"}!</h1>
                <p className="text-muted-foreground">Here's a summary of your farm's current status.</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Weather Card */}
              <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-card to-card/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
                <h3 className="text-sm text-muted-foreground mb-2">Today's Weather</h3>
                {weather ? (
                  <>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</span>
                      <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                        alt="weather icon"
                        className="w-10 h-10"
                      />
                    </div>
                    <p className="text-muted-foreground mb-3 capitalize">{weather.weather[0].description}</p>
                  </>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <Loader2 className="animate-spin" /> Loading weather...
                  </div>
                )}
                <Link to="/weather">
                  <Button variant="link" className="p-0 h-auto font-semibold">
                    View Full Forecast
                  </Button>
                </Link>
              </Card>

              {/* Soil Health Card */}
              <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-card to-card/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
                <h3 className="text-sm text-muted-foreground mb-2">Soil Health</h3>
                <div className="flex items-end gap-2 mb-2">
                  {/* Displaying latest crop or generic status */}
                  <span className="text-2xl font-bold truncate">
                    {recommendations.length > 0 ? recommendations[0].predictedCrop : "No Data"}
                  </span>
                </div>
                <p className="text-muted-foreground mb-3 text-sm line-clamp-2">
                  {healthSummary}
                </p>
                <Link to="/soil-reports">
                  <Button variant="link" className="p-0 h-auto font-semibold">
                    View Soil Report
                  </Button>
                </Link>
              </Card>

              {/* Active Recommendations Card */}
              <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-card to-card/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
                <h3 className="text-sm text-muted-foreground mb-2">Active Recommendations</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold">{recommendations.length}</span>
                </div>
                <p className="text-muted-foreground mb-3">Total recommendations generated</p>
                <Link to="/soil-reports">
                  <Button variant="link" className="p-0 h-auto font-semibold">
                    View Recommendations
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Recent Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Recent Recommendations</h2>
                <Link to="/soil-reports">
                  <Button variant="link" className="text-primary">
                    View All History
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center text-2xl">
                          🌱
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{rec.crop}</h3>
                          <p className="text-muted-foreground text-sm">{rec.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-700 hover:bg-green-100"
                        >
                          {rec.status}
                        </Badge>
                        <Link to="/soil-reports">
                          <Button variant="link" className="text-primary font-semibold">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
                {recommendations.length === 0 && (
                  <p className="text-muted-foreground">No recommendations yet. Go to "Get Recommendation" to start.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
