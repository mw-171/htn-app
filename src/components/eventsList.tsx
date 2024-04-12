import React from "react";
import { TEvent, TSpeaker } from "src/types/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/contexts/authContext";
import {
  ClockIcon,
  CalendarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import "../App.css";

interface Props {
  event: TEvent;
  allEvents: TEvent[];
}

//function for listing of events - reused for public and private events
const EventsList: React.FC<Props> = ({ event, allEvents }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  //controls the navigation to the view event page taking the id as a reference
  const viewEvent = (id: number) => {
    console.log("clicked event id: ", id);
    navigate(`/${id}`);
  };

  //formatting time and dat functions
  function formatTime(timestamp: number) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const formatDate = (dateString: number) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
      }
      return format(date, "EEE, MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  return (
    <div className="text-white">
      <li className="overflow-hidden rounded-lg bg-black bg-opacity-40 px-12 py-12 shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div>
            <button
              onClick={() => viewEvent(event.id)}
              className="text-left text-3xl font-bold hover:text-indigo-300"
            >
              {event.name}
            </button>
            <div className="pt-2 sm:pt-4 sm:w-2/3 flex items-center font-semibold text-lg grid grid-cols-1 sm:grid-cols-2">
              <div className="flex items-center flex-inline">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span className="pl-2">{formatDate(event.start_time)}</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                <span className="pl-2">
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </span>
              </div>
            </div>
          </div>
          <div className="pt-4 sm:pt-2">
            <div className="flex flex-col justify-center space-y-5">
              {event.event_type === "tech_talk" ||
              event.event_type === "workshop" ? (
                <div>
                  <div className="pt-1 flex items-center md:justify-end space-x-4">
                    <div>
                      <ul>
                        {event.speakers.map(
                          (speaker: TSpeaker, index: number) => (
                            <li
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <UserCircleIcon className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-600" />
                              <span className="text-2xl font-bold text-white hover:text-indigo-300">
                                {speaker.name}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex items-center md:justify-end  space-x-4">
                {isAuthenticated ? (
                  <a
                    className="rounded-full bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    href={event.private_url}
                    target="_blank rel=noopener noreferrer"
                  >
                    Learn More
                  </a>
                ) : (
                  <a
                    className="rounded-full bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    href={event.public_url}
                    target="_blank rel=noopener noreferrer"
                  >
                    See Recording
                  </a>
                )}

                <button
                  className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300"
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
