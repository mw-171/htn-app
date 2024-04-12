import React, { useState, useEffect } from "react";
import { TEvent } from "../types/types";

const SearchBar = ({
  allEvents,
  setFilteredEvents,
}: {
  allEvents: TEvent[];
  setFilteredEvents: (events: TEvent[]) => void;
}) => {
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    const filteredEvents = allEvents.filter((event) => {
      const nameMatches: boolean = event.name
        .toLowerCase()
        .includes(input.toLowerCase());
      return nameMatches;
    });

    if (filteredEvents) {
      setFilteredEvents(filteredEvents);
    }
  }, [input, allEvents, setFilteredEvents]);
  return (
    <input
      type="text"
      placeholder="Search events..."
      value={input}
      onChange={(e): void => {
        setInput(e.target.value);
      }}
      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
    />
  );
};

export default SearchBar;

// setSearchTerm(event.target.value);
// if (event.target.value !== "") {
//   const filteredEvents = allEvents.filter((event) =>
//     event.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   setFilteredEvents(filteredEvents);
// } else {
//   setFilteredEvents(allEvents);
// }