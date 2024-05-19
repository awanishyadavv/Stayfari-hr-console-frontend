import React, { useEffect, useState } from "react";
import { useTable, useSortBy } from "react-table";
import axios from "axios";
import toast from "react-hot-toast";
import Dropdown from "react-dropdown";
import { MdDelete } from "react-icons/md";
import { server } from "..";
import "../styles/AccessControl.css";

const AccessControl = () => {
  const [columns, setColumns] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allFilesOnDatabase, setAllFilesOnDatabase] = useState([]);
  const [accessId, setAccessId] = useState("");
  const [startRange, setStartRange] = useState("");
  const [endRange, setEndRange] = useState("");

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: allUsers }, useSortBy);

  useEffect(() => {
    fetchData();
    setupTableColumns();
    fetchAllDataFileNames();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${server}/users/getAllUsers`, { withCredentials: true });
      setAllUsers(data.users);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const setupTableColumns = () => {
    const columns = [
      { Header: "S.No", accessor: (row, index) => index + 1 },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      { Header: "Employee Code", accessor: "employeeCode" },
      { Header: "Role", accessor: "role" },
      {
        Header: "Current Access",
        accessor: "action",
        Cell: ({ row }) => (
          <button onClick={() => handleOpenModal(row.original)} className="btn-user">
            Open Access
          </button>
        ),
      },
    ];
    setColumns(columns);
  };

  const fetchAllDataFileNames = () => {
    axios
      .get(`${server}/data/getAllDataFileName`, { withCredentials: true })
      .then((res) => {
        setAllFilesOnDatabase(res.data.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleOpenModal = (userData) => {
    setIsModalOpen(true);
    setSelectedUser(userData);
  };

  const handleCloseModal = async (e) => {
    if (e.target.classList.contains("model")) {
      setIsModalOpen(false);
      await fetchData();
    }
  };

  const handleUpdateAccess = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${server}/access/updateAccess/${selectedUser._id}`,
        {
          access: {
            accessId,
            accessRange: [startRange-1, endRange-1],
          },
        },
        { withCredentials: true }
      );
      toast.success("Access updated successfully");
      setEndRange("");
      setStartRange("");
      fetchData();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleRemoveAccess = async (accessDataId) => {
    try {
      await axios.delete(
        `${server}/access/removeAccess/${selectedUser._id}`,
        {
          data: { removeAccessId: accessDataId },
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Access removed successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const dropdownOptions = allFilesOnDatabase.map((file) => ({
    value: file._id,
    label: file.fileName,
  }));

  return (
    <div className="access-control">
      <section>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className="table-header"
              >
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {isModalOpen && (
        <div className="model" onClick={handleCloseModal}>
          <div className="overlay">
            <div className="existing-access">
              <div className="existing-header">
                <h2>{selectedUser.name}</h2>
                <h3>{selectedUser.employeeCode}</h3>
              </div>
              <br />
              <h4>Existing Access</h4>
              {selectedUser.access.map((accessItem, index) => (
                <div key={index} className="existing-access-items">
                  <p>{accessItem.accessDataName}</p>
                  <p>{accessItem.accessDataRange[0]+1}</p>
                  <p>{accessItem.accessDataRange[1]+1}</p>
                  <MdDelete
                    onClick={() => handleRemoveAccess(accessItem.accessDataId)}
                    className="delete-btn"
                  />
                </div>
              ))}
            </div>
            <div className="add-access">
              <br />
              <h4>Add New Access</h4>
              <form action="" className="update-access">
                <Dropdown
                  options={dropdownOptions}
                  placeholder="Select a File"
                  onChange={(selectedOption) =>
                    setAccessId(selectedOption.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Start"
                  value={startRange}
                  onChange={(e) => setStartRange(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="End"
                  value={endRange}
                  onChange={(e) => setEndRange(e.target.value)}
                />
                <button className="btn-add-access" onClick={handleUpdateAccess}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessControl;
