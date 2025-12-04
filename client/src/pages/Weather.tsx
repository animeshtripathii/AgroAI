import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Search, Sun, CloudRain, Cloud, CloudDrizzle, Loader2, Wind, Droplets, Thermometer, Navigation } from "lucide-react";
import Navbar from "@/components/Navbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

// Types for API response
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
}

interface ForecastItem {
  dt: number;
  main: {
    temp_min: number;
    temp_max: number;
  };
  weather: {
    main: string;
    icon: string;
  }[];
  dt_txt: string;
}

const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    // Initial load: Try geolocation, fallback to Moscow
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
        (err) => {
          console.warn("Location access denied or failed. Falling back to default location.", err);
          fetchWeatherData({ cityId: 524901 });
        }
      );
    } else {
      console.warn("Geolocation not supported. Falling back to default location.");
      fetchWeatherData({ cityId: 524901 });
    }
  }, []);

  const fetchWeatherData = async (params: { lat?: number; lon?: number; cityId?: number; city?: string }) => {
    try {
      setLoading(true);
      setError(null);

      let weatherUrl = "";
      let forecastUrl = "";

      if (params.city) {
        weatherUrl = `${import.meta.env.VITE_OPENWEATHER_API_URL}/weather?q=${params.city}&appid=${API_KEY}&units=metric`;
        forecastUrl = `${import.meta.env.VITE_OPENWEATHER_API_URL}/forecast?q=${params.city}&appid=${API_KEY}&units=metric`;
      } else if (params.lat && params.lon) {
        weatherUrl = `${import.meta.env.VITE_OPENWEATHER_API_URL}/weather?lat=${params.lat}&lon=${params.lon}&appid=${API_KEY}&units=metric`;
        forecastUrl = `${import.meta.env.VITE_OPENWEATHER_API_URL}/forecast?lat=${params.lat}&lon=${params.lon}&appid=${API_KEY}&units=metric`;
      } else if (params.cityId) {
        weatherUrl = `${import.meta.env.VITE_OPENWEATHER_API_URL}/weather?id=${params.cityId}&appid=${API_KEY}&units=metric`;
        forecastUrl = `${import.meta.env.VITE_OPENWEATHER_API_URL}/forecast?id=${params.cityId}&appid=${API_KEY}&units=metric`;
      } else {
        throw new Error("Invalid parameters for weather fetch");
      }

      // Fetch Current Weather
      const weatherRes = await axios.get(weatherUrl);
      setWeather(weatherRes.data);

      // Fetch Forecast
      const forecastRes = await axios.get(forecastUrl);

      // Process forecast to get daily data (API returns 3-hour intervals)
      // We'll take one reading per day (e.g., at 12:00 PM) for the next 5 days
      const dailyForecast = forecastRes.data.list.filter((reading: ForecastItem) =>
        reading.dt_txt.includes("12:00:00")
      );
      setForecast(dailyForecast);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather data. Please check the city name.");
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeatherData({ city: searchQuery });
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear": return Sun;
      case "clouds": return Cloud;
      case "rain": return CloudRain;
      case "drizzle": return CloudDrizzle;
      default: return Sun;
    }
  };

  // Prepare chart data from forecast
  const chartData = forecast.map(item => ({
    day: format(new Date(item.dt * 1000), "EEE"), // Mon, Tue, etc.
    temp: Math.round(item.main.temp),
    humidity: item.main.humidity
  }));

  const advisories = [
    {
      title: "Weather Impact",
      desc: "Monitor local weather conditions closely for sudden changes in temperature or precipitation.",
      icon: "🌤️"
    },
    {
      title: "Crop Care",
      desc: "Ensure crops receive adequate irrigation based on soil moisture levels and upcoming rain.",
      icon: "🌱"
    },
    {
      title: "Pest & Disease Control",
      desc: "Regularly inspect crops for signs of pests or disease, especially after humidity changes.",
      icon: "🔍"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-[calc(100vh-100px)]">
          <p className="text-xl text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold text-foreground mb-2">Weather Insights</h1>
        <p className="text-muted-foreground mb-8">
          Detailed weather information for informed farming decisions.
        </p>

        {/* Location and Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium">{weather?.name || "Unknown Location"}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium">{format(new Date(), "MMMM do, yyyy")}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder="Search city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64"
              />
              <Button type="submit" variant="default">
                <Search className="w-4 h-4" />
              </Button>
            </form>
            <Button
              variant="outline"
              size="icon"
              title="Use Current Location"
              onClick={() => {
                setLoading(true);
                navigator.geolocation.getCurrentPosition((position) => {
                  fetchWeatherData({ lat: position.coords.latitude, lon: position.coords.longitude });
                });
              }}
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Hero Weather Card */}
        <Card className="mb-8 overflow-hidden relative h-[320px]">
          <img
            src="https://images.unsplash.com/photo-1601134467661-3d775b999c8b"
            alt="Weather background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          <div className="relative h-full flex items-center px-12">
            <div>
              <h2 className="text-5xl font-bold text-white mb-2">
                {weather?.weather[0].main}, {Math.round(weather?.main.temp || 0)}°C in {weather?.name}
              </h2>
              <p className="text-white/90 text-lg capitalize">{weather?.weather[0].description}</p>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Current Conditions */}
          <Card className="lg:col-span-1 p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Current Conditions</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1"><Thermometer className="w-3 h-3" /> Temperature</p>
                <p className="text-3xl font-bold text-foreground">{Math.round(weather?.main.temp || 0)}°C</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1"><Droplets className="w-3 h-3" /> Humidity</p>
                <p className="text-3xl font-bold text-foreground">{weather?.main.humidity}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1"><Wind className="w-3 h-3" /> Wind</p>
                <p className="text-xl font-bold text-foreground">{weather?.wind.speed} m/s</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pressure</p>
                <p className="text-xl font-bold text-foreground">{weather?.main.pressure} hPa</p>
              </div>
              {/* These are not in standard free API, keeping placeholders or calculating if possible, but for now hardcoded/mocked or removed if strictly real data needed. 
                  Let's keep them as "N/A" or mock values if we want to preserve layout, but user asked for real data. 
                  I will hide them or show N/A to be accurate to "fetch data". 
                  Actually, the prompt implies "fetch data... and show it". It doesn't say remove other things. 
                  I'll keep the layout but maybe mark them as estimated or just leave the hardcoded ones as "Historical/Sensor" data which is plausible for a farm app.
                  Wait, I should probably replace them with available data if possible or remove them to avoid confusion.
                  I'll replace "Precipitation" with "Cloudiness" which is available.
                  Soil Moisture is definitely not available.
              */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cloudiness</p>
                <p className="text-xl font-bold text-foreground">{weather?.weather[0].description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Visibility</p>
                <p className="text-xl font-bold text-foreground">{weather ? (weather as any).visibility / 1000 : 0} km</p>
              </div>
            </div>
          </Card>

          {/* Forecast */}
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">5-Day Forecast</h3>
            <div className="grid grid-cols-5 gap-3">
              {forecast.map((day, index) => {
                const Icon = getWeatherIcon(day.weather[0].main);
                return (
                  <div key={index} className="text-center p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                    <p className="font-semibold text-foreground mb-2">{format(new Date(day.dt * 1000), "EEE")}</p>
                    <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-lg font-bold text-foreground">{Math.round(day.main.temp_max)}°</p>
                    <p className="text-sm text-muted-foreground">{Math.round(day.main.temp_min)}°</p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{day.weather[0].main}</p>
                  </div>
                );
              })}
              {forecast.length === 0 && <p>No forecast data available.</p>}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 5-Day Forecast Trends Graph */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">5-Day Temperature Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Legend />
                <Bar dataKey="temp" fill="hsl(var(--primary))" name="Temperature (°C)" radius={[8, 8, 0, 0]} />
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
