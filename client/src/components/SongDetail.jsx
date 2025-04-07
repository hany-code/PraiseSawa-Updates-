import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import backImg from "../assets/images/background-img.png";
import mainImg from "../assets/images/mainImg.png";
import logo from "../assets/images/logo.png";
import Overview from "./Overview";
import ArSong from "./ArSong";
import TranslatedSong from "./TranslatedSong";
import TransliteratedSong from "./TransliteratedSong";
import SearchBar from "./SearchBar"


const SongDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  // Function to check if text contains only English characters
  const isEnglishText = (text) => {
    // Regular expression to match English letters, numbers, spaces, and common punctuation
    const englishRegex = /^[A-Za-z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/;
    
    // Check if the text matches the English pattern
    // Also check if it contains at least one English letter (to avoid strings with only numbers or symbols)
    const hasEnglishLetter = /[A-Za-z]/.test(text);
    
    return englishRegex.test(text) && hasEnglishLetter;
  };

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/ArbSongs/getArbSongBySongID/${id}`
        );
        const data = await response.json();
        setSong(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching song data:", err);
        setError("Error fetching song data");
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#ffbb02" size={50} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  // Check if the song title is in English
  const isEnglishSong = isEnglishText(song?.title || "");

  // Define tabs based on whether the song is in English
  const tabs = isEnglishSong
    ? [
        { id: "overview", label: "Overview" },
        { id: "chords", label: "Chords" },
      ]
    : [
        { id: "overview", label: "Overview" },
        { id: "arabic", label: "Arabic" },
        { id: "translated", label: "Translated" },
        { id: "transliterated", label: "Transliterated" },
        // { id: "chords", label: "Chords" },
      ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-white z-0">
      {/* Hero section with dynamic height */}
      <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] z-0 hidden sm:block">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={backImg}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 to-neutral-950/90" />
        </div>

        {/* Content container */}
        <div className="relative h-full px-4 md:px-8 lg:px-12">
          <div className="w-full h-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-8">
            {/* Album art */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 flex-shrink-0 -mb-20 sm:mb-0 z-10">
              <img
                src={mainImg}
                alt="Album art"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>

            {/* Song info */}
            <div className="flex flex-col gap-2 sm:gap-3 text-center sm:text-left pb-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                {song.title}
              </h1>
              <h2 className="text-base sm:text-lg md:text-xl text-white/90">
                {song.subtitle}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl hidden sm:block">
                {song.description}
              </p>

              {/* Stats row */}
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-1">
                <img src={logo} alt="Logo" className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-white font-semibold text-sm sm:text-base">
                  {song.likes} likes
                </span>
                <div className="w-1 h-1 bg-white/50 rounded-full" />
                <span className="text-white/70 text-sm sm:text-base">
                  {song.duration}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SearchBar/>

      {/* Tabs navigation */}
      <div className="w-full px-4 mt-8 sm:mt-16">
        <div className="max-w-7xl mx-auto">
          {/* Scrollable tabs container */}
          <div className="flex overflow-x-auto gap-6 sm:gap-8 md:gap-10 justify-start sm:justify-center pb-2 hide-scrollbar pt-[50px]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`whitespace-nowrap px-2 py-1 text-sm sm:text-base md:text-lg transition-colors
                  ${
                    activeTab === tab.id
                      ? "text-black font-bold border-b-2 border-black"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="mt-6 px-0 sm:px-6 md:px-8">
            {activeTab === "overview" && <Overview song={song} />}
            {!isEnglishSong && activeTab === "arabic" && <ArSong song={song} />}
            {!isEnglishSong && activeTab === "translated" && <TranslatedSong song={song} />}
            {!isEnglishSong && activeTab === "transliterated" && (
              <TransliteratedSong song={song} />
            )}
            {/* {activeTab === "chords" && (
              <div className="text-black text-xl sm:text-2xl font-bold text-center py-16">
                Chords content goes here
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetail;