import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const TransliteratedSong = ({ song: arSong }) => {
  const { songID } = arSong;
  const [song, setSong] = useState(null);
  const [activeVerseIndex, setActiveVerseIndex] = useState(-1);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/FrankSongs/getFrankSongBySongID/${songID}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setSong(data);
      } catch (error) {
        console.error("Error fetching song data:", error);
        setError("Error loading song. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [songID]);

  const handleClick = (verseIndex, lineIndex) => {
    if (verseIndex === activeVerseIndex && lineIndex === activeLineIndex) {
      setActiveVerseIndex(-1);
      setActiveLineIndex(-1);
    } else {
      setActiveVerseIndex(verseIndex);
      setActiveLineIndex(lineIndex);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full min-h-[16rem]">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center rounded-lg bg-red-50">
        {error}
      </div>
    );
  }

  if (!song) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No song selected
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto transition-all duration-300 hover:translate-y-[-0.25rem]">
      <div className="bg-white rounded-xl shadow-lg p-1 md:p-6 lg:p-8">
        {/* Chorus Section */}
        {Array.isArray(song.chorus) && (
          <div className="space-y-3 mb-8">
            {song.chorus.map((line, index) => (
              <div
                key={index}
                onClick={() => handleClick(-1, index)}
                className={`
                  relative rounded-lg p-[25px] md:p-4 
                  transition-all duration-300 
                  cursor-pointer
                  ${activeVerseIndex === -1 && activeLineIndex === index
                    ? 'bg-yellow-50 shadow-md'
                    : 'hover:bg-white hover:text-gray-900 transform hover:scale-[1.02] hover:shadow-xl'
                  }
                `}
              >
                {line.split("\n").map((subLine, subIndex) => (
                  <p 
                    key={`${line}-${subIndex}`} 
                    className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800"
                  >
                    {subLine.trim() !== "" ? subLine : <br />}
                  </p>
                ))}
                {activeVerseIndex === -1 && activeLineIndex === index && (
                  <span className="absolute right-0 bottom-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-tl-none rounded-tr-none rounded-bl-none rounded-br-md">
                    Now Playing
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Verses Section */}
        {Array.isArray(song.verses) && (
          <div className="space-y-6">
            {song.verses.map((verse, verseIndex) => (
              <div key={verseIndex} className="space-y-3">
                {verse.map((line, lineIndex) => (
                  <div
                    key={`${verseIndex}-${lineIndex}`}
                    onClick={() => handleClick(verseIndex, lineIndex)}
                    className={`
                      relative rounded-lg p-[25px] md:p-4
                      transition-all duration-300
                      cursor-pointer
                      ${activeVerseIndex === verseIndex && activeLineIndex === lineIndex
                        ? 'bg-yellow-50 shadow-md'
                        : 'hover:bg-white hover:text-gray-900 transform hover:scale-[1.02] hover:shadow-xl'
                      }
                    `}
                  >
                    <div className="space-y-2">
                      {lineIndex === 0 && (
                        <span className="inline-block bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full mb-2">
                          Verse {verseIndex + 1}
                        </span>
                      )}
                      {line.split("\n").map((subLine, subIndex) => (
                        <p 
                          key={`${lineIndex}-${subIndex}`}
                          className="text-base md:text-lg lg:text-xl text-gray-700"
                        >
                          {subLine.trim() !== "" ? subLine : <br />}
                        </p>
                      ))}
                      {activeVerseIndex === verseIndex && activeLineIndex === lineIndex && (
                        <span className="absolute right-0 bottom-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-tl-none rounded-tr-none rounded-bl-none rounded-br-md">
                          Now Playing
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransliteratedSong;
