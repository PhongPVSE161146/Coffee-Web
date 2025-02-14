// import axios from 'axios';

// export const fetchReportData = async () => {
//   try {
//     const accessToken = sessionStorage.getItem('accessToken');
//     const response = await axios.get(
//       'http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/trainers/reports-history',
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     const data = response.data.data;

//     if (Array.isArray(data)) {
//       return data.flatMap((trainerItem) =>
//         trainerItem.reports.flatMap((report) =>
//           report.topics.map((topic) => ({
//             classId: trainerItem.classId,
//             className: trainerItem.className,
//             moduleName: trainerItem.moduleName,
//             date: report.date,
//             topics: topic.topicName,
//             deliveryType: topic.deliveryType || 'N/A',
//             trainingFormat: topic.trainingFormat || 'N/A',
//             duration: topic.duration || 0,
//             note: topic.note || 'No note',
//             reason: topic.reason || 'No reason',
//           }))
//         )
//       );
//     } else {
//       //console.error('Data is not an array:', data);
//       return [];
//     }
//   } catch (error) {
//     //console.error('Error fetching report data', error);
//     return [];
//   }
// };
