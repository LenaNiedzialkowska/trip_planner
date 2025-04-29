import React, { useEffect, useRef, useState } from 'react'
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
type DemoAppProps = {
  onEventDrop: (id: number) =>void;
}

export function DemoApp({onEventDrop}: DemoAppProps) {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
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

  function handleDrop(info: DropArg) {
    const id = parseInt(info.draggedEl.getAttribute('data-id') || '0');
    if(id){
      onEventDrop(id)

    }
  }

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
    if(date){
      const fullDate = `${date?.getMonth()+1}-${date?.getDate()}-${date?.getFullYear()}`
      console.log(fullDate);
      setSelectedEventDate(fullDate);
    }
    // if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove()
    // }
  }

  function handleRemove () {
    console.log(selectedEvent);

    if (window.confirm(`Are you sure you want to delete the event '${selectedEvent.title}'`)) {
      selectedEvent.remove()
    }
  }

  function handleUpdate(){
    // let title = prompt(selectedEvent.title)
    let title = selectedEvent.title;
    selectedEvent.setProp('title',title)
    if(valueDatePicker){
      selectedEvent.setStart(dayjs(valueDatePicker).toDate());
      selectedEvent.setEnd(dayjs(valueDatePicker).toDate());
      alert("Updated")
    }
  }

  function handleEvents(events) {
    setCurrentEvents(events)
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
          initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={(info) => {handleEventClick(info); }}
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed
        /* you can update a remote database when these fire:
        eventAdd={function(){}}
        eventChange={function(){}}
        eventRemove={function(){}}
        */
       drop={handleDrop}
        />
      </div>
      {showPopup && (
  <div className=" bg-gray-400/50 flex items-center justify-center h-full w-full z-[1300] fixed top-0 left-0">
    <div className="relative w-[70vw] h-[80vh] bg-white opacity-100 flex items-center justify-center flex-col rounded-lg shadow-lg p-6">
      <p className="text-xl mb-4">
        {selectedEvent.start.toLocaleDateString('pl-PL', {day: '2-digit', month: 'numeric', year:'numeric', hour: '2-digit', minute: 'numeric'})}
        <DatePickerValue value={valueDatePicker} setValue={setValueDatePicker} defaultValue={dayjs(selectedEventDate)}/>
      
      </p>
      <button 
        onClick={() => setShowPopup(false)} 
        className="absolute top-2 right-2 mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Close
      </button>
      <button 
        onClick={()=>{handleRemove(); setShowPopup(false);}} 
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Remove
      </button>
      <button 
        onClick={()=>{handleUpdate(); setShowPopup(false);}} 
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
      <div className='demo-app-sidebar-section'>
        <label>
          <input
            type='checkbox'
            checked={weekendsVisible}
            onChange={handleWeekendsToggle}
          ></input>
          toggle weekends
        </label>
      </div>
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

export default function BasicDateCalendar() {
  const draggableEl = useRef<HTMLDivElement>(null);
  const [externalEvents, setExternalEvents ] = useState([
    {id: 1, title:"nowe zadanie", duration: "01:00"},
    {id: 2, title:"spotkanie", duration: "05:00"},
    
  ]);



  useEffect(() => {
    let draggable: Draggable | null = null;

    if (draggableEl.current) {
      draggable = new Draggable(draggableEl.current, {
        itemSelector: '.fc-event',
        eventData: function (eventEl) {
          const id = parseInt(eventEl.getAttribute('data-id') || '0')
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

  function handleEventRemove (id: number){
    setExternalEvents(prev => prev.filter(event => event.id !== id))

  }

  return (
    <div className="grid grid-cols-[auto_350px] gap-14">

      <DemoApp onEventDrop={handleEventRemove}/>
      <div>
        <h2>Lista zadań do zaplanowania</h2>
        <div id='draggable-el' ref={draggableEl}>
          {externalEvents.map(event =>(
            <div key={event.id} className='fc-event' data-id={event.id}>
              {event.title}
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}