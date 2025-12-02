import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Sparkles, FileText, Cloud, MessageSquare, LogOut, UserCog } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string; image?: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const recommendations = [
    {
      crop: "Corn",
      date: "Mar 15, 2024",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df"
    },
    {
      crop: "Soybean",
      date: "Mar 10, 2024",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1587320885004-0de2722c3e3d"
    },
    {
      crop: "Potatoes",
      date: "Mar 01, 2024",
      status: "Pending",
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655"
    },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 min-h-[calc(100vh-64px)] border-r border-border bg-card">
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
              <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-card to-card/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
                <h3 className="text-sm text-muted-foreground mb-2">Today's Weather</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold">24°C</span>
                  <span className="text-2xl text-muted-foreground mb-1">☀️</span>
                </div>
                <p className="text-muted-foreground mb-3">Sunny with light winds</p>
                <Link to="/weather">
                  <Button variant="link" className="p-0 h-auto font-semibold">
                    View Full Forecast
                  </Button>
                </Link>
              </Card>

              <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-card to-card/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
                <h3 className="text-sm text-muted-foreground mb-2">Soil Health</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold">45%</span>
                  <span className="text-lg text-muted-foreground mb-1">- Optimal</span>
                </div>
                <p className="text-muted-foreground mb-3">pH: 6.8</p>
                <Link to="/soil-reports">
                  <Button variant="link" className="p-0 h-auto font-semibold">
                    View Soil Report
                  </Button>
                </Link>
              </Card>

              <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-card to-card/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
                <h3 className="text-sm text-muted-foreground mb-2">Active Recommendations</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold">3</span>
                </div>
                <p className="text-muted-foreground mb-3">Awaiting your action</p>
                <Button variant="link" className="p-0 h-auto font-semibold">
                  View Recommendations
                </Button>
              </Card>
            </div>

            {/* Recent Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Recent Recommendations</h2>
                <Button variant="link" className="text-primary">
                  View All History
                </Button>
              </div>

              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={rec.image}
                          alt={rec.crop}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{rec.crop}</h3>
                          <p className="text-muted-foreground text-sm">{rec.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={rec.status === "Completed" ? "default" : "secondary"}
                          className={rec.status === "Completed" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"}
                        >
                          {rec.status}
                        </Badge>
                        <Button variant="link" className="text-primary font-semibold">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
