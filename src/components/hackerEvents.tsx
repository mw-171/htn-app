import { useState, useEffect } from "react";
import EventService from "../services/eventService";
import EventsList from "./eventsList";
import { TEvent } from "src/types/types";
import { useAuth } from "src/contexts/authContext";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
          <h1 className="text-white">you are logged in</h1>
          <button
            type="button"
            className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            onClick={handleLogout}
          >
            Logout
          </button>
          <ul className="space-y-3">
            {events.map((event: any) => (
              <EventsList key={event.id} event={event} />
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <p>Please log in to access hacker events</p>
          <NavLink
            to="/login"
            className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            Log in
          </NavLink>

          <NavLink
            to="/"
            className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            home
          </NavLink>
        </div>
      )}
    </>
  );
}
