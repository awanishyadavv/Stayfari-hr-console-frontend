import React, { useState, useEffect, useCallback, useMemo } from "react";
import Dropdown from "react-dropdown";
import { useTable, useSortBy } from "react-table";
import "./HumanResource.css";
import "./Interviews.css";
import toast from "react-hot-toast";
import { server } from "../..";
import axios from "axios";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoIosDocument } from "react-icons/io";

const Row = ({ row, handleCheckboxChange, handleCommentChange, loadResume}) => {
  const [comment, setComment] = useState("");
  const onCommentChange = (e) => {
    const newComment = e.target.value;
    setComment(newComment);
    handleCommentChange(row.original.email, newComment);
  };

  return (
    <tr {...row.getRowProps()}>
      {row.cells.map((cell) => (
        <td {...cell.getCellProps()} className="table-cell">
          {cell.column.Header === "Completed" ? (
            <div className="candidate-info">
              <textarea
                placeholder="Enter Comment"
                cols={27}
                rows={2}
                value={comment}
                onChange={onCommentChange}
              ></textarea>
              <div className="poc poc1">
                <div>Mark Completed </div>
                <IoIosArrowRoundForward  className="arrow"/>
                <input
                  type="checkbox"
                  checked={row.original.isInterviewCompleted}
                  onChange={() => handleCheckboxChange(row.original.email, !row.original.isInterviewCompleted, comment)}
                />
              </div>
            </div>
          ) : cell.column.Header === "Resume" ? (
            <div className="candidate-info1">
              <IoIosDocument onClick={() => loadResume(row.original._id)}/>
            </div>
          ) : (
            cell.render("Cell")
          )}
        </td>
      ))}
    </tr>
  );
};

const Interviews = () => {
  const [data, setData] = useState([]);
  const [requestedDate, setRequestedDate] = useState(new Date().toISOString().split("T")[0]);

  const loadData = useCallback(async (date) => {
    try {
      const response = await axios.get(`${server}/hr/list-interviews`, {
        params: { date: date === "loadall" ? date : requestedDate },
        withCredentials: true,
      });
      const fetchedData = response.data.interviews;
      setData(fetchedData || []);
      toast.success(response.data.message || "Data loaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error loading data");
      setData([]);
    }
  }, [requestedDate]);

  const isCompletedSave = async (email, isCompleted, comment) => {
    try {
      const response = await axios.post(`${server}/hr/isInterviewCompleted`, {
        email,
        isCompleted,
        comment,
      });
      toast.success(response.data.message || "Data saved successfully");
      loadData(requestedDate);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving data");
    }
  };

  useEffect(() => {
    loadData(requestedDate);
  }, [loadData, requestedDate]);

  const loadResume = async (candidateId) => {
      await axios
      .get(`${server}/file-handle/resume/${candidateId}`, {
        withCredentials: true,
      })
      .then((res) => {
        const googleDriveUrl = `https://drive.google.com/file/d/${res.data.resume.googleUploadedResumeId}/view`;
        window.open(googleDriveUrl, '_blank');
      })
      .catch((error) => {
        toast.error(error);
      });
  }

  const handleDateChange = (event) => {
    setRequestedDate(event.target.value);
  };

  const handleLoadAllUpcoming = () => {
    loadData("loadall");
  };

  const handleCheckboxChange = (email, isCompleted, comment) => {
    isCompletedSave(email, isCompleted, comment);
  };

  const handleCommentChange = (email, comment) => {
    // Comment change handler can be used for debouncing or any other logic if required
  };

  const columns = useMemo(() => [
    {
      Header: "Candidate Info",
      accessor: "candidate_info",
      Cell: ({ row }) => (
        <div className="candidate-info text-align-center">
          <div>{row.original.name}</div>
          <div>{row.original.email}</div>
          <a
            href={`https://wa.me/${row.original.phone}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.original.phone}
          </a>
        </div>
      ),
    },
    {
      Header: "Experience",
      accessor: "experience",
      Cell: ({ row }) => (
        <div className="candidate-info">
          <div className="poc poc1">
            <h4>Experience: </h4>
            <div>{row.original.experience}</div>
          </div>
          <div>{row.original.current_Job}</div>
        </div>
      ),
    },
    {
      Header: "Interview Details",
      accessor: "interview-details",
      Cell: ({ row }) => (
        <div>
          <div className="candidate-info">{row.original.new_interview.date}</div>
          <div className="candidate-info">{row.original.new_interview.time}</div>
          <div className="candidate-info">{row.original.new_interview.zone}</div>
          <a
            href={row.original.new_interview.interviewLink}
            className="candidate-info"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join Interview
          </a>
        </div>
      ),
    },
    {
      Header: "Interviewers",
      accessor: "interviewers",
      Cell: ({ row }) => (
        <div className="candidate-info">
          {row.original.new_interview.interviewers.map((interviewer) => (
            <div key={interviewer.id}>{interviewer.name}</div>
          ))}
        </div>
      ),
    },
    {
      Header: "Shortlisted Role",
      accessor: "Source and Profile",
      Cell: ({ row }) => (
        <div className="candidate-info">
          <div className="poc">
            <p>Role:</p>
            <div>{row.original.shortlisted_profile_for}</div>
          </div>
          <div className="poc">
            <p>POC:</p>
            <p>{row.original.poc_hr}</p>
          </div>
          {row.original.referral ? (
            <div className="poc">
              <p>Ref:</p>
              <div>{row.original.referral.employeeEmail}</div>
            </div>
          ) : (
            <div>{row.original.sourceOfProfile}</div>
          )}
        </div>
      ),
    },
    {
      Header: "Completed",
      accessor: "isInterviewCompleted",
    },
    {
      Header: "Resume",
      accessor: "cv",
    },
  ], []);

  const tableData = useMemo(() => data.slice().reverse(), [data]);

  const sortedData = useMemo(() => {
    return [...tableData].sort((a, b) => {
      const dateA = new Date(`${a.new_interview.date}T${a.new_interview.time} ${a.new_interview.zone}`);
      const dateB = new Date(`${b.new_interview.date}T${b.new_interview.time} ${b.new_interview.zone}`);
      return dateA - dateB;
    });
  }, [tableData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data: sortedData },
    useSortBy
  );

  return (
    <div className="container">
      <div className="section">
        <button className="create-new" onClick={handleLoadAllUpcoming}>
          Load All Upcoming
        </button>
        <input type="date" value={requestedDate} onChange={handleDateChange} />
      </div>
      <div className="data-table">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="table-header"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <Row
                    key={row.id}
                    row={row}
                    handleCheckboxChange={handleCheckboxChange}
                    handleCommentChange={handleCommentChange}
                    loadResume={loadResume}
                  />
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="no-data-cell">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Interviews;
