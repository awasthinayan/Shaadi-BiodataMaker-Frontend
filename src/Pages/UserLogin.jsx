import { useLogin } from "../Hooks/UseAuth";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
    const navigate = useNavigate();
    const { mutate, isPending, isError, error } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
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
                // ✅ SAVE BOTH TOKEN AND USER DATA
                const token = response.data.token;
                const user = response.data.user;
                
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                
                alert("Login Successful ❤️");
                navigate("/dashboard");
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-purple-100 p-4">

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl p-8"
            >

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome Back 👋
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Login to your Shaadi Biodata Builder
                    </p>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="mail@abc.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 outline-none hover:border-pink-400"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Password
                        </label>

                        <div className="relative mt-1">

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="********"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 transition-all duration-300 outline-none hover:border-pink-400"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink-600 transition cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>

                        </div>
                    </div>

                    {/* Button */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={isPending}
                        className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50 flex justify-center items-center cursor-pointer"
                    >
                        {isPending ? (
                            <>
                                <svg
                                    className="animate-spin mr-2 h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0"
                                    />
                                </svg>
                                Logging In...
                            </>
                        ) : (
                            "Login"
                        )}
                    </motion.button>

                </form>

                {/* Error */}
                {isError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                        <p className="text-sm text-red-600 text-center">
                            {error?.response?.data?.message || "Something went wrong"}
                        </p>
                    </motion.div>
                )}

            </motion.div>
        </div>
    );
};

export default Login;