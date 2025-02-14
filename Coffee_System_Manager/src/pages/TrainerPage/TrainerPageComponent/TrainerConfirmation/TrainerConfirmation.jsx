// import "./TrainerConfirmation.css";
// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Checkbox,
//   Tag,
//   Button,
//   Input,
//   DatePicker,
//   Select,
//   Modal,
//   Form,
// } from "antd";
// import dayjs from "dayjs";
// import { fetchData, postData } from "./ApiService/apiService";
// import { useNavigate } from "react-router-dom";
// import { IoEye, IoCheckmark, IoClose } from "react-icons/io5";
// import {
//   showErrorNotification,
//   showSuccessNotification,
//   showWarningNotification,
// } from "../../../../components/Notifications/Notifications";

// const { TextArea } = Input;
// const { Option } = Select;

// const ClassConfirmationTable = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [modalAction, setModalAction] = useState("");
//   const [selectedModules, setSelectedModules] = useState([]);
//   const [reason, setReason] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [fetchConfinrmData, setFetchConfinrmData] = useState([]);
//   const [form] = Form.useForm();
//   const name = sessionStorage.getItem("username");
//   const path = name;

//   const navigate = useNavigate();

//   useEffect(() => {
//     loadEvents();
//   }, []);

//   const showModal = (action) => {
//     if (selectedModules.length === 0) {
//       showWarningNotification("Please select at least one module."); // Show warning if no checkboxes are selected
//       return;
//     }
//     setModalAction(action);
//     setIsModalVisible(true);
//   };

//   const loadEvents = async () => {
//     try {
//       const response = await fetchData(path);
//       setFetchConfinrmData(response.data.classConfirmations || []);
//       //console.log(fetchConfinrmData);
//     } catch (error) {
//       //console.error("Error loading events:", error);
//     }
//   };
//   //console.log(fetchConfinrmData);

//   const convertData = (classConfirmations) => {
//     let rows = [];
//     classConfirmations.forEach((classItem) => {
//       const {
//         id,
//         className,
//         technicalGroup,
//         site,
//         planStartDate,
//         planEndDate,
//         modules,
//       } = classItem;
//       modules.forEach((module, index) => {
//         rows.push({
//           key: `${id}-${module.moduleId}`,
//           id: id,
//           className: index === 0 ? className : "",
//           technicalGroup: index === 0 ? technicalGroup : "",
//           site: index === 0 ? site : "",
//           planStartDate: index === 0 ? planStartDate : "",
//           planEndDate: index === 0 ? planEndDate : "",
//           moduleName: module.moduleName,
//           status: module.status,
//           moduleConfirmId: module.moduleConfirmId,
//           rowSpan: index === 0 ? modules.length : 0,
//         });
//       });
//     });
//     return rows;
//   };

//   const convertedData = convertData(fetchConfinrmData);

//   // Debug dữ liệu đã chuyển đổi

//   const getSelectedModuleNames = () => {
//     return selectedModules
//       .map((moduleConfirmId) => {
//         for (let classItem of convertedData) {
//           if (classItem.moduleConfirmId === moduleConfirmId) {
//             return classItem.moduleName;
//           }
//         }
//         return null;
//       })
//       .filter((name) => name);
//   };

//   const handleOk = async () => {
//     const data = {
//       ids: selectedModules,
//       status: modalAction.toUpperCase(),
//       reason: reason,
//     };

//     try {
//       await postData(data);
//       const response = await fetchData(path);
//       setFetchConfinrmData(response.data.classConfirmations || []);
//       showSuccessNotification("Change status successfully!");
//     } catch (error) {
//       showErrorNotification(" Changes tatus error ! ");
//     }
//     //console.log('Dữ liệu gửi đi:', data);
//     setSelectedModules([]);
//     setIsModalVisible(false);
//     setReason("");
//     form.resetFields();
//   };

//   const handleCancel = () => {
//     setReason("");
//     form.resetFields();
//     setIsModalVisible(false);
//   };

//   const onSubmit = () => {
//     form
//       .validateFields()
//       .then(() => {
//         handleOk(); // Truyền `reason` khi OK
//       })
//       .catch((err) => {
//         setReason("");
//       });
//   };

//   const filteredData = convertedData.filter((item) => {
//     const statusMatches =
//       statusFilter === "All" || item.status === statusFilter;
//     const searchTextMatches = item.className
//       .toLowerCase()
//       .includes(searchText.toLowerCase());
//     const startDateMatches =
//       !startDate || dayjs(item.planStartDate).isSame(startDate, "day");
//     const endDateMatches =
//       !endDate || dayjs(item.planEndDate).isSame(endDate, "day");

