import React, { useState, useEffect } from 'react';
import { googleSearch } from '../services/searchService';
import EventCard from './EventCard';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // The fixed search query for Christian worship services
  const searchQuery = 'خدمات التسبيح المسيحيه المباشره اليوم';

  useEffect(() => {
    // This will run every time the component mounts (user visits the page)
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Always fetch fresh data from the Google API
        const response = await googleSearch(searchQuery, 10, true);
        
        if (response && response.items && response.items.length > 0) {
          setEvents(response.items);
          setError(null);
        } else {
          setEvents([]);
          setError('No live worship services found.');
        }
      } catch (err) {
        setError('Failed to fetch worship services. Please try again later.');
        console.error('Error fetching worship services:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    
    // No dependencies array means this runs on every mount
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Live Christian Worship Services</h1>
      
      {error && (
        <div className="text-red-500 text-center mb-6">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-gray-500 text-lg">No live worship services found at the moment. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;