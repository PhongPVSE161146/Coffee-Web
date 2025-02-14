// import React, { useEffect, useState } from "react";
// import { Select, DatePicker } from "antd";
// import { DownOutlined, StarOutlined, UpOutlined } from "@ant-design/icons";
// import "./CourseOrganization.css";
// import ClassAdminTable from "./table/classAdmin table/classAdminTable";
// import {
//   fetchTechnicalGroupData,
//   fetchTechnicalNameData,
//   fetchTrainerData,
// } from "./table/apiService";
// import TechnicalTable from "./table/technical table/technicalTable";
// import dayjs from "dayjs";

// const CourseOrganization = () => {
//   const [isOpen1, setIsOpen1] = useState(false);
//   const [trackValue, setTrackValue] = useState("");
//   const [timeValue, setTimeValue] = useState("");
//   const [technicalValue, setTechnicalValue] = useState("");
//   const [technicalOptions, setTechnicalOptions] = useState([]);
//   const [classAdminValue, setClassAdminValue] = useState("");
//   const [classAdminOptions, setClassAdminOptions] = useState([]);
//   const [classValue, setClassValue] = useState("");
//   const [averageScoreRange, setAverageScoreRange] = useState({
//     min: null,
//     max: null,
//   });
//   const { Option } = Select;
//   const { RangePicker } = DatePicker;

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await fetchTechnicalNameData();
//       setTechnicalOptions(Array.isArray(data.data) ? data.data : []);
//       const data2 = await fetchTrainerData();
//       setClassAdminOptions(Array.isArray(data2.data) ? data2.data : []);
//     };
//     fetchData();
//   }, []);

//   const showModal = () => {
//     setIsOpen1(true);
//   };

//   const hideModal = () => {
//     setIsOpen1(false);
//     setTrackValue("");
//     setTimeValue("");
//     setTechnicalValue("");
//     setClassAdminValue("");
//     setClassValue("");
//   };

//   const handleTrackValue = (value) => {
//     setTrackValue(value);
//     setTimeValue("");
//     setTechnicalValue("");
//     setClassAdminValue("");
//     setClassValue("");
//   };

//   const handleTimeValue = (dates) => {
//     setTimeValue(dates);
//   };

//   const handleTechnicalValue = (value) => {
//     setTechnicalValue(value);
//     setClassValue("");
//   };

//   const handleClassAdminValue = (value) => {
//     setClassAdminValue(value);
//     setClassValue("");
//   };

//   const handleClassValue = (value) => {
//     if (value === "selectAll") {
//       const allClassCodes =
//         trackValue === "trackBy_module"
//           ? technicalOptions.filter(
//               (option) => option.technicalGroupName === technicalValue
//             )[0]?.classCode || []
//           : classAdminOptions.filter(
//               (option) => option.trainerName === classAdminValue
//             )[0]?.classCode || [];

//       setClassValue(allClassCodes);
//     } else {
//       setClassValue(value);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetchTechnicalGroupData(classValue);
//         if (response && response.data) {
//           const averageScores = response.data.map((item) => item.averageRating);

//           if (averageScores.length > 0) {
//             const minValue = Math.min(...averageScores);
//             const maxValue = Math.max(...averageScores);
//             setAverageScoreRange({ min: minValue, max: maxValue });
//           } else {
//             setAverageScoreRange({ min: 0, max: 0 });
//           }
//         } else {
//           //console.error("Response or data is undefined", response);
//           setAverageScoreRange({ min: 0, max: 0 });
//         }
//       } catch (error) {
//         //console.error("Error fetching data:", error);
//         setAverageScoreRange({ min: 0, max: 0 });
//       }
//     };

//     if (classValue) {
//       fetchData();
//     }
//   }, [classValue]);