//     return (
//       statusMatches && searchTextMatches && startDateMatches && endDateMatches
//     );
//   });

//   const handleCheckboxChange = (moduleConfirmId, checked) => {
//     setSelectedModules((prevSelected) =>
//       checked
//         ? [...prevSelected, moduleConfirmId]
//         : prevSelected.filter((id) => id !== moduleConfirmId)
//     );
//   };

//   const columns = [
//     {
//       title: "No.",
//       dataIndex: "no",
//       key: "no",
//       fixed: "left",
//       width: 50,
//       render: (text, record, index) => {
//         const firstOccurrenceIndex = convertedData.findIndex(
//           (item) => item.id === record.id // Use class ID for grouping
//         );
//         const rowSpan =
//           index === firstOccurrenceIndex
//             ? convertedData.filter((item) => item.id === record.id).length
//             : 0;

//         return {
//           children:
//             index === firstOccurrenceIndex ? <div>{index + 1}</div> : null,
//           props: {
//             rowSpan,
//           },
//         };
//       },
//     },
//     {
//       title: "Class Code",
//       dataIndex: "className",
//       key: "className",
//       width: "10%",
//       render: (text, record, index) => {
//         const firstOccurrenceIndex = convertedData.findIndex(
//           (item) => item.id === record.id
//         );
//         const rowSpan =
//           index === firstOccurrenceIndex
//             ? convertedData.filter((item) => item.id === record.id).length
//             : 0;

//         return {
//           children:
//             index === firstOccurrenceIndex ? (
//               <a
//                 onClick={() => {
//                   navigate(
//                     `/trainerPage/classdetailConfirm/${record.className}`,
//                     { state: { value: record.className } }
//                   );
//                   sessionStorage.setItem("classcode", record.className);
//                 }}
//               >
//                 {record.className}
//               </a>
//             ) : null,
//           props: {
//             rowSpan,
//           },
//         };
//       },
//     },
//     {
//       title: "Technical Group",
//       dataIndex: "technicalGroup",
//       key: "technicalGroup",
//       fixed: "left",
//       width: 150,
//       render: (text, record, index) => {
//         const firstOccurrenceIndex = convertedData.findIndex(
//           (item) => item.id === record.id
//         );
//         const rowSpan =
//           index === firstOccurrenceIndex
//             ? convertedData.filter((item) => item.id === record.id).length
//             : 0;

//         return {
//           children:
//             index === firstOccurrenceIndex ? (
//               <div>{record.technicalGroup}</div>
//             ) : null,
//           props: {
//             rowSpan,
//           },
//         };
//       },
//     },
//     {
//       title: "Site",
//       dataIndex: "site",
//       key: "site",
//       width: 100,
//       render: (text, record, index) => {
//         const firstOccurrenceIndex = convertedData.findIndex(
//           (item) => item.id === record.id
//         );
//         const rowSpan =
//           index === firstOccurrenceIndex
//             ? convertedData.filter((item) => item.id === record.id).length
//             : 0;
//         return {
//           children:
//             index === firstOccurrenceIndex ? <div>{record.site}</div> : null,
//           props: {
//             rowSpan,
//           },
//         };
//       },
//     },
//     {
//       title: "Plan Start Date",
//       dataIndex: "planStartDate",
//       key: "planStartDate",
//       width: 150,
//       render: (text, record, index) => {
//         const firstOccurrenceIndex = convertedData.findIndex(
//           (item) => item.id === record.id
//         );
//         const rowSpan =
//           index === firstOccurrenceIndex
//             ? convertedData.filter((item) => item.id === record.id).length
//             : 0;
//         return {
//           children:
//             index === firstOccurrenceIndex ? (
//               <div>{dayjs(record.planStartDate).format("DD-MMM-YYYY")}</div>
//             ) : null,
//           props: {
//             rowSpan,
//           },
//         };
//       },
//     },
//     {
//       title: "Plan End Date",
//       dataIndex: "planEndDate",
//       key: "planEndDate",
//       width: 150,
//       render: (text, record, index) => {
//         const firstOccurrenceIndex = convertedData.findIndex(
//           (item) => item.id === record.id
//         );
//         const rowSpan =
//           index === firstOccurrenceIndex
//             ? convertedData.filter((item) => item.id === record.id).length
//             : 0;

