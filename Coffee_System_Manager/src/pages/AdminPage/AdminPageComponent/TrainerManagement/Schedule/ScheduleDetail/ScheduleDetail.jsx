import React, { useState, useEffect } from "react";
import './ScheduleDetail.css';
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import { fetchDMEventDetails } from "../ApiService/apiService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input, Spin, Table } from "antd";
import { showErrorNotification, showSuccessNotification } from "../../../../../../components/Notifications/Notifications";
import ScheduleDetailLoad from "../ScheduleLoad/ScheduleDetailLoad";

dayjs.extend(isBetween);

export default function ScheduleDetail() {
    const [DMeventDetails, setDMeventDetails] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const date_selected = searchParams.get('date');

    useEffect(() => {
        loadDMEventDetails(date_selected);
    }, [date_selected]);

    useEffect(() => {
    }, [DMeventDetails]);
    
    useEffect(() => {
    }, [filteredData]);

    const loadDMEventDetails = async (section) => {
        try {
            setLoading(true)
            const response = await fetchDMEventDetails(section);
            if (response && response.data) {
                setDMeventDetails(response.data);
                setFilteredData(response.data);
                setLoading(false);
            } else if (Array.isArray(response)) {
                setDMeventDetails(response);
                setFilteredData(response);
                setLoading(false);
            } else if (response.length = 0) {
                setDMeventDetails([]);
                setFilteredData([]);
                showErrorNotification("No Schedule Details Data for this Date", `${response.message}`);
                setLoading(false);
            }
        } catch (error) {
            showErrorNotification("An Error Occurred While Loading Schedule Details", `${error.message}`);
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearchFilter(keyword);

        const filtered = DMeventDetails.filter(event =>
            event.feedbackTemplateName.toLowerCase().includes(keyword)
        );
        setFilteredData(filtered);
    };

    const columns = [
        { 
            title: 'Template', 
            dataIndex: 'feedbackTemplateName', 
            key: 'template', 
            render: text => text || 'None' 
        },
        { 
            title: 'Owner', 
            dataIndex: 'owner', 
            key: 'owner', 
            render: text => text || 'None' 
        },
        { 
            title: 'To Class', 
            dataIndex: 'className', 
            key: 'toClass', 
            render: text => text || 'None' 
        },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            key: 'status', 
            render: text => text || 'None' 
        },
    ];

    return (
        <div className='schedule-detail'>
            <div className='diviner'>
                <h1 className="statitics-text">Schedule</h1>
            </div>

            <div className="categories-items">
                <a className="selected">Schedule Detail</a>
            </div>

            {loading ? (
                <ScheduleDetailLoad/>
            ) : (
                <div className="scheduleDetail-container">
                    <div className='scheduleDetail-content'>
                        {/* Filters */}
                        <div className="scheduleDetail-filters">
                            <div>
                                <div className="scheduleDetail-filter-title">Search</div>
                                <Input 
                                    placeholder="Search by Template Title" 
                                    className="scheduleDetail-search-input" 
                                    onChange={handleSearchChange} 
                                    value={searchFilter}
                                />
                            </div>
                            <div>
                                <span className="scheduleDetail-time-title">Time</span> 
                                <span>{dayjs(date_selected).format("DD/MM/YYYY - HH:mm A")}</span>
                            </div>
                        </div>
                        <Table
                            className="scheduleDetail-table"
                            columns={columns}
                            dataSource={filteredData}
                            pagination={{ pageSize: 5 }}
                            rowKey="id"
                        />
                    </div>
                    <div className="schedule-detail-footer">
                        <div 
                            className="back-btn" 
                            onClick={() => navigate("/DeliveryManagerPage/traineeManagement/schedule")}
                        >
                            Back to Schedule Template
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}