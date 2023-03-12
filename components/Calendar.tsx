import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import { getJobForCalendar } from "../services/JobServices";
import { useCookies } from "react-cookie";
import { splitTFromISO } from "../services/UtilsServices";
import { useRouter } from "next/router";

const Calendar = () => {
  const [cookies, setCookie] = useCookies(["token"]);
  const router = useRouter();

  const [allJobs, setAllJobs] = useState([]);
  const [timeEvents, setTimeEvents] = useState<Object[]>([]);

  const fetchData = async () => {
    try {
      const response = await getJobForCalendar(cookies.token);
      setAllJobs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const format = () => {
    if (allJobs.length === 0) return;
    else {
      allJobs.map((job) => {
        return setTimeEvents((timeEvents) => [
          ...timeEvents,
          {
            // this object will be "parsed" into an Event Object
            title: job.title, // a property!
            date: splitTFromISO(job.deadline), // a property!
            // end: splitTFromISO(job.deadline), // a property! ** see important note below about 'end' **
            id: job._id,
          },
        ]);
      });
    }
    setAllJobs([]);
  };

  const handleEventClick = (eventClickInfo: any) => {
    const id = eventClickInfo.event._def.publicId;
    router.push(`/job/details/${id}`);
  };

  useEffect(() => {
    setTimeEvents([]);
    fetchData();
  }, []);

  useEffect(() => {
    format();
  }, [allJobs]);

  return (
    <section>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={timeEvents}
        eventClick={handleEventClick}
      />
    </section>
  );
};

export default Calendar;
