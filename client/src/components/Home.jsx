import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import Intro from "./Intro";
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

const Home = () => {
  const [searchState, setSearchState] = useState({
    value: "",
    results: [],
    showDropdown: false,
    page: 1,
    textDirection: "ltr",
    hasMore: false,
    isHovered: false,
    isFocused: false,
  });

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const containsArabic = (text) => ARABIC_PATTERN.test(text);

  const getPlaceholder = (direction) =>
    direction === "rtl"
      ? "ابحث في أي جزء من الترانيم..."
      : "Search any part of the songs...";

  // Custom fuzzy search implementation
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
        // Filter results based on fuzzy matching in title, artist, or content
        data = data.filter((item) => {
          const titleMatch = fuzzyMatch(item.title, query);
          const artistMatch = fuzzyMatch(item.artist, query);
          const contentMatch = fuzzyMatch(item.content, query);
          return titleMatch || artistMatch || contentMatch;
        });
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
    const newDirection = containsArabic(newValue) ? "rtl" : "ltr";

    setSearchState((prev) => ({
      ...prev,
      value: newValue,
      textDirection: newDirection,
      showDropdown: true,
      page: 1,
    }));

    // Debounce the API call
    debounce(async () => {
      const { results, hasMore } = await fetchSearchResults(newValue);
      setSearchState((prev) => ({
        ...prev,
        results,
        hasMore,
        showDropdown: results.length > 0,
      }));
    }, 300)();
  };

  const handleLoadMore = async () => {
    const nextPage = searchState.page + 1;
    const { results: newResults, hasMore } = await fetchSearchResults(
      searchState.value,
      nextPage
    );

    if (newResults.length > 0) {
      setSearchState((prev) => ({
        ...prev,
        results: [...prev.results, ...newResults],
        page: nextPage,
        hasMore,
      }));
    } else {
      setSearchState((prev) => ({
        ...prev,
        hasMore: false,
      }));
    }
  };

  const handleResultClick = (result) => {
    setSearchState((prev) => ({ ...prev, showDropdown: false }));
    navigate(`/songs/${result.songID}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchState((prev) => ({ ...prev, showDropdown: false }));
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
      if (!result.content || !searchState.value.trim()) return null;

      const searchValue = searchState.value.toLowerCase();
      const content = result.content.toLowerCase();
      const snippetLength = 100;

      const matchIndex = content.indexOf(searchValue);
      if (matchIndex === -1) return null;

      const start = Math.max(0, matchIndex - snippetLength / 2);
      const end = Math.min(
        result.content.length,
        matchIndex + searchValue.length + snippetLength / 2
      );

      let snippet = result.content.slice(start, end);
      if (start > 0) snippet = "..." + snippet;
      if (end < result.content.length) snippet = snippet + "...";

      return snippet;
    };

    const contentSnippet = getContentSnippet();

    return (
      <li
        className="cursor-pointer px-3 md:px-4 py-2 hover:bg-[#3a3b3f] transition-all duration-200 ease-in-out"
        onClick={() => handleResultClick(result)}
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
              {highlightText(result.title, searchState.value, titleIsArabic)}
            </span>
            {result.artist && (
              <span
                className={`text-[#b0b0b0] text-xs md:text-sm truncate ${
                  artistIsArabic ? "text-right" : "text-left"
                }`}
                style={{ direction: artistIsArabic ? "rtl" : "ltr" }}
              >
                {highlightText(result.artist, searchState.value, artistIsArabic)}
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
              {highlightText(contentSnippet, searchState.value, contentIsArabic)}
            </div>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center pt-8 md:pt-12 lg:pt-16 space-y-2 md:space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            PraiseSawa
          </h1>
          <p className="text-3xl md:text-4xl lg:text-3xl font-bold bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 bg-clip-text text-transparent">
            A Movement of Praise and Worship
          </p>
          <p className="text-xl md:text-2xl lg:text-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 bg-clip-text text-transparent">
            Translated & Transliterated Arabic Songs
          </p>
        </header>

        <div className="mt-6 md:mt-8 lg:mt-10">
          <div className="relative max-w-xl mx-auto w-full group">
            <div
              className={`
                absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 
                rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500
                ${searchState.isFocused ? "opacity-75" : ""}
              `}
            />
            <input
              type="text"
              placeholder={getPlaceholder(searchState.textDirection)}
              value={searchState.value}
              onChange={handleSearchChange}
              onFocus={() =>
                setSearchState((prev) => ({
                  ...prev,
                  showDropdown: true,
                  isFocused: true,
                }))
              }
              onBlur={() =>
                setSearchState((prev) => ({ ...prev, isFocused: false }))
              }
              onMouseEnter={() =>
                setSearchState((prev) => ({ ...prev, isHovered: true }))
              }
              onMouseLeave={() =>
                setSearchState((prev) => ({ ...prev, isHovered: false }))
              }
              className={`
                relative w-full text-white text-base md:text-lg bg-[#3a3b3f] p-3 md:p-4 
                ${
                  searchState.textDirection === "rtl"
                    ? "pr-10 md:pr-12 pl-4"
                    : "pl-10 md:pl-12 pr-4"
                }
                rounded-xl transition-all duration-300
                hover:shadow-lg hover:bg-[#434446]
                focus:ring-2 focus:ring-amber-500 focus:outline-none
                ${searchState.isHovered ? "scale-[1.01]" : "scale-100"}
              `}
              style={{ direction: searchState.textDirection }}
            />
            <button
              className={`
                absolute top-1/2 transform -translate-y-1/2 
                ${searchState.textDirection === "rtl" ? "right-3" : "left-3"}
                transition-all duration-300
                ${
                  searchState.isHovered || searchState.isFocused
                    ? "text-amber-500 scale-110"
                    : "text-white"
                }
              `}
            >
              <FaSearch className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {searchState.showDropdown && searchState.results.length > 0 && (
              <ul
                ref={dropdownRef}
                style={{ direction: searchState.textDirection }}
                className="absolute left-0 right-0 mt-2 bg-[#1d1d1d] border border-[#444545] rounded-lg shadow-lg max-h-48 md:max-h-60 overflow-y-auto z-10 custom-scrollbar animate-in fade-in duration-200"
              >
                {searchState.results.map((result) => (
                  <SearchResult key={result._id} result={result} />
                ))}
                {searchState.hasMore && (
                  <li
                    className="text-center cursor-pointer text-[#FFBB02] hover:text-[#FFD700] py-2 border-t border-[#444545] text-sm md:text-base"
                    onClick={handleLoadMore}
                  >
                    {searchState.textDirection === "rtl"
                      ? "تحميل المزيد"
                      : "Load more"}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-8 md:mt-12 lg:mt-16">
          <Intro />
        </div>
      </div>
    </div>
  );
};

export default Home;