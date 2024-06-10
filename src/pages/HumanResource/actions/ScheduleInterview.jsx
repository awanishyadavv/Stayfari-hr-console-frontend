import React, { useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../..";
import './Overlay.css'

const ScheduleInterview = ({ actionOverlay, setActionOverlay }) => {
  // Hardcoded list of interviewers
  const interviewers = [
    { name: "Awanish Yadav 1", _id: "dfjsn7sdfnskfjf" },
    { name: "Awanish Yadav 2", _id: "dfjsn7sdfnskfjfffg" },
    { name: "Awanish 3", _id: "skfksdbni7" },
  ];

  // Map the interviewers to the options state
  const [options] = useState(interviewers);

  const [selectedValues, setSelectedValues] = useState([]);
  const [date, setDate] = useState(actionOverlay.candidate.new_interview.date);
  const [time, setTime] = useState(actionOverlay.candidate.new_interview.time);
  const [zone, setZone] = useState(actionOverlay.candidate.new_interview.zone);
  const [interviewLink, setInterviewLink] = useState(actionOverlay.candidate.new_interview.interviewLink);
  const [note, setNote] = useState(actionOverlay.candidate.new_interview.note);

  const handleSelect = (selectedList) => {
    setSelectedValues(selectedList);
  };

  const handleRemove = (selectedList) => {
    setSelectedValues(selectedList);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const saveShortlistAction = async () => {
    try {
      const response = await axios.post(
        `${server}/hr/scheduleInterview`,
        {
          email: actionOverlay.candidate.email,
          time,
          date,
          zone,
          note,
          interviewers: selectedValues.map(interviewer => ({
            name: interviewer.name,
            id: interviewer._id,
          })),
          interviewLink,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Stage Changes Successfully");
      setActionOverlay({ ...actionOverlay, visible: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error Saving data");
    }
  };

  const handleSave = () => {
    saveShortlistAction();
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <div className="overlay-heading">
          <p>{actionOverlay.action}</p>
          <div>
            <p>{actionOverlay.candidate.name}</p>
            <p>{actionOverlay.candidate.email}</p>
          </div>
        </div>
        <hr className="border" />
        <div className="overlay-content-container interview-schedule-container">
          <div className="flex-column-gap-1">
            <div className="display-flex">
              <div className="overlay-key overlay-key-2">Date</div>
              <input
                type="date"
                required
                min={getCurrentDate()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="display-flex">
              <div className="overlay-key overlay-key-2">Time</div>
              <input
                type="time"
                required
                className="input-interview-1"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="display-flex">
              <div className="overlay-key overlay-key-2">Zone</div>
              <input
                type="text"
                required
                className="input-interview-1"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-column-gap-1">
            <div className="display-flex">
              <div className="overlay-key overlay-key-3">Schedule Link</div>
              <input
                type="text"
                required
                className="input-interview-1"
                value={interviewLink}
                onChange={(e) => setInterviewLink(e.target.value)}
              />
            </div>
            <div className="display-flex">
              <div className="overlay-key overlay-key-3">Assign Interviewers</div>
              <Multiselect
                options={options}
                displayValue="name"
                onSelect={handleSelect}
                onRemove={handleRemove}
                selectedValues={selectedValues}
                showCheckbox={true}
              />
            </div>
          </div>
        </div>
        <div className="display-flex">
          <div className="overlay-key overlay-key-2">Note</div>
          <textarea
            required
            cols={83}
            placeholder="Enter any comment."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="overlay-action-button">
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setActionOverlay({ visible: false })}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterview;
