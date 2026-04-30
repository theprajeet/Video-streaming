import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginLoading} = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      await dispatch(loginUser(formData)).unwrap();
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      const errorMessage = err || "Failed to log in";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020202] p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-zinc-950/80 backdrop-blur-2xl border border-zinc-800 rounded-3xl shadow-2xl max-w-lg w-full p-8 sm:p-10"
      >
        <h2 className="text-xl md:text-3xl  font-extrabold text-center text-zinc-100 mb-6">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            error={errors.email}
            icon={<FaEnvelope />}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••"
            error={errors.password}
            icon={<FaLock />}
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loginLoading}
            className="w-full py-3 rounded-2xl bg-zinc-800 text-gray-100 font-bold shadow-lg hover:bg-zinc-700 transition-all disabled:opacity-50"
          >
            {loginLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                Logging In...
              </span>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-zinc-300 font-semibold hover:text-white hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

const Input = ({ label, type = "text", error, icon, ...props }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-200 mb-2">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
        {icon}
      </span>
      <input
        type={type}
        {...props}
        className={`w-full p-3 pl-10 rounded-2xl bg-zinc-900 border ${
          error ? "border-red-400" : "border-white/20"
        } text-gray-100 focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 placeholder-gray-500 transition-all`}
      />
    </div>
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

export default Login;
