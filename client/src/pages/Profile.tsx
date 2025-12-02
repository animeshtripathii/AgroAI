import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/services/api";
import Navbar from "@/components/Navbar";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ name: string; email: string; image?: string } | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        image: "",
        password: "",
        confirmPassword: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setFormData((prev) => ({
                ...prev,
                name: parsedUser.name || "",
                email: parsedUser.email || "",
                image: parsedUser.image || "",
            }));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("email", formData.email);
            if (formData.password) {
                data.append("password", formData.password);
            }
            if (selectedFile) {
                data.append("image", selectedFile);
            } else if (formData.image) {
                data.append("imageUrl", formData.image);
            }

            const response = await api.put("/auth/profile", data);

            localStorage.setItem("user", JSON.stringify(response.data));
            localStorage.setItem("token", response.data.token);
            setUser(response.data);
            toast.success("Profile updated successfully");
            setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
            setSelectedFile(null);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-md mx-auto p-6">
                    <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>

                    <div className="flex justify-center mb-6">
                        {selectedFile ? (
                            <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Profile Preview"
                                className="w-24 h-24 rounded-full object-cover border-4 border-primary/10"
                            />
                        ) : user.image ? (
                            <img
                                src={user.image}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-primary/10"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary border-4 border-primary/10">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="file">Profile Image</Label>
                            <Input
                                id="file"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Or Image URL</Label>
                            <Input
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="Enter image URL"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave blank to keep current"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Update Profile
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
