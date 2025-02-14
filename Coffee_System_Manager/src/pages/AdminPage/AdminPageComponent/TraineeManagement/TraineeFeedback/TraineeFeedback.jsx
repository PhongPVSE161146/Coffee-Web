// // export default TraineeFeedback;
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './TraineeFeedback.css';
// import { CloseOutlined, VerticalAlignBottomOutlined, LoadingOutlined } from '@ant-design/icons';
// import { showSuccessNotification } from '../../../../../components/Notifications/Notifications';
// import { fetchData2 } from './ClassTemplate/ApiService/apiServices';
// import ErrorFeedback from "../../../../../assets/errorfeedback.png"
// import { Pagination } from 'antd';


// const ClassTemplate = () => {
//   const role = sessionStorage.getItem("selectedRole");
//   const [searchQuery, setSearchQuery] = useState('');
//   const menuButtonRefs = useRef({});
//   const navigate = useNavigate();
//   const [templates, setTemplates] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(4);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedClasses, setSelectedClasses] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState([]);
//   const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
//   const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
//   const [classOptions, setClassOptions] = useState([]);
//   const [classSearchQuery, setClassSearchQuery] = useState('');
//   const [statusSearchQuery, setStatusSearchQuery] = useState('');

//   const statusOptions = [
//     "On-Going",
//     "Finished",
//     "Scheduled"
//   ];

//   useEffect(() => {
//     loadClassTemplate();
//   }, []);

//   // After fetching data, sort the classOptions
//   const loadClassTemplate = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetchData2();
//       if (response.success) {
//         const formattedTemplates = response.data.map(template => ({
//           id: template.id,
//           classId: template.classId,
//           title: template.title,
//           createdBy: template.createdBy,
//           className: template.className,
//           lastUpdate: new Date(template.lastModifiedDate),
//           image: ErrorFeedback,
//           numberOfResponse: template.numberOfResponse || 0,
//           sendDate: template.sendDate || new Date().toISOString(), // Mocked data
//           expirationDate: template.expirationDate || new Date(new Date().setDate(new Date().getDate() + 7)).toISOString() // Mocked data
//         }));
//         setTemplates(formattedTemplates);

//         const uniqueClassNames = [...new Set(response.data.map(template => template.className))].sort();
//         setClassOptions(uniqueClassNames);
//       }
//     } catch (error) {
//       //console.error("Error loading class details:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   // Update handleClassSelect to immediately sort selectedClasses
//   const handleClassSelect = (className) => {
//     setSelectedClasses(prev => {
//       const updatedClasses = prev.includes(className)
//         ? prev.filter(c => c !== className) // Remove class if already selected
//         : [...prev, className]; // Add class if not selected

//       return updatedClasses.sort(); // Sort immediately after updating
//     });
//   };

//   const getTodayDate = () => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return today;
//   };

//   const determineStatus = (expirationDate, sendDate) => {
//     if (!expirationDate || !sendDate) {
//       //console.error("Invalid dates", { expirationDate, sendDate });
//       return "Unknown";
//     }

//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Normalize to midnight for accurate comparison

//     const expiration = new Date(expirationDate);
//     const send = new Date(sendDate);

//     if (isNaN(expiration) || isNaN(send)) {
//       //console.error("Invalid date format", { expirationDate, sendDate });
//       return "Unknown";
//     }

//     if (send > today) {
//       return "Scheduled"; // Send date is in the future
//     }
//     if (send <= today && expiration >= today) {
//       return "On-Going"; // Send date is in the past/present and expiration is in the future
//     }
//     return "Finished"; // Expiration date is in the past
//   };



//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const isClickInsideAnyButton = Object.values(menuButtonRefs.current).some(
//         buttonRef => buttonRef && buttonRef.contains(event.target)
//       );
//       const isClickInsideMenu = event.target.closest('.template-menu');

//       if (!isClickInsideAnyButton && !isClickInsideMenu) {
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);


//   const handleSearch = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const filteredAndSortedTemplates = templates
//     .filter(template =>
//       template.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
//       (selectedClasses.length === 0 || selectedClasses.includes(template.className)) &&
//       (selectedStatus.length === 0 ||
//         (selectedStatus.includes("Scheduled") && determineStatus(template.expirationDate, template.sendDate) === "Scheduled") ||
//         (selectedStatus.includes("On-Going") && determineStatus(template.expirationDate, template.sendDate) === "On-Going") ||
//         (selectedStatus.includes("Finished") && determineStatus(template.expirationDate, template.sendDate) === "Finished"))
//     );


//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentTemplates = filteredAndSortedTemplates.slice(indexOfFirstItem, indexOfLastItem);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleItemsPerPageChange = (current, pageSize) => {
//     setItemsPerPage(pageSize);
//     setCurrentPage(1);
//   };

//   if (isLoading) {
//     return (
//       <div className="loading-container">
//         <LoadingOutlined style={{ fontSize: 30 }} spin />
//       </div>
//     );
//   }

//   const navigateToAdminModuleFeedback = (templateId, classId) => () => {
//     if (role === 'admin') {
//       navigate(`/adminPage/traineeManagement/feedback/${templateId}?classId=${classId}`);
//     } else if (role === 'deliverymanager') {
//       navigate(`/DeliveryManagerPage/traineeManagement/feedback/${templateId}?classId=${classId}`);
//     }
//   };

