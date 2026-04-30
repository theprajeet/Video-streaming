import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FiThumbsUp } from "react-icons/fi";
import { toggleLike } from "../../redux/slices/videoSlice";

const LikeBtn = () => {
  const dispatch = useDispatch();
  const { loading, currentVideo } = useSelector((state) => state.video);
  const { currentUser } = useSelector((state) => state.user);

   // Local state for optimistic updates
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [localLoading, setLocalLoading] = useState(false);


 // Initialize local state from Redux
  useEffect(() => {
    if (currentVideo && currentUser) {
      const isLiked = currentVideo.likes?.includes(currentUser.id);
      setLiked(isLiked);
      setLikesCount(currentVideo.likes?.length || 0);
    }
  }, [currentVideo, currentUser]);


const handleLike = async () => {
    if (!currentUser) return toast.error("Please log in to like videos.");
    if (!currentVideo) return toast.error("Video not found.");

    // Save previous state in case API fails
    const wasLiked = liked;

    // Optimistic UI update
    setLiked(!liked);
    setLikesCount((prev) => prev + (liked ? -1 : 1));
    setLocalLoading(true);

    try {
      await dispatch(toggleLike(currentVideo._id)).unwrap();
    } catch (error) {
      // Revert on failure
      setLiked(wasLiked);
      setLikesCount((prev) => prev + (wasLiked ? 1 : -1));
      toast.error(error?.message || "Failed to toggle like.");
    } finally {
      setLocalLoading(false);
    }
  };

  if (!currentVideo || !currentUser) return null;




return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleLike}
      disabled={localLoading || loading}
      className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors duration-200 ${
        liked ? "bg-zinc-700 text-white" : "bg-zinc-900 text-gray-300 hover:bg-zinc-800"
      } ${localLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-label={liked ? "Unlike video" : "Like video"}
    >
      <FiThumbsUp className={`text-lg ${liked ? "opacity-100" : "opacity-85"}`} />
      <span className="font-medium">{likesCount}</span>
    </motion.button>
  );

 
};

export default LikeBtn;
