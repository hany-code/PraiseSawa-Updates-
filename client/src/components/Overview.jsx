import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import ControlBar from "./controlBar";

const Overview = ({ song }) => {
  const [arSong, setArSong] = useState(null);
  const [transliteration, setTransliteration] = useState(null);
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVerseIndex, setActiveVerseIndex] = useState(-1);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [activeChorusLineIndex, setActiveChorusLineIndex] = useState(-1);
  const [screens, setScreens] = useState([
    {
      id: 1,
      displayOptions: {
        arabic: true,
        english: true,
        franco: true,
      },
      fontSizes: {
        arabic: 2.5,
        english: 2.0,
        franco: 1.8,
      },
    },
  ]);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [isEndOfSong, setIsEndOfSong] = useState(false);

  const { songID } = song;

  // Fetch song data
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const [arSongRes, transliterationRes, translationRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/ArbSongs/getArbSongBySongID/${songID}`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/FrankSongs/getFrankSongBySongID/${songID}`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/ArbSongs/translateToEnglish/${songID}`),
        ]);

        setArSong(arSongRes.data);
        setTransliteration(transliterationRes.data);
        setTranslation(translationRes.data);
      } catch (error) {
        console.error("Error fetching song data:", error);
        setError("Error fetching song data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [songID]);

  // Get total number of lines (verses + chorus)
  const getTotalLines = () => {
    let total = 0;
    if (Array.isArray(arSong?.chorus)) {
      total += arSong.chorus.length;
    }
    if (Array.isArray(arSong?.verses)) {
      arSong.verses.forEach((verse) => {
        total += verse.length;
      });
    }
    return total;
  };

  // Get current index considering all lines
  const getCurrentIndex = () => {
    if (isEndOfSong) {
      return getTotalLines();
    }

    let index = 0;

    if (activeChorusLineIndex !== -1) {
      return activeChorusLineIndex;
    }

    if (activeVerseIndex !== -1 && activeLineIndex !== -1) {
      if (Array.isArray(arSong?.chorus)) {
        index += arSong.chorus.length;
      }
      for (let i = 0; i < activeVerseIndex; i++) {
        index += arSong.verses[i].length;
      }
      index += activeLineIndex;
    }

    return index;
  };

  // Get line info based on global index
  const getLineInfo = (index, totalLines) => {
    // Handle black screen (last position)
    if (index === totalLines) {
      return {
        type: "black",
        chorusIndex: -1,
        verseIndex: -1,
        lineIndex: -1,
      };
    }

    let currentIndex = 0;

    // Check chorus lines
    if (Array.isArray(arSong?.chorus)) {
      if (index < arSong.chorus.length) {
        return {
          type: "chorus",
          chorusIndex: index,
          verseIndex: -1,
          lineIndex: -1,
        };
      }
      currentIndex += arSong.chorus.length;
    }

    // Check verse lines
    if (Array.isArray(arSong?.verses)) {
      for (let verseIndex = 0; verseIndex < arSong.verses.length; verseIndex++) {
        const verse = arSong.verses[verseIndex];
        if (index < currentIndex + verse.length) {
          const lineIndex = index - currentIndex;
          return {
            type: "verse",
            chorusIndex: -1,
            verseIndex,
            lineIndex,
          };
        }
        currentIndex += verse.length;
      }
    }

    return null;
  };

  // Update selected verse based on line info
  const updateSelectedVerse = (lineInfo) => {
    if (!lineInfo) return;

    setIsEndOfSong(false);

    if (lineInfo.type === "black") {
      setIsEndOfSong(true);
      setSelectedVerse(null);
      setActiveChorusLineIndex(-1);
      setActiveVerseIndex(-1);
      setActiveLineIndex(-1);
      return;
    }

    if (lineInfo.type === "chorus") {
      setActiveChorusLineIndex(lineInfo.chorusIndex);
      setActiveVerseIndex(-1);
      setActiveLineIndex(-1);
      setSelectedVerse({
        arabic: arSong.chorus[lineInfo.chorusIndex],
        english: translation?.chorus?.[lineInfo.chorusIndex],
        franco: transliteration?.chorus?.[lineInfo.chorusIndex],
      });
    } else {
      setActiveChorusLineIndex(-1);
      setActiveVerseIndex(lineInfo.verseIndex);
      setActiveLineIndex(lineInfo.lineIndex);
      setSelectedVerse({
        arabic: arSong.verses[lineInfo.verseIndex][lineInfo.lineIndex],
        english: translation?.verses?.[lineInfo.verseIndex]?.[lineInfo.lineIndex],
        franco: transliteration?.verses?.[lineInfo.verseIndex]?.[lineInfo.lineIndex],
      });
    }
  };

  // Handle verse click
  const handleClick = (verseIndex, lineIndex) => {
    if (verseIndex === activeVerseIndex && lineIndex === activeLineIndex) return;

    setActiveVerseIndex(verseIndex);
    setActiveLineIndex(lineIndex);
    setSelectedVerse({
      arabic: arSong.verses[verseIndex][lineIndex],
      english: translation?.verses[verseIndex][lineIndex],
      franco: transliteration?.verses[verseIndex][lineIndex],
    });
    setActiveChorusLineIndex(-1);
    setIsEndOfSong(false);
  };

  // Handle chorus click
  const handleChorusClick = (lineIndex) => {
    if (lineIndex === activeChorusLineIndex) return;

    setActiveChorusLineIndex(lineIndex);
    setSelectedVerse({
      arabic: arSong.chorus[lineIndex],
      english: translation?.chorus[lineIndex],
      franco: transliteration?.chorus[lineIndex],
    });
    setActiveVerseIndex(-1);
    setActiveLineIndex(-1);
    setIsEndOfSong(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!arSong) return;

      const totalLines = getTotalLines();
      const currentIndex = getCurrentIndex();

      let newIndex;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        // If we're at the black screen, go to the first line
        if (isEndOfSong) {
          newIndex = 0;
        } else {
          // Otherwise, go to next line or black screen
          newIndex = (currentIndex + 1) % (totalLines + 1);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        // If we're at the first line, go to black screen
        if (currentIndex === 0) {
          newIndex = totalLines;
        } else {
          // Otherwise, go to previous line
          newIndex = (currentIndex - 1 + totalLines + 1) % (totalLines + 1);
        }
      } else {
        return;
      }

      const lineInfo = getLineInfo(newIndex, totalLines);
      updateSelectedVerse(lineInfo);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [arSong, activeVerseIndex, activeLineIndex, activeChorusLineIndex, isEndOfSong]);

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] sm:min-h-[300px] md:min-h-[400px]">
        <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-2 sm:p-3 md:p-4 text-red-500 text-center bg-red-50 rounded-lg text-sm sm:text-base">
        {error}
      </div>
    );
  }

  // Render no data state
  if (!arSong || !transliteration || !translation) {
    return (
      <div className="p-2 sm:p-3 md:p-4 text-gray-500 text-center text-sm sm:text-base">
        No song data available
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
      {(selectedVerse || isEndOfSong) && (
        <ControlBar
          selectedVerse={selectedVerse}
          screens={screens}
          setScreens={setScreens}
          isEndOfSong={isEndOfSong}
        />
      )}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-3 gap-4 p-2 sm:p-3 md:p-4 bg-gray-50 border-b">
          <div className="text-center font-semibold text-gray-700 text-sm sm:text-base">
            Arabic
          </div>
          <div className="text-center font-semibold text-gray-700 text-sm sm:text-base">
            Transliteration
          </div>
          <div className="text-center font-semibold text-gray-700 text-sm sm:text-base">
            Translation
          </div>
        </div>

        {/* Content */}
        <div className="divide-y divide-gray-100">
          {/* Chorus Section */}
          {arSong.chorus && arSong.chorus.length > 0 && (
            <div className="p-2 sm:p-3 md:p-4">
              {arSong.chorus.map((line, index) => (
                <div
                  key={`chorus-${index}`}
                  className="grid grid-cols-3 gap-4 mb-4"
                >
                  <div
                    className={`p-2 sm:p-3 md:p-4 rounded-lg cursor-pointer ${
                      activeChorusLineIndex === index
                        ? "bg-yellow-50 shadow-md scale-[1.02] z-10"
                        : "hover:bg-gray-50 hover:shadow-lg hover:scale-[1.02] hover:z-10"
                    }`}
                    onClick={() => handleChorusClick(index)}
                  >
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 text-right font-bold">
                      {line}
                    </p>
                  </div>
                  <div
                    className={`p-2 sm:p-3 md:p-4 rounded-lg cursor-pointer ${
                      activeChorusLineIndex === index
                        ? "bg-yellow-50 shadow-md scale-[1.02] z-10"
                        : "hover:bg-gray-50 hover:shadow-lg hover:scale-[1.02] hover:z-10"
                    }`}
                    onClick={() => handleChorusClick(index)}
                  >
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 text-center">
                      {transliteration.chorus[index]}
                    </p>
                  </div>
                  <div
                    className={`p-2 sm:p-3 md:p-4 rounded-lg cursor-pointer ${
                      activeChorusLineIndex === index
                        ? "bg-yellow-50 shadow-md scale-[1.02] z-10"
                        : "hover:bg-gray-50 hover:shadow-lg hover:scale-[1.02] hover:z-10"
                    }`}
                    onClick={() => handleChorusClick(index)}
                  >
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 text-center">
                      {translation.chorus[index]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Verses Section */}
          {arSong.verses.map((verse, verseIndex) => (
            <div key={`verse-${verseIndex}`} className="p-2 sm:p-3 md:p-4">
              <div className="mb-2 sm:mb-3 md:mb-4">
                <span className="inline-block bg-gray-100 text-gray-600 text-xs sm:text-sm px-2 py-1 rounded-full">
                  Verse {verseIndex + 1}
                </span>
              </div>
              {verse.map((line, lineIndex) => (
                <div
                  key={`verse-${verseIndex}-line-${lineIndex}`}
                  className="grid grid-cols-3 gap-4 mb-4"
                >
                  <div
                    className={`p-2 sm:p-3 md:p-4 rounded-lg cursor-pointer ${
                      activeVerseIndex === verseIndex && activeLineIndex === lineIndex
                        ? "bg-yellow-50 shadow-md scale-[1.02] z-10"
                        : "hover:bg-gray-50 hover:shadow-lg hover:scale-[1.02] hover:z-10"
                    }`}
                    onClick={() => handleClick(verseIndex, lineIndex)}
                  >
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 text-right font-bold">
                      {line}
                    </p>
                  </div>
                  <div
                    className={`p-2 sm:p-3 md:p-4 rounded-lg cursor-pointer ${
                      activeVerseIndex === verseIndex && activeLineIndex === lineIndex
                        ? "bg-yellow-50 shadow-md scale-[1.02] z-10"
                        : "hover:bg-gray-50 hover:shadow-lg hover:scale-[1.02] hover:z-10"
                    }`}
                    onClick={() => handleClick(verseIndex, lineIndex)}
                  >
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 text-center">
                      {transliteration.verses[verseIndex][lineIndex]}
                    </p>
                  </div>
                  <div
                    className={`p-2 sm:p-3 md:p-4 rounded-lg cursor-pointer ${
                      activeVerseIndex === verseIndex && activeLineIndex === lineIndex
                        ? "bg-yellow-50 shadow-md scale-[1.02] z-10"
                        : "hover:bg-gray-50 hover:shadow-lg hover:scale-[1.02] hover:z-10"
                    }`}
                    onClick={() => handleClick(verseIndex, lineIndex)}
                  >
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 text-center">
                      {translation.verses[verseIndex][lineIndex]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;