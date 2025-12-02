import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Search, Sun, CloudRain, Cloud, CloudDrizzle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

const Weather = () => {
  const forecastDays = [
    { day: "Mon", icon: Sun, high: 24, low: 12, condition: "Sunny" },
    { day: "Tue", icon: Cloud, high: 22, low: 11, condition: "Cloudy" },
    { day: "Wed", icon: CloudRain, high: 21, low: 10, condition: "Rainy" },
    { day: "Thu", icon: Cloud, high: 19, low: 9, condition: "Cloudy" },
    { day: "Fri", icon: CloudDrizzle, high: 18, low: 10, condition: "Drizzle" },
    { day: "Sat", icon: CloudRain, high: 20, low: 12, condition: "Rainy" },
    { day: "Sun", icon: Sun, high: 23, low: 13, condition: "Sunny" },
  ];

  const rainfallData = [
    { month: "Jan", thisYear: 45, average: 35 },
    { month: "Feb", thisYear: 52, average: 40 },
    { month: "Mar", thisYear: 78, average: 55 },
    { month: "Apr", thisYear: 95, average: 70 },
    { month: "May", thisYear: 120, average: 85 },
    { month: "Jun", thisYear: 140, average: 100 },
  ];

  const advisories = [
    {
      title: "High Frost Risk Tonight",
      desc: "Temperatures are expected to drop near 0°C. Consider protective measures for sensitive crops.",
      icon: "❄️"
    },
    {
      title: "Pest Alert",
      desc: "Recent humidity and warmth are favorable for aphid growth. Monitor fields closely.",
      icon: "🐛"
    },
    {
      title: "Optimal Seeding Conditions",
      desc: "Soil moisture and upcoming forecast are ideal for seeding corn in the next 48 hours.",
      icon: "🌱"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold text-foreground mb-2">Weather Insights</h1>
        <p className="text-muted-foreground mb-8">
          Detailed weather information for informed farming decisions.
        </p>

        {/* Location and Date */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="font-medium">Willow Creek Farm</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="font-medium">Today</span>
          </div>
          <Button variant="default" className="ml-auto">
            <Search className="w-4 h-4 mr-2" />
            Search Location
          </Button>
        </div>

        {/* Hero Weather Card */}
        <Card className="mb-8 overflow-hidden relative h-[320px]">
          <img
            src="https://images.unsplash.com/photo-1601134467661-3d775b999c8b"
            alt="Sunny sky"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          <div className="relative h-full flex items-center px-12">
            <div>
              <h2 className="text-5xl font-bold text-white mb-2">Sunny, 22°C in Willow Creek Farm</h2>
              <p className="text-white/90 text-lg">Perfect weather for field work today</p>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Current Conditions */}
          <Card className="lg:col-span-1 p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Current Conditions</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Temperature</p>
                <p className="text-3xl font-bold text-foreground">22°C</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Humidity</p>
                <p className="text-3xl font-bold text-foreground">68%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Wind</p>
                <p className="text-xl font-bold text-foreground">12 km/h E</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Precipitation</p>
                <p className="text-xl font-bold text-foreground">5%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Soil Moisture</p>
                <p className="text-xl font-bold text-foreground">42%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">UV Index</p>
                <p className="text-xl font-bold text-foreground">High</p>
              </div>
            </div>
          </Card>

          {/* 7-Day Forecast */}
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">7-Day Forecast</h3>
            <div className="grid grid-cols-7 gap-3">
              {forecastDays.map((day, index) => {
                const Icon = day.icon;
                return (
                  <div key={index} className="text-center p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                    <p className="font-semibold text-foreground mb-2">{day.day}</p>
                    <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-lg font-bold text-foreground">{day.high}°</p>
                    <p className="text-sm text-muted-foreground">{day.low}°</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Historical Rainfall */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Historical Rainfall (mm)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rainfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Legend />
                <Bar dataKey="thisYear" fill="hsl(var(--primary))" name="This Year" radius={[8, 8, 0, 0]} />
                <Bar dataKey="average" fill="hsl(var(--muted))" name="5-Year Average" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Agricultural Advisory */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Agricultural Advisory</h3>
            <div className="space-y-4">
              {advisories.map((advisory, index) => (
                <div key={index} className="p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                  <div className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">{advisory.icon}</span>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{advisory.title}</h4>
                      <p className="text-sm text-muted-foreground">{advisory.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Weather;
