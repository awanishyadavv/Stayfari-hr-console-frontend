import React, { useContext, useState, useEffect } from "react";
import "./HumanResource.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import axios from "axios";
import toast from "react-hot-toast";
import { Context, server } from "../../index.js";
import CandidateTable from "./components/CandidateTable";
import AddCall from "./actions/AddCall";
import AddReferral from "./actions/AddReferral";
import ScheduleInterview from "./actions/ScheduleInterview";
import MoveTo from "./actions/MoveTo";
import AddComment from "./actions/AddComment";

const HumanResource = () => {
  const [dataId, setDataId] = useState("New Profile");
  const [currentData, setCurrentData] = useState([]);
  const [actionOverlay, setActionOverlay] = useState({
    visible: false,
    candidate: null,
    action: null,
  });

  const {
    isAuthenticated,
    setIsAuthenticated,
    setIsAuthenticatedAdmin,
    user,
    setUser,
  } = useContext(Context);

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

  useEffect(() => {
    loadData();
  }, [dataId]);

  const loadData = async () => {
    try {
      const response = await axios.get(
        `${server}/hr/candidates/stage/${dataId}`,
        {
          withCredentials: true,
        }
      );
      const fetchedData = response.data.candidates;
      setCurrentData(fetchedData || []);
      toast.success(response.message || "Data loaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error loading data");
      setCurrentData([]);
    }
  };

  const handleAction = (action, candidate) => {
    setActionOverlay({ visible: true, candidate, action });
  };

  const handleSaveButtonClick = () => {
    switch (actionOverlay.action) {
      case "Add Call":
        return (
          <AddCall
            actionOverlay={actionOverlay}
            setActionOverlay={setActionOverlay}
            user={user}
          />
        );
      case "Add Referral":
        return (
          <AddReferral
            actionOverlay={actionOverlay}
            setActionOverlay={setActionOverlay}
          />
        );
      case "Schedule Interview":
        return (
          <ScheduleInterview
            actionOverlay={actionOverlay}
            setActionOverlay={setActionOverlay}
          />
        );
      case "Move To":
        return (
          <MoveTo
            actionOverlay={actionOverlay}
            setActionOverlay={setActionOverlay}
          />
        );
      case "Add Comment":
        return (
          <AddComment
            actionOverlay={actionOverlay}
            setActionOverlay={setActionOverlay}
          />
        );
      default:
        break;
    }
  };

  return (
    <div className="container">
      <div className="section">
        <div className="create-new">New Candidate</div>
        <div className="load-data">
          <Dropdown
            options={options}
            onChange={(selectedOption) => setDataId(selectedOption.value)}
            placeholder="New Profiles"
          />
        </div>
      </div>
      <CandidateTable data={currentData} handleAction={handleAction} />
      {actionOverlay.visible && handleSaveButtonClick()}
    </div>
  );
};

export default HumanResource;
