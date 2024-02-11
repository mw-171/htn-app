import React, { useEffect, useState } from "react";
import axios from "axios";

const EventList: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [publicEvents, setPublicEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Send GET request to fetch all events
        const response = await axios.get(
          "https://api.hackthenorth.com/v3/events"
        );
        const eventIds = response.data.map((event: any) => event.id);

        // Fetch details for each event
        const eventDetailsPromises = eventIds.map((id: number) =>
          axios.get(`https://api.hackthenorth.com/v3/events/${id}`)
        );
        const eventDetailsResponses = await Promise.all(eventDetailsPromises);
        const detailedEvents = eventDetailsResponses.map(
          (response: any) => response.data
        );

        // Store events in state
        setEvents(detailedEvents);

        // Filter events to get public events
        const publicEvents = detailedEvents.filter(
          (event: any) => event.permission === "public"
        );
        setPublicEvents(publicEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Private Events</h1>
      <ul>
        {events.map((event: any) => (
          <li key={event.id}>
            <h2>{event.name}</h2>
            <p>Event Type: {event.event_type}</p>
            <p>Start Time: {new Date(event.start_time).toLocaleString()}</p>
            {/* Add other event details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
