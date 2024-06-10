import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../../index.js";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import './Overlay.css'

const MoveTo = ({ actionOverlay, setActionOverlay }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [comment, setComment] = useState("");

  const options = [
    { value: "New Profile", label: "New Profile" },
    { value: "Screening", label: "Screening" },
    { value: "HR Round", label: "HR Round" },
    { value: "Technical Round 1", label: "Technical Round 1" },
    { value: "Technical Round 2", label: "Technical Round 2" },
    { value: "Senior HR", label: "Senior HR" },
    { value: "Final Round", label: "Final Round" },
    { value: "Final Shortlisted", label: "Final Shortlisted" },
    { value: "Rejected", label: "Rejected" },
  ];

  const saveShortlistAction = async () => {
    try {
      const response = await axios.post(
        `${server}/hr/change_stage/${actionOverlay.candidate.email}`,
        {
          stage: selectedOption,
          current_stage_comment: comment,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Stage Changes Successfully");
      setActionOverlay({ ...actionOverlay, visible: false });
      resetForm();
      setSelectedOption(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error Saving data");
    }
  };

  const handleSave = () => {
    saveShortlistAction();
  };

  const resetForm = () => {
    setSelectedOption(null);
    setComment("");
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
        <div className="display-flex">
          <div className="overlay-key">Move to</div>
          <Dropdown
             options={options}
            onChange={(selectedOption) =>
              setSelectedOption(selectedOption.value)
            }
            value={selectedOption}
            placeholder="Select an option"
          />
        </div>
        <div className="display-flex">
          <div className="overlay-key">Comment</div>
          <textarea
            placeholder="Enter Comment"
            cols={27}
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button onClick={handleSave}>Save</button>
        <button onClick={() => setActionOverlay({ visible: false })}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MoveTo;
