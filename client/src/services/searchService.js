import axios from 'axios';

// Google Custom Search API endpoint
const SEARCH_API_URL = 'https://www.googleapis.com/customsearch/v1';

// Google Custom Search API key and Search Engine ID
// These should be stored in environment variables
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SEARCH_ENGINE_ID = process.env.REACT_APP_SEARCH_ENGINE_ID;

/**
 * Search for content using Google Custom Search API
 * @param {string} query - The search query
 * @param {number} limit - Number of results to return (max 10 for free tier)
 * @param {boolean} forceRefresh - Force a fresh search rather than using cache
 * @returns {Promise} - Promise containing search results
 */
export const googleSearch = async (query, limit = 10, forceRefresh = false) => {
  try {
    if (!API_KEY || !SEARCH_ENGINE_ID) {
      console.warn('Google API credentials not found, using mock data');
      return getMockSearchResults(query, limit);
    }

    // Add timestamp to ensure we get fresh results every time
    // This prevents browser or CDN caching
    const timestamp = forceRefresh ? `&_t=${new Date().getTime()}` : '';

    const response = await axios.get(SEARCH_API_URL, {
      params: {
        key: API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: query + timestamp, // Adding timestamp as part of query ensures fresh results
        num: limit,
        searchType: 'searchTypeUndefined',
        fields: 'items(title,link,snippet,pagemap(cse_thumbnail,cse_image))'
      },
      // Prevent axios from caching responses
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    // Transform the response to match our expected format
    const items = response.data.items?.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      thumbnail: item.pagemap?.cse_image?.[0]?.src || item.pagemap?.cse_thumbnail?.[0]?.src
    })) || [];

    return { items };
  } catch (error) {
    console.error('Error performing Google search:', error);
    if (error.response?.status === 429) {
      console.warn('API quota exceeded, using mock data');
      return getMockSearchResults(query, limit);
    }
    throw error;
  }
};

/**
 * Generate mock search results for development purposes
 * This function simulates search results for "خدمات التسبيح المسيحيه المباشره اليوم"
 */
const getMockSearchResults = (query, limit) => {
  // Mock data based on the Arabic query for Christian worship services
  const mockItems = [
    {
      title: 'خدمة تسبيح مباشرة - كنيسة القديس مارمرقس',
      link: 'https://www.youtube.com/watch?v=example1',
      snippet: 'بث مباشر لخدمة التسبيح اليوم من كنيسة القديس مارمرقس. انضم إلينا للعبادة والصلاة في هذه الخدمة الروحية المميزة.',
      thumbnail: 'https://example.com/thumbnail1.jpg'
    },
    {
      title: 'تسبيح وعبادة - خدمة مسائية حية',
      link: 'https://www.facebook.com/live/example2',
      snippet: 'خدمة التسبيح المسائية مباشرة الآن. ترانيم وتسبيح بقيادة فريق العبادة. شاركونا في هذا الوقت المبارك من الحضور في محضر الرب.',
      thumbnail: 'https://example.com/thumbnail2.jpg'
    },
    {
      title: 'بث مباشر - مؤتمر التسبيح السنوي',
      link: 'https://www.youtube.com/watch?v=example3',
      snippet: 'البث المباشر لمؤتمر التسبيح السنوي اليوم. متحدثون من مختلف الكنائس يشاركون في هذا الحدث الروحي المميز.',
      thumbnail: 'https://example.com/thumbnail3.jpg'
    },
    {
      title: 'خدمة الشباب للتسبيح - بث حي',
      link: 'https://www.instagram.com/live/example4',
      snippet: 'انضموا إلينا في خدمة الشباب للتسبيح والعبادة. بث مباشر من كنيسة النعمة بقيادة فريق التسبيح الشبابي.',
      thumbnail: 'https://example.com/thumbnail4.jpg'
    },
    {
      title: 'ليلة التسبيح والصلاة - بث مباشر',
      link: 'https://www.youtube.com/watch?v=example5',
      snippet: 'بث مباشر لليلة التسبيح والصلاة. وقت مميز من العبادة والتأمل في كلمة الله. الخدمة تبدأ الساعة 7 مساءً.',
      thumbnail: 'https://example.com/thumbnail5.jpg'
    },
    {
      title: 'تسبيح وترانيم - خدمة الأحد المباشرة',
      link: 'https://www.facebook.com/live/example6',
      snippet: 'خدمة الأحد المباشرة مع تسبيح وترانيم روحية. انضموا إلينا للعبادة والاستماع لكلمة الله في هذا اليوم المبارك.',
      thumbnail: 'https://example.com/thumbnail6.jpg'
    }
  ];

  // Return mock data in a format similar to what the API would return
  return {
    items: mockItems.slice(0, limit),
    searchInformation: {
      totalResults: mockItems.length,
      searchTime: 0.5,
      formattedSearchTime: '0.5',
      formattedTotalResults: String(mockItems.length)
    }
  };
};