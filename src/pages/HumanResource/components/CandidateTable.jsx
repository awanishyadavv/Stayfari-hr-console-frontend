import React from "react";
import Dropdown from "react-dropdown";
import { useTable, useSortBy } from "react-table";
import './CandidateTable.css';
import { IoIosArrowRoundForward } from "react-icons/io";

const CandidateTable = ({ data, handleAction }) => {
  const actionOption = [
    { value: "Add Call", label: "Add Call" },
    { value: "Add Referral", label: "Add Referral" },
    { value: "Schedule Interview", label: "Schedule Interview" },
    { value: "Move To", label: "Move To" },
    { value: "Add Comment", label: "Add Comment" },
  ];

  const resumeOption = [
    { value: "Upload", label: "Upload" },
    { value: "View", label: "View" },
    { value: "Download", label: "Download" },
  ];

  const columns = React.useMemo(
    () => [
      {
        Header: "Candidate Info",
        accessor: "candidate_info",
        Cell: ({ row }) => (
          <div className="candidate-info text-align-center">
            <div>{row.original.name}</div>
            <div>{row.original.email}</div>
            <a href={`https://wa.me/${row.original.phone}`} target="_blank" rel="noopener noreferrer">{row.original.phone}</a>
          </div>
        ),
      },
      {
        Header: "Experience",
        accessor: "experience",
        Cell: ({ row }) => (
          <div className="candidate-info experience-section">
            <div className="experience-section-experience">
              <div>Experience</div>
              <IoIosArrowRoundForward />
            <div>{row.original.experience}</div>
            </div>
            <div>{row.original.current_Job}</div>
          </div>
        ),
      },
      {
        Header: "Highest Degree",
        accessor: "degree",
        Cell: ({ row }) => (
          <div className="candidate-info">{row.original.highest_Degree}</div>
        ),
      },
      {
        Header: "Shortlisted Role",
        accessor: "source_and_profile",
        Cell: ({ row }) => (
          <div className="candidate-info">
            <div className="poc">
              <p>Role</p>
              <IoIosArrowRoundForward />
              <div>{row.original.shortlisted_profile_for}</div>
            </div>
            <div className="poc">
              <p>POC</p>
              <IoIosArrowRoundForward />
              <p>{row.original.poc_hr}</p>
            </div>
            {row.original.referral ? (
              <div className="poc">
                <p>Ref</p>
              <IoIosArrowRoundForward />
                <div>{row.original.referral.employeeEmail}</div>
              </div>
            ) : (
              <div>{row.original.sourceOfProfile}</div>
            )}
          </div>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="candidate-info text-align-center">
            <Dropdown
              options={actionOption}
              onChange={(selectedOption) =>
                handleAction(selectedOption.value, row.original)
              }
              placeholder="Select"
            />
          </div>
        ),
      },
      {
        Header: "Resume",
        accessor: "cv",
        Cell: () => (
          <div className="candidate-info">
            <Dropdown
              options={resumeOption}
              placeholder="Select"
            />
          </div>
        ),
      },
    ],
    [handleAction]
  );

  const tableData = React.useMemo(() => data.slice().reverse(), [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: tableData }, useSortBy);

  return (
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
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} className="table-cell">
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
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
  );
};

export default CandidateTable;
