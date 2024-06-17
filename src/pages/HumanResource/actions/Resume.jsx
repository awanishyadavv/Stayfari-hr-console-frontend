import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../../index.js";
import "./Overlay.css";

const Resume = ({ actionOverlay, setActionOverlay }) => {
  const [file, setFile] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);

  useEffect(() => {
    axios
      .get(`${server}/file-handle/resume/${actionOverlay.candidate._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setResumeId(res.data.resume.googleUploadedResumeId);
      })
      .catch((error) => {
        setResumeId(null);
      });
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
  setFile(selectedFile);
  setSelectedFileName(selectedFile ? selectedFile.name : null);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("candidateName", actionOverlay.candidate.name);
    formData.append("candidateEmail", actionOverlay.candidate.email);
    formData.append("candidateId", actionOverlay.candidate._id);

    try {
      const response = await axios.post(
        `${server}/file-handle/upload-file-to-google-drive`,
        formData,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setActionOverlay({ ...actionOverlay, visible: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error uploading resume");
    }
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <div className="overlay-heading">
          <p>Resume</p>
          <div>
            <p>{actionOverlay.candidate.name}</p>
            <p>{actionOverlay.candidate.email}</p>
          </div>
        </div>
        <hr className="border" />
        <div className="overlay-content-container">
          <div className="display-flex">
            <div className="overlay-key">{resumeId ? "Replace Resume" : "Upload Resume"}</div>
            <div className="upload-files">
              <label htmlFor="file-upload" className="custom-file-upload">
                {selectedFileName || "Select File"}
              </label>
              <input id="file-upload" type="file" onChange={handleFileChange} />
            </div>
          </div>
          {resumeId ? (
            <>
              <hr className="border" />
              <div className="display-flex">
                <div className="overlay-key">View Resume</div>
                <a
                  href={`https://drive.google.com/file/d/${resumeId}/view`}
                  target="_blank"
                  className="view-resume"
                >
                  View Resume
                </a>
              </div>
            </>
          ) : null}
          <div className="overlay-action-button">
            <button onClick={() => setActionOverlay({ visible: false })}>
              Close
            </button>
            <button onClick={handleUpload} className="upload-btn">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
