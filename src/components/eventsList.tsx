import React from "react";
import { TEvent } from "src/types/types";

interface Props {
  event: TEvent;
}

const EventsList: React.FC<Props> = ({ event }) => {
  return (
    <div className="text-white">
      <h2 className="font-bold">{event.name}</h2>
      <p>Event Type: {event.event_type}</p>
      <p>Start Time: {new Date(event.start_time).toLocaleString()}</p>
      <p>Permission: {event.permission}</p>
      {/* Render other event details as needed */}
    </div>
  );
};

export default EventsList;
