import React, { useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import "./HumanResource.css";
import { MdOutlineDisplaySettings } from "react-icons/md";

const HumanResource = () => {
  const [loadePage, setLoadPage] = useState(1);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    setupTableColumns();
    setData(mapDataToTableFormat());
  }, []);

  const rawData = [
    {
      Name: "Jane Doe",
      Phone: "+1-234-567-8901",
      Email: "jane.doe@example.com",
      Education: "Master of Science in Data Science, ABC University",
      Experience: "2 years as Data Analyst at Data Insights Co.",
      PermanentLocation: "123 Main Street, Hometown, USA",
      CurrentLocation: "456 Elm Street, Metropolis, USA",
      Profile_For: "Data Analyst",
      AssignedTo: "John Smith",
      Comment: "Strong analytical skills and proficient in Python and Tableau.",
    },
    {
      Name: "John Doe",
      Phone: "+1-987-654-3210",
      Email: "john.doe@example.com",
      Education: "Bachelor of Science in Computer Science, XYZ University",
      Experience: "3 years as Software Developer at Tech Solutions Inc.",
      PermanentLocation: "789 Oak Street, Smalltown, USA",
      CurrentLocation: "101 Maple Street, Bigcity, USA",
      Profile_For: "Software Developer",
      AssignedTo: "Jane Smith",
      Comment: "Expert in JavaScript and React.",
    },
    {
        Name: "John Doe",
        Phone: "+1-987-654-3210",
        Email: "john.doe@example.com",
        Education: "Bachelor of Science in Computer Science, XYZ University",
        Experience: "3 years as Software Developer at Tech Solutions Inc.",
        PermanentLocation: "789 Oak Street, Smalltown, USA",
        CurrentLocation: "101 Maple Street, Bigcity, USA",
        Profile_For: "Software Developer",
        AssignedTo: "Jane Smith",
        Comment: "Expert in JavaScript and React.",
      },
      {
        Name: "John Doe",
        Phone: "+1-987-654-3210",
        Email: "john.doe@example.com",
        Education: "Bachelor of Science in Computer Science, XYZ University",
        Experience: "3 years as Software Developer at Tech Solutions Inc.",
        PermanentLocation: "789 Oak Street, Smalltown, USA",
        CurrentLocation: "101 Maple Street, Bigcity, USA",
        Profile_For: "Software Developer",
        AssignedTo: "Jane Smith",
        Comment: "Expert in JavaScript and React.",
      },
      {
        Name: "John Doe",
        Phone: "+1-987-654-3210",
        Email: "john.doe@example.com",
        Education: "Bachelor of Science in Computer Science, XYZ University",
        Experience: "3 years as Software Developer at Tech Solutions Inc.",
        PermanentLocation: "789 Oak Street, Smalltown, USA",
        CurrentLocation: "101 Maple Street, Bigcity, USA",
        Profile_For: "Software Developer",
        AssignedTo: "Jane Smith",
        Comment: "Expert in JavaScript and React.",
      },
      {
        Name: "John Doe",
        Phone: "+1-987-654-3210",
        Email: "john.doe@example.com",
        Education: "Bachelor of Science in Computer Science, XYZ University",
        Experience: "3 years as Software Developer at Tech Solutions Inc.",
        PermanentLocation: "789 Oak Street, Smalltown, USA",
        CurrentLocation: "101 Maple Street, Bigcity, USA",
        Profile_For: "Software Developer",
        AssignedTo: "Jane Smith",
        Comment: "Expert in JavaScript and React.",
      },
      {
        Name: "John Doe",
        Phone: "+1-987-654-3210",
        Email: "john.doe@example.com",
        Education: "Bachelor of Science in Computer Science, XYZ University",
        Experience: "3 years as Software Developer at Tech Solutions Inc.",
        PermanentLocation: "789 Oak Street, Smalltown, USA",
        CurrentLocation: "101 Maple Street, Bigcity, USA",
        Profile_For: "Software Developer",
        AssignedTo: "Jane Smith",
        Comment: "Expert in JavaScript and React.",
      },
      {
        Name: "John Doe",
        Phone: "+1-987-654-3210",
        Email: "john.doe@example.com",
        Education: "Bachelor of Science in Computer Science, XYZ University",
        Experience: "3 years as Software Developer at Tech Solutions Inc.",
        PermanentLocation: "789 Oak Street, Smalltown, USA",
        CurrentLocation: "101 Maple Street, Bigcity, USA",
        Profile_For: "Software Developer",
        AssignedTo: "Jane Smith",
        Comment: "Expert in JavaScript and React.",
      },
      {
        Name: "John Doe",
        Phone: "+1-987-654-3210",
        Email: "john.doe@example.com",
        Education: "Bachelor of Science in Computer Science, XYZ University",
        Experience: "3 years as Software Developer at Tech Solutions Inc.",
        PermanentLocation: "789 Oak Street, Smalltown, USA",
        CurrentLocation: "101 Maple Street, Bigcity, USA",
        Profile_For: "Software Developer",
        AssignedTo: "Jane Smith",
        Comment: "Expert in JavaScript and React.",
      },
    // Add more data as needed
  ];

  const setupTableColumns = () => {
    const columns = [
      {
        Header: "S.No",
        accessor: (row, index) => index + 1,
        id: 'serial', // unique id for accessor that is not a string
      },
      {
        Header: "Name",
        accessor: "Name",
      },
      {
        Header: "Email",
        accessor: "Email",
      },
      {
        Header: "Phone",
        accessor: "Phone",
      },
      {
        Header: "Experience",
        accessor: "Experience",
      },
      {
        Header: "Profile",
        accessor: "Profile_For",
      },
      {
        Header: "Assigned To",
        accessor: "AssignedTo",
      },
      {
        Header: "Comment",
        accessor: "Comment",
      },
      {
        Header: "Action",
        Cell: () => <MdOutlineDisplaySettings className="action-button" />,
      },
    ];
    setColumns(columns);
  };

  const mapDataToTableFormat = () => {
    return rawData;
  };

  const tableInstance = useTable({ columns, data }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const renderContent = () => {
    switch (loadePage) {
      case 1:
        return (
          <div>
            <table {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()} className="table-header">
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} className="cell">
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      case 2:
        return <div>Screening</div>;
      case 3:
        return <div>Technical Round 1</div>;
      case 4:
        return <div>Technical Round 2</div>;
      case 5:
        return <div>Technical Round 3</div>;
      case 6:
        return <div>Hr Round</div>;
      case 7:
        return <div>Finalised</div>;
      case 8:
        return <div>Rejected</div>;
      default:
        return <div>Select an option to view details</div>;
    }
  };

  return (
    <div className="humanResource">
      <div className="humanResource-section1">
        <button className="button">New Candidate</button>
      </div>
      <div className="Header-humanResource">
        <button className="button" onClick={() => setLoadPage(1)}>
          New Profiles
        </button>
        <button className="button" onClick={() => setLoadPage(2)}>
          Screening
        </button>
        <button className="button" onClick={() => setLoadPage(3)}>
          Technical Round 1
        </button>
        <button className="button" onClick={() => setLoadPage(4)}>
          Technical Round 2
        </button>
        <button className="button" onClick={() => setLoadPage(5)}>
          Technical Round 3
        </button>
        <button className="button" onClick={() => setLoadPage(6)}>
          Hr Round
        </button>
        <button className="button" onClick={() => setLoadPage(7)}>
          Finalised
        </button>
        <button className="button" onClick={() => setLoadPage(8)}>
          Rejected
        </button>
      </div>
      <div className="humanResource-section">{renderContent()}</div>
    </div>
  );
};

export default HumanResource;
