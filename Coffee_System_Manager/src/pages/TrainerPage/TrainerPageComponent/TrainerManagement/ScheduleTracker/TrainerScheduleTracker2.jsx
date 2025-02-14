// import React, { useState, useEffect } from "react";
// import Loading from "../../../../../components/Loading/Loading";
// import TrainingFilter from "./components/TrainingFilter/TrainingFilter2";
// import TrainingTable from "./components/TrainingTable/TrainingTable2";
// import "./TrainerScheduleTracker.css";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import dayjs from "dayjs";
// import { showErrorNotification } from "../../../../../components/Notifications/Notifications";
// import { message } from "antd";

// export default function TrainerScheduleTracker2() {
//   const { id } = useParams();
//   const [scheduleData, setScheduleData] = useState([]);
//   const [selectedModule, setSelectedModule] = useState(null);
//   const [selectedModuleInfo, setSelectedModuleInfo] = useState({});
//   const [selectedDeliveryType, setSelectedDeliveryType] = useState("");
//   const [selectedTrainingFormat, setSelectedTrainingFormat] = useState("");
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredDeliveryTypes, setFilteredDeliveryTypes] = useState([]);
//   const [filteredTrainingFormats, setFilteredTrainingFormats] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [scheduleDates, setScheduleDates] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [noDataAvailable, setNoDataAvailable] = useState(false);

