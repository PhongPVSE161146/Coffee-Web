// import React, { useEffect, useState } from 'react';
// import { Modal, Button, Select, Checkbox, Input, Spin, Dropdown, Menu } from 'antd';
// import './NewClassDetail.css';
// import TrainerScheduleTracker2 from '../../../../../TrainerPage/TrainerPageComponent/TrainerManagement/ScheduleTracker/TrainerScheduleTracker2';
// import { fetchData } from './ApiServices/apiService';
// import { useNavigate, useParams } from 'react-router-dom';
// import dayjs from 'dayjs';
// import { fetchModulesByClassId, exportScheduleTrackerReport } from './ApiServices/apiService';
// import { showSuccessNotification, showErrorNotification, showWarningNotification } from '../../../../../../components/Notifications/Notifications';

// const { Option } = Select;

// export const NewClassDetail = () => {
//   const role = sessionStorage.getItem("selectedRole");
//   const { id } = useParams();
//   const [classData, setClassData] = useState(null);
//   const [classlistSelected, setClasslistSelected] = useState('detail');
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedModules, setSelectedModules] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [modules, setModules] = useState([]);
//   const [isExporting, setIsExporting] = useState(false);
//   const navigate = useNavigate();

//   const loadClassDetail = async () => {
//     try {
//       const response = await fetchData(id);
//       setClassData(response.data || {});
//       setLoading(false);
//     } catch (error) {
//       //console.error("Error loading class details:", error);
//       setLoading(false);
//     }
//   };

//   const tableData = classData ? [
//     { label: 'Class Name', value: classData?.name || 'None' },
//     { label: 'Format Type', value: classData?.formatType || 'None' },
//     { label: 'Technical Group', value: classData?.technicalGroup || 'None' },
//     { label: 'Location', value: classData?.location || 'None' },
//     { label: 'Planned Trainee No.', value: classData?.plannedTraineeNo || 'None' },
//     { label: 'Scope', value: classData?.scope || 'None' },
//     { label: 'Global SE', value: classData?.globalSe || 'None' },
//     { label: 'Delivery Type', value: classData?.deliveryType || 'None' },
//     { label: 'Request Group', value: classData?.requestGroup || 'None' },
//     { label: 'Training Program', value: classData?.trainingProgram || 'None' },
//     { label: 'Expected Start Date', value: classData?.expectedStartDate ? dayjs(classData.expectedStartDate).format('DD/MM/YYYY') : 'None' },
//     { label: 'Subject Type', value: classData?.subjectType || 'None' },
//     { label: 'Supplier', value: classData?.supplier || 'None' },
//     { label: 'Job Recommendation', value: classData?.jobRecommendation || 'None' },
//     { label: 'Trainee Type', value: classData?.traineeType || 'None' },
//     { label: 'Request Subgroup', value: classData?.requestSubgroup || 'None' },
//     { label: 'Site', value: classData?.site || 'None' },
//     { label: 'Expected End Date', value: classData?.expectedEndDate ? dayjs(classData.expectedEndDate).format('DD/MM/YYYY') : 'None' },
//     { label: 'Planned Revenue', value: classData?.plannedRevenue || 'None' },
//     { label: 'Key Program', value: classData?.keyProgram || 'None' },
//     { label: 'Salary Paid', value: classData?.salaryPaid || 'None' },
//   ] : [];

//   const handleOpenModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalVisible(false);
//     setSelectedModules([]); // Reset selected modules when closing the modal
//     setSearchTerm(''); // Clear the search term when closing the modal
//   };

//   const loadModulesByClassId = async (id) => {
//     try {
//       const modulesResponse = await fetchModulesByClassId(id);
//       setModules(modulesResponse.data || []);
//     } catch (error) {
//       //console.error("Error loading modules:", error);
//     }
//   };

//   useEffect(() => {
//     loadClassDetail();
//     if (id) {
//       loadModulesByClassId(id);
//     }
//   }, [id]);

//   const handleModuleChange = (value) => {
//     setSelectedModules(value); // Directly update selected modules with value from Select
//   };

//   const handleSelectAll = () => {
//     if (selectedModules.length === modules.length) {
//       setSelectedModules([]);
//     } else {
//       setSelectedModules(modules.map(module => module.id)); // Select all modules
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value); // Update search term on input change
//   };

//   const filteredModules = Array.isArray(modules)
//     ? modules.filter((module) => module.moduleName && module.moduleName.toLowerCase().includes(searchTerm.toLowerCase()))
//     : [];

//   const handleMenuClick = (e) => {
//     if (e.key === 'exportScheduleTracker') {
//       handleOpenModal(); // Open the modal for exporting data
//     }
//     if (e.key === 'exportTrainingData') {
      
//     }
//     if (e.key === 'exportOJTTrainingData') {
      
//     }
//   };

//   const exportMenu = (
//     <Menu onClick={handleMenuClick}>
//       <Menu.Item key="exportTrainingData">Export Training Data</Menu.Item>
//       <Menu.Item key="exportOJTTrainingData">Export OJT Training Data</Menu.Item>
//       <Menu.Item key="exportScheduleTracker">Export Schedule Tracker Data</Menu.Item>
//     </Menu>
//   );

//   const exportToExcel = async () => {
//     if (selectedModules.length === 0) {
//       showWarningNotification(
//         'No Modules Selected',
//         'Please select at least one module to export'
//       );
//       return;
//     }

