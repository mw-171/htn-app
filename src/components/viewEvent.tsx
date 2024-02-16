import EventService from "../services/eventService";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TEvent, TSpeaker } from "src/types/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/contexts/authContext";
import { format } from "date-fns";
import {
  ClockIcon,
  CalendarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

interface Props {
  event: TEvent;
  events: TEvent[];
}

const ViewEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>({});
  const navigate = useNavigate();
  const [relatedEvents, setRelatedEvents] = useState<TEvent[]>([]);
  const { isAuthenticated } = useAuth();
  const isPrivateAndNotAuthenticated =
    event.permission === "private" && !isAuthenticated;
  const isPrivateEventType = event.event_type === "private";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (id) {
          const eventId = parseInt(id, 10);
          const response = await EventService.getEventId(eventId);
          setEvent(response.data);
          console.log("event call", response.data);

          const relatedDetailsPromises = response.data.related_events.map(
            (relatedId: number) => EventService.getEventId(relatedId)
          );
          const relatedDetailsResponses = await Promise.all(
            relatedDetailsPromises
          );
          const relatedEventsData: TEvent[] = relatedDetailsResponses.map(
            (response: any) => response.data
          );
          setRelatedEvents(relatedEventsData);
          // console.log("related eventss", relatedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [id]);

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

  const formatDate = (dateString: string) => {
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

  const eventTypeDisplay: { [key: string]: string } = {
    workshop: "Workshop",
    activity: "Activity",
    tech_talk: "Tech Talk",
  };
  const eventType = eventTypeDisplay[event.event_type] || "Unknown";

  const eventPermissionDisplay: { [key: string]: string } = {
    public: "Public",
    private: "Private",
  };
  const eventPermission = eventPermissionDisplay[event.permission] || "Unknown";

  return (
    <>
      {isAuthenticated ? (
        <div className="bg-black min-h-screen flex flex-1 min-h-full text-white">
          <div className="overflow-hidden px-16 py-16 sm:py-48 lg:px-56 lg:py-48 shadow">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="">
                <h2 className="font-bold text-5xl  flex inline-block">
                  {event.name}
                </h2>
                <ol role="list" className="flex items-center sm:space-x-4 py-4">
                  <li>
                    <div>
                      <div className="text-gray-400 hover:text-gray-500">
                        {eventPermission} {eventType}
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
                      <div className="ml-2 md:ml-4 text-sm font-medium text-gray-400 hover:text-gray-500 flex flex-col sm:flex-row items-start">
                        <CalendarIcon
                          className="h-5 w-5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span className="mt-1 sm:mt-0 sm:ml-2">
                          {formatDate(event.start_time)}
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
                      <div className="ml-2 md:ml-4 text-sm font-medium text-gray-400 hover:text-gray-500 flex flex-col sm:flex-row items-start">
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
                <div className="flex flex-col justify-center pt-8 md:pt-0">
                  <div className="flex items-center md:justify-end space-x-4 opacity-90">
                    <h3>Speakers:</h3>
                  </div>
                  <div className="pt-1 flex items-center md:justify-end space-x-4">
                    {event.event_type === "tech_talk" ||
                    event.event_type === "workshop" ? (
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
                    ) : null}
                  </div>

                  <div className="pt-8 flex items-center md:justify-end  space-x-4">
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
                  </div>
                  <div className="pt-8 flex items-center md:justify-end ">
                    <div className="font-bold ">Related Events:</div>
                  </div>
                  {relatedEvents.map((relatedEvent: TEvent) => (
                    <div className="pt-2 flex items-center md:justify-end ">
                      <button
                        onClick={() => viewEvent(relatedEvent.id)}
                        key={relatedEvent.id}
                        className="border-b-2 border-indigo-500 hover:text-indigo-300"
                      >
                        {relatedEvent.name}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
      ) : (
        <div>
          <h1>This event is private. Please log in to view.</h1>
        </div>
      )}
    </>
  );
};

export default ViewEvent;
