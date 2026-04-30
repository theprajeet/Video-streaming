import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../redux/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaImage, FaTimes } from "react-icons/fa";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    profileImage: null,
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.gender) newErrors.gender = "Gender is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file && file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }
      setFormData((prev) => ({ ...prev, profileImage: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: null }));
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    const signupData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) signupData.append(key, value);
    });

    try {
      await dispatch(signupUser(signupData)).unwrap();
      toast.success("Account created successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        gender: "",
        profileImage: null,
      });
      setPreview(null);
      navigate("/login");
    } catch (err) {
      toast.error(err || "Failed to create account");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020202] p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative bg-zinc-950/80 backdrop-blur-2xl border border-zinc-800 rounded-3xl shadow-2xl max-w-lg w-full p-8 sm:p-10"
      >
        <h2 className="text-xl md:text-3xl font-extrabold text-center text-zinc-100 mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            error={errors.name}
            icon={<FaUser />}
          />
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

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full p-3 rounded-2xl bg-zinc-900 border ${
                errors.gender ? 'border-red-400' : 'border-white/20'
              } text-gray-100 focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 transition-all`}
            >
              <option value="" className="bg-gray-900 text-gray-300">
                Select Gender
              </option>
              <option value="male" className="bg-gray-900 text-gray-300">
                Male
              </option>
              <option value="female" className="bg-gray-900 text-gray-300">
                Female
              </option>
              <option value="other" className="bg-gray-900 text-gray-300">
                Other
              </option>
            </select>
            {errors.gender && (
              <p className="text-red-400 text-xs mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Profile Picture
            </label>
            <div className="relative">
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                id="profileImage"
              />
              <label
                htmlFor="profileImage"
                className="flex items-center gap-2 p-3 rounded-2xl bg-zinc-900 border border-white/20 text-gray-200 hover:bg-zinc-800 cursor-pointer transition-all"
              >
                <FaImage />
                <span>
                  {formData.profileImage ? 'Change Image' : 'Upload Image'}
                </span>
              </label>
            </div>
            {preview && (
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={preview}
                  alt="Profile preview"
                  className="w-16 h-16 rounded-full object-cover border border-white/20"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <FaTimes /> Remove
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-zinc-800 text-gray-100 font-bold shadow-lg hover:bg-zinc-700 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                Signing Up...
              </span>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-zinc-300 font-semibold hover:text-white hover:underline"
          >
            Login here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Input Component
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

export default Signup;
