import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import './AdminModuleDetail.css';
import { axiosInstance } from '../../../../../../axios/Axios';
import Loading from '../../../../../../components/Loading/Loading';
import { AdminModuleFeedback } from '../AdminFeedback/AdminModuleFeedback';

export const AdminTrainerModuleDetail = () => {
  const { moduleId } = useParams(); // Combined useParams call
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moduleSelected, setModuleSelected] = useState('module');
  const navigate = useNavigate();
  // This should now log the account ID correctly

  // Fetch module data
  const fetchModuleData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`trainer/module/get-info/${moduleId}`);
      setModuleData(response.data.data);
      //console.log('Fetched module data:', response.data.data); // Log fetched data 
    } catch (error) {
      //console.error('Error fetching module data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateTotrainerClaslist = () => {
    window.history.back();
  };

  useEffect(() => {
    fetchModuleData(); // Call the fetch function
  }, [moduleId]);

  // Define the 4x4 table data
  const tableData = moduleData ? [
    { label: 'Module', value: moduleData.name },
    { label: 'Skill', value: moduleData.skill || 'None' },
    { label: 'Contribution Type', value: moduleData.contributiontype || 'None' },
    { label: 'End Date', value: new Date(moduleData.endDate).toLocaleDateString() },
    { label: 'Class', value: moduleData.className },
    { label: 'Role', value: moduleData.roleName || 'None' },
    { label: 'Start Date', value: new Date(moduleData.startDate).toLocaleDateString() },
    { label: 'Status', value: moduleData.status || 'None' },
  ] : [];

  if (loading) {
    return <Loading isLoading={loading} />;
  }

  const noteValue = moduleData?.Note || 'None';

  return (
    <div className="module-detail-container">
      <div className='diviner'>
        <h1 className="statitics-text">Module Detail - {moduleData?.name}</h1>
      </div>
      <div className="categories-items">
        <a className={moduleSelected === 'module' ? 'selected' : ''} onClick={() => setModuleSelected('module')}>Module Info</a>
        <a className={moduleSelected === 'feedback' ? 'selected' : ''} onClick={() => setModuleSelected('feedback')}>Feedback</a>
      </div>

      {moduleSelected === 'module' && (
        <Card>
          <table className="module-detail-table">
            <tbody>
              {tableData.slice(0, 4).map((item, index) => (
                <tr key={index}>
                  <td className="field">{item.label}</td>
                  <td className="value">{item.value}</td>
                  <td className="field">{tableData[index + 4]?.label}</td>
                  <td className="value">{tableData[index + 4]?.value}</td>
                </tr>
              ))}
              <tr>
                <td className="field">Note</td>
                <td className="value" colSpan={3}>{noteValue}</td>
              </tr>
            </tbody>
          </table>
        </Card>
      )}

      {moduleSelected === 'feedback' && (
        <AdminModuleFeedback />
      )}
      <div className="trainer-management-footer">
        <div className="back-btn" onClick={handleNavigateTotrainerClaslist}>
          Back to ClassList
        </div>
      </div>
    </div>
  );
};
