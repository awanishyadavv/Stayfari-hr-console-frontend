import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../../index.js";
import './Overlay.css'

const AddReferral = ({ actionOverlay, setActionOverlay }) => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');

  useEffect(() => {
    // Load existing referral data if available
    if (actionOverlay.candidate.referral) {
      const { employeeName, employeeCode, employeeEmail } = actionOverlay.candidate.referral;
      setEmployeeName(employeeName);
      setEmployeeCode(employeeCode);
      setEmployeeEmail(employeeEmail);
    }
  }, [actionOverlay.candidate.referral]);

  const saveAddReferralAction = async () => {
    try {
      const response = await axios.post(
        `${server}/hr/addNewReferral`,
        {
          email: actionOverlay.candidate.email,
          employeeName,
          employeeCode,
          employeeEmail,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Referral Added Successfully");
      setActionOverlay({ ...actionOverlay, visible: false });
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error Saving data");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveAddReferralAction();
  };

  const resetForm = () => {
    setEmployeeName("");
    setEmployeeCode("");
    setEmployeeEmail("");
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
        <form onSubmit={handleSave}>
          <div className="overlay-content-container">
            <div className="display-flex">
              <div className="overlay-key">Employee Name</div>
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                required
              />
            </div>
            <div className="display-flex">
              <div className="overlay-key">Employee Code</div>
              <input
                type="text"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                required
              />
            </div>
            <div className="display-flex">
              <div className="overlay-key">Employee Email</div>
              <input
                type="email"
                value={employeeEmail}
                onChange={(e) => setEmployeeEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit">Save</button>
          <button onClick={() => setActionOverlay({ visible: false })}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddReferral;
