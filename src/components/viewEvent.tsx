import EventService from "../services/eventService";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TEvent } from "src/types/types";

interface Props {
  event: TEvent;
}

const ViewEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (id) {
          const eventId = parseInt(id, 10);
          const response = await EventService.getEventId(eventId);
          setEvent(response.data);
          console.log("response", response.data);
          console.log("event", event);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [id]);

  return (
    <div className="container mt-5 ">
      <h1>hi</h1>
      <h2>{event.name}</h2>
    </div>
  );
};

export default ViewEvent;
