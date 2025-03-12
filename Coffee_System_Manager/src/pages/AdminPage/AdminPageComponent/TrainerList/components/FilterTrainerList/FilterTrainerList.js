// import React, { useEffect, useState } from 'react';
// import { Modal, Button, Select } from 'antd';
// import { CaretDownOutlined, FilterOutlined } from '@ant-design/icons';
// import styles from './FilterTrainerList.module.css';
// import { axiosInstance } from '../../../../../../axios/Axiosver2';

// const FilterTrainerList = ({ trainers = [], onFilterChange }) => {
//   const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
//   const [isFilterMenuOpen2, setIsFilterMenuOpen2] = useState(false);
//   const [classNames, setClassNames] = useState([]);
//   const [moduleNames, setModuleNames] = useState([]);
//   const [allClassNamesSelected, setAllClassNamesSelected] = useState(false);
//   const [allModuleNamesSelected, setAllModuleNamesSelected] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [classOptions, setClassOptions] = useState([]);
//   const [moduleOptions, setModuleOptions] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false); // Modal state

//   const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);
//   const [trainerType, setTrainerType] = useState(null);
//   const [skill, setSkill] = useState(null);

//   const [skillOptions, setSkillOptions] = useState([]);
//   const [selectedSkills, setSelectedSkills] = useState([]);

//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const response = await axiosInstance.get('/trainer/get-all');
//         if (response.data && response.data.success) {
//           const uniqueSkills = [...new Set(response.data.data.flatMap((item) => item.registeredSkills || []))];
//           setSkillOptions(uniqueSkills);
//           const uniqueStatus = [...new Set(response.data.data.map((item) => item.status || "N/A"))];
//           const uniqueSites = [...new Set(response.data.data.map((item) => item.site || "N/A"))];

//           setClassOptions(uniqueStatus);
//           setModuleOptions(uniqueSites);
//         } else {
//           //console.error('Error fetching ', response);
//         }
//       } catch (error) {
//         //console.error('Error fetching ', error);
//       }
//     };
//     fetchSkills();
//   }, []);

//   const toggleTrainerMenu = () => {
//     setIsFilterMenuOpen((prev) => !prev);
//     if (isFilterMenuOpen2) setIsFilterMenuOpen2(false);
//   };

//   const toggleTrainerMenu2 = () => {
//     setIsFilterMenuOpen2((prev) => !prev);
//     if (isFilterMenuOpen) setIsFilterMenuOpen(false);
//   };

//   const handleCheckboxChange = (setter, state, value, key) => {
//     const newState = state.includes(value)
//       ? state.filter((item) => item !== value)
//       : [...state, value];
//     setter(newState);

//     if (key === 'status') {
//       onFilterChange({ status: newState, site: moduleNames, searchTerm });
//     } else if (key === 'site') {
//       onFilterChange({ status: classNames, site: newState, searchTerm });
//     }
//   };

//   const handleSelectAll = (setter, stateSetter, allSelected, options, key) => {
//     const newState = allSelected ? [] : [...options];
//     setter(newState);
//     stateSetter(!allSelected);

