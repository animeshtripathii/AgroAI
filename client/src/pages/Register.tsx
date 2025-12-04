import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wheat, Eye, EyeOff } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";

const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(location.pathname === "/login");
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        city: "",
        state: "",
        password: "",
    });

    useEffect(() => {
        setIsLogin(location.pathname === "/login");
    }, [location.pathname]);

    const toggleMode = () => {
        const newPath = isLogin ? "/register" : "/login";
        navigate(newPath);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const { data } = await api.post("/auth/login", {
                    email: formData.email,
                    password: formData.password,
                });
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));
                toast.success("Login successful!");
                navigate("/dashboard");
            } else {
                const { data } = await api.post("/auth/register", formData);
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));
                toast.success("Registration successful!");
                navigate("/dashboard");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
            <div className="relative w-full max-w-[1000px] min-h-[600px] bg-card rounded-2xl shadow-2xl overflow-hidden flex">

                {/* Sign Up Form Container (Left Side) */}
                <div className="w-1/2 h-full absolute left-0 top-0 flex items-center justify-center p-12">
                    <motion.div
                        initial={false}
                        animate={{
                            x: isLogin ? -50 : 0,
                            opacity: isLogin ? 0 : 1,
                            zIndex: isLogin ? 0 : 10
                        }}
                        className="w-full max-w-sm space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
                            <p className="text-muted-foreground mt-2">Join us for smarter farming</p>
                        </div>

                        <form className="space-y-4" onSubmit={handleAuth}>
                            <div className="space-y-2">
                                <Input
                                    name="name"
                                    placeholder="Full Name"
                                    className="h-11 bg-muted/50"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required={!isLogin}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    name="email"
                                    placeholder="Email"
                                    type="email"
                                    className="h-11 bg-muted/50"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Input
                                        name="city"
                                        placeholder="City"
                                        className="h-11 bg-muted/50"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required={!isLogin}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        name="state"
                                        placeholder="State"
                                        className="h-11 bg-muted/50"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Input
                                        name="password"
                                        placeholder="Password"
                                        type={showPassword ? "text" : "password"}
                                        className="h-11 bg-muted/50 pr-10"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <Button className="w-full h-11 text-base mt-2" size="lg" type="submit">Sign Up</Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <Button variant="outline" className="w-full" type="button">Google</Button>
                        </div>
                    </motion.div>
                </div>

                {/* Login Form Container (Right Side) */}
                <div className="w-1/2 h-full absolute right-0 top-0 flex items-center justify-center p-12">
                    <motion.div
                        initial={false}
                        animate={{
                            x: isLogin ? 0 : 50,
                            opacity: isLogin ? 1 : 0,
                            zIndex: isLogin ? 10 : 0
                        }}
                        className="w-full max-w-sm space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
                            <p className="text-muted-foreground mt-2">Log in to your account</p>
                        </div>

                        <form className="space-y-4" onSubmit={handleAuth}>
                            <div className="space-y-2">
                                <Input
                                    name="email"
                                    placeholder="Email"
                                    type="email"
                                    className="h-11 bg-muted/50"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Input
                                        name="password"
                                        placeholder="Password"
                                        type={showPassword ? "text" : "password"}
                                        className="h-11 bg-muted/50 pr-10"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <a href="#" className="text-sm text-primary hover:underline">Forgot Password?</a>
                            </div>
                            <Button className="w-full h-11 text-base mt-2" size="lg" type="submit">Log In</Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <Button variant="outline" className="w-full" type="button">Google</Button>
                        </div>
                    </motion.div>
                </div>

                {/* Overlay Container (The Sliding Part) */}
                <motion.div
                    initial={false}
                    animate={{ x: isLogin ? "0%" : "100%" }}
                    className="absolute left-0 top-0 w-1/2 h-full z-20 overflow-hidden"
                >
                    {/* Inner Container for Image (Moves opposite to parent to keep image static relative to screen) */}
                    <motion.div
                        animate={{ x: isLogin ? "0%" : "-50%" }}
                        className="relative h-full w-[200%] flex"
                    >
                        {/* Login Overlay Content (Visible when Overlay is on Left - prompting Sign Up) */}
                        <div className="w-1/2 h-full relative flex items-center justify-center text-white p-12">
                            <div className="absolute inset-0 bg-black/40 z-0" />
                            <img
                                src="https://images.unsplash.com/photo-1560493676-04071c5f467b"
                                className="absolute inset-0 w-full h-full object-cover z-[-1]"
                                alt="Farm field"
                            />

                            <div className="relative z-10 text-center space-y-6">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                                    <Wheat className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-4xl font-bold">New Here?</h2>
                                <p className="text-lg text-white/90 max-w-xs mx-auto">
                                    Sign up and discover a smarter way to manage your farm with AI insights.
                                </p>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="mt-8 w-40 bg-white text-primary hover:bg-white/90 border-none"
                                    onClick={toggleMode}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </div>

                        {/* Register Overlay Content (Visible when Overlay is on Right - prompting Login) */}
                        <div className="w-1/2 h-full relative flex items-center justify-center text-white p-12">
                            <div className="absolute inset-0 bg-black/40 z-0" />
                            <img
                                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d"
                                className="absolute inset-0 w-full h-full object-cover z-[-1]"
                                alt="Farmer tablet"
                            />

                            <div className="relative z-10 text-center space-y-6">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                                    <Wheat className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-4xl font-bold">Welcome Back!</h2>
                                <p className="text-lg text-white/90 max-w-xs mx-auto">
                                    To keep connected with us please login with your personal info.
                                </p>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="mt-8 w-40 bg-white text-primary hover:bg-white/90 border-none"
                                    onClick={toggleMode}
                                >
                                    Log In
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

            </div>
        </div>
    );
};

export default Register;
