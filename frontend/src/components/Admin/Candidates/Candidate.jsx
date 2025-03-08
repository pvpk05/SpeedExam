/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Service from "../../../service/Service";

import Profile from "./Profile";
import History from "./History";
import PerformanceReport from "./Report";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  Button,
  TablePagination,
  TableSortLabel,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

// const SettingsDropdown = ({ onMenuItemClick }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <div>
//       <IconButton onClick={handleClick}>
//         <SettingsIcon style={{ width: "20px" }} />
//       </IconButton>
//       <div>
//         <Button onClick={() => onMenuItemClick("profile")}>View Profile</Button>
//         <Button onClick={() => onMenuItemClick("history")}>Exam History</Button>
//         <Button onClick={() => onMenuItemClick("performanceReport")}>
//           Performance Report
//         </Button>
//       </div>
//     </div>
//   );
// };

const SettingsDropdown = ({ onMenuItemClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <SettingsIcon style={{ width: '20px' }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => onMenuItemClick("profile")}>View Profile</MenuItem>
        <MenuItem onClick={() => onMenuItemClick("history")}>Exam History</MenuItem>
        <MenuItem onClick={() => onMenuItemClick("performanceReport")}>Performance Report</MenuItem>
      </Menu>
    </div>
  );
};

const CandidatesTable = ({ candidates, onMenuItemClick }) => {
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortField, setSortField] = useState("candidateID");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
    setPage(0);
  };

  const sortedCandidates = [...candidates].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredCandidates = sortedCandidates.filter((candidate) => {
    return (
      candidate.candidateID?.toLowerCase().includes(filterText.toLowerCase()) ||
      candidate.fullName?.toLowerCase().includes(filterText.toLowerCase()) ||
      candidate.mobileNo?.toLowerCase().includes(filterText.toLowerCase()) ||
      candidate.domain?.toLowerCase().includes(filterText.toLowerCase()) ||
      candidate.batchNo?.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  const currentCandidates = filteredCandidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div style={{ margin: '0 auto', maxWidth: '1100px' }}>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={filterText}
        onChange={handleFilterChange}
        style={{ marginBottom: 20 }}
      />

      <TableContainer style={{ border: '0.1px solid black' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bolder', width: '150px' }}>
                <TableSortLabel
                  active={sortField === 'candidateID'}
                  direction={sortField === 'candidateID' ? sortDirection : 'asc'}
                  onClick={() => handleSort('candidateID')}
                >
                  Intern ID
                </TableSortLabel>
              </TableCell>
              <TableCell style={{ fontWeight: 'bolder', width: '300px' }}>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortDirection : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell style={{ fontWeight: 'bolder', width: '150px' }}>
                <TableSortLabel
                  active={sortField === 'mobileNo'}
                  direction={sortField === 'mobileNo' ? sortDirection : 'asc'}
                  onClick={() => handleSort('mobileNo')}
                >
                  Mobile No
                </TableSortLabel>
              </TableCell>
              <TableCell style={{ fontWeight: 'bolder' }}>
                <TableSortLabel
                  active={sortField === 'domain'}
                  direction={sortField === 'domain' ? sortDirection : 'asc'}
                  onClick={() => handleSort('domain')}
                >
                  Domain
                </TableSortLabel>
              </TableCell>
              <TableCell style={{ fontWeight: 'bolder' }}>
                <TableSortLabel
                  active={sortField === 'batchNo'}
                  direction={sortField === 'batchNo' ? sortDirection : 'asc'}
                  onClick={() => handleSort('batchNo')}
                >
                  Batch
                </TableSortLabel>
              </TableCell>
              <TableCell style={{ fontWeight: 'bolder' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(currentCandidates) && currentCandidates.length > 0 ? (
              currentCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>{candidate.candidateID}</TableCell>
                  <TableCell>{candidate.fullName}</TableCell>
                  <TableCell>{candidate.mobileNo}</TableCell>
                  <TableCell>{candidate.domain}</TableCell>
                  <TableCell>{candidate.batchNo}</TableCell>
                  <TableCell>
                    <SettingsDropdown onMenuItemClick={(tab) => onMenuItemClick(tab, candidate.candidateID)} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>No candidates found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={filteredCandidates.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};


const Candidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [tab, setTab] = useState("candidates");
  const [selectedCandidateID, setSelectedCandidateID] = useState(null);
  const [candidateHistory, setCandidateHistory] = useState([])
  const navigate = useNavigate();

  const fetchCandidates = async () => {
    try {
      const response = await Service.get("/intern_data");
      setCandidates(response.data[0]);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleMenuItemClick = async (tab, candidateID) => {
    setTab(tab);
    setSelectedCandidateID(candidateID);

    if (tab === "history") {
      const response = await Service.get(`/getExamByCandidateID/${candidateID}`);
      setCandidateHistory(response.data);
      console.log(response.data);
    }
    navigate(`/admin/${tab}/${candidateID}`);
  };

  const handleBack = () => {
    setTab("candidates");
    navigate(`/admin/candidates`);
  };

  return (
    <div>
      {tab === "candidates" && (
        <CandidatesTable candidates={candidates} onMenuItemClick={handleMenuItemClick} />
      )}
      {tab === "profile" &&
        <Profile candidateID={selectedCandidateID} onBack={handleBack} />
      }
      {tab === "history" &&
        <History candidateID={selectedCandidateID} candidateHistory={candidateHistory} onBack={handleBack} />
      }
      {tab === "performanceReport" && (
        <PerformanceReport candidateID={selectedCandidateID} onBack={handleBack} />
      )}
    </div>
  );
};

export default Candidate;





// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Service from '../../service/Service';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   TablePagination,
//   TableSortLabel,
//   Modal,
//   Menu,
//   Link,
//   MenuItem,
//   TextField,
//   Box,
//   IconButton,
// } from '@mui/material';
// import SettingsIcon from '@mui/icons-material/Settings';

// const SettingsDropdown = ({ ProfileClick }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <div>
//       <IconButton onClick={handleClick}>
//         <SettingsIcon style={{ width: '20px' }} />
//       </IconButton>
//       <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
//         <MenuItem onClick={() => ProfileClick('profile')}>View Profile</MenuItem>
//         <MenuItem onClick={() => ProfileClick('history')}>Exam History</MenuItem>
//         <MenuItem onClick={() => ProfileClick('performanceReport')}>Performance Report</MenuItem>
//       </Menu>
//     </div>
//   );
// };

// const CandidatesTable = ({ candidates, ProfileClick }) => {
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [sortField, setSortField] = useState('candidateID');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [filterText, setFilterText] = useState('');

//   const handleSort = (field) => {
//     const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
//     setSortField(field);
//     setSortDirection(direction);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleFilterChange = (event) => {
//     setFilterText(event.target.value);
//     setPage(0);
//   };

//   const sortedCandidates = [...candidates].sort((a, b) => {
//     if (a[sortField] < b[sortField]) {
//       return sortDirection === 'asc' ? -1 : 1;
//     }
//     if (a[sortField] > b[sortField]) {
//       return sortDirection === 'asc' ? 1 : -1;
//     }
//     return 0;
//   });

//   const filteredCandidates = sortedCandidates.filter((candidate) => {
//     return (
//       candidate.candidateID?.toLowerCase().includes(filterText.toLowerCase()) ||
//       candidate.fullName?.toLowerCase().includes(filterText.toLowerCase()) ||
//       candidate.mobileNo?.toLowerCase().includes(filterText.toLowerCase()) ||
//       candidate.domain?.toLowerCase().includes(filterText.toLowerCase()) ||
//       candidate.batchNo?.toLowerCase().includes(filterText.toLowerCase())
//     );
//   });

//   const currentCandidates = filteredCandidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     <div style={{ margin: '0 auto', maxWidth: '1100px' }}>
//       <TextField
//         label="Search"
//         variant="outlined"
//         fullWidth
//         value={filterText}
//         onChange={handleFilterChange}
//         style={{ marginBottom: 20 }}
//       />

//       <TableContainer style={{ border: '0.1px solid black' }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell style={{ fontWeight: 'bolder', width: '150px' }}>
//                 <TableSortLabel
//                   active={sortField === 'candidateID'}
//                   direction={sortField === 'candidateID' ? sortDirection : 'asc'}
//                   onClick={() => handleSort('candidateID')}
//                 >
//                   Intern ID
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell style={{ fontWeight: 'bolder', width: '300px' }}>
//                 <TableSortLabel
//                   active={sortField === 'name'}
//                   direction={sortField === 'name' ? sortDirection : 'asc'}
//                   onClick={() => handleSort('name')}
//                 >
//                   Name
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell style={{ fontWeight: 'bolder', width: '150px' }}>
//                 <TableSortLabel
//                   active={sortField === 'mobileNo'}
//                   direction={sortField === 'mobileNo' ? sortDirection : 'asc'}
//                   onClick={() => handleSort('mobileNo')}
//                 >
//                   Mobile No
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell style={{ fontWeight: 'bolder' }}>
//                 <TableSortLabel
//                   active={sortField === 'domain'}
//                   direction={sortField === 'domain' ? sortDirection : 'asc'}
//                   onClick={() => handleSort('domain')}
//                 >
//                   Domain
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell style={{ fontWeight: 'bolder' }}>
//                 <TableSortLabel
//                   active={sortField === 'batchNo'}
//                   direction={sortField === 'batchNo' ? sortDirection : 'asc'}
//                   onClick={() => handleSort('batchNo')}
//                 >
//                   Batch
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell style={{ fontWeight: 'bolder' }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {Array.isArray(currentCandidates) && currentCandidates.length > 0 ? (
//               currentCandidates.map((candidate) => (
//                 <TableRow key={candidate.id}>
//                   <TableCell>{candidate.candidateID}</TableCell>
//                   <TableCell>{candidate.fullName}</TableCell>
//                   <TableCell>{candidate.mobileNo}</TableCell>
//                   <TableCell>{candidate.domain}</TableCell>
//                   <TableCell>{candidate.batchNo}</TableCell>
//                   <TableCell>
//                     <SettingsDropdown ProfileClick={ProfileClick} />
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={6}>No candidates found</TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={filteredCandidates.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </div>
//   );
// };

// const Candidate = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [tab, setTab] = useState('candidates');

//   const fetchCandidates = async () => {
//     try {
//       const response = await Service.get('/intern_data');
//       setCandidates(response.data[0]);
//     } catch (error) {
//       console.error('Error fetching candidates:', error);
//     }
//   };

//   useEffect(() => {
//     fetchCandidates();
//   }, []);

//   const renderContent = () => {
//     switch (tab) {
//       case 'candidates':
//         return <CandidatesTable candidates={candidates} ProfileClick={setTab} />;
//       case 'profile':
//         return <div>Profile Content</div>;
//       case 'history':
//         return <div>History Content</div>;
//       case 'performanceReport':
//         return <div>Performance Report Content</div>;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//       {renderContent()}
//     </div>
//   );
// };

// export default Candidate;
