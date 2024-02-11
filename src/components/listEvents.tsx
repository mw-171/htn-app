// import React, { useEffect, useState } from "react";
// import EventService from "../services/eventService";

// const ListEvents: React.FC = () => {
//   const [events, setEvents] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await EventService.getEvents();
//         setEvents(response.data.data.events);
//       } catch (error) {
//         console.error("Error fetching events:", error);
//       }
//     };

//     fetchEvents();
//   }, []);

//   return (
//     <div>
//       <h1>Events</h1>
//       <ul>
//         {events.map((event) => (
//           <li key={event.id}>
//             <h2>{event.name}</h2>
//             <p>Event Type: {event.eventType}</p>
//             <p>Start Time: {new Date(event.startTime).toLocaleString()}</p>
//             <p>End Time: {new Date(event.endTime).toLocaleString()}</p>
//             <p>Description: {event.description}</p>
//             <p>Speakers:</p>
//             <ul>
//               {event.speakers.map(
//                 (speaker: { name: string }, index: number) => (
//                   <li key={index}>{speaker.name}</li>
//                 )
//               )}
//             </ul>
//             <p>
//               Public URL: <a href={event.publicUrl}>{event.publicUrl}</a>
//             </p>
//             <p>
//               Private URL: <a href={event.privateUrl}>{event.privateUrl}</a>
//             </p>
//             <p>Related Events: {event.relatedEvents.join(", ")}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ListEvents;

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
