import React from "react";
import { TEvent } from "src/types/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/contexts/authContext";

interface Props {
  event: TEvent;
}

const EventsList: React.FC<Props> = ({ event }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const viewEvent = (id: number) => {
    console.log("clicked event id: ", id);
    navigate(`/${id}`);
  };

  return (
    <div className="text-white">
      <li className="overflow-hidden rounded-md bg-black px-8 py-8 shadow">
        <h2 className="text-3xl font-bold">{event.name}</h2>
        <p>
          {event.permission} {event.event_type}
        </p>
        <p>Start Time: {new Date(event.start_time).toLocaleString()}</p>
        <p>End Time: {new Date(event.end_time).toLocaleString()}</p>
        <p>{event.description}</p>
        <p>Speakers:</p>
        <ul>
          {event.speakers.map((speaker, index) => (
            <li key={index}>{speaker.name}</li>
          ))}
        </ul>

        <p>Related Events: </p>
        <div className="flex items-center space-x-4">
          {event.related_events.map((related, index) => (
            <li key={index}>
              <button
                onClick={() => viewEvent(related)}
                className="text-sm font-semibold text-white hover:text-indigo-300"
              >
                {related}
              </button>
            </li>
          ))}
        </div>
        {isAuthenticated ? (
          <a
            className="text-sm font-semibold text-white hover:text-indigo-300"
            href={event.private_url}
          >
            url
          </a>
        ) : (
          <a
            className="text-sm font-semibold text-white hover:text-indigo-300"
            href={event.public_url}
          >
            url
          </a>
        )}

        <button
          className="text-sm font-semibold text-white hover:text-indigo-300"
          onClick={() => viewEvent(event.id)}
        >
          expand
        </button>
      </li>
    </div>
  );
};

export default EventsList;