//   const toggleClassDropdown = () => {
//     setIsClassDropdownOpen(!isClassDropdownOpen);
//     setIsStatusDropdownOpen(false);
//   };

//   const toggleStatusDropdown = () => {
//     setIsStatusDropdownOpen(!isStatusDropdownOpen);
//     setIsClassDropdownOpen(false);
//   };

//   const handleStatusSelect = (status) => {
//     setSelectedStatus(prev =>
//       prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
//     );
//   };

//   const handleSelectAllStatus = (checked) => {
//     if (checked) {
//       setSelectedStatus(statusOptions);
//     } else {
//       setSelectedStatus([]);
//     }
//   };

//   const handleSelectAllClasses = (checked) => {
//     if (checked) {
//       setSelectedClasses(classOptions); // Select all classes
//     } else {
//       setSelectedClasses([]); // Deselect all classes
//     }
//   };

//   // Update handleSearch for class name
//   const handleClassSearch = (event) => {
//     setClassSearchQuery(event.target.value);
//   };

//   // Update handleSearch for status
//   const handleStatusSearch = (event) => {
//     setStatusSearchQuery(event.target.value);
//   };

//   // Filter class options based on search query
//   const filteredClassOptions = classOptions.filter(className =>
//     className.toLowerCase().includes(classSearchQuery.toLowerCase())
//   );

//   // Filter status options based on search query
//   const filteredStatusOptions = statusOptions.filter(status =>
//     status.toLowerCase().includes(statusSearchQuery.toLowerCase())
//   );

//   return (
//     <div className="custom-template-feed">
//       <div className="template-header-feed">
//         <div className="sort-search-class-feed">
//           <div className="filter-dropdown-feed">
//             <button
//               className="filter-button-feed"
//               onClick={toggleClassDropdown}
//             >
//               {selectedClasses.length ? `${selectedClasses.length} selected` : 'Class Name'}
//               <span className="dropdown-arrow-feed">▼</span>
//             </button>
//             {isClassDropdownOpen && (
//               <div className="dropdown-content-feed">
//                 <div className="search-box-feed">
//                   <input
//                     type="text"
//                     placeholder="Search Class Name"
//                     value={classSearchQuery}
//                     onChange={handleClassSearch}
//                   />
//                 </div>
//                 <label className="checkbox-label-feed">
//                   <input
//                     type="checkbox"
//                     checked={selectedClasses.length === classOptions.length}
//                     onChange={(e) => handleSelectAllClasses(e.target.checked)}
//                   />
//                   Select All
//                 </label>
//                 <div className='template-classname-overflow-x'>
//                   {filteredClassOptions.map((className) => (
//                     <label key={className} className="checkbox-label-feed">
//                       <input
//                         type="checkbox"
//                         checked={selectedClasses.includes(className)}
//                         onChange={() => handleClassSelect(className)}
//                       />
//                       {className}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Status Filter */}
//           <div className="filter-dropdown-feed">
//             <button
//               className="filter-button-feed-2"
//               onClick={toggleStatusDropdown}
//             >
//               {selectedStatus.length ? `${selectedStatus.length} selected` : 'Status'}
//               <span className="dropdown-arrow-feed">▼</span>
//             </button>
//             {isStatusDropdownOpen && (
//               <div className="dropdown-content-feed">
//                 <div className="search-box-feed">
//                   <input
//                     type="text"
//                     placeholder="Search Status"
//                     value={statusSearchQuery}
//                     onChange={handleStatusSearch}
//                   />
//                 </div>
//                 {filteredStatusOptions.map((status) => (
//                   <label key={status} className="checkbox-label-feed">
//                     <input
//                       type="checkbox"
//                       checked={selectedStatus.includes(status)}
//                       onChange={() => handleStatusSelect(status)}
//                     />
//                     {status}
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>
//           <input
//             type="text"
//             placeholder="Enter key words"
//             value={searchQuery}
//             onChange={handleSearch}
//           />
//         </div>
//       </div>
//       <div className="template-grid">
//         {currentTemplates.map((template, index) => (
//           <div key={`${template.id}-${index}`} className="template-card" onClick={navigateToAdminModuleFeedback(template.id, template.classId)}>
//             <img src={template.image} alt={template.title} className="template-image" />
//             <div className="template-content">
//               <div className="template-info">
//                 <h3 className="template-title" title={template.title}>
//                   {template.title.length > 25 ? `${template.title.slice(0, 25)}...` : template.title}
//                 </h3>
//                 <div className='css-for-classname'>
//                   <p className='css-p-classname-template' title={template.className}>For: {template.className}</p>
//                   <div className='css-status-response'>
//                     <p className={`statusfeedback${determineStatus(template.expirationDate, template.sendDate)}`}>
//                       {determineStatus(template.expirationDate, template.sendDate)}
//                     </p>
//                     <p>{template.numberOfResponse} Responses</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className='pagination-feedback-template'>
//         <Pagination
//           current={currentPage}
//           pageSize={itemsPerPage}
//           total={filteredAndSortedTemplates.length}
//           onChange={handlePageChange}
//           showSizeChanger
//           onShowSizeChange={handleItemsPerPageChange}
//           pageSizeOptions={[4, 8, 12]}
//         />
//       </div>

//     </div>
//   );
// };

// export default ClassTemplate;