import React from "react";
import { TEvent } from "src/types/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/contexts/authContext";
import { ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";
import "../App.css";

interface Props {
  event: TEvent;
  allEvents: TEvent[];
}

const EventsList: React.FC<Props> = ({ event, allEvents }) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="">
            <h2 className="text-3xl font-bold">{event.name}</h2>
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
                  <div className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-500 flex flex-col sm:flex-row items-start">
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
                  <div className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-500 flex flex-col sm:flex-row items-start">
                    <ClockIcon
                      className="h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="mt-1 sm:mt-0 sm:ml-2">
                      {formatTime(event.start_time)} -{" "}
                      {formatTime(event.end_time)}
                    </span>
                  </div>
                </div>
              </li>
            </ol>
            {/* <div className="grid grid-cols-1 sm:grid-cols-2"> */}
            <p>{event.description}</p>
          </div>
          <div className="">
            <div className="flex flex-col justify-center space-y-5">
              <div className="flex items-center md:justify-end space-x-4">
                <div className="relative">
                  <div className=" font-bold text-6xl bg-gradient-to-r from-purple-500 to-blue-600 text-transparent bg-clip-text flex inline-block">
                    {event.id}
                  </div>
                </div>
              </div>
              <div className="flex items-center md:justify-end space-x-4 text-lg">
                <p>Speakers:</p>
                <ul>
                  {event.speakers.map((speaker, index) => (
                    <li key={index} className="font-bold">
                      {speaker.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center md:justify-end space-x-4">
                <p className="font-semibold">Related Events: </p>
                {event.related_events.map((related, index) => {
                  // Find the related event object from allEvents array
                  const relatedEvent = allEvents.find((e) => e.id === related);
                  // If the related event exists, render its name along with the button
                  return relatedEvent ? (
                    <div key={index} className="flex items-center">
                      <button
                        onClick={() => viewEvent(related)}
                        className="ml-2"
                      >
                        {relatedEvent.name}
                      </button>
                    </div>
                  ) : null;
                })}
              </div>

              <div className="flex items-center md:justify-end  space-x-4">
                {isAuthenticated ? (
                  <a
                    className="text-sm font-semibold text-white hover:text-indigo-300"
                    href={event.private_url}
                  >
                    View More
                  </a>
                ) : (
                  <a
                    className="rounded-full bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    href={event.public_url}
                  >
                    See More
                  </a>
                )}

                <button
                  className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => viewEvent(event.id)}
                >
                  Expand
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </li>
    </div>
  );
};

export default EventsList;
