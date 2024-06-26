import React, { useState, useEffect } from "react";
import { TEvent } from "../types/types";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const SearchBar = ({
  allEvents,
  setFilteredEvents,
}: {
  allEvents: TEvent[];
  setFilteredEvents: (events: TEvent[]) => void;
}) => {
  const [input, setInput] = useState<string>("");
  const [selectedEventType, setSelectedEventType] = useState<string>("All");
  const [isOpen, setIsOpen] = useState(false);
  const eventTypes: string[] = ["All", "Workshop", "Activity", "Tech talk"];

  const toggleDropdown = () => setIsOpen(!isOpen);

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
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white/5 px-3 py-2 text-sm text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 hover:ring-indigo-500">
            <div className="whitespace-nowrap text-left">
              <div className="w-[63px]">{selectedEventType}</div>
            </div>
            <ChevronDownIcon
              className="-mr-1 h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-gray-900 shadow-lg ring-1 ring-white/10 ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {eventTypes.map((type) => (
                <Menu.Item key={type}>
                  {({ active }) => (
                    <div
                      onClick={() => {
                        setSelectedEventType(type);
                      }}
                      className={classNames(
                        active ? "bg-gray-700 text-white" : "text-white",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      {type}
                    </div>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default SearchBar;
