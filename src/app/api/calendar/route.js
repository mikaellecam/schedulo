import {NextResponse} from "next/server";
// @ts-ignore
import ical from 'ical.js';

const groupLink = "https://ade-web-consult.univ-amu.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?projectId=8&resources=644&calType=ical&firstDate=2024-01-01&lastDate=2024-07-01";

export async function GET(){
    try{
        const response = await fetch(groupLink);
        if(!response.ok){
            return NextResponse.json({status: 400, error: "Failed to fetch calendar"});
        }
        const data = await response.text();

        const jcalData = ical.parse(data);
        const comp = new ical.Component(jcalData, null);
        const vevents = comp.getAllSubcomponents();

        // @ts-ignore
        const parsedEvents = vevents.map(vevent => {
            const event = new ical.Event(vevent);
            return {
                title: event.summary,
                description: event.description,
                start: event.startDate.toJSDate(),
                end: event.endDate.toJSDate(),
                color: defineColor(event.summary),
                className: ["bold-event"],
            };
        });
        return NextResponse.json({status: 200, data: parsedEvents});
    } catch (error){
        console.error("Error fetching/parsing .ics file: ", error);
        return NextResponse.json({status: 500, error: "Error fetching/parsing .ics file"});
    }
}


const defineColor = (summary) => {
    if(summary.includes("Web")) return "#66FFFF";
    if(summary.includes("Langages")) return "#FF00FF";
    if(summary.includes("Partiel")) return "#FF0000";
    if(summary.includes("Programmation")) return "#CC66FF";
    if(summary.includes("Anglais")) return "#FFFF00";
    if(summary.includes("FERIE") || summary.includes("VACANCES")) return "#00FFFF";
    if(summary.includes("Algorithmique")) return "#0080FF";
    if(summary.includes("Projet")) return "#00FF00";
    return "#008000";
}