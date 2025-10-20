import React, { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import axios from 'axios';

const VideosSection = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/homepage/videos/get`
      );
      if (response.data.success) {
        setVideos(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-[9/16] bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
            Our Videos
          </h2>
          <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded"></div>
        </div>
      </div>

      {/* Videos Grid - Instagram Reels Style (Auto-play first video) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4">
        {videos.map((video, index) => (
          <div
            key={video._id}
            className={`group relative bg-black rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 aspect-[9/16] ${
              index === 0 ? 'pointer-events-none' : 'cursor-pointer'
            }`}
            onClick={index === 0 ? undefined : () => setSelectedVideo(video)}
          >
            {/* Video Container */}
            <div className="relative w-full h-full">
              {index === 0 ? (
                // First video auto-plays with thumbnail fallback
                <>
                  <video
                    src={video.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    poster={video.thumbnailUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Featured Badge for auto-playing video */}
                  {/* <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Play className="w-3 h-3 fill-white" />
                    Featured
                  </div> */}
                </>
              ) : (
                // Other videos show thumbnail with play button
                <>
                  <img
                    src={video.thumbnailUrl}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                    <div className="bg-white/90 group-hover:bg-white transition-all rounded-full p-3 transform group-hover:scale-110 duration-300">
                      <Play className="w-6 h-6 text-blue-600 fill-blue-600" />
                    </div>
                  </div>
                </>
              )}

              {/* Order Badge (only for non-featured videos) */}
              {index > 0 && video.order !== undefined && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
                  {video.order + 1}
                </div>
              )}

              {/* Bottom Gradient Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal - Instagram Reel Style */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setSelectedVideo(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all backdrop-blur-sm"
            aria-label="Close video"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Video Container - Vertical Reel Style */}
          <div 
            className="relative w-full max-w-[420px] h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black rounded-none sm:rounded-3xl overflow-hidden shadow-2xl h-full">
              {/* Video Player - Vertical Format */}
              <video
                src={selectedVideo.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>

              {/* Bottom Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-base font-bold mb-1">
                      Video {selectedVideo.order + 1}
                    </h3>
                    <p className="text-gray-300 text-xs">
                      {new Date(selectedVideo.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideosSection;