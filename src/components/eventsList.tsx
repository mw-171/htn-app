import React from "react";
import { TEvent } from "src/types/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/contexts/authContext";
import { ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import "../App.css";

interface Props {
  event: TEvent;
  allEvents: TEvent[];
}

const EventsList: React.FC<Props> = ({ event, allEvents }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const startDate = new Date(event.start_time);
  const formattedDate = format(startDate, "EEE, MMM dd, yyyy");

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
          <div className="">
            <h2 className="text-3xl font-bold">{event.name}</h2>
            <div className="space-x-4">
              {/* <CalendarIcon className="h-5 w-5" /> */}
              <span className="">{formatDate(event.start_time)}</span>
              {/* <ClockIcon className="h-5 w-5 flex-shrink-0" /> */}
              <span className="">
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </span>
            </div>
          </div>
          <div className="">
            <div className="flex flex-col justify-center space-y-5">
              <div className="flex items-center md:justify-end space-x-4 text-lg">
                <p className="opacity-70">Speakers:</p>
                <ul>
                  {event.speakers.map((speaker, index) => (
                    <li key={index} className="font-bold text-xl">
                      {speaker.name}
                    </li>
                  ))}
                </ul>
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
