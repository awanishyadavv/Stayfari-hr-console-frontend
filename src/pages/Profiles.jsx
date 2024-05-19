import React, { useContext, useEffect, useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { Context, server } from "../index.js";
import toast from "react-hot-toast";
import axios from "axios";
import { useTable, useSortBy } from "react-table";
import "../styles/Profiles.css";

const Profiles = () => {
  const [columns, setColumns] = useState([]);
  const [accessToData, setAccessToData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [dataId, setDataId] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [file, setFile] = useState(null);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedDataIndex, setSelectedDataIndex] = useState(Number);

  const [country, setCountry] = useState("");
  const [company, setCompany] = useState("");
  const [profile, setProfile] = useState("");
  const [purpose, setPurpose] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [comment, setComment] = useState("");

  const options1 = [
    "1. Businesses (India SMEs/Non-profits)",
    "2. Businesses (Foreign small cos owners/self employed - landscaping/cleaning services/startups/docs)",
    "3. Businesses (Foreign Cos with India offices)",
    "4. Senior Managers/professionals/software/CFA (India)",
    "5. Senior Managers/professionals/software/CFA (EU, US, SE Asia)",
    "6. Foreign visiting Univ profs/UN/delegations",
    "7. Foreign buyers for handicrafts/creatives in RJ",
    "8. Domestic functions/seminars/delgations at colleges/univs",
    "9. Expats (WOSs and JVs)",
    "10. UHNI",
    "11. Travel Agent",
  ];

  const options2 = ["1. Vacation", "2. Business"];

  useEffect(() => {
    setupTableColumns();
  }, []);

  const { isAuthenticated, isAuthenticatedAdmin, user } = useContext(Context);

  useEffect(() => {
    axios
      .get(`${server}/profiling/loadAccess/${user._id}`, {
        withCredentials: true,
      })
      .then((response) => {
        toast.success(response.data.message);
        setAccessToData(response.data.access);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, [user._id]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setSelectedFileName(selectedFile.name);
    setFile(selectedFile);
  };

  const uploadFile = () => {
    const formData = new FormData();
    formData.append("uploaded_file", file);
    axios
      .post(`${server}/data/new`, formData, { withCredentials: true })
      .then((response) => {
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const loadData = async () => {
    axios
      .get(`${server}/profiling/loadData/${user._id}`, {
        params: { dataId },
        withCredentials: true,
      })
      .then((response) => {
        toast.success(response.data.message);
        const fetchedData = response.data.data;
        setCurrentData(fetchedData.data || []);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const updateData = () => {
    axios
      .put(
        `${server}/data/update/${user._id}`,
        {
          dataId,
          email: selectedRowData.Email,
          company,
          purpose,
          socialMedia,
          profile,
          country,
          comment,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        const updatedData = [...currentData];
        updatedData[selectedDataIndex]["From "] = country;
        updatedData[selectedDataIndex]["Company/Profession"] = company;
        updatedData[selectedDataIndex].Profile = profile;
        updatedData[selectedDataIndex]["Purpose of the reservation "] = purpose;
        updatedData[selectedDataIndex].Profile_1 = socialMedia;
        setCurrentData(updatedData);
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const setupTableColumns = () => {
    const columns = [
      {
        Header: "S.No",
        accessor: (row, index) => (
          <div className="customer-content">{index + 1}</div>
        ),
      },
      {
        Header: "Customer",
        accessor: (row, index) => (
          <div className="customer-content">
            <a onClick={() => handleOpenModel(row, index)}>{row.Email}</a>
            <span className="no-select">{row.Customer}</span>
            <span className="no-select">{row.Phone}</span>
          </div>
        ),
      },
      {
        Header: "Profile",
        accessor: (row) => (
          <div className="profile-content">
            <span>{`Company: ${row["Company/Profession"]}`}</span>
            <span>{`Position: ${row.Profile}`}</span>
            <span>{`Purpose: ${row["Purpose of the reservation "]}`}</span>
            <span className="linkedin-profile">
              <p>Link: </p>
              <a href={row.Profile_1} target="_blank">
                {row.Profile_1}
              </a>
            </span>
          </div>
        ),
      },
      {
        Header: "Description",
        accessor: (row) => (
          <div className="customer-content">
            <p>{`Adults  → ${row.Adults}`}</p>
            <p>{`Childs  → ${row.Children}`}</p>
            <p>{`Days  → ${row.Days}`}</p>
          </div>
        ),
      },
      {
        Header: "Itinerary",
        accessor: (row) => (
          <div className="customer-content">{row.Itinerary}</div>
        ),
      },
      {
        Header: "Value",
        accessor: (row) => {
          if (
            row.Vehicle &&
            typeof row.Vehicle === "string" &&
            row.Vehicle.includes("(") &&
            row.Vehicle.includes(")")
          ) {
            const valueInBracket = row.Vehicle.match(/\((.*?)\)/)[1];
            return (
              <div className="customer-content">
                <span>{valueInBracket}</span>
                <span>{`Value → $${row["Value ($)"]}`}</span>
              </div>
            );
          } else {
            return (
              <div className="customer-content">
                <span>{row.Vehicle}</span>
                <span>{`Value → $${row["Value ($)"]}`}</span>
              </div>
            );
          }
        },
      },
    ];
    setColumns(columns);
  };

  const handleOpenModel = (row, index) => {
    setSelectedDataIndex(index);
    setSelectedRowData(row);
    setIsModelOpen(true);
    setCountry(row["From "]);
    setCompany(row["Company/Profession"]);
    setProfile(row.Profile);
    setPurpose(row["Purpose of the reservation "]);
    setSocialMedia(row.Profile_1);
  };

  const handleCloseModel = async (e) => {
    if (e.target.classList.contains("model")) {
      setIsModelOpen(false);
      setSelectedRowData(null);
      setCountry("");
      setCompany("");
      setProfile("");
      setPurpose("");
      setSocialMedia("");
      setSelectedDataIndex(null);
    }
  };

  const querySearch = (e) => {
    e.preventDefault();
    const encodedName = encodeURIComponent(`"${selectedRowData.Customer}"`);
    const encodedEmail = encodeURIComponent(`"${selectedRowData.Email}"`);
    const url1 = `https://www.linkedin.com/search/results/people/?keywords=${encodedName}&origin=SWITCH_SEARCH_VERTICAL&sid=qtl`
    window.open(url1, '_blank');
    const url2 = `https://www.google.com/search?q=${selectedRowData.Email}`;
    window.open(url2, '_blank');
    window.open(`mailto:${selectedRowData.Email}`, '_blank')
    window.open(`https://wa.me/${selectedRowData.Phone}`, '_blank')
    const searchQuery = `${encodedName}+${encodedEmail}`;
    const combinedSearchUrl = `https://www.google.com/search?q=${searchQuery}`;
    window.open(combinedSearchUrl, '_blank');
    window.open( `https://www.google.com/search?q=${selectedRowData.Phone}`, '_bank')
  }

  const submitHandler = async (e) => {
    e.preventDefault();
  };

  const tableInstance = useTable({ columns, data: currentData }, useSortBy);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="profile">
      <div className="upload-and-search">
        {isAuthenticatedAdmin && (
          <div className="data-upload">
            <div className="upload-files">
              <label htmlFor="file-upload" className="custom-file-upload">
                {selectedFileName || "Select File"}
              </label>
              <input id="file-upload" type="file" onChange={handleFileChange} />
              <button onClick={uploadFile} className="upload-btn">
                Upload
              </button>
            </div>
          </div>
        )}
        <div className="data-load">
          <div className="load-data">
            <Dropdown
              options={accessToData.map((item) => ({
                value: item.accessDataId,
                label: item.accessDataName,
              }))}
              onChange={(selectedOption) => setDataId(selectedOption.value)}
            />
            <button onClick={loadData} className="load-btn">
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="data-table">
        {currentData.length > 0 && (
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
        )}
      </div>

      {/* <Model></Model> */}

      {isModelOpen && selectedRowData && (
        <div className="model" onClick={handleCloseModel}>
          <div className="overlay">
            <form action="" className="model-content" onSubmit={submitHandler}>
              <div className="overlay-section ">
                <div>
                  <h4>Customer Details:</h4>
                </div>
                <div className="customer">
                  <div className="content">
                    <p className="p1">Name</p>
                    <p className="p2">{selectedRowData.Customer}</p>
                  </div>
                  <div className="content">
                    <p className="p1">Email</p>
                    <p className="p2">{selectedRowData.Email}</p>
                  </div>
                  <div className="content">
                    <p className="p1">Phone</p>
                    <p className="p2">{selectedRowData.Phone}</p>
                  </div>
                </div>
              </div>
              <div className="overlay-section details">
                <div>
                  <h4>Details: </h4>
                </div>
                <div className="customer">
                  <div className="content">
                    <p className="p1 ">Adults</p>
                    <p className="p2">{selectedRowData.Adults}</p>
                  </div>
                  <div className="content">
                    <p className="p1">Children</p>
                    <p className="p2">{selectedRowData.Children}</p>
                  </div>
                  <div className="content">
                    <p className="p1">Days</p>
                    <p className="p2">{selectedRowData.Days}</p>
                  </div>
                </div>
              </div>
              <div className="overlay-section ">
                <div>
                  <h4>Vehicle: </h4>
                </div>
                <div className="customer">
                  <div className="content">
                    <p className="p1">Vehicle</p>
                    <p className="p2">{selectedRowData.Vehicle}</p>
                  </div>
                  <div className="content">
                    <p className="p1">Value</p>
                    <p className="p2">{`$${selectedRowData["Value ($)"]}`}</p>
                  </div>
                  <div className="content">
                    <p className="p1">Run Queries</p>
                    <button className="p2 btn-open-query" onClick={querySearch}>OPEN</button>
                  </div>
                </div>
              </div>
              <div className="overlay-section ">
                <div>
                  <h4>Itinerary</h4>
                </div>
                <div className="itinerary">
                  <p>{selectedRowData.Itinerary} </p>
                </div>
              </div>
              <div className="overlay-section ">
                <div>
                  <h4>Profile</h4>
                </div>
                <div className="customer">
                  <div className="content">
                    <p className="p1">Country</p>
                    <input
                      className="p2 input"
                      type="text"
                      onChange={(e) => setCountry(e.target.value)}
                      value={country}
                    />
                  </div>
                  <div className="content">
                    <p className="p1">Company</p>
                    <input
                      className="p2 input company"
                      type="text"
                      onChange={(e) => setCompany(e.target.value)}
                      value={company}
                    />
                  </div>
                  <div className="content">
                    <p className="p1">Profile</p>
                    <Dropdown
                      className="dropdown-1"
                      options={options1}
                      // onChange={this._onSelect}
                      onChange={(selectedOption) =>
                        setProfile(selectedOption.value)
                      }
                      value={profile}
                      placeholder="Select an option"
                    />

                    {/* <input className="p2 input profession" type="text" value={selectedRowData.Profile} /> */}
                  </div>
                  <div className="content">
                    <p className="p1">Purpose</p>
                    <Dropdown
                      className="dropdown-2"
                      options={options2}
                      onChange={(selectedOption) =>
                        setPurpose(selectedOption.value)
                      }
                      // onChange={this._onSelect}
                      value={purpose}
                      placeholder="Select an option"
                    />

                    {/* <input
                  className="p2 input"
                    type="text"
                    value={selectedRowData["Purpose of the reservation "]}
                    /> */}
                  </div>
                  <div className="content">
                    <p className="p1">Social Profile</p>
                    <input
                      className="p2 input linkedin"
                      type="link"
                      onChange={(e) => setSocialMedia(e.target.value)}
                      value={socialMedia}
                    />
                  </div>
                </div>
              </div>
              {/* <div className="overlay-section other"></div> */}
              <div className="customer action-overlay">
                <button type="submit" onClick={updateData}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profiles;
