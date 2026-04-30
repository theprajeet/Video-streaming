import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserPlaylists,
  deletePlaylist,
  updatePlaylist,
} from "../../redux/slices/playlistSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { FiUsers, FiList, FiBookmark, FiThumbsUp } from "react-icons/fi";

import AllSubscriptions from "../subscribe/AllSubscriptions";
import UserLikedVideos from "../user/UserLikedVideos";
import UserSavedVideos from "../user/UserSavedVideos";

const MyLibrary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { playlists, loading, error } = useSelector((state) => state.playlist);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editThumbnail, setEditThumbnail] = useState(null);
  const [activeSection, setActiveSection] = useState("playlists");

  useEffect(() => {
    dispatch(getUserPlaylists());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      dispatch(deletePlaylist(id))
        .unwrap()
        .then(() => toast.success("Playlist deleted successfully"))
        .catch(() => toast.error("Failed to delete playlist"));
    }
  };

  const handleEdit = (playlist) => {
    setEditingId(playlist._id);
    setEditName(playlist.title);
    setEditDescription(playlist.description || "");
    setEditThumbnail(null);
  };

  const handleUpdate = async (id) => {
  try {
    const formData = new FormData();
    formData.append("title", editName);
    formData.append("description", editDescription);

    // Only append if user selected a new thumbnail
    if (editThumbnail) {
      formData.append("thumbnail", editThumbnail);
    }

    await dispatch(updatePlaylist({ id, formData })).unwrap();
    toast.success("Playlist updated successfully");
    setEditingId(null);
    setEditThumbnail(null);
  } catch (err) {
    toast.error(err?.message || "Failed to update playlist");
  }
};


  if (loading)
    return (
      <p className="text-center mt-6 text-gray-300">Loading playlists...</p>
    );
  if (error) return <p className="text-red-400 text-center mt-6">{error}</p>;

  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 px-6 pt-6 pb-20">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-center">
        {/* Go Back Button */}
        <div className="w-full md:w-auto mb-4 md:mb-0 flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition px-2 py-1"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>

        {/* Title and Create Playlist */}
        <div className="w-full md:w-auto flex  md:flex-row justify-center items-center gap-4">
          <h1 className="text-3xl pb-2 font-bold text-center text-white">
            My Library
          </h1>
          <button
            onClick={() => navigate("/create-playlist")}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white px-4 py-2 rounded-2xl shadow-md font-medium transition-transform transform hover:-translate-y-1"
          >
            + Create Playlist
          </button>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveSection("subscriptions")}
          className={`flex items-center justify-center px-6 py-2 rounded-2xl font-medium transition border ${
            activeSection === "subscriptions"
              ? "bg-zinc-800 border-zinc-600 text-white shadow-lg hover:bg-zinc-700"
              : "bg-zinc-900 border-zinc-800 text-gray-300 hover:bg-zinc-800"
          }`}
        >
          {/* Mobile icon */}
          <FiUsers className="md:hidden mr-2" />
          <span className="hidden md:inline"> Creators</span>
        </button>
        <button
          onClick={() => setActiveSection("Liked")}
          className={`flex items-center justify-center px-6 py-2 rounded-2xl font-medium transition border ${
            activeSection === "Liked"
              ? "bg-zinc-800 border-zinc-600 text-white shadow-lg hover:bg-zinc-700"
              : "bg-zinc-900 border-zinc-800 text-gray-300 hover:bg-zinc-800"
          }`}
        >
          {/* Mobile icon */}
          <FiThumbsUp className="md:hidden mr-2" />
          <span className="hidden md:inline">Liked</span>
        </button>
        <button
          onClick={() => setActiveSection("Saved")}
          className={`flex items-center justify-center px-6 py-2 rounded-2xl font-medium transition border ${
            activeSection === "Saved"
              ? "bg-zinc-800 border-zinc-600 text-white shadow-lg hover:bg-zinc-700"
              : "bg-zinc-900 border-zinc-800 text-gray-300 hover:bg-zinc-800"
          }`}
        >
          {/* Mobile icon */}
          <FiBookmark className="md:hidden mr-2" />
          <span className="hidden md:inline">Saved</span>
        </button>

        <button
          onClick={() => setActiveSection("playlists")}
          className={`flex items-center justify-center px-6 py-2 rounded-2xl font-medium transition border ${
            activeSection === "playlists"
              ? "bg-zinc-800 border-zinc-600 text-white shadow-lg hover:bg-zinc-700"
              : "bg-zinc-900 border-zinc-800 text-gray-300 hover:bg-zinc-800"
          }`}
        >
          {/* Mobile icon */}
          <FiList className="md:hidden mr-2" />
          <span className="hidden md:inline"> Playlists</span>
        </button>
      </div>

      {/* Conditional Sections */}
      {activeSection === "subscriptions" && (
        <div>
          <AllSubscriptions />
        </div>
      )}
      {activeSection === "Saved" && (
        <div>
          <UserSavedVideos />
        </div>
      )}
      {activeSection === "Liked" && (
        <div>
          <UserLikedVideos />
        </div>
      )}

      {activeSection === "playlists" && (
        <div>
          {playlists.length === 0 ? (
            <p className="text-gray-400 text-center">
              You have no playlists yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {playlists.map((playlist) => (
                <div
                  key={playlist._id}
                  className="bg-zinc-950 border border-zinc-800 rounded-3xl shadow-lg p-4 hover:border-zinc-600 transition-all duration-300"
                >
                  {editingId === playlist._id ? (
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <textarea
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditThumbnail(e.target.files[0])}
                        className="text-sm text-gray-400"
                      />
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => handleUpdate(playlist._id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white px-4 py-2 rounded-2xl transition"
                        >
                          <FaSave /> Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 text-white px-4 py-2 rounded-2xl transition"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {playlist.thumbnailUrl ? (
                        <Link to={`/playlist/${playlist._id}`}>
                          <img
                            src={playlist.thumbnailUrl}
                            alt={playlist.title}
                            className="w-full h-44 object-cover rounded-2xl mb-4 hover:opacity-90 transition"
                          />
                        </Link>
                      ) : (
                        <div className="w-full h-44 bg-zinc-900 rounded-2xl mb-4 flex items-center justify-center text-gray-500 text-sm">
                          No Thumbnail
                        </div>
                      )}

                      <div>
                        <Link
                          to={`/playlist/${playlist._id}`}
                          className="text-lg font-semibold text-zinc-200 hover:text-white hover:underline line-clamp-2"
                        >
                          {playlist.title}
                        </Link>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {playlist.description || "No description"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {playlist.videos?.length || 0} videos
                        </p>
                      </div>

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleEdit(playlist)}
                          className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white px-3 py-2 rounded-2xl transition"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(playlist._id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-red-300 px-3 py-2 rounded-2xl transition"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLibrary;