//     setIsExporting(true);
//     try {
//       const response = await exportScheduleTrackerReport(selectedModules);
//       if (response.success) {
//         showSuccessNotification(
//           'Export Successful',
//           'Schedule tracker data has been exported successfully'
//         );
//         handleCloseModal();
//       } else {
//         showErrorNotification(
//           'Export Failed',
//           response.message || 'Failed to export schedule tracker data'
//         );
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message 
//         || error.message 
//         || 'An error occurred while exporting data';
      
//       showErrorNotification(
//         'Export Error: ',
//         `${error.message}`
//       );
//       //console.error('Export error:', error);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   return (
//     <>
//       {loading ? (
//         <div style={{ textAlign: 'center', marginTop: '50px' }}>
//           <Spin size="large" />
//           <p>Loading...</p>
//         </div>
//       ) : (
//         <div className="new-class-detail">
//           <div className="diviner">
//             <h1 className="statitics-text">Class Detail: {classData?.name || 'Loading...'}</h1>
//             <Dropdown overlay={exportMenu} trigger={['click']}>
//               <div className="classdetail-export-btn">
//                 Export Data
//               </div>
//             </Dropdown>
//           </div>

//           <div className="categories-items">
//             <a className={classlistSelected === 'detail' ? 'selected' : ''} onClick={() => setClasslistSelected('detail')}>Class Info</a>
//             <a>Trainer List</a>
//             <a>Budget & Operation Info</a>
//             <a>Activities</a>
//             <a className={classlistSelected === 'tracker' ? 'selected' : ''} onClick={() => setClasslistSelected('tracker')}>Schedule Tracker</a>
//           </div>



//           {classlistSelected === 'detail' && (
//             <div>
//               <div className="newClasslist-general">
//                 <a>General</a>
//               </div>
//               <div className='newclasslist-custom-table-bigdiv'>
//                 <table className="newclasslist-custom-table">
//                   <tbody className='newclasslist-custom-table-body'>
//                     {tableData.slice(0, 7).map((item, index) => (
//                       <tr key={index}>
//                         <td className="newclasslist-table-field">{item.label}</td>
//                         <td className="newclasslist-table-value">{item.value}</td>
//                         <td className="newclasslist-table-field">{tableData[index + 7]?.label}</td>
//                         <td className="newclasslist-table-value">{tableData[index + 7]?.value}</td>
//                         <td className="newclasslist-table-field">{tableData[index + 14]?.label}</td>
//                         <td className="newclasslist-table-value">{tableData[index + 14]?.value}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {classlistSelected === 'tracker' && (
//             <TrainerScheduleTracker2 />
//           )}

//           <Modal
//             className="new-class-detail-modal"
//             title="Export Schedule Tracker Data"
//             open={isModalVisible}
//             onCancel={handleCloseModal}
//             closable={false}
//             footer={[
//               <Button key="cancel" shape="round" onClick={handleCloseModal}>Cancel</Button>,
//               <Button
//                 key="export"
//                 type="primary"
//                 loading={isExporting}
//                 onClick={exportToExcel}
//               >
//                 Submit
//               </Button>,
//             ]}
//           >
//             <div className="bleeee">
//               <h3>Module</h3>
//               <Select
//                 mode="multiple"
//                 placeholder="Please select module"
//                 value={selectedModules}
//                 onChange={handleModuleChange}
//                 open={isDropdownOpen}
//                 showSearch={false}
//                 onDropdownVisibleChange={setIsDropdownOpen}
//                 style={{ width: '100%', height: '40px' }}
//                 dropdownRender={(menu) => (
//                   <div>
//                     <Input
//                       placeholder="Search modules..."
//                       value={searchTerm}
//                       onChange={handleSearch}
//                       style={{ marginBottom: 8, width: '100%' }}
//                     />
//                     <Checkbox
//                       checked={selectedModules.length === modules.length}
//                       indeterminate={selectedModules.length > 0 && selectedModules.length < modules.length}
//                       onChange={handleSelectAll}
//                       style={{ marginLeft: '12px', padding: '5px 0' }}
//                     >
//                       Select All
//                     </Checkbox>
//                     <div style={{ maxHeight: '100%' }}>{menu}</div>
//                   </div>
//                 )}
//               >
//                 {filteredModules.map((module) => (
//                   <Option key={module.id} value={module.id}>
//                     <Checkbox
//                       checked={selectedModules.includes(module.id)}
//                       onChange={() =>
//                         handleModuleChange(
//                           selectedModules.includes(module.id)
//                             ? selectedModules.filter((m) => m !== module.id)
//                             : [...selectedModules, module.id]
//                         )
//                       }
//                     >
//                       {module.moduleName}
//                     </Checkbox>
//                   </Option>
//                 ))}
//               </Select>
//             </div>
//           </Modal>
//           <div className="class-detail-footer">
//             <div
//               className="class-detail-back-btn"
//               onClick={() => {
//                 if (role === 'admin') {
//                   navigate("/adminPage/newClassList");
//                 } else if (role === 'trainer') {
//                   navigate("/trainerPage/newClassList");
//                 } else if (role === 'deliverymanager') {
//                   navigate("/DeliveryManagerPage/newClassList"); // Fallback path if needed
//                 } else if (role === 'FAMadmin') {
//                   navigate("/FAMAdminPage/newClassList"); // Fallback path if needed
//                 } 
//               }}
//             >
//               Back to Class List
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default NewClassDetail;
