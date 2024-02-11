import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import EventService from "../services/eventService";
import EventsList from "./eventsList";
import { TEvent } from "src/types/types";
// import { useAuth } from "src/contexts/authContext";

export default function HackerEvents() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  //   const { login } = useAuth();

  //login function
  const handleLogin = () => {
    console.log("login button clicked");
    // hard coding the user and pass
    if (username === "hacker" && password === "hacker123!") {
      // Redirect to the admin page
      //   login();
      // <Navigate to="/events"></Navigate>;
      console.log("logged in");
      //change the bool to true to access the admin page
      setIsLoggedIn(true);
    } else {
      alert("Invalid username or password");
    }
  };

  //logout function
  const handleLogout = () => {
    // Reset the login state and redirect to public page
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
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
      {!isLoggedIn && (
        <div className="h-screen flex min-h-full flex-1 flex-col justify-center bg-gray-900 px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="/htnlogo.png"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form
              className="space-y-6"
              // action="#"
              // method="POST"
              onSubmit={handleLogin}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="user"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <div className="bg-gray-900">
          <h1 className="text-white">you are logged in</h1>
          <button
            type="button"
            className="bg-blue-500 text-white py-1 px-4 rounded mb-4 ml-4 shadow-sm hover:shadow-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
          <ul>
            {events.map((event: any) => (
              <EventsList key={event.id} event={event} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
