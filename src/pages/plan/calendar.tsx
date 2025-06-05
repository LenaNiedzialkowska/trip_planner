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

type DemoAppProps = {
  onEventDrop: (id: string) => void;
}
interface Events {
  id: string;
  name: string;
  trip_id: string;
  date: Date;
  time: Date;
  description: string;
  cost: number;
}
type CalendarEvent = {
  id: string;
  title: string;
  start: string;
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

const updateEvent = async (description: string, cost: number, fullDate: Dayjs, id: string, trip_id: string | null) => {
  const date = fullDate.format('YYYY-MM-DD');
  const time = fullDate.format('HH:mm:ss');
  console.log("updateEvent: ", description, cost, date, time, id, trip_id);
  try {
    const response = await fetch(
      `http://localhost:5000/api/events/${trip_id}/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, cost, date, time, id }),
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

  useEffect(() => {
    if (tripStartDate) {
      console.log("tripStartDate", tripStartDate);
    }

  }, [tripStartDate]);

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible)
  }

  function handleDateSelect(selectInfo) {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
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
        updateEvent(selectedEvent.description, selectedEvent.cost, fullDate, id.toString(), trip_id);

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

  function handleRemove() {
    console.log(selectedEvent);

    if (window.confirm(`Are you sure you want to delete the event '${selectedEvent.title}'`)) {
      selectedEvent.remove();
      // setCurrentEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
      setShowPopup(false);
    }
  }

  async function handleUpdate() {
    // let title = prompt(selectedEvent.title)


    let title = selectedEvent.title;
    selectedEvent.setProp('title', title)
    if (valueDatePicker) {
      console.log("valueDatePicker:", valueDatePicker)
      if (!selectedEvent) {
        alert("Nie wybrano wydarzenia do zaktualizowania.");
        return;
      }
      selectedEvent.setStart(dayjs(valueDatePicker).startOf('day').toDate());
      selectedEvent.setEnd(dayjs(valueDatePicker).endOf('day').toDate());
      await updateEvent(selectedEvent.title, selectedEvent.extendedProps.cost, selectedEvent.start, selectedEvent.id, trip_id);

      // getEvents(); 

      alert("Updated")
    }
  }

  function handleEvents(events) {
    setCurrentEvents(events);

  }

  function handleEventDrop(info) {
    const event = info.event;
    const id = parseInt(event.id, 10);
    const newDate = event.start;
    const fullDate = dayjs(newDate);

    console.log("Przesunięto wydarzenie:", id, "na nowy termin:", newDate);

    const selectedEvent = events.find(ev => ev.id === id.toString());
    if (selectedEvent) {
      updateEvent(selectedEvent.description, selectedEvent.cost, fullDate, id.toString(), trip_id);
    }

    // Możesz też aktualizować stan, jeśli potrzebujesz:
    // setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, date: newDate } : ev));
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

        />
      </div>
      {showPopup && (
        <div className=" bg-black/50 flex items-center justify-center h-full w-full z-[1300] fixed top-0 left-0">
          <div className="relative w-[40vw] h-[60vh] bg-white opacity-100 flex items-center justify-center flex-col rounded-lg shadow-lg p-6">
            <p className="text-xl mb-4">
              {/* {selectedEvent.start.toLocaleDateString('pl-PL', { day: '2-digit', month: 'numeric', year: 'numeric', hour: '2-digit', minute: 'numeric' })} */}
              
              <Typography variant="h4" className="font-bold mb-2">
                {selectedEvent.title}
                </Typography>
                <br/>
                <Typography variant='h6'>Actual date</Typography>
              <DatePickerValue value={valueDatePicker} setValue={setValueDatePicker} defaultValue={dayjs(selectedEventDate)} />

            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
            <button
              onClick={() => { handleRemove(); setShowPopup(false); }}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
            <button
              onClick={() => { handleUpdate(); setShowPopup(false); }}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Update
            </button>
          </div>
        </div>
      )}

    </div>
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

      if (event.date && event.time) {
        const datePart = dayjs(event.date).format('YYYY-MM-DD');  // date z backendu
        const timePart = event.time;  // HH:mm:ss
        startDateTime = dayjs(`${datePart}T${timePart}`);
      } else if (event.date) {
        startDateTime = dayjs(event.date);
      } else {
        startDateTime = dayjs();
      }

      return {
        id: event.id,
        title: event.name || event.description,
        start: startDateTime.toISOString(),
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
    <div className="grid grid-cols-1 lg:grid-cols-[65%_auto] gap-8  bg-gray-50 min-h-screen">
      <div className='mt-10 mx-6'>
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
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Typography variant="h4" className="font-bold">{tripName}</Typography>
          <div className="flex items-center gap-3">
            <Typography variant="h6" className="text-blue-600">
              {((1 - (unplannedEventsCount / eventsCount)) * 100) > 0 ? ((1 - (unplannedEventsCount / eventsCount)) * 100).toFixed(0) : 0}%
            </Typography>
            <Box position="relative" display="inline-flex">
              <CircularProgress variant="determinate" value={100} sx={{ color: "#e0e0e0" }} size={50} />
              <CircularProgress variant="determinate" value={(1 - (unplannedEventsCount / eventsCount)) > 0 ? (1 - (unplannedEventsCount / eventsCount)) * 100 : 0} sx={{ position: "absolute", color: "#42a5f5" }} size={50} />
            </Box>
            <Typography variant="body2" className="text-gray-600 text-center leading-tight">
              Rozplanowanych<br />wydarzeń
            </Typography>
          </div>
        </div>

        <div className="flex gap-6 border-b pb-2">
          {["Unplanned", "DayByDay"].map(tab => (
            <button
              key={tab}
              className={`font-semibold pb-1 border-b-2 transition ${selectedTab === tab
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-blue-500"
                }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab === "Unplanned" ? "Lista zadań do zaplanowania" : "Dzień po dniu"}
            </button>
          ))}
        </div>

        {selectedTab === "Unplanned" && (
          <div className="space-y-4">
            <AddEvent setRefreshFlag={setRefreshFlag} trip_id={trip_id} />
            <div
              id="draggable-el"
              ref={draggableEl}
              className="flex flex-col gap-3 p-4 bg-gray-100 rounded-lg max-h-96 overflow-y-auto"
            >
              {unplannedCalendarEvents.length === 0 ? (
                <p className="text-gray-500 text-center">Brak zadań do zaplanowania</p>
              ) : (
                unplannedCalendarEvents.map(event => (
                  <div
                    key={event.id}
                    className="fc-event bg-white shadow-sm hover:shadow-md p-3 rounded-md border cursor-move transition"
                    data-id={event.id}
                  >
                    {event.title}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {selectedTab === "DayByDay" && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-3 font-semibold text-gray-700 border-b pb-2">
              <span>Data</span>
              <span>Nazwa</span>
              <span>Opis</span>
            </div>  
            {events
              .slice()
              .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
              .map(event => (
                <div
                  key={event.id}
                  className="grid grid-cols-3 gap-4 bg-white shadow-sm hover:shadow-md p-3 rounded-md border transition"
                >
                  <p>{dayjs(event.date).format("DD-MM-YYYY")}</p>
                  {/* <p>{dayjs(event.time).format("HH:mm:ss")}</p> */}
                  <p>{event.name}</p>
                  <p>{event.description}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>

  );
}