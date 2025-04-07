import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "./scroll.css";

const SEARCH_API_ENDPOINT = `${process.env.REACT_APP_API_BASE_URL}/api/ArbSongs/searchForArbSong`;
const ARABIC_PATTERN = /[\u0600-\u06FF]/;

// Function to compute word similarity score (Levenshtein distance)
const getLevenshteinDistance = (str1, str2) => {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }
  return track[str2.length][str1.length];
};

// Debounce function to limit API calls
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const [textDirection, setTextDirection] = useState("ltr");
  const [hasMore, setHasMore] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const containsArabic = (text) => ARABIC_PATTERN.test(text);

  const getPlaceholder = (direction) =>
    direction === "rtl"
      ? "ابحث عن الترانيم العربية أو الإنجليزية..."
      : "Search Arabic or English songs...";

  const fuzzyMatch = (text, searchTerm) => {
    if (!text || !searchTerm) return false;
    text = text.toLowerCase();
    searchTerm = searchTerm.toLowerCase();

    const searchWords = searchTerm.split(/\s+/);
    return searchWords.some((word) => {
      const textWords = text.split(/\s+/);
      return textWords.some((textWord) => {
        const distance = getLevenshteinDistance(textWord, word);
        const maxLength = Math.max(textWord.length, word.length);
        const similarity = 1 - distance / maxLength;
        return similarity >= 0.8 || textWord.includes(word) || word.includes(textWord);
      });
    });
  };

  const highlightText = (text, query, isArabic) => {
    if (!query.trim() || !text) return text;

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    const parts = text.split(regex);

    return (
      <span className={isArabic ? "text-right" : "text-left"}>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="bg-amber-500/30 text-amber-400 font-medium">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const fetchSearchResults = async (query, page = 1) => {
    if (!query.trim()) return { results: [], hasMore: false };

    try {
      const response = await fetch(
        `${SEARCH_API_ENDPOINT}?query=${query}&page=${page}&fullContent=true`
      );
      let data = await response.json();

      if (Array.isArray(data)) {
        data = data.filter(
          (item) =>
            fuzzyMatch(item.title, query) ||
            fuzzyMatch(item.artist, query) ||
            fuzzyMatch(item.content, query)
        );
      }

      const hasMore = data.hasMore !== undefined ? data.hasMore : data.length > 0;
      const results = Array.isArray(data) ? data : data.results || [];

      return { results, hasMore };
    } catch (error) {
      console.error("Error fetching search results:", error);
      return { results: [], hasMore: false };
    }
  };

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    setTextDirection(containsArabic(newValue) ? "rtl" : "ltr");
    setPage(1);
    setHasMore(true);

    if (newValue.trim() !== "") {
      debounce(async () => {
        const { results, hasMore } = await fetchSearchResults(newValue);
        setSearchResults(results);
        setShowDropdown(true);
        setHasMore(hasMore);
      }, 300)();
    } else {
      setSearchResults([]);
      setShowDropdown(false);
      setHasMore(false);
    }
  };

  const loadMoreSongs = async () => {
    const nextPage = page + 1;
    const { results: newResults, hasMore } = await fetchSearchResults(searchValue, nextPage);

    if (newResults.length > 0) {
      setSearchResults([...searchResults, ...newResults]);
      setPage(nextPage);
      setHasMore(hasMore);
    } else {
      setHasMore(false);
    }
  };

  const clickSearchResult = (result) => {
    setShowDropdown(false);
    navigate(`/songs/${result.songID}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const SearchResult = ({ result }) => {
    const titleIsArabic = containsArabic(result.title);
    const artistIsArabic = result.artist && containsArabic(result.artist);
    const contentIsArabic = result.content && containsArabic(result.content);

    // Find the matching content snippet
    const getContentSnippet = () => {
      if (!result.content || !searchValue.trim()) return null;

      const searchValueLower = searchValue.toLowerCase();
      const content = result.content.toLowerCase();
      const snippetLength = 100;

      const matchIndex = content.indexOf(searchValueLower);
      if (matchIndex === -1) return null;

      const start = Math.max(0, matchIndex - snippetLength / 2);
      const end = Math.min(
        result.content.length,
        matchIndex + searchValueLower.length + snippetLength / 2
      );

      let snippet = result.content.slice(start, end);
      if (start > 0) snippet = "..." + snippet;
      if (end < result.content.length) snippet = snippet + "...";

      return snippet;
    };

    const contentSnippet = getContentSnippet();

    return (
      <li
        className="cursor-pointer px-3 md:px-4 py-2 hover:bg-zinc-900 transition-all duration-200 ease-in-out"
        onClick={() => clickSearchResult(result)}
        style={{ direction: titleIsArabic ? "rtl" : "ltr" }}
      >
        <div className="flex flex-col gap-1">
          <div
            className={`flex flex-col md:flex-row gap-1 md:gap-2 ${
              titleIsArabic ? "md:flex-row-reverse justify-end" : "md:flex-row"
            }`}
          >
            <span
              className={`text-white text-sm md:text-base font-medium truncate ${
                titleIsArabic ? "text-right" : "text-left"
              }`}
            >
              {highlightText(result.title, searchValue, titleIsArabic)}
            </span>
            {result.artist && (
              <span
                className={`text-[#b0b0b0] text-xs md:text-sm truncate ${
                  artistIsArabic ? "text-right" : "text-left"
                }`}
                style={{ direction: artistIsArabic ? "rtl" : "ltr" }}
              >
                {highlightText(result.artist, searchValue, artistIsArabic)}
              </span>
            )}
          </div>
          {contentSnippet && (
            <div
              className={`text-[#8a8a8a] text-xs leading-relaxed ${
                contentIsArabic ? "text-right" : "text-left"
              }`}
              style={{ direction: contentIsArabic ? "rtl" : "ltr" }}
            >
              {highlightText(contentSnippet, searchValue, contentIsArabic)}
            </div>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mt-6 md:mt-8 lg:mt-10">
          <div className="relative max-w-xl mx-auto w-full group">
            {/* Gradient background glow effect */}
            <div
              className={`
                absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 
                rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500
                ${isFocused ? "opacity-75" : ""}
              `}
            />

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder={getPlaceholder(textDirection)}
                value={searchValue}
                onChange={handleSearchChange}
                onFocus={() => {
                  setShowDropdown(true);
                  setIsFocused(true);
                }}
                onBlur={() => setIsFocused(false)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                  relative w-full text-white text-base md:text-lg 
                  bg-black p-3 md:p-4 
                  ${textDirection === "rtl" ? "pr-10 md:pr-12 pl-4" : "pl-10 md:pl-12 pr-4"}
                  rounded-xl transition-all duration-300 ease-in-out
                  hover:shadow-lg hover:bg-black
                  focus:ring-2 focus:ring-amber-500 focus:outline-none
                  ${isHovered ? "scale-[1.01]" : "scale-100"}
                `}
                style={{ direction: textDirection }}
              />

              {/* Search Icon */}
              <button
                className={`
                  absolute top-1/2 transform -translate-y-1/2
                  ${textDirection === "rtl" ? "right-3" : "left-3"}
                  transition-all duration-300 ease-in-out
                  ${isHovered || isFocused ? "text-amber-500 scale-110" : "text-white"}
                `}
              >
                <FaSearch className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Dropdown Results */}
            {showDropdown && searchResults.length > 0 && (
              <ul
                ref={dropdownRef}
                style={{ direction: textDirection }}
                className="absolute left-0 right-0 mt-2 bg-black border border-[#444545] 
                  rounded-lg shadow-lg max-h-48 md:max-h-60 overflow-y-auto z-10 
                  custom-scrollbar animate-in fade-in duration-200"
              >
                {searchResults.map((result) => (
                  <SearchResult key={result._id} result={result} />
                ))}
                {hasMore && (
                  <li
                    className="text-center cursor-pointer text-[#FFBB02] hover:text-[#FFD700] 
                      py-2 border-t border-[#444545] text-sm md:text-base
                      transition-colors duration-200 hover:bg-zinc-900"
                    onClick={loadMoreSongs}
                  >
                    {textDirection === "rtl" ? "تحميل المزيد" : "Load more"}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;