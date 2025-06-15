
import React, { useState } from "react";
import DatePickerValue from './datePicker.tsx'
import dayjs, { Dayjs } from 'dayjs';

interface Props {
    addEventPopup: boolean;
    setAddEventShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedDateInfo: React.Dispatch<React.SetStateAction<any>>;
    selectedDateInfo: any;
    trip_id: string | null;
}

export default function AddEventPopup({ addEventPopup, setAddEventShowPopup, selectedDateInfo, setSelectedDateInfo, trip_id }: Props) {
    const [formState, setFormState] = useState({
        name: "",
        cost: 0,
        startHour: "00",
        startMinute: "00",
        endHour: "00",
        endMinute: "00",
        description: "",
        date: "",
    });
    if (!selectedDateInfo || !selectedDateInfo.date) return null;

    async function handleAdd() {
        const dateObject = dayjs(selectedDateInfo.date);
        const date = dateObject.format('YYYY-MM-DD');

        let startHour = formState.startHour.padStart(2, "0");
        let startMinute = formState.startMinute.padStart(2, "0");
        let endHour = formState.endHour.padStart(2, "0");
        let endMinute = formState.endMinute.padStart(2, "0");

        const start_time = `${startHour}:${startMinute}`;
        const end_time = `${endHour}:${endMinute}`;

        const name = formState.name;
        const description = formState.description;
        const cost = formState.cost;
        // const trip_id = localStorage.getItem("trip_id");

        console.log("updateEvent: ", description, cost, date, start_time, end_time, trip_id);
        try {
            const response = await fetch(
                `http://localhost:5000/api/events`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // name, date, start_time, end_time, description, cost, trip_id
                    body: JSON.stringify({ name, date, start_time, end_time, description, cost, trip_id }),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to change ");
            }else{
                const data = await response.json();
                console.log("Event added successfully:", data);
                setSelectedDateInfo((prev: any) => ({
                    ...prev,
                    events: [...(prev.events || []), data]
                }));
                setFormState({
                    name: "",
                    cost: 0,
                    startHour: "00",
                    startMinute: "00",
                    endHour: "00",
                    endMinute: "00",
                    description: "",
                    date: "",
                });
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div
            className="fixed inset-0 z-[1300] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setAddEventShowPopup(false)}
        >
            <div
                className="relative w-full max-w-xl bg-white text-zinc-900  rounded-2xl shadow-2xl p-6 md:p-8 transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={() => setAddEventShowPopup(false)}
                    className="absolute top-4 right-4 text-2xl text-zinc-400 hover:text-blue-500 transition"
                    aria-label="Zamknij"
                >
                    ×
                </button>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-center mb-6">
                    Add event
                </h2>
                {/* Event name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        className="rounded-lg w-[250px] border border-zinc-300 dark:border-zinc-700 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={formState.name}
                        onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Event name"
                    />
                </div>
                {/* Date Picker */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <DatePickerValue
                        value={dayjs(selectedDateInfo.date)}
                        setValue={(newValue) => {
                            setSelectedDateInfo((prev) => ({
                                ...prev,
                                date: newValue?.toISOString()
                            }))
                        }}
                        defaultValue={dayjs(selectedDateInfo.date)}
                    />
                </div>

                {/* Time Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Start time</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                className="w-16 rounded-lg border border-zinc-300 dark:border-zinc-700 p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={formState.startHour}
                                onChange={e => setFormState(prev => ({ ...prev, startHour: e.target.value }))}
                                min={0}
                                max={23}
                                placeholder="HH"
                            />
                            <span>:</span>
                            <input
                                type="number"
                                className="w-16 rounded-lg border border-zinc-300 dark:border-zinc-700 p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={formState.startMinute}
                                onChange={e => setFormState(prev => ({ ...prev, startMinute: e.target.value }))}
                                min={0}
                                max={59}
                                placeholder="MM"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">End time</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                className="w-16 rounded-lg border border-zinc-300 dark:border-zinc-700 p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={formState.endHour}
                                onChange={e => setFormState(prev => ({ ...prev, endHour: e.target.value }))}
                                min={0}
                                max={23}
                                placeholder="HH"
                            />
                            <span>:</span>
                            <input
                                type="number"
                                className="w-16 rounded-lg border border-zinc-300 dark:border-zinc-700 p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={formState.endMinute}
                                onChange={e => setFormState(prev => ({ ...prev, endMinute: e.target.value }))}
                                min={0}
                                max={59}
                                placeholder="MM"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        className="w-full h-24 rounded-lg border border-zinc-300 dark:border-zinc-700 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={formState.description}
                        onChange={e => setFormState(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Event description"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => { handleAdd(); setAddEventShowPopup(false); }}
                        className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                    >
                        Add event
                    </button>
                </div>
            </div>
        </div>

    )
}