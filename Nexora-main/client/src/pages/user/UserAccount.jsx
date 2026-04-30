import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { deleteUser } from "../../redux/slices/userSlice";
import {
  FiUser,
  FiMail,
  FiUserCheck,
  FiTrash2,
  FiEdit3,
  FiUpload,
  FiBarChart2,
  FiZap,
} from "react-icons/fi";

const UserAccount = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser, error } = useSelector((state) => state.user);

    const handleDeleteAccount = async () => {
        if (
            !window.confirm(
                "Are you sure you want to delete your account? This action cannot be undone."
            )
        ) {
            return;
        }
        try {
            await dispatch(deleteUser()).unwrap();
            toast.success("Account deleted successfully!");
            navigate("/login");
        } catch (err) {
            toast.error(err || "Failed to delete account");
        }
    };

    const handleUpdateProfile = () => {
        navigate(`/update-profile/${currentUser.id}`);
    };

    const handleCreateProduct = () => {
        navigate("/upload-video");
    };

    const handleDashboard = () => {
        navigate("/creator/dashboard");
    };

    const handleUpgradeSeller = () => {
        navigate("/become-creator");
    };

    if (!currentUser) {
        return (
            <div className="text-center py-12 text-lg font-medium text-gray-400">
                No user data available. Please log in.
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex items-center justify-center bg-[#030303] pt-6 pb-16 px-4 sm:px-6 sm:pb-10 lg:px-8"
        >
            <div className="max-w-3xl w-full space-y-8 bg-zinc-950 py-12 p-10 rounded-3xl shadow-2xl border border-zinc-800">
                {/* Profile Header */}
                <div className="flex flex-col items-center space-y-4">
                    {currentUser.profileImage ? (
                        <img
                            src={currentUser.profileImage}
                            alt="Profile"
                            className="h-28 w-28 rounded-full object-cover shadow-md border-2 border-zinc-600"
                        />
                    ) : (
                        <FiUser className="h-28 w-28 text-gray-500" />
                    )}
                    <h2 className="text-2xl font-bold text-white">
                        {currentUser.name || "Unnamed User"}
                    </h2>
                    <p className="text-gray-400 text-sm">Manage your profile</p>
                </div>

                {/* User Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-zinc-900 p-4 rounded-2xl shadow-sm flex items-center gap-3 border border-zinc-800">
                        <FiMail className="text-zinc-300 text-xl" />
                        <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium text-gray-200">
                                {currentUser.email || "Not set"}
                            </p>
                        </div>
                    </div>

                    <div className="bg-zinc-900 p-4 rounded-2xl shadow-sm flex items-center gap-3 border border-zinc-800">
                        <FiUserCheck className="text-zinc-300 text-xl" />
                        <div>
                            <p className="text-xs text-gray-500">Gender</p>
                            <p className="text-sm font-medium text-gray-200">
                                {currentUser.gender || "Not set"}
                            </p>
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    <button
                        onClick={handleUpdateProfile}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-800 border border-zinc-600 text-white font-semibold shadow-md hover:bg-zinc-700 transition"
                    >
                        <FiEdit3 /> Update Profile
                    </button>

                    {currentUser.role === "creator" ? (
                        <>
                            <button
                                onClick={handleCreateProduct}
                                className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-800 border border-zinc-600 text-white font-semibold shadow-md hover:bg-zinc-700 transition"
                            >
                                <FiUpload /> Upload Video
                            </button>

                            <button
                                onClick={handleDashboard}
                                className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-800 border border-zinc-600 text-white font-semibold shadow-md hover:bg-zinc-700 transition"
                            >
                                <FiBarChart2 /> Dashboard
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleUpgradeSeller}
                            className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-800 border border-zinc-600 text-white font-semibold shadow-md hover:bg-zinc-700 transition"
                        >
                            <FiZap /> Become Creator
                        </button>
                    )}

                    <button
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-700 text-red-300 font-semibold shadow-md hover:bg-zinc-800 transition"
                    >
                        <FiTrash2 /> Delete Account
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default UserAccount;
