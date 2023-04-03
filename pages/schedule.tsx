import Calendar from "../components/Calendar";
import Header from "../components/Header";

const SchedulePage = () => {
  return (
    <>
      <Header title="Schedule (Deadline)" />
      <div className="bg-white p-2 rounded-md">
        <Calendar />
      </div>
    </>
  );
};

export default SchedulePage;