//         return {
//           children:
//             index === firstOccurrenceIndex ? (
//               <div>{dayjs(record.planEndDate).format("DD-MMM-YYYY")}</div>
//             ) : null,
//           props: {
//             rowSpan,
//           },
//         };
//       },
//     },
//     {
//       title: "Module Name",
//       dataIndex: "moduleName",
//       key: "moduleName",
//       width: "20%",
//       render: (text, record) => (
//         <Checkbox
//           checked={selectedModules.includes(record.moduleConfirmId)} // Use moduleConfirmId instead of id
//           onChange={(e) =>
//             handleCheckboxChange(record.moduleConfirmId, e.target.checked)
//           }
//         >
//           {text}
//         </Checkbox>
//       ),
//     },

//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       width: "5%",
//       render: (status) => {
//         let color;
//         let text;

//         switch (status) {
//           case "ACCEPT":
//             color = "green";
//             text = "Confirmed";
//             break;
//           case "ASSIGNED":
//             color = "orange";
//             text = "Assigned";
//             break;
//           case "CONSIDERED":
//             color = "grey";
//             text = "Consider";
//             break;
//           case "DECLINED":
//             color = "red";
//             text = "Declined";
//             break;
//           default:
//             color = "gray";
//             text = "Unknown";
//         }

//         return <Tag color={color}>{text}</Tag>;
//       },
//     },
//     {
//       title: "Action",
//       key: "action",
//       width: "10%",
//       render: (_, row) => (
//         <div className="confirm-action">
//           <div className="io-check" onClick={() => showModal("Accept")}>
//             <IoCheckmark />
//           </div>
//           <div className="io-eye" onClick={() => showModal("Considered")}>
//             <IoEye />
//           </div>
//           <div className="io-close" onClick={() => showModal("Declined")}>
//             <IoClose />
//           </div>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div className="trainer-confirmation-title">TRAINER CONFIRMATION</div>
//       <div
//         className="confirm-container"
//         style={{ padding: "20px 20px 0 20px", background: "#fff" }}
//       >
//         <div style={{ marginBottom: "16px" }}>
//           <Select
//             value={statusFilter}
//             onChange={setStatusFilter}
//             style={{ width: 120, marginRight: 8 }}
//           >
//             <Option value="All">All</Option>
//             {Array.from(new Set(convertedData.map((item) => item.status))).map(
//               (status) => (
//                 <Option key={status} value={status}>
//                   {status}
//                 </Option>
//               )
//             )}
//           </Select>
//           <DatePicker
//             value={startDate}
//             onChange={(date) => setStartDate(date)}
//             placeholder="Start Date"
//             style={{ marginRight: 8 }}
//           />
//           <DatePicker
//             value={endDate}
//             onChange={(date) => setEndDate(date)}
//             placeholder="End Date"
//             style={{ marginRight: 8 }}
//           />
//           <Input.Search
//             placeholder="Enter class code, class name"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             style={{ width: 200 }}
//           />
//         </div>
//         <div>
//           <Table
//             columns={columns}
//             dataSource={filteredData}
//             pagination={{
//               defaultPageSize: 10,
//               pageSizeOptions: ["10", "20", "50"],
//               showSizeChanger: true,
//             }}
//             rowKey="key"
//           />
//         </div>
//         <Modal
//           title={`${modalAction} Modules`.toUpperCase()}
//           open={isModalVisible}
//           onOk={onSubmit}
//           onCancel={handleCancel}
//         >
//           <p>Do you really want to {modalAction} modules ?</p>
//           <ul>
//             {getSelectedModuleNames().map((moduleName, index) => (
//               <li key={index}>{moduleName}</li>
//             ))}
//           </ul>
//           <Form form={form} layout="vertical" initialValues={reason}>
//             <Form.Item
//               label="Reason"
//               name="reason"
//               rules={[{ required: true, message: " Reason is required " }]}
//             >
//               <TextArea
//                 rows={4}
//                 placeholder="Enter reason..."
//                 onChange={(e) => setReason(e.target.value)}
//               />
//             </Form.Item>
//           </Form>
//         </Modal>
//       </div>
//       <div className="trainer-confirmation-footer">
//         <button className="accpect-btn" onClick={() => showModal("Accept")}>
//           Accept
//         </button>
//         <button
//           className="consider-btn"
//           onClick={() => showModal("Considered")}
//         >
//           Consider
//         </button>
//         <button className="decline-btn" onClick={() => showModal("Declined")}>
//           Decline
//         </button>
//       </div>
//     </>
//   );
// };

// export default ClassConfirmationTable;