//   return (
//     <div className="course-container">
//       <div className="course-content">
//         <div>
//           <div className="course-info-dropdown">
//             <div
//               className={`course-info-dropdown-header ${
//                 isOpen1 ? "active" : ""
//               }`}
//               onClick={!isOpen1 ? showModal : hideModal}
//             >
//               Course Organization
//               <span className="course-info-dropdown-arrow">
//                 {isOpen1 ? <UpOutlined /> : <DownOutlined />}
//               </span>
//             </div>
//             {isOpen1 && (
//               <div className="course-dropdown-body">
//                 <div className="course-filter">
//                   <div>
//                     <div className="course-filter-header">
//                       <label>Track By</label>
//                       <StarOutlined />
//                     </div>
//                     <Select
//                       placeholder="Select Track by"
//                       onChange={handleTrackValue}
//                       style={{ width: "100%" }}
//                     >
//                       <Option value="trackBy_module">
//                         Evaluate Class Admin by Module
//                       </Option>
//                       <Option value="trackBy_classAdmin">
//                         Module Statistics by Class Admin
//                       </Option>
//                     </Select>
//                   </div>
//                   {trackValue !== "" ? (
//                     <>
//                       <div className="date">
//                         <label>Time</label>
//                         <RangePicker
//                           onChange={handleTimeValue}
//                           value={
//                             timeValue?.length > 0
//                               ? timeValue?.map((date) =>
//                                   dayjs(date, "DD-MM-YYYY")
//                                 )
//                               : null
//                           }
//                         />
//                       </div>
//                       <div className="specific">
//                         {trackValue === "trackBy_module" ? (
//                           <div className="technical">
//                             <label>Technical Group</label>
//                             <Select
//                               placeholder="Select Technical Group"
//                               onChange={handleTechnicalValue}
//                               value={technicalValue}
//                               style={{
//                                 width: "100%",
//                               }}
//                               options={technicalOptions.map((option) => ({
//                                 value: option.technicalGroupName,
//                                 label: option.technicalGroupName,
//                               }))}
//                             />
//                           </div>
//                         ) : (
//                           <div className="class-admin">
//                             <label>Class Admin</label>
//                             <Select
//                               onChange={handleClassAdminValue}
//                               placeholder="Select Class Admin"
//                               value={classAdminValue}
//                               style={{
//                                 width: "100%",
//                               }}
//                               options={classAdminOptions.map((option) => ({
//                                 label: option.trainerName,
//                                 value: option.trainerName,
//                               }))}
//                             />
//                           </div>
//                         )}
//                       </div>
//                       <div className="class">
//                         <label>Class</label>
//                         <Select
//                           placeholder="Select class"
//                           onChange={handleClassValue}
//                           value={classValue}
//                           style={{
//                             width: "100%",
//                           }}
//                           options={
//                             trackValue === "trackBy_module"
//                               ? technicalOptions
//                                   .filter(
//                                     (option) =>
//                                       option.technicalGroupName ===
//                                       technicalValue
//                                   )[0]
//                                   ?.classCode?.map((item) => ({
//                                     label: item,
//                                     value: item,
//                                   }))
//                               : classAdminOptions
//                                   .filter(
//                                     (option) =>
//                                       option.trainerName === classAdminValue
//                                   )[0]
//                                   ?.classCode?.map((item) => ({
//                                     label: item,
//                                     value: item,
//                                   }))
//                           }
//                         />
//                       </div>
//                     </>
//                   ) : (
//                     ""
//                   )}
//                 </div>
//                 {timeValue !== "" &&
//                 (technicalValue !== "" || classAdminValue !== "") &&
//                 classValue !== "" ? (
//                   <>
//                     <div className="average-score">
//                       <p>Average Score Range</p>
//                       <div className="lower-range">{averageScoreRange.min}</div>
//                       <div className="higher-range">
//                         {averageScoreRange.max}
//                       </div>
//                     </div>
//                     {trackValue === "trackBy_module" &&
//                     technicalValue !== "" &&
//                     classValue !== "" ? (
//                       <TechnicalTable
//                         classCode={classValue}
//                         trackValue={trackValue}
//                       />
//                     ) : (
//                       <ClassAdminTable
//                         trainerAccount={classAdminValue}
//                         classCode={classValue}
//                         trackValue={trackValue}
//                         startValue={timeValue?.[0]}
//                         endValue={timeValue?.[1]}
//                       />
//                     )}
//                   </>
//                 ) : (
//                   ""
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseOrganization;
