"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {EventMountArg} from "@fullcalendar/core";
import Tooltip from "tooltip.js";

export default function Calendar(){
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startingView, setStartingView] = useState("timeGridWeek");
    const [loadingMessage, setLoadingMessage] = useState("Fetching data");
    const [tryAgain, setTryAgain] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch("/api/calendar")
            .then(response => response.json())
            .then(json => {
                setEvents(json.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching events :", error);
                setLoadingMessage("Error fetching data");
                setTryAgain(true);
            });
    }, []);

    useEffect(() => {
        if(window.innerWidth < 768){
            setStartingView("timeGridDay");
        }
    }, []);

    const handleMountedEvent = (info: EventMountArg) => {
        new Tooltip(info.el, {
            title: info.event.extendedProps.description,
            placement: 'top',
            trigger: 'click',
            container: 'body',
            template: `
                <div class="tooltip bg-white text-gray-800 border border-gray-300 shadow-lg rounded-lg p-2 max-w-xs z-50 overflow-x-hidden">
                    <div class="tooltip-arrow"></div>
                    <div class="tooltip-inner"></div>
                </div>
            `,
        });
    }


    return (
        <div className="w-[85vw]">
            {loading ? (
                <>
                    <h3 className="text-center">{loadingMessage}</h3>
                    {tryAgain ? (
                            <Button onClick={() => {
                                setTryAgain(false);
                                setLoadingMessage("Fetching data");
                                window.location.reload()}}>
                                Try Again
                            </Button>)
                            : null}
                </>
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

                    eventDidMount={(info) => handleMountedEvent(info)}

                    weekends={false}
                    allDaySlot={false}

                    nowIndicator={true}

                    slotMinTime={"08:00:00"}
                    slotMaxTime={"19:00:00"}

                    editable={true}
                    selectable={true}

                    eventTextColor={"black"}
                    events={events}
                />
            )}
        </div>
    );
}