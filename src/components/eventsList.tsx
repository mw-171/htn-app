import React from "react";
import { TEvent } from "src/types/types";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface Props {
  event: TEvent;
}

const EventsList: React.FC<Props> = ({ event }) => {
  const navigate = useNavigate();

  const viewEvent = (id: number) => {
    console.log("clicked event id: ", id);
    navigate(`/${id}`);
  };

  return (
    <div className="text-white">
      <h2 className="font-bold">{event.name}</h2>
      <p>Event Type: {event.event_type}</p>
      <p>Start Time: {new Date(event.start_time).toLocaleString()}</p>
      <p>Permission: {event.permission}</p>
      <button onClick={() => viewEvent(event.id)}>hi</button>
    </div>
  );
};

export default EventsList;
