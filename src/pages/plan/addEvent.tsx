import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";

interface Props {
  setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
  trip_id: string | null;
}

export default function AddEvent({ setRefreshFlag, trip_id }: Props) {
  const [newEventName, setNewEventName] = useState("");

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim()) return;

    try {
      const body = {
        name: newEventName,
        trip_id: trip_id,
      };

      const response = await fetch(`http://localhost:5000/api/events/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setNewEventName("");
        setRefreshFlag(true);
      } else {
        console.error("Error: Failed to create event");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={onSubmitForm} className="flex items-center gap-2 mb-4 w-full">
      <input
        type="text"
        value={newEventName}
        onChange={(e) => setNewEventName(e.target.value)}
        placeholder="Add new event..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <button
        type="submit"
        disabled={!newEventName.trim()}
        className={`p-2 rounded-lg transition ${
          newEventName.trim()
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        title="Add event"
      >
        <IoMdAdd size={24} />
      </button>
    </form>
  );
}
