import React, { useState } from "react";

const ArSong = ({ song }) => {
  const [activeVerseIndex, setActiveVerseIndex] = useState(-1);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);

  const handleClick = (verseIndex, lineIndex) => {
    if (verseIndex === activeVerseIndex && lineIndex === activeLineIndex) {
      setActiveVerseIndex(-1);
      setActiveLineIndex(-1);
    } else {
      setActiveVerseIndex(verseIndex);
      setActiveLineIndex(lineIndex);
    }
  };

  if (!song) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No song selected
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto transition-all duration-300 hover:translate-y-[-0.25rem]">
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 lg:p-8">
        {/* Chorus Section */}
        {Array.isArray(song.chorus) && (
          <div className="space-y-3 mb-8 text-right" dir="rtl">
            {song.chorus.map((line, index) => (
              <div
                key={index}
                onClick={() => handleClick(-1, index)}
                className={`
                  relative rounded-lg md:p-4 
                  transition-all duration-300 
                  cursor-pointer p-[25px]
                  ${activeVerseIndex === -1 && activeLineIndex === index
                    ? 'bg-yellow-50 shadow-md transform scale-105' // active item with scale effect
                    : 'hover:bg-white hover:text-gray-900 transform hover:scale-[1.02] hover:shadow-xl'} // updated hover effect
                `}
              >
                {line.split("\n").map((subLine, subIndex) => (
                  <p 
                    key={`${line}-${subIndex}`} 
                    className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 leading-relaxed"
                    dir="rtl"
                  >
                    {subLine.trim() !== "" ? subLine : <br />}
                  </p>
                ))}
                {activeVerseIndex === -1 && activeLineIndex === index && (
                  <span className="absolute right-auto left-0 bottom-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-tl-none rounded-tr-none rounded-bl-md rounded-br-none">
                    يعرض الآن
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Verses Section */}
        {Array.isArray(song.verses) && (
          <div className="space-y-6 text-right" dir="rtl">
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
                        ? 'bg-yellow-50 shadow-md transform scale-105'
                        : 'hover:bg-white hover:text-gray-900 transform hover:scale-[1.02] hover:shadow-xl'
                      }
                    `}
                  >
                    <div>
                      {lineIndex === 0 && (
                        <span className="inline-block bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full mb-2">
                          البيت {verseIndex + 1}
                        </span>
                      )}
                      <div className="space-y-2">
                        {line.split("\n").map((subLine, subIndex) => (
                          <p 
                            key={`${lineIndex}-${subIndex}`}
                            className="text-base md:text-lg lg:text-xl text-gray-800 leading-relaxed font-bold"
                            dir="rtl"
                          >
                            {subLine.trim() !== "" ? subLine : <br />}
                          </p>
                        ))}
                      </div>
                      {activeVerseIndex === verseIndex && activeLineIndex === lineIndex && (
                        <span className="absolute right-auto left-0 bottom-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-tl-none rounded-tr-none rounded-bl-md rounded-br-none">
                          يعرض الآن
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

export default ArSong;
