import { useRegister } from "../Hooks/UseAuth";
import { useNavigate } from "react-router";
import { useState } from "react";

const Register = () => {
    const navigate = useNavigate();
    const { mutate, isPending, isError, error } = useRegister();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        mutate(formData, {
            onSuccess: (response) => {
                console.log("User Registered:", response.data);
                alert("Registration Successful ❤️");
                navigate("/login");
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80')" }}>
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="text-zinc-200 text-center px-8">
                        <h2 className="text-4xl font-bold mb-4">Welcome to Shaadi-Biodata</h2>
                        <p className="text-lg">Create your perfect marriage biodata in minutes</p>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.4s ease-out forwards;
                    }
                `}</style>

                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Sign up</h1>
                        <p className="text-gray-600 mt-2">Start your 30-day free trial.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200 outline-none"
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200 outline-none"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters.</p>
                        </div>

                        {/* Get Started Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-2.5 px-4 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:cursor-pointer"
                        >
                            {isPending ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Please wait...
                                </>
                            ) : (
                                "Get started"
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or</span>
                            </div>
                        </div>

                        
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Already have an account?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="text-pink-600 hover:underline font-medium cursor-pointer"
                        >
                            Log in
                        </button>
                    </p>

                    {/* Footer */}
                    <div className="text-center text-xs text-gray-500 mt-8 pt-6 border-t border-gray-200">
                        <p>Shaadi@Biodata</p>
                        <a
                            href="mailto:info@inityagency"
                            className="text-gray-400 hover:text-pink-600 transition"
                        >
                            @All rights reserved
                        </a>
                    </div>

                    {/* Error Message */}
                    {isError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 text-center">
                                {error?.response?.data?.message || "Something went wrong"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;