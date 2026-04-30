import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTopVideosThunk } from "../../redux/slices/videoSlice";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiHeart, FiEye, FiMessageSquare } from "react-icons/fi";

const TopVideos = () => {
  const dispatch = useDispatch();
  const { topVideos, topByLikes, topByViews, topByComments, loading, error } =
    useSelector((state) => state.video);



  useEffect(() => {
    dispatch(getTopVideosThunk());
  }, [dispatch]);

  if (loading)
    return (
      <div className="text-center text-gray-400 mt-10">Loading videos...</div>
    );
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  const sections = [
    { title: "Top Videos", data: topVideos },
    { title: "Most Liked", data: topByLikes },
    { title: "Most Viewed", data: topByViews },
    { title: "Most Commented", data: topByComments },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white px-6 py-10">
     

      {sections.map(
        (section, index) =>
          section.data?.length > 0 && (
            <div key={index} className="mb-14">
              {/* Section Title */}
              <h2 className="text-2xl font-semibold mb-6 border-l-4 border-zinc-600 pl-3">
                {section.title}
              </h2>

              {/* Video Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {section.data.map((video) => (
                  <motion.div
                    key={video._id}
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-md hover:shadow-2xl hover:border-zinc-600 transition-all duration-300 cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <Link to={`/video/${video._id}`}>
                      <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Video Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-white line-clamp-2 hover:text-zinc-300 transition-colors">
                        {video.title}
                      </h3>

                      {/* Creator */}
                      <div className="flex items-center gap-3 mb-4">
                        <Link to={`/creator/${video.uploadedBy?._id}`}>
                          <img
                            src={video.uploadedBy?.profileImage}
                            alt={video.uploadedBy?.name}
                            className="w-8 h-8 rounded-full border border-gray-700"
                          />
                        </Link>
                        <span className="text-sm text-gray-300 truncate">
                          {video.uploadedBy?.name}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex justify-between text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <FiHeart className="text-zinc-300" />{" "}
                          {video.likesCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiEye className="text-zinc-300" /> {video.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiMessageSquare className="text-zinc-300" />{" "}
                          {video.commentsCount}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default TopVideos;