//   useEffect(() => {
//     const fetchScheduleData = async () => {
//       setIsLoading(true);
//       setNoDataAvailable(false);
//       const token = sessionStorage.getItem("accessToken");
//       if (!token) {
//         //console.error("Token not found");
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v3/trainers/trainer-report/get-schedule-by-class?classID=${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.status === 400) {
//           setNoDataAvailable(true);
//           return;
//         }

//         const data = response.data.data;
//         setScheduleData(data);
//         //console.log(response.data);
//         //console.log(response.data.name);

//         const uniqueScheduleDates = new Set();
//         data.forEach((item) => {
//           item.topics.forEach((topic) => {
//             topic.contents.forEach((content) => {
//               uniqueScheduleDates.add(content.scheduledTime);
//             });
//           });
//         });
//         setScheduleDates([...uniqueScheduleDates]);
//       } catch (error) {
//         //console.error("Error fetching schedule data:", error);
//         if (error.response && error.response.status === 400) {
//           setNoDataAvailable(true);
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchScheduleData();
//   }, [id]);

//   const fetchLatestData = async () => {
//     const token = sessionStorage.getItem("accessToken");
//     if (!token) {
//       //console.error("Token not found");
//       return null;
//     }

//     try {
//       const response = await axios.get(
//         `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v3/trainers/trainer-report/get-schedule-by-class?classID=${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data.data;
//     } catch (error) {

//       //console.error("Error fetching schedule data:", error);
//       return null;
//     }
//   };

//   const handleModuleChange = async (moduleId) => {
//     setIsLoading(true);
//     try {
//       const latestData = await fetchLatestData();
//       if (!latestData) return;

//       setScheduleData(latestData);
//       setSelectedModule(moduleId);

//       const selected = latestData.find((item) => item.id === moduleId);
//       if (selected) {
//         const moduleDates = new Set();
//         selected.topics.forEach((topic) => {
//           topic.contents.forEach((content) => {
//             if (content.scheduledTime) {
//               moduleDates.add(content.scheduledTime);
//             }
//           });
//         });
//         setScheduleDates([...moduleDates]);

//         const uniqueDeliveryTypes = new Set();
//         const uniqueTrainingFormats = new Set();

//         const groupedByReport = {};
//         selected.topics.forEach((topic) => {
//           topic.contents.forEach((content) => {
//             uniqueDeliveryTypes.add(content.deliveryType);
//             uniqueTrainingFormats.add(content.trainingFormat);

//             if (content.reportId) {
//               const key = `${content.reportId}-${topic.name}`; // Use both reportId and topicName as key
//               if (!groupedByReport[key]) {
//                 groupedByReport[key] = {
//                   contents: [],
//                   actualDate: content.actualDate,
//                   duration: content.duration,
//                   note: content.note,
//                   reason: content.reason,
//                   status: content.status,
//                   reportId: content.reportId,
//                 };
//               }
//               groupedByReport[key].contents.push({
//                 moduleId: selected.id,
//                 topicName: topic.name,
//                 topicId: topic.id,
//                 contentName: content.name,
//                 contentId: content.id,
//                 deliveryType: content.deliveryType,
//                 trainingFormat: content.trainingFormat,
//                 scheduleDate: content.scheduledTime,
//               });
//             }
//           });
//         });

//         setSelectedModuleInfo({
//           name: selected.name,
//           startTime: dayjs(selected.startTime).format("DD/MM/YYYY"),
//           endTime: dayjs(selected.endTime).format("DD/MM/YYYY"),
//         });

//         const mergedData = selected.topics.flatMap((topic) =>
//           topic.contents.map((content) => {
//             const key = `${content.reportId}-${topic.name}`;
//             if (content.reportId && groupedByReport[key]) {
//               const group = groupedByReport[key];
//               return {
//                 moduleId: selected.id,
//                 topicName: topic.name,
//                 topicId: topic.id,
//                 contentName: content.name,
//                 contentId: content.id,
//                 deliveryType: content.deliveryType,
//                 trainingFormat: content.trainingFormat,
//                 scheduleDate: content.scheduledTime,
//                 actualDate: group.actualDate,
//                 duration: group.duration,
//                 note: group.note,
//                 reason: group.reason,
//                 status: group.status,
//                 reportId: content.reportId,
//                 mergedContents: group.contents,
//               };
//             } else {
//               return {
//                 moduleId: selected.id,
//                 topicName: topic.name,
//                 topicId: topic.id,
//                 contentName: content.name,
//                 contentId: content.id,
//                 deliveryType: content.deliveryType,
//                 trainingFormat: content.trainingFormat,
//                 scheduleDate: content.scheduledTime,
//                 actualDate: content.actualDate,
//                 duration: content.duration,
//                 note: content.note,
//                 reason: content.reason,
//                 status: content.status,
//                 reportId: content.reportId,
//               };
//             }
//           })
//         );

//         setFilteredData(mergedData);
//         setFilteredDeliveryTypes([...uniqueDeliveryTypes]);
//         setFilteredTrainingFormats([...uniqueTrainingFormats]);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const refreshData = async () => {
//     setIsLoading(true);
//     const previousSelectedModule = selectedModule;

//     try {
//       // Clear all filters and data first
//       setSelectedModule(null);
//       setSelectedModuleInfo({});
//       setSelectedDeliveryType("");
//       setSelectedTrainingFormat("");
//       setSelectedDate(null);
//       setSearchTerm("");
//       setFilteredData([]);
//       setFilteredDeliveryTypes([]);
//       setFilteredTrainingFormats([]);

//       // Wait for states to clear
//       await new Promise(resolve => setTimeout(resolve, 0));

//       // Reuse handleModuleChange to get fresh data
//       if (previousSelectedModule) {
//         await handleModuleChange(previousSelectedModule);
//       }
//     } catch (error) {
//       //console.error("Error refreshing data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="TrainerScheduleTrackerPage">
//       <Loading isLoading={isLoading} />
//       {!isLoading && !noDataAvailable && (
//         <>
//           <TrainingFilter
//             modules={scheduleData}
//             deliveryTypes={filteredDeliveryTypes}
//             trainingFormats={filteredTrainingFormats}
//             scheduleDates={scheduleDates}
//             selectedModule={selectedModule}
//             selectedDeliveryType={selectedDeliveryType}
//             selectedTrainingFormat={selectedTrainingFormat}
//             selectedDate={selectedDate}
//             searchTerm={searchTerm}
//             onModuleChange={handleModuleChange}
//             onDeliveryTypeChange={setSelectedDeliveryType}
//             onTrainingFormatChange={setSelectedTrainingFormat}
//             onDateChange={setSelectedDate}
//             onSearchChange={setSearchTerm}
//           />

//           {/* Dòng hiển thị thông tin Module với flexbox */}
//           {selectedModule !== null && (
//             <div
//               className="module-info"
//               style={{
//                 display: "flex",
//                 textWrap: "nowrap",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "1em",
//                 padding: "0 10px 0 10px",
//                 marginTop: "10px"
//               }}
//             >
//               <div>
//                 <strong>Module:</strong> {selectedModuleInfo.name || "All Modules"}
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   gap: "20px",
//                 }}
//               >
//                 <div>
//                   <strong>Start Time:</strong> {selectedModuleInfo.startTime || "-"}
//                 </div>
//                 <div>
//                   <strong>End Time:</strong> {selectedModuleInfo.endTime || "-"}
//                 </div>
//               </div>
//             </div>
//           )}

//           {selectedModule && (
//             <TrainingTable
//               data={filteredData}
//               selectedDeliveryType={selectedDeliveryType}
//               selectedTrainingFormat={selectedTrainingFormat}
//               selectedDate={selectedDate}
//               searchTerm={searchTerm}
//               onDataUpdate={refreshData}
//             />
//           )}
//         </>
//       )}
//       {noDataAvailable && (
//         <div className='no-data-feedback'>NO SCHEDULE FOR THIS CLASS</div>
//       )}
//     </div>
//   );
// }
