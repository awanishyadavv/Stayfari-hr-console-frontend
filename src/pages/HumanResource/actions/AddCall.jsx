import React, { useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../../index.js";
import './Overlay.css'

const AddCall = ({ actionOverlay, setActionOverlay, user }) => {
  const [callResult, setCallResult] = useState(null);

  const callResultOptions = [
    { value: "Connected", label: "Connected" },
    { value: "Busy", label: "Busy" },
    { value: "Not Connected 1", label: "Couldn't Connect" },
    { value: "Not Connected 2", label: "Couldn't Connect" },
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
        <button onClick={handleSave}>Save</button>
        <button onClick={() => setActionOverlay({ visible: false })}>Cancel</button>
      </div>
    </div>
  );
};

export default AddCall;