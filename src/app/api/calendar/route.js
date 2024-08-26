import {NextResponse} from "next/server";
import { auth } from "../../../auth";
import ical from 'ical.js';

// const groupLink = "https://ade-web-consult.univ-amu.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?projectId=8&resources=644&calType=ical&firstDate=2024-01-01&lastDate=2024-07-01";
// const groupPPPE = "https://ade-web-consult.univ-amu.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?projectId=8&resources=125727&calType=ical&firstDate=2024-01-01&lastDate=2024-07-01";
// const groupEnglish = "https://ade-web-consult.univ-amu.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?projectId=8&resources=645&calType=ical&firstDate=2024-01-01&lastDate=2024-07-01";

export async function GET(){
    const session = await auth();
    if(!session) return NextResponse.json({status: 401, error:"Unauthorized request"});

    try{
        const responseTD = await fetch(groupLink);
        const responsePPPE = await fetch(groupPPPE);
        const responseEnglish = await fetch(groupEnglish);
        if(!responseTD.ok && !responsePPPE.ok && !responseEnglish.ok){
            return NextResponse.json({status: 400, error: "Failed to fetch calendars"});
        }
        const data = await responseTD.text();
        const dataPPPE = await responsePPPE.text();
        const dataEnglish = await responseEnglish.text();

        const jcalData = ical.parse(data);
        const jcalDataPPPE = ical.parse(dataPPPE);
        const jcalDataEnglish = ical.parse(dataEnglish);

        const comp = new ical.Component(jcalData, null);
        const compPPPE = new ical.Component(jcalDataPPPE, null);
        const compEnglish = new ical.Component(jcalDataEnglish, null);

        const vevents = comp.getAllSubcomponents();
        const veventsPPPE = compPPPE.getAllSubcomponents();
        const veventsEnglish = compEnglish.getAllSubcomponents();


        let parsedEvents = vevents.map(vevent => {
            const event = new ical.Event(vevent);
            if(filterEnglishForMain(event.summary)){
                return {
                    title: event.summary,
                    description: event.description,
                    start: event.startDate.toJSDate(),
                    end: event.endDate.toJSDate(),
                    color: defineColor(event.summary),
                };
            }
        });
        let parsedEventsPPPE = veventsPPPE.map(vevent => {
           const event = new ical.Event(vevent);
           if(verifyPPPEGroup(event.summary, session.user.calendar_url.at(-1))){
               return {
                   title: event.summary,
                   description: event.description,
                   start: event.startDate.toJSDate(),
                   end: event.endDate.toJSDate(),
                   color: "green",
               };
           }
        });
        let parsedEventsEnglish = veventsEnglish.map(vevent => {
            const event = new ical.Event(vevent);
            if(filterEnglishLesson(event.summary, session.user.calendar_url.at(-3), true)){
                return {
                    title: event.summary,
                    description: event.description,
                    start: event.startDate.toJSDate(),
                    end: event.endDate.toJSDate(),
                    color: defineColor(event.summary),
                };
            }
        });

        parsedEvents = parsedEvents.filter(event => event !== undefined);
        parsedEventsPPPE = parsedEventsPPPE.filter(event => event !== undefined);
        parsedEventsEnglish = parsedEventsEnglish.filter(event => event !== undefined)

        const combinedEvents = [
            ...parsedEvents,
            ...parsedEventsPPPE,
            ...parsedEventsEnglish
        ];

        return NextResponse.json({status: 200, data: combinedEvents});
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

const verifyPPPEGroup= (summary, groupNumberStr) => {
    return summary.includes("PPPE") && summary.includes("TD Gpe " + groupNumberStr);
}

const filterEnglishForMain = (summary) => {
    return !summary.includes("Anglais");
}
const filterEnglishLesson = (summary) => {
    return summary.includes("Anglais");
}