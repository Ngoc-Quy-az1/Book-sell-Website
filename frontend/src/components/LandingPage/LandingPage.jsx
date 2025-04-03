import React from "react";
import Video from "../LandingPage/landing_page_video.mp4"

const LandingPage = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src={Video} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <h1 className="text-5xl font-bold mb-4">Welcome to Team 31 website</h1>
          <p className="text-lg mb-6">Please sign in to continue</p>
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
