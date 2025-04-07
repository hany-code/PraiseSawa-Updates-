import React, { useRef } from "react";
import maherFayz from "../assets/images/maherFayz.png";
import hermesSamir from "../assets/images/hermasSamir.png";
import butterlife from "../assets/images/butterlife.png";
import houseOfPrayer from "../assets/images/houseOfPrayer.png";
import qasrAldobara from "../assets/images/qasrAldobara.png";
import SamuelFarouk from "../assets/images/SamuelFarouk.png";
import newLive from "../assets/images/newLive.png";

const Intro = () => {
  const containerRef = useRef(null);

  const images = [
    { src: SamuelFarouk, link: "https://www.youtube.com/playlist?list=PLa1UbfgSw_V3czxjxAc_6MWEmotXhGZHa" },
    { src: maherFayz, link: "https://www.youtube.com/@ElKarouzTeam" },
    { src: hermesSamir, link: "https://www.youtube.com/@HermasSamir" },
    { src: butterlife, link: "https://www.youtube.com/channel/UC3L8s0htMWtlo4wTJs44lxA" },
    { src: houseOfPrayer, link: "https://www.youtube.com/@hopkdec" },
    { src: qasrAldobara, link: "https://www.youtube.com/@KasreldobaraevangelicalChurch" },
    { src: newLive, link: "https://www.youtube.com/playlist?list=PLyEDvV-gx0_yz3KTzM_UGZYACVXgt17t3" }
  ];

  const scroll = (direction) => {
    const container = containerRef.current;
    const scrollAmount = 300;

    if (container) {
      const newScrollPosition = 
        direction === "left" 
          ? container.scrollLeft - scrollAmount 
          : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: newScrollPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="w-full px-4 md:px-8 pt-2 md:pt10">
      <h2 className="text-xl md:text-2xl lg:text-[25px] font-normal mb-4">
        Musicians and Worshippers
      </h2>

      <div className="relative -mt-2">
        <div 
          ref={containerRef}
          id="image-container"
          className="flex overflow-x-auto gap-4 scroll-smooth hide-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          {images.map((image, index) => (
            <a 
              key={index}
              href={image.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-none w-[280px] md:w-[200px] group relative overflow-hidden rounded-lg"
            >
              <div className="relative">
                <img
                  src={image.src}
                  alt={`Musician ${index + 1}`}
                  className="w-full h-auto object-cover aspect-[197/174] transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-sm font-medium px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm">
                      View Channel
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 rounded-full p-3 items-center justify-center hover:bg-black/80 transition-colors duration-200 max-sm:hidden flex"
        >
          <svg className="w-6 h-6 rotate-180 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 rounded-full p-3 items-center justify-center hover:bg-black/80 transition-colors duration-200 max-sm:hidden flex"
        >
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Intro;