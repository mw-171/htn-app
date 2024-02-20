import EventService from "../services/eventService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TEvent, TSpeaker } from "src/types/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/contexts/authContext";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import {
  ClockIcon,
  CalendarIcon,
  UserCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

interface Props {
  event: TEvent;
  events: TEvent[];
}

//for indiivdual event view pages
const ViewEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>({});
  const navigate = useNavigate();
  const [relatedEvents, setRelatedEvents] = useState<TEvent[]>([]);
  const { isAuthenticated } = useAuth();
  const isPrivateEventType = event.permission === "private";
  const [loading, setLoading] = useState(true); // Initialize loading state

  //gets the event detail by individual event
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (id) {
          const eventId = parseInt(id, 10);
          const response = await EventService.getEventId(eventId);
          setEvent(response.data);
          setLoading(false);
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
  //handles the loading screen if the data has not been fetched yet
  if (loading) {
    return (
      <div className="bg-black min-h-screen flex justify-center items-center font-bold text-white">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div>
        {/* checks if user is authenticated yet */}
        {isAuthenticated ? (
          <div>
            <div>
              <div className="absolute px-8 py-4 flex justify-start">
                <NavLink
                  to="/hackerevents"
                  className="flex items-center gap-2 rounded-mdpx-3.5 py-2.5 text-sm font-semibold text-white shadow-sm leading-6 hover:text-indigo-300"
                >
                  <span aria-hidden="true">
                    <ArrowLeftIcon className="h-5 w-5" />
                  </span>
                  Home
                </NavLink>
              </div>
            </div>
            <div className="bg-black min-h-screen flex flex-1 min-h-full text-white">
              <div className="overflow-hidden px-12 sm:px-16 py-16 sm:py-48 lg:px-56 lg:py-48 shadow">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="">
                    <h2 className="font-bold text-5xl  flex inline-block">
                      {event.name}
                    </h2>
                    <EventDetails event={event} />
                    <p>{event.description}</p>
                  </div>
                  <div className="">
                    <div className="flex flex-col justify-center pt-8 md:pt-0">
                      <Speakers event={event} speakers={event.speakers} />
                      <div className="pt-8 flex items-center md:justify-end space-x-4">
                        <a
                          className="rounded-full bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          href={event.private_url}
                        >
                          Learn More
                        </a>
                      </div>
                      <RelatedEvents
                        relatedEvents={relatedEvents}
                        viewEvent={viewEvent}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* not authenticated */}
            {isPrivateEventType ? (
              <div className="bg-black min-h-screen flex flex-1 min-h-full text-white justify-center items-center">
                <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                  <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      This is a Hacker event!
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-400">
                      Please log in to view further details.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                      <NavLink
                        to="/login"
                        className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                      >
                        Log in
                      </NavLink>
                      <NavLink
                        to="/"
                        className="flex items-center gap-2 rounded-mdpx-3.5 py-2.5 text-sm font-semibold text-white shadow-sm leading-6 hover:text-indigo-300"
                      >
                        Home
                        <span aria-hidden="true">
                          <ArrowRightIcon className="h-5 w-5" />
                        </span>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* public */}
                <div className="bg-black min-h-screen flex flex-1 min-h-full text-white">
                  <div>
                    <div className="absolute px-8 py-4 flex justify-start">
                      <NavLink
                        to="/"
                        className="flex items-center gap-2 rounded-mdpx-3.5 py-2.5 text-sm font-semibold text-white shadow-sm leading-6 hover:text-indigo-300"
                      >
                        <span aria-hidden="true">
                          <ArrowLeftIcon className="h-5 w-5" />
                        </span>
                        Home
                      </NavLink>
                    </div>
                  </div>
                  <div className="overflow-hidden px-16 py-16 sm:py-48 lg:px-56 lg:py-48 shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="">
                        <h2 className="font-bold text-5xl pt-4 sm:pt-0 flex inline-block">
                          {event.name}
                        </h2>
                        <EventDetails event={event} />
                        <p>{event.description}</p>
                      </div>
                      <div className="">
                        <div className="flex flex-col justify-center pt-8 md:pt-0">
                          <Speakers event={event} speakers={event.speakers} />
                          <div className="pt-8 flex items-center md:justify-end  space-x-4">
                            <a
                              className="rounded-full bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              href={event.public_url}
                            >
                              See Recording
                            </a>
                          </div>
                          <RelatedEvents
                            relatedEvents={relatedEvents}
                            viewEvent={viewEvent}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewEvent;

//resuable function for related events
interface RProps {
  relatedEvents: TEvent[];
  viewEvent: (id: number) => void;
}
const RelatedEvents = ({ relatedEvents, viewEvent }: RProps) => {
  return (
    <div>
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
  );
};

//resuable function for speakers
interface SProps {
  event: TEvent;
  speakers: TSpeaker[];
}
const Speakers = ({ event, speakers }: SProps) => {
  return (
    <div>
      {event.event_type === "tech_talk" || event.event_type === "workshop" ? (
        <div>
          <div className="flex items-center md:justify-end space-x-4 opacity-90">
            <h3>Speakers:</h3>
          </div>
          <div className="pt-1 flex items-center md:justify-end space-x-4">
            <div>
              <ul>
                {event.speakers.map((speaker: TSpeaker, index: number) => (
                  <li key={index} className="flex items-center space-x-2">
                    <UserCircleIcon className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-600" />
                    <span className="text-2xl font-bold text-white hover:text-indigo-300">
                      {speaker.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

//reusable function for date, time, event details
interface TProps {
  event: TEvent;
}
const EventDetails = ({ event }: TProps) => {
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
  const eventPermission = event?.permission
    ? eventPermissionDisplay[event.permission] || "Unknown"
    : "Unknown";

  return (
    <div>
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
              <ClockIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="mt-1 sm:mt-0 sm:ml-2">
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </span>
            </div>
          </div>
        </li>
      </ol>
    </div>
  );
};
