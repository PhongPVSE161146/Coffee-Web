// import React, { useState, useEffect } from 'react';
// import "./ClassInfo.css";
// import { fetchData } from '../ApiService/apiService';
// import { Outlet } from 'react-router-dom';

// const ClassInfo = () => {
//     const name = sessionStorage.getItem("classcode");
//     const [data, setData] = useState({});
//     const path = name;

//     useEffect(() => {
//         loadEvents();
//     }, []);

//     const loadEvents = async () => {
//         try {
//             const response = await fetchData(path);
//             setData(response.data || {});
//         } catch (error) {
//             //console.error("Error loading events:", error);
//         }
//     };

//     return (
//         <div className='confirm-content'>
//             <table className="confirm-info-table">
//                 <thead>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td className="confirm-form-tile">Class Name</td>
//                         <td>{data.className}</td>
//                         <td className="confirm-form-tile">Delivery Type</td>
//                         <td>{data.deliveryType}</td>
//                         <td className="confirm-form-tile">Trainee Type</td>
//                         <td>{data.traineeType}</td>
//                     </tr>
//                     <tr>
//                         <td className="confirm-form-tile">Format Type</td>
//                         <td>{data.formatType}</td>
//                         <td className="confirm-form-tile">Request Group</td>
//                         <td>{data.requestGroup}</td>
//                         <td className="confirm-form-tile">Request Subgroup</td>
//                         <td>{data.requestSubgroup}</td>
//                     </tr>
//                     <tr>
//                         <td className="confirm-form-tile">Technical Group</td>
//                         <td>{data.technicalGroup}</td>
//                         <td className="confirm-form-tile">Training Program</td>
//                         <td>{data.trainingProgram}</td>
//                         <td className="confirm-form-tile">Site</td>
//                         <td>{data.site}</td>
//                     </tr>
//                     <tr>
//                         <td className="confirm-form-tile">Location</td>
//                         <td>{data.location}</td>
//                         <td className="confirm-form-tile">Expected Start Date</td>
//                         <td>{data.expectedStartDate}</td>
//                         <td className="confirm-form-tile">
//                             Expected End Date
//                         </td>
//                         <td>{data.expectedEndDate}</td>
//                     </tr>
//                     <tr>
//                         <td className="confirm-form-tile">Planned Trainee No</td>
//                         <td>{data.plannedTraineeNo}</td>
//                         <td className="confirm-form-tile">Subject Type</td>
//                         <td>{data.subjectType}</td>
//                         <td className="confirm-form-tile">
//                             Planned Revenue
//                         </td>
//                         <td>{data.plannedRevenue}</td>
//                     </tr>
//                     <tr>
//                         <td className="confirm-form-tile">Scope</td>
//                         <td>{data.scope}</td>
//                         <td className="confirm-form-tile">Supplier/Partner</td>
//                         <td>{data.supplierPartner}</td>
//                         <td className="confirm-form-tile">
//                             Key Program
//                         </td>
//                         <td>{data.keyProgram}</td>
//                     </tr>
//                     <tr>
//                         <td className="confirm-form-tile">Global SE</td>
//                         <td>{data.globalSE}</td>
//                         <td className="confirm-form-tile">Job Recommendation</td>
//                         <td>{data.jobRecommendation}</td>
//                         <td className="confirm-form-tile">
//                             Salary Paid
//                         </td>
//                         <td>{data.salaryPaid}</td>
//                     </tr>
//                     <tr>
//                         <td className="confirm-form-tile">Note</td>
//                         <td colSpan="5">{data.note}</td>
//                     </tr>
//                 </tbody>
//             </table>
//             <Outlet />
//         </div>
//     );
// };

// export default ClassInfo;