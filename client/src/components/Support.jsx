import React from "react";
import { Video } from "lucide-react";

const Support = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Video className="w-8 h-8" />
          Tutorials
        </h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Tutorial Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-w-16 aspect-h-9 transform transition-all duration-300 hover:scale-105">
                <iframe
                  src="https://www.youtube.com/embed/w-3vgeqtjiA"
                  title="Tutorial Video 1"
                  className="w-full h-full rounded-lg shadow-lg hover:shadow-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="aspect-w-16 aspect-h-9 transform transition-all duration-300 hover:scale-105">
                <iframe
                  src="https://www.youtube.com/embed/OEXyITvJupo"
                  title="Tutorial Video 2"
                  className="w-full h-full rounded-lg shadow-lg hover:shadow-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="aspect-w-16 aspect-h-9 transform transition-all duration-300 hover:scale-105">
                <iframe
                  src="https://www.youtube.com/embed/11pLCCEeG4U"
                  title="Tutorial Video 3"
                  className="w-full h-full rounded-lg shadow-lg hover:shadow-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="aspect-w-16 aspect-h-9 transform transition-all duration-300 hover:scale-105">
                <iframe
                  src="https://www.youtube.com/embed/cW-Wpzr5Qfo"
                  title="Tutorial Video 4"
                  className="w-full h-full rounded-lg shadow-lg hover:shadow-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </section>
          


        </div>
      </div>
    </div>
  );
};

export default Support;