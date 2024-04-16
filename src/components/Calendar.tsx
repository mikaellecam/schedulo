"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {useEffect, useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";

export default function Calendar(){
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startingView, setStartingView] = useState("timeGridWeek");

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

    useEffect(() => {
        if(window.innerWidth < 768){
            setStartingView("timeGridDay");
        }
    }, []);

    return (
        <div className="my-0 mx-auto w-[80vw]">
            {loading ? (
                <Skeleton className="h-full w-full rounded-xl"/>
            ) : (
                <FullCalendar
                    contentHeight={"auto"}
                    handleWindowResize={true}

                    headerToolbar={
                        {
                            left: "prev,next today",
                            center: "title",
                            right: "timeGridWeek,timeGridDay"
                        }
                    }

                    plugins = {[
                        timeGridPlugin,
                        dayGridPlugin,
                        interactionPlugin,
                    ]}

                    initialView = {startingView}

                    eventClick = { (info) => {
                        info.jsEvent.preventDefault();

                        if(info.event.url)
                            window.open(info.event.url)
                    }}

                    weekends={false}
                    allDaySlot={false}

                    nowIndicator={true}

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