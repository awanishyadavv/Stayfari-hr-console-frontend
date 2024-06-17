import React, { useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../../index.js";
import "./Overlay.css";

const AddCall = ({ actionOverlay, setActionOverlay, user }) => {
  const [callResult, setCallResult] = useState(null);

  const callResultOptions = [
    { value: "Connected, JD Shared", label: "Connected, JD Shared" },
    { value: "Not Answering", label: "Not Answering" },
    { value: "Couldn't Connected", label: "Couldn't Connect" },
    { value: "Cut the call", label: "Couldn't Connect" },
    { value: "Not Interested", label: "Not Interested" },
    { value: "Location Issue", label: "Location Issue" },
    { value: "Out of Budjet", label: "Out of Budjet" },
  ];

  const saveAddCallAction = async () => {
    try {
      const response = await axios.post(
        `${server}/hr/addNewCall`,
        {
          email: actionOverlay.candidate.email,
          caller: user.name,
          caller_Id: user._id,
          callResult: callResult.value,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Call Saved Successfully");
      setActionOverlay({ ...actionOverlay, visible: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error Saving data");
    }
  };

  const handleSave = () => {
    saveAddCallAction();
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
        <div className="overlay-content-container">
          <div className="display-flex">
            <div className="overlay-key">Caller Name</div>
            <div>{user.name}</div>
          </div>
          <div className="display-flex">
            <div className="overlay-key">Caller ID</div>
            <div>{user._id}</div>
          </div>
          <div className="display-flex">
            <div className="overlay-key">Call Result</div>
            <Dropdown
              options={callResultOptions}
              onChange={(selectedOption) => setCallResult(selectedOption)}
              value={callResult}
              placeholder="Select"
            />
          </div>
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

export default AddCall;
