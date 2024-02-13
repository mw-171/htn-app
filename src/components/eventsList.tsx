import React from "react";
import { TEvent } from "src/types/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/contexts/authContext";
import { ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";

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

  function formatTime(timestamp: number) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  return (
    <div className="text-white">
      <li className="overflow-hidden rounded-lg bg-black px-12 py-12 shadow">
        <h2 className="text-3xl font-bold">
          {event.id} {event.name}
        </h2>
        <ol role="list" className="flex items-center space-x-4 py-4">
          <li>
            <div>
              <div className="text-gray-400 hover:text-gray-500">
                {event.permission} {event.event_type}
                <span className="sr-only">event type</span>
              </div>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <div className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 flex flex-col sm:flex-row items-start">
                <CalendarIcon
                  className="h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="mt-1 sm:mt-0 sm:ml-2">
                  {new Date(event.start_time).toLocaleDateString()}
                </span>
              </div>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <div className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 flex flex-col sm:flex-row items-start">
                <ClockIcon
                  className="h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="mt-1 sm:mt-0 sm:ml-2">
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </span>
              </div>
            </div>
          </li>
        </ol>
        <p>{event.description}</p>

        <div className="flex items-center space-x-4">
          <p>Speakers:</p>
          <ul>
            {event.speakers.map((speaker, index) => (
              <li key={index}>{speaker.name}</li>
            ))}
          </ul>
        </div>

        <div className="flex items-center space-x-4">
          <p>Related Events: </p>
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

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <a
              className="text-sm font-semibold text-white hover:text-indigo-300"
              href={event.private_url}
            >
              View More
            </a>
          ) : (
            <a
              className="text-sm font-semibold text-white hover:text-indigo-300"
              href={event.public_url}
            >
              See More
            </a>
          )}

          <button
            className="text-sm font-semibold text-white hover:text-indigo-300"
            onClick={() => viewEvent(event.id)}
          >
            expand
          </button>
        </div>
      </li>
    </div>
  );
};

export default EventsList;
