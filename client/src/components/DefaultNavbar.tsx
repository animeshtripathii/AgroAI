import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wheat, Menu, Sprout } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

import { useEffect, useState } from "react";

const DefaultNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/");
    };

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Crop Recommender", path: "/crop-recommender" },
        { name: "Fertilizer", path: "/fertilizer-prediction" },

        { name: "Weather", path: "/weather" },
    ];

    return (
        <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Wheat className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">AgroAI</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === item.path
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        {isLoggedIn ? (
                            <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:inline-flex">
                                Logout
                            </Button>
                        ) : (
                            <div className="hidden md:flex items-center gap-3">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">
                                        Log In
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button - Implemented with Sheet */}
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="-mr-2">
                                        <Menu className="h-5 w-5" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="flex flex-col gap-6 pt-12">
                                    <SheetHeader>
                                        <SheetTitle className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                                <Wheat className="w-5 h-5 text-primary-foreground" />
                                            </div>
                                            <span className="text-xl font-bold text-foreground">AgroAI</span>
                                        </SheetTitle>
                                        <SheetDescription className="sr-only">
                                            Mobile navigation menu
                                        </SheetDescription>
                                    </SheetHeader>

                                    <div className="flex flex-col gap-3">
                                        {navItems.map((item) => (
                                            <SheetClose asChild key={item.path}>
                                                <Link
                                                    to={item.path}
                                                    className={`text-lg font-medium transition-colors py-2 ${location.pathname === item.path
                                                        ? "text-primary"
                                                        : "text-muted-foreground hover:text-primary"
                                                        }`}
                                                >
                                                    {item.name}
                                                </Link>
                                            </SheetClose>
                                        ))}
                                    </div>

                                    <div className="mt-auto border-t pt-6 flex flex-col gap-3">
                                        {isLoggedIn ? (
                                            <SheetClose asChild>
                                                <Button size="lg" onClick={handleLogout} className="w-full">
                                                    Logout
                                                </Button>
                                            </SheetClose>
                                        ) : (
                                            <>
                                                <SheetClose asChild>
                                                    <Link to="/login">
                                                        <Button variant="ghost" size="lg" className="w-full justify-start">
                                                            Log In
                                                        </Button>
                                                    </Link>
                                                </SheetClose>
                                                <SheetClose asChild>
                                                    <Link to="/register">
                                                        <Button size="lg" className="w-full">
                                                            Get Started
                                                        </Button>
                                                    </Link>
                                                </SheetClose>
                                            </>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DefaultNavbar;
