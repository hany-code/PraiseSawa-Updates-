import React from 'react';

const EventCard = ({ event }) => {
  return (
    <div className="glassmorphism p-6 rounded-lg hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-blue-500 to-purple-500">
      {event.thumbnail && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img 
            src={event.thumbnail} 
            alt={event.title} 
            className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-worship.jpg"; // Fallback image
            }}
          />
        </div>
      )}
      <h2 className="text-xl font-semibold mb-2 text-white" dir="rtl">{event.title}</h2>
      <p className="text-white mb-4" dir="rtl" dangerouslySetInnerHTML={{ __html: event.snippet }}></p>
      <a
        href={event.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-300"
      >
        Watch Live
      </a>
    </div>
  );
};

export default EventCard;