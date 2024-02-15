import EventService from "../services/eventService";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TEvent, TSpeaker } from "src/types/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/contexts/authContext";
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
          console.log("related eventss", relatedEvents);
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

  return (
    <>
      <div className="bg-black h-screen text-white">
        <div className="overflow-hidden  px-48 py-48 shadow">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="">
              <h2 className="font-bold text-5xl bg-gradient-to-r from-purple-500 to-blue-600 text-transparent bg-clip-text flex inline-block">
                {event.name}
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
                  <h3>Speakers:</h3>
                </div>

                <div className="flex items-center md:justify-end space-x-4">
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
                              <UserCircleIcon className="w-10 h-10 rounded-full" />
                              <span className="text-xl font-bold text-white hover:text-indigo-300">
                                {speaker.name}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ) : null}
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
                </div>
                <div className="flex items-center md:justify-end ">
                  <div className="font-bold">Related Events:</div>
                </div>
                {relatedEvents.map((relatedEvent: TEvent) => (
                  <div className="flex items-center md:justify-end ">
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
    </>
  );
};

export default ViewEvent;
