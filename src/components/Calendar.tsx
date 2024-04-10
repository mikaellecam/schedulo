"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/timetable.css";

export default function Calendar(){
    return (
        <div className="calendarContainer">
            <FullCalendar
                height={"100%"}
                contentHeight={"auto"}
                handleWindowResize={true}

                plugins = {[ timeGridPlugin, dayGridPlugin, interactionPlugin ]}
                initialView = "timeGridWeek"

                weekends={false}
                allDaySlot={false}

                slotMinTime={"08:00:00"}
                slotMaxTime={"20:00:00"}

                editable={true}
                selectable={true}

                initialEvents={[
                    { title: 'test event', start: '2024-04-08T10:00:00', end: '2024-04-08T12:00:00'}
                ]}
            />
        </div>
    );
}