//     if (key === 'status') {
//       onFilterChange({ status: newState, site: moduleNames, searchTerm });
//     } else if (key === 'site') {
//       onFilterChange({ status: classNames, site: newState.length === options.length ? [] : newState, searchTerm });
//     }
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     const filteredTrainers = trainers.filter((trainer) => {
//       const matchesSearchTerm =
//         trainer.name.toLowerCase().includes(value.toLowerCase()) ||
//         trainer.account.toLowerCase().includes(value.toLowerCase()) ||
//         trainer.email.toLowerCase().includes(value.toLowerCase());

//       const matchesStatus = classNames.length === 0 || classNames.includes(trainer.status) || classNames.includes("");
//       const matchesSite = moduleNames.length === 0 || moduleNames.includes(trainer.site);

//       return matchesSearchTerm && matchesStatus && matchesSite;
//     });

//     onFilterChange({ status: classNames, site: moduleNames, searchTerm: value, filteredTrainers });
//   };

//   const getSelectedLabel = (selectedItems, defaultLabel) => {
//     if (selectedItems.length === 0) return defaultLabel;
//     return selectedItems.join(', ');
//   };


//   const handleAddFilterClick = () => setShowAdditionalFilters(prev => !prev);

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   const handleClear = () => {
//     setSelectedSkills([]);
//   };

//   const handleApply = () => {
//     onFilterChange({ skill: selectedSkills });
//     setIsModalVisible(false);
//   };

//   return (
//     <div className={styles.chartFilterContainer} style={{ marginLeft: 30 }}>
//       <div className={styles.filterSelector}>
//         <div className={styles.filterLabel}>Status</div>
//         <div className={styles.filterType} onClick={toggleTrainerMenu}>
//           {getSelectedLabel(classNames, 'Select Active')}
//           <CaretDownOutlined className={`${styles.arrow} ${isFilterMenuOpen ? styles.open : ''}`} />
//         </div>
//         {isFilterMenuOpen && (
//           <ul className={styles.submenu2}>
//             <li>
//               <input
//                 type="checkbox"
//                 checked={allClassNamesSelected}
//                 onChange={() =>
//                   handleSelectAll(setClassNames, setAllClassNamesSelected, allClassNamesSelected, classOptions, 'status')
//                 }
//               />
//               <label>Select All</label>
//             </li>
//             {classOptions.map((className) => (
//               <li key={className}>
//                 <input
//                   type="checkbox"
//                   checked={classNames.includes(className)}
//                   onChange={() => handleCheckboxChange(setClassNames, classNames, className, 'status')}
//                 />
//                 <label>{className}</label>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <div className={styles.filterSelector}>
//         <div className={styles.filterLabel}>Site</div>
//         <div className={styles.filterType} onClick={toggleTrainerMenu2}>
//           {getSelectedLabel(moduleNames, 'Select Site')}
//           <CaretDownOutlined className={`${styles.arrow} ${isFilterMenuOpen2 ? styles.open : ''}`} />
//         </div>
//         {isFilterMenuOpen2 && (
//           <ul className={styles.submenu2}>
//             <li>
//               <input
//                 type="checkbox"
//                 checked={allModuleNamesSelected}
//                 onChange={() =>
//                   handleSelectAll(setModuleNames, setAllModuleNamesSelected, allModuleNamesSelected, moduleOptions, 'site')
//                 }
//               />
//               <label>Select All</label>
//             </li>
//             {moduleOptions.map((moduleName) => (
//               <li key={moduleName}>
//                 <input
//                   type="checkbox"
//                   checked={moduleNames.includes(moduleName)}
//                   onChange={() => handleCheckboxChange(setModuleNames, moduleNames, moduleName, 'site')}
//                 />
//                 <label>{moduleName}</label>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <div className={styles.searchFormTrainer}>
//         <div className={styles.filterLabel}>Search</div>
//         <div className={styles.searchInputWrapper}>
//           <input
//             type="text"
//             className={styles.searchBartableFilter}
//             placeholder="Enter Trainer Name, Account, email..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//           <span className={styles.searchIcon}>
//             {/* Inline SVG for magnifying glass icon */}
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
//               <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
//             </svg>
//           </span>
//         </div>
//       </div>


//       {/* Filter button to open modal */}
//       <div className={styles.filterButton} onClick={showModal}>
//         <FilterOutlined />
//       </div>

//       {/* Advanced Search Modal */}
//       <Modal
//         title={
//           <div
//             style={{
//               backgroundColor: "#4A3AFF", // Bright blue background
//               color: "#ffffff",            // White text color
//               fontSize: "16px",            // Font size for title
//               fontWeight: "600",           // Bold font weight
//               padding: "12px",        // Padding around text
//               textAlign: "left",           // Align text to the left
//               borderRadius: "8px 8px 0 0", // Rounded top corners
//               display: "flex",             // Flex layout for title and close button
//               justifyContent: "space-between",
//               alignItems: "center",
//               margin: "-24px",
//               marginTop: "-20px" //
//             }}
//           >
//             Advanced Search
//           </div>
//         }
//         open={isModalVisible}
//         onCancel={handleCancel}
//         footer={
//           <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
//             {/* Left-aligned Cancel button */}
//             <Button
//               key="cancel"
//               onClick={handleCancel}
//               style={{
//                 color: "red",
//                 borderRadius: "20px",   // Make button round
//                 border: "1px solid red",// Red border for cancel button
//               }}
//             >
//               Cancel
//             </Button>

//             {/* Right-aligned Clear and Apply buttons */}
//             <div style={{ display: "flex", gap: "8px" }}>
//               <Button
//                 key="clear"
//                 onClick={handleClear}
//                 style={{
//                   borderRadius: "20px", // Make button round
//                 }}
//               >
//                 Clear
//               </Button>
//               <Button
//                 key="apply"
//                 type="primary"
//                 onClick={handleApply}
//                 style={{
//                   borderRadius: "20px", // Make button round
//                 }}
//               >
//                 Apply
//               </Button>
//             </div>
//           </div>
//         }
//       >
//         <div className={styles.addFiltercap1} style={{ marginTop: 40 }} onClick={handleAddFilterClick}>
//           +Add more filter
//         </div>
//         {showAdditionalFilters && (
//           <div style={{ marginTop: 20 }}>
//             <div style={{width: "100%"}}>
//               <div style={{width: "100%"}}>Skill</div>
//               <Select
//                 mode="multiple"
//                 style={{ width: '100%' }}
//                 placeholder="Select Skills"
//                 maxTagCount='responsive'
//                 value={selectedSkills}
//                 onChange={(value) => {
//                   setSelectedSkills(value);
                  
//                 }}
//                 options={skillOptions.map((skill) => ({ label: skill, value: skill }))}
//               />
//             </div>
//           </div>
//         )}
//       </Modal>

//     </div>
//   );
// };

// export default FilterTrainerList;
