import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import { DropArg } from '@fullcalendar/interaction'
import {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/core'
import DatePickerValue from './datePicker.tsx'
import dayjs, { Dayjs } from 'dayjs';
import allLocales from '@fullcalendar/core/locales-all.js'
import router from '../../../server/routes/events.js'
import AddEvent from './addEvent.tsx'
import { Box, CircularProgress, Typography } from '@mui/material'
import { CiClock2 } from "react-icons/ci";
import AddEventPopup from './addEventPopup.tsx'

type DemoAppProps = {
  onEventDrop: (id: string) => void;
}
interface Events {
  id: string;
  name: string;
  trip_id: string;
  date: Date;
  start_time: Date;
  end_time: Date;
  description: string;
  cost: number;
}
type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  cost?: number;
};


interface Props {
  events: Events[];
  calendarEvents: CalendarEvent[];
  setUnplannedCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

interface BasicCalendarProps {
  trip_id: string | null;
  tripName: string;
  tripStartDate?: Date | null;


}

const updateEvent = async (description: string, cost: number, fullDate: Dayjs, endTime: Dayjs | null, id: string, trip_id: string | null) => {
  const date = fullDate.format('YYYY-MM-DD');
  const time = fullDate.format('HH:mm:ss');
  const end_time = endTime ? endTime.format('HH:mm:ss') : time;
  const start_time = time;
  console.log("updateEvent: ", description, cost, date, start_time, end_time, id, trip_id);
  try {
    const response = await fetch(
      `http://localhost:5000/api/events/${trip_id}/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, cost, date, start_time, end_time, id }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to change ");
    }
  } catch (error) {
    console.error(error.message);
  }
};


export function DemoApp({ onEventDrop, trip_id, events, calendarEvents, setUnplannedCalendarEvents, tripStartDate }: DemoAppProps & Props & BasicCalendarProps) {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedEventDate, setSelectedEventDate] = useState<string>();
  const [valueDatePicker, setValueDatePicker] = React.useState<Dayjs | null>(dayjs());
  const [updatedStartTime, setUpdatedStartTime] = React.useState<string>("");
  const [updatedStartMinutes, setUpdatedStartMinutes] = React.useState<string>("");
  const [updatedEndTime, setUpdatedEndTime] = React.useState<string>("");
  const [updatedEndMinutes, setUpdatedEndMinutes] = React.useState<string>("");
  const [updatedDescription, setUpdatedDescription] = React.useState<string>("");
  const [formState, setFormState] = useState({
    startHour: "00",
    startMinute: "00",
    endHour: "00",
    endMinute: "00",
    description: "",
    date: "",
  });
  const [selectedDateInfo, setSelectedDateInfo] = useState<any>(null);
  const [addEventPopup, setAddEventShowPopup] = useState(false);

  useEffect(() => {
    if (selectedEvent) {
      setFormState({
        startHour: dayjs(selectedEvent.start).format("HH"),
        startMinute: dayjs(selectedEvent.start).format("mm"),
        endHour: dayjs(selectedEvent.end).format("HH"),
        endMinute: dayjs(selectedEvent.end).format("mm"),
        description: selectedEvent.extendedProps.description || "",
        date: dayjs(selectedEvent.start).toString(),
      })
    }
  }, [selectedEvent])

  useEffect(() => {
    if (tripStartDate) {
      console.log("tripStartDate", tripStartDate);

    }

  }, [tripStartDate]);

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible)
  }

  function handleDateSelect(selectInfo) {
    // let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar;
    setSelectedDateInfo({ ...selectInfo, date: selectInfo.startStr });
    setAddEventShowPopup(true);

    calendarApi.unselect() // clear date selection
    selectInfo.view.calendar.unselect();

    // if (title) {
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   })
    // }
  }

  // function handleDrop(info: DropArg) {
  //   const id = parseInt(info.draggedEl.getAttribute('data-id') || '0');
  //   if (id) {
  //     onEventDrop(id);
  //     const newDate = info.dateStr;
  //     updateEvent(id, newDate);
  //   }
  // }
  function handleDrop(info: DropArg) {
    // const id = parseInt(info.draggedEl.getAttribute('data-id') || '0');
    const id = info.draggedEl.getAttribute('data-id');
    if (id) {
      onEventDrop(id);

      const newDate = info.dateStr;
      console.log("newDate", newDate)
      const selectedEvent = events.find(event => event.id === id.toString());

      if (selectedEvent) {
        // Przekazujesz dane z eventu i nową datę do updateEvent
        console.log("id eventu: ", id);
        const fullDate = dayjs(newDate);
        console.log("fullDate", fullDate);
        console.log("selectedEvent: ", selectedEvent)
        updateEvent(selectedEvent.description, selectedEvent.cost, fullDate, null, id.toString(), trip_id);

        setUnplannedCalendarEvents(prev => prev.filter(item => item.id !== id));

      }
    }
  }

  // function handleDrop(info: DropArg) {
  //   const id = parseInt(info.draggedEl.getAttribute('data-id') || '0');
  //   if (!id) {
  //     console.warn("No event ID found for dropped element.");
  //     return;
  //   }

  //   const newDate = info.dateStr;
  //   console.log("newDate", newDate);

  //   let selectedEvent = currentEvents.find(event => event.id === id);

  //   // If not in currentEvents, try finding in unplannedEvents
  //   if (!selectedEvent) {
  //     console.warn(`Event with ID ${id} not found in planned events. Trying unplanned events.`);
  //     selectedEvent = unplannedEvents.find(event => event.id === id);

  //     // If found, move to currentEvents
  //     if (selectedEvent) {
  //       setCurrentEvents([...currentEvents, selectedEvent]);
  //       setUnplannedEvents(prev => prev.filter(event => event.id !== id));
  //     } else {
  //       console.error(`Event with ID ${id} not found in any list.`);
  //       return;
  //     }
  //   }

  //   onEventDrop(id);

  //   // Update the event with new date
  //   updateEvent(
  //     selectedEvent.description,
  //     selectedEvent.cost,
  //     dayjs(newDate).toDate(),
  //     id,
  //     trip_id
  //   );
  // }


  function handleEventClick(info: EventClickArg) {
    console.log(`KLIK: ${info.event.title}`);
    console.log(`KLIK: ${info.event.start}`);
    console.log(`KLIK: ${info.event.end}`);
    console.log(`KLIK: ${info.event.allDay}`);
    // console.log(`KLIK: ${info.event.startEditable}`);
    console.log(`KLIK: ${info.event.id}`);
    setShowPopup(true);
    setSelectedEvent(info.event);
    // let date = info.event.start?.toLocaleDateString('pl-PL', {day: '2-digit', month: 'numeric', year:'numeric'});
    // date = date?.replaceAll(".", "-")
    const date = info.event.start;
    if (date) {
      const fullDate = `${date?.getMonth() + 1}-${date?.getDate()}-${date?.getFullYear()}`
      console.log(fullDate);
      setSelectedEventDate(fullDate);
      setValueDatePicker(dayjs(fullDate, 'M-D-YYYY'));

    }
    // if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove()
    // }
  }

  async function handleRemove() {
    console.log(selectedEvent);

    if (window.confirm(`Are you sure you want to delete the event '${selectedEvent.title}'`)) {
      selectedEvent.remove();
      // setCurrentEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
      setShowPopup(false);
    }

    try {
      console.log("Deleting event with ID:", selectedEvent.id, selectedEvent);
      const res = await fetch(`http://localhost:5000/api/events/${trip_id}/${selectedEvent.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete event");
      } else {
        console.log("Event deleted successfully");
        // Remove the event from the unplannedCalendarEvents state
        setUnplannedCalendarEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
        setCurrentEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
        alert("Event deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");

    }
  }

  async function handleUpdate() {
    let title = selectedEvent.title;
    selectedEvent.setProp('title', title)

    if (valueDatePicker) {
      const dateString = dayjs(valueDatePicker).format("YYYY-MM-DD");
      let startHour = formState.startHour.padStart(2, "0");
      let startMinute = formState.startMinute.padStart(2, "0");
      let endHour = formState.endHour.padStart(2, "0");
      let endMinute = formState.endMinute.padStart(2, "0");
      const dateStartTimeString = `${dateString}T${startHour}:${startMinute}`;
      const newStart = dayjs(dateStartTimeString).toDate();
      const dateEndTimeString = `${dateString}T${endHour}:${endMinute}`;
      const newEnd = dayjs(dateEndTimeString).toDate();
      const updatedDescription = formState.description;

      console.log("valueDatePicker:", valueDatePicker)
      if (!selectedEvent) {
        alert("Nie wybrano wydarzenia do zaktualizowania.");
        return;
      }
      selectedEvent.setStart(newStart);
      selectedEvent.setEnd(newEnd);
      // TODO: zmienić gdy dodam w bazie czas konca wydarzenia
      // selectedEvent.setEnd(dayjs(newStart).add(1, "hour").toDate());
      await updateEvent(updatedDescription, selectedEvent.cost, dayjs(newStart), dayjs(newEnd), selectedEvent.id, trip_id);

      alert("Updated")
    }
  }

  function handleEvents(events) {
    setCurrentEvents(events);

  }

  async function handleEventDrop(info) {
    const event = dayjs(info.event.start).format('YYYY-MM-DD HH:mm:ss');
    const endTime = dayjs(info.event.end).format('YYYY-MM-DD HH:mm:ss');
    console.log("Przesunięto wydarzenie:", info.event._def.publicId, "na nowy termin:", event, info.event, info.event.extendedProps);

    updateEvent(info.event.extendedProps.description, info.event.extendedProps.cost, dayjs(event), dayjs(endTime), info.event._def.publicId, trip_id);


  }
  async function handleEventResize(info) {
    const newStart = dayjs(info.event.start).format('YYYY-MM-DD HH:mm:ss');
    const newEnd = dayjs(info.event.end).format('YYYY-MM-DD HH:mm:ss');
    console.log("wydluzanie", dayjs(newStart), dayjs(newEnd))
    updateEvent(
      info.event.extendedProps.description,
      info.event.extendedProps.cost,
      dayjs(newStart),
      dayjs(newEnd),
      info.event._def.publicId,
      trip_id
    );
  }

  return (
    <div className='demo-app'>
      <Sidebar
        weekendsVisible={weekendsVisible}
        handleWeekendsToggle={handleWeekendsToggle}
        currentEvents={currentEvents}
      />
      <div className='demo-app-main'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='timeGridWeek'
          initialDate={dayjs(tripStartDate).format('YYYY-MM-DD')}
          editable={true}
          droppable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          events={calendarEvents}
          // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={(info) => { handleEventClick(info); }}
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:
          eventAdd={function(){}}
          eventChange={function(){}}
          eventRemove={function(){}}
          */
          drop={handleDrop}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
        />
      </div>

      {/* TODO: do poprawy bo się nie dodaje + poprawić wyglad unplanned events */}
      {addEventPopup && (
        <AddEventPopup addEventPopup={addEventPopup} setAddEventShowPopup={setAddEventShowPopup} selectedDateInfo={selectedDateInfo} setSelectedDateInfo={setSelectedDateInfo} trip_id={trip_id}/>

      )}
      {showPopup && (
        <div
          className="fixed inset-0 z-[1300] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="relative w-full max-w-xl bg-white text-zinc-900  rounded-2xl shadow-2xl p-6 md:p-8 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-2xl text-zinc-400 hover:text-blue-500 transition"
              aria-label="Zamknij"
            >
              ×
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-center mb-6">
              <span className="text-blue-600">{selectedEvent.title}</span>
            </h2>

            {/* Date Picker */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Date</label>
              <DatePickerValue
                value={valueDatePicker}
                setValue={setValueDatePicker}
                defaultValue={dayjs(selectedEventDate)}
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
                onClick={() => { handleRemove(); setShowPopup(false); }}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                Remove
              </button>
              <button
                onClick={() => { handleUpdate(); setShowPopup(false); }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}


    </div >
  )
}


function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

function Sidebar({ weekendsVisible, handleWeekendsToggle, currentEvents }) {
  return (
    <div className='demo-app-sidebar'>
      {/* <div className='demo-app-sidebar-section'>
        <h2>Instructions</h2>
        <ul>
          <li>Select dates and you will be prompted to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to delete it</li>
        </ul>
      </div> */}
      {/* <div className='demo-app-sidebar-section'>
        <label>
          <input
            type='checkbox'
            checked={weekendsVisible}
            onChange={handleWeekendsToggle}
          ></input>
          toggle weekends
        </label>
      </div> */}
      {/* <div className='demo-app-sidebar-section'>
        <h2>All Events ({currentEvents.length})</h2>
        <ul>
          {currentEvents.map((event) => (
            <SidebarEvent key={event.id} event={event} />
          ))}
        </ul>
      </div> */}
    </div>
  )
}

function SidebarEvent({ event }) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
      <i>{event.title}</i>
    </li>
  )
}

export default function BasicDateCalendar({ trip_id, tripName, tripStartDate }: BasicCalendarProps) {
  useEffect(() => {
    if (tripStartDate) {
      console.log("tripStartDate", tripStartDate);
    }

  }, [tripStartDate]);
  const draggableEl = useRef<HTMLDivElement>(null);
  // const [externalEvents, setExternalEvents] = useState([
  //   { id: 1, title: "nowe zadanie", duration: "01:00" },
  //   { id: 2, title: "spotkanie", duration: "05:00" },

  // ]);
  const [events, setEvents] = useState<Events[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [unplannedCalendarEvents, setUnplannedCalendarEvents] = useState<CalendarEvent[]>([]);
  const [unplannedEvents, setUnplannedEvents] = useState<Events[]>([]);
  const [refreshFlag, setRefreshFlag] = React.useState<boolean>(false);
  const [selectedTab, setSelectedTab] = React.useState<string>("Unplanned");
  React.useEffect(() => {
    if (trip_id) {
      getEvents();
      getUnplannedEvents();
      setRefreshFlag(false);
    }
  }, [refreshFlag]);

  React.useEffect(() => {
    if (trip_id) {
      setRefreshFlag(true);
    }
  }, []);

  const getEvents = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${trip_id}`
      );
      const jsonData: Events[] = await response.json();
      console.log("GetEvents", jsonData);
      setEvents(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getUnplannedEvents = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${trip_id}/unplanned`
      );
      const jsonData: Events[] = await response.json();
      console.log("getUnplannedEvents:", jsonData);
      setUnplannedEvents(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };

  // useEffect(() => {
  //   getEvents();
  //   getUnplannedEvents();
  // }, [])

  // function mapEventsToCalendarEvents(events: Events[]): CalendarEvent[] {

  //   return events.map(ev => ({
  //     id: ev.id.toString(),
  //     title: ev.name,
  //     // start: ev.date + (ev.time ? 'T' + ev.time : ''),
  //     start: `${dayjs(ev.date).format('YYYY-MM-DD')}${ev.time ? 'T' + dayjs(ev.time).format('HH:mm:ss') : ''}`,
  //     description: ev.description,
  //     cost: ev.cost
  //   }))
  // };

  // const getTripStartDate = async () => {
  //   const response = await fetch(`http://localhost:5000/api/trips/${trip_id}`);
  //   if (response.ok) {
  //     const data = await response.json();

  //     if (Array.isArray(data) && data.length > 0) {
  //       const tripData = data[0];
  //       const startDate = tripData.start_date;
  //       if (startDate) {
  //         console.log("Trip start date set to:", startDate);
  //       }
  //     }
  //   }
  // }


  // useEffect(() => {
  //   if (trip_id) {
  //     getTripStartDate();
  //   }
  // }, [trip_id]);

  const transformEvents = (eventsFromBackend) => {
    return eventsFromBackend.map(event => {
      let startDateTime;
      let endDateTime;

      if (event.date && event.start_time) {
        const datePart = dayjs(event.date).format('YYYY-MM-DD');
        const timePart = event.start_time;  // HH:mm:ss
        startDateTime = dayjs(`${datePart}T${timePart}`);
      } else if (event.date) {
        startDateTime = dayjs(event.date);
      } else {
        startDateTime = dayjs();
      }

      if (event.date && event.end_time) {
        const datePart = dayjs(event.date).format('YYYY-MM-DD');
        const endTimePart = event.end_time; // HH:mm:ss
        endDateTime = dayjs(`${datePart}T${endTimePart}`);
      } else {
        endDateTime = null;
      }

      return {
        id: event.id,
        title: event.name || event.description,
        start: startDateTime.toISOString(),
        end: endDateTime ? endDateTime.toISOString() : undefined,
        // extendedProps: {
        description: event.description,
        cost: event.cost,
        trip_id: event.trip_id
        // }
      };
    });
  };


  useEffect(() => {
    setCalendarEvents(transformEvents(events));
    setUnplannedCalendarEvents(transformEvents(unplannedEvents));
  }, [events, refreshFlag, unplannedEvents]);

  useEffect(() => {
    let draggable: Draggable | null = null;

    if (draggableEl.current) {
      draggable = new Draggable(draggableEl.current, {
        itemSelector: '.fc-event',
        eventData: function (eventEl) {
          const id = parseInt(eventEl.getAttribute('data-id') || '0');
          //TODO: put 
          // updateEvent(time, description, cost, date,id);
          return {
            id,
            title: eventEl.innerText.trim(),
            // duration: '01:00',
            allDay: false,
          };
        },
      });
    }
    return () => {
      if (draggable) {
        draggable.destroy();
      }
    }
  }, [])

  function handleEventRemove(id: string) {
    // setExternalEvents(prev => prev.filter(event => event.id !== id))
    setUnplannedCalendarEvents(prev => prev.filter(event => event.id !== id));
  }


  const unplannedEventsCount = unplannedCalendarEvents.length;
  const eventsCount = calendarEvents.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[65%_auto] gap-0 bg-gray-50 min-h-screen">
      {/* Lewa kolumna - kalendarz */}
      <div className="mt-10 mx-6">
        <DemoApp
          onEventDrop={handleEventRemove}
          trip_id={trip_id}
          events={events}
          calendarEvents={calendarEvents}
          setUnplannedCalendarEvents={setUnplannedCalendarEvents}
          tripName={tripName}
          tripStartDate={tripStartDate}
        />
      </div>

      {/* Prawa kolumna - boczny panel */}
      <div className="bg-white rounded-xl shadow-xl p-6 space-y-8 max-h-screen overflow-y-auto">

        {/* Górna część z nazwą i postępem */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Typography variant="h4" className="font-bold">{tripName}</Typography>

          <div className="flex items-center gap-3">
            <Typography variant="h6" className="text-blue-600">
              {eventsCount > 0 ? ((1 - unplannedEventsCount / eventsCount) * 100).toFixed(0) : 0}%
            </Typography>
            <Box position="relative" display="inline-flex">
              <CircularProgress variant="determinate" value={100} sx={{ color: "#e0e0e0" }} size={50} />
              <CircularProgress
                variant="determinate"
                value={eventsCount > 0 ? (1 - unplannedEventsCount / eventsCount) * 100 : 0}
                sx={{ position: "absolute", color: "#42a5f5" }}
                size={50}
              />
            </Box>
            <Typography variant="body2" className="text-gray-600 text-center leading-tight">
              Rozplanowanych<br />wydarzeń
            </Typography>
          </div>
        </div>

        {/* Zakładki */}
        <div className="flex gap-6 border-b pb-2">
          {["Unplanned", "DayByDay"].map(tab => (
            <button
              key={tab}
              className={`font-semibold pb-2 border-b-2 transition ${selectedTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-blue-500"
                }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab === "Unplanned" ? "Lista zadań do zaplanowania" : "Dzień po dniu"}
            </button>
          ))}
        </div>

        {/* Unplanned View */}
        {selectedTab === "Unplanned" && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg ">
              <AddEvent setRefreshFlag={setRefreshFlag} trip_id={trip_id} />
            </div>

            <div
              id="draggable-el"
              ref={draggableEl}
              className="flex flex-col gap-3 p-4 max-h-96 overflow-y-auto "
            >
              {unplannedCalendarEvents.length === 0 ? (
                <p className="text-gray-500 text-center">Brak zadań do zaplanowania</p>
              ) : (
                unplannedCalendarEvents.map(event => (
                  <div
                    key={event.id}
                    className="fc-event bg-white shadow-sm hover:shadow-md p-4 rounded-lg border transition space-y-1"
                    data-id={event.id}
                  >
                    <p className="font-medium">{event.title}</p>
                    {event.description && (
                      <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Day by Day View */}
        {selectedTab === "DayByDay" && (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {calendarEvents
              .slice()
              .sort((a, b) => dayjs(a.start).diff(dayjs(b.start)))
              .map(event => (
                <div
                  key={event.id}
                  className="bg-white shadow-sm hover:shadow-md p-4 rounded-lg border transition space-y-1"
                >
                  <div className="text-sm text-gray-500">
                    {dayjs(event.start).format("DD-MM-YYYY")}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <CiClock2 />
                    <span>{dayjs(event.start).format("HH:mm")} - {dayjs(event.end).format("HH:mm")}</span>
                  </div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  {event.description && (
                    <p className="text-sm text-gray-500">{event.description}</p>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );

}