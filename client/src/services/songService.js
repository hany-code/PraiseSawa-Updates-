// const BASE_URL = '/api/ArbSongs/searchForArbSong?query=';

// export const searchSongs = async (query, page = 1, limit = 10) => {
//   try {
//     const response = await fetch(`${BASE_URL}/songs/search?q=${query}&page=${page}&limit=${limit}`);
//     if (!response.ok) throw new Error('Search failed');
//     return await response.json();
//   } catch (error) {
//     console.error('Error searching songs:', error);
//     throw error;
//   }
// };