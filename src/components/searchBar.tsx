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
  const [selectedEventType, setSelectedEventType] = useState<string>("All");
  const eventTypes: string[] = ["All", "Workshop", "Activity", "Tech talk"];

  useEffect(() => {
    const filteredEvents = allEvents.filter((event) => {
      const nameMatches: boolean = event.name
        .toLowerCase()
        .includes(input.toLowerCase());

      if (selectedEventType !== "All") {
        const typeMatches: boolean =
          event.event_type ===
          selectedEventType.split(" ").join("_").toLowerCase();
        return typeMatches && nameMatches;
      }
      return nameMatches;
    });

    if (filteredEvents) {
      setFilteredEvents(filteredEvents);
    }
  }, [input, allEvents, setFilteredEvents, selectedEventType]);
  return (
    <div className="flex justify-between gap-4">
      <input
        type="text"
        placeholder="Search events..."
        value={input}
        onChange={(e): void => {
          setInput(e.target.value);
        }}
        className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
      />
      <select
        value={selectedEventType}
        onChange={(e) => setSelectedEventType(e.target.value)}
        className="block rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
      >
        {eventTypes.map((type) => (
          <option
            key={type}
            value={type}
            className="bg-gray-800 text-white py-1 px-2 rounded-md hover:bg-gray-700"
          >
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;
