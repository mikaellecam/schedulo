"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import iCalendarPlugin from "@fullcalendar/icalendar";
import {useEffect, useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";

export default function Calendar(){
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        fetch("/api/calendar")
           .then(response => response.json())
           .then(json => {
                setEvents(json.data);
                setLoading(false);
           })
           .catch(error => {
                console.error("Error fetching events :", error);
                setLoading(false);
           });
        }, []);

    return (
        <div className="my-0 mx-auto w-[80vw]">
            {loading ? (
                <Skeleton className="h-full w-full rounded-xl"/>
            ) : (
                <FullCalendar
                    contentHeight={"auto"}
                    handleWindowResize={true}

                    plugins = {[
                        timeGridPlugin,
                        dayGridPlugin,
                        interactionPlugin,
                        iCalendarPlugin ]}

                    initialView = "timeGridWeek"

                    weekends={false}
                    allDaySlot={false}

                    slotMinTime={"08:00:00"}
                    slotMaxTime={"20:00:00"}

                    editable={true}
                    selectable={true}

                    eventTextColor={"black"}
                    events={events}
                />
            )}
        </div>
    );
}