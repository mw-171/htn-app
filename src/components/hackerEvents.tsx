import { useState, useEffect } from "react";
import EventService from "../services/eventService";
import EventsList from "./eventsList";
import { TEvent } from "src/types/types";
import { useAuth } from "src/contexts/authContext";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

//hacker events page/private page
export default function HackerEvents() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  //logout function
  const handleLogout = () => {
    // Reset the login state and redirect to public page
    setIsLoggedIn(false);
    logout();
    setUsername("");
    setPassword("");
    navigate("/");
  };

  //gets all the event information
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await EventService.getEvents();
        const eventIds = response.data.map((event: any) => event.id);

        const eventDetailsPromises = eventIds.map((id: number) =>
          EventService.getEventId(id)
        );
        const eventDetailsResponses = await Promise.all(eventDetailsPromises);
        //define as an array of Tevent objects
        const detailedEvents: TEvent[] = eventDetailsResponses.map(
          (response: any) => response.data
        );

        detailedEvents.sort((a, b) => a.start_time - b.start_time);

        // Store events in state
        setEvents(detailedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <div className="bg-gray-900">
          <div className="relative isolate overflow-hidden bg-gray-900 pt-8">
            <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Welcome to the Hacker page!
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                  Find hacker-exclusive events, workshops, and activities.
                  Discover helpful tips and innovative solutions.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <button
                    type="button"
                    className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
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
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle
                cx={512}
                cy={512}
                r={512}
                fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
                fillOpacity="0.7"
              />
              <defs>
                <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          <ul className="space-y-6 pb-16 pt-6 sm:pt-0 px-6 sm:px-16">
            {events.map((event: any) => (
              <EventsList key={event.id} event={event} allEvents={events} />
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <div className="bg-black min-h-screen flex flex-1 min-h-full text-white justify-center items-center">
            <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  These are hacker events!
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
                    className="flex items-center gap-2 rounded-mdpx-3.5 py-2.5 text-sm font-semibold text-white shadow-sm leading-6 hover:text-indigo-400"
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
        </div>
      )}
    </>
  );
}
