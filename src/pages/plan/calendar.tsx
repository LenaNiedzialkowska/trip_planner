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

type DemoAppProps = {
  onEventDrop: (id: number) => void;
}
interface Events {
  id: number;
  name: string;
  trip_id: number;
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
  trip_id: number | null;
  events: Events[];
  calendarEvents: CalendarEvent[];
  setUnplannedCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}


const updateEvent = async (description: string, cost: number, fullDate: Date, id: number, trip_id: number | null) => {
  const date = dayjs(fullDate).format('YYYY-MM-DD');
  const time = dayjs(fullDate).format('HH:mm:ss');
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


export function DemoApp({ onEventDrop, trip_id, events, calendarEvents, setUnplannedCalendarEvents }: DemoAppProps & Props) {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedEventDate, setSelectedEventDate] = useState<string>();
  const [valueDatePicker, setValueDatePicker] = React.useState<Dayjs | null>(dayjs());


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
    const id = parseInt(info.draggedEl.getAttribute('data-id') || '0');
    if (id) {
      onEventDrop(id); // Możesz wywołać onEventDrop, jeśli chcesz zaktualizować lokalny stan

      const newDate = info.dateStr; // Tutaj przekazujesz nową datę
      console.log("newDate", newDate)
      const selectedEvent = events.find(event => event.id === id); // Znajdź wybrane wydarzenie w currentEvents

      if (selectedEvent) {
        // Przekazujesz dane z eventu i nową datę do updateEvent
        console.log("id eventu: ", id);
        const fullDate = dayjs(newDate).toDate();
        console.log("fullDate", fullDate);
        updateEvent(selectedEvent.description, selectedEvent.cost, fullDate, id, trip_id);

        setUnplannedCalendarEvents(prev => prev.filter(item => parseInt(item.id, 10) !== id));

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
  const fullDate = dayjs(newDate).toDate();

  console.log("Przesunięto wydarzenie:", id, "na nowy termin:", newDate);

  const selectedEvent = events.find(ev => ev.id === id);
  if (selectedEvent) {
    updateEvent(selectedEvent.description, selectedEvent.cost, fullDate, id, trip_id);
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
          initialView='dayGridMonth'
          editable={true}
          droppable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          events={calendarEvents}
          initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
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
        <div className=" bg-gray-400/50 flex items-center justify-center h-full w-full z-[1300] fixed top-0 left-0">
          <div className="relative w-[70vw] h-[80vh] bg-white opacity-100 flex items-center justify-center flex-col rounded-lg shadow-lg p-6">
            <p className="text-xl mb-4">
              {selectedEvent.start.toLocaleDateString('pl-PL', { day: '2-digit', month: 'numeric', year: 'numeric', hour: '2-digit', minute: 'numeric' })}
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

export default function BasicDateCalendar({ trip_id }: Props) {
  const draggableEl = useRef<HTMLDivElement>(null);
  const [externalEvents, setExternalEvents] = useState([
    { id: 1, title: "nowe zadanie", duration: "01:00" },
    { id: 2, title: "spotkanie", duration: "05:00" },

  ]);
  const [events, setEvents] = useState<Events[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [unplannedCalendarEvents, setUnplannedCalendarEvents] = useState<CalendarEvent[]>([]);
  const [unplannedEvents, setUnplannedEvents] = useState<Events[]>([]);
  const [refreshFlag, setRefreshFlag] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (trip_id) {
      getEvents();
      getUnplannedEvents();
      setRefreshFlag(false);
    }
  }, [refreshFlag]);

  const getEvents = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${trip_id}`
      );
      const jsonData: Events[] = await response.json();
      console.log("GetEvents",jsonData);
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

  function mapEventsToCalendarEvents(events: Events[]): CalendarEvent[] {
    
    return events.map(ev => ({
      id: ev.id.toString(),
      title: ev.name,
      // start: ev.date + (ev.time ? 'T' + ev.time : ''),
      start: `${dayjs(ev.date).format('YYYY-MM-DD')}${ev.time ? 'T' + dayjs(ev.time).format('HH:mm:ss') : ''}`,
      description: ev.description,
      cost: ev.cost
    }))
  };

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
      start: startDateTime.toISOString(),  // FullCalendar używa ISO stringa
      extendedProps: {
        description: event.description,
        cost: event.cost,
        trip_id: event.trip_id
      }
    };
  });
};


  useEffect(() => {
    setCalendarEvents(transformEvents(events));
    setUnplannedCalendarEvents(transformEvents(unplannedEvents));
  }, [events]);

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
  }, [externalEvents])

  function handleEventRemove(id: number) {
    setExternalEvents(prev => prev.filter(event => event.id !== id))

  }

  return (
    <div className="grid grid-cols-[auto_300px] gap-8">

      <DemoApp onEventDrop={handleEventRemove} trip_id={trip_id} events={events} calendarEvents={calendarEvents} setUnplannedCalendarEvents={setUnplannedCalendarEvents} />
      <div>
        <h2>Lista zadań do zaplanowania</h2>
        <AddEvent setRefreshFlag={setRefreshFlag} trip_id={trip_id} />
        <div id='draggable-el' ref={draggableEl}>
          {unplannedCalendarEvents.map(event => (
            <div key={event.id} className="fc-event" data-id={event.id}>
              {event.title}
            </div>
          ))}
        </div>
      </div>
    </div>


  );
}