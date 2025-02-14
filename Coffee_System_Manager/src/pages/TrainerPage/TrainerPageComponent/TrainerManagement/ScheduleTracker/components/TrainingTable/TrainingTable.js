import React, { useEffect, useState } from 'react';
import { Table, Spin } from 'antd';
import './TrainingTable.css';
import dayjs from 'dayjs';


import Report from './Report'; // Import Report component
import { axiosInstance } from '../../../../../../../axios/Axios';

const TrainingTable = ({
  selectedClass,
  selectedModule,
  selectedDeliveryType,
  selectedTrainingFormat,
  selectedDate,
  searchTerm,
}) => {
  const [reportData, setReportData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState([]);
 

  // Hàm tải dữ liệu từ API khi component mount lần đầu
  const fetchReportData = async () => {
    try {

      const response = await axiosInstance.get('/trainers/trainer-report/get-schedule-non-report');


      const { data } = response.data;

      const formattedData = data.flatMap((classItem) =>
        classItem.modules.flatMap((moduleItem) =>
          moduleItem.topics.flatMap((topic) => {
            const contents = topic.contents.map((content, contentIndex) => ({
              classId: classItem.classId,
              className: classItem.className,
              moduleId: moduleItem.moduleId,
              moduleName: moduleItem.moduleName,
              topicId: topic.topicId,
              topicName: topic.topicName,
              contentId: content.contentId,
              contentName: content.contentName || 'N/A',
              deliveryType: content.deliveryType || 'N/A',
              trainingFormat: content.trainingFormat || 'N/A',
              scheduleDate: topic.date || 'N/A',
              scheduleDuration: topic.duration || 'N/A',
              isFirstRow: contentIndex === 0,
              rowSpan: topic.contents.length,
            }));
            return contents;
          })
        )
      );

      setReportData(formattedData); // Lưu dữ liệu gốc
      setFilteredData(formattedData); // Lưu dữ liệu lọc ban đầu (chưa lọc)
      setLoading(false);
    } catch (error) {
      //console.error('Error fetching report data', error);
      setLoading(false);
    }
  };

  // Tải dữ liệu khi component mount lần đầu
  useEffect(() => {
    fetchReportData();
  }, []);

  // Lọc dữ liệu mỗi khi dependencies thay đổi
  useEffect(() => {
    const filterData = () => {
      const newFilteredData = reportData.filter((item) => {
        const matchesClass = selectedClass ? item.classId === selectedClass : true;
        const matchesModule = selectedModule ? item.moduleId === selectedModule : true;
        const matchesDeliveryType = selectedDeliveryType ? item.deliveryType === selectedDeliveryType : true;
        const matchesTrainingFormat = selectedTrainingFormat ? item.trainingFormat === selectedTrainingFormat : true;
        const matchesDate = selectedDate ? dayjs(item.scheduleDate).isSame(selectedDate, 'day') : true;
        const matchesSearch = searchTerm
          ? item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.topicName.toLowerCase().includes(searchTerm.toLowerCase())
          : true;

        return matchesClass && matchesModule && matchesDeliveryType && matchesTrainingFormat && matchesDate && matchesSearch;
      });

      setFilteredData(newFilteredData);
    };

    filterData(); // Lọc dữ liệu
  }, [selectedClass, selectedModule, selectedDeliveryType, selectedTrainingFormat, selectedDate, searchTerm, reportData]);


  const handleCheckboxChange = (e, record) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      const topicContentGroup = reportData.filter((item) => item.topicId === record.topicId);
      const classId = record.classId;
      const moduleId = record.moduleId;

      setSelectedTopics((prev) => [
        ...prev,
        {
          topicId: record.topicId,
          topicName: record.topicName,
          classId: classId,
          moduleId: moduleId,
          scheduleDate: record.scheduleDate,
          contents: topicContentGroup.map((item) => ({
            contentId: item.contentId,
            contentName: item.contentName,
          })),
        },
      ]);
    } else {
      const updatedTopics = selectedTopics.filter((item) => item.topicId !== record.topicId);
      setSelectedTopics(updatedTopics);
    }
  };

  const handleRemoveTopic = (updatedTopics) => {
    setSelectedTopics(updatedTopics);
  };

  const refreshTable = () => {
    fetchReportData();
  };

  const columns = (onCheckboxChange, selectedTopics) => [
    {
      title: 'Topic',
      dataIndex: 'topicName',
      key: 'topicName',
      render: (text, record, index) => {
        const previousRecord = index > 0 ? filteredData[index - 1] : null;
        const nextRecord = index < filteredData.length - 1 ? filteredData[index + 1] : null;

        if (previousRecord && previousRecord.topicName === record.topicName) {
          return { props: { rowSpan: 0 } };
        }

        let rowSpan = 1;
        let i = index + 1;
        while (nextRecord && filteredData[i] && filteredData[i].topicName === record.topicName) {
          rowSpan++;
          i++;
        }

        return {
          children: <div>{text}</div>,
          props: { rowSpan },
        };
      },
    },
    {
      title: '', // Checkbox column
      dataIndex: 'checkbox',
      key: 'checkbox',
      render: (_, record, index) => {
        const previousRecord = index > 0 ? filteredData[index - 1] : null;
        const nextRecord = index < filteredData.length - 1 ? filteredData[index + 1] : null;

        if (previousRecord && previousRecord.topicName === record.topicName) {
          return { props: { rowSpan: 0 } };
        }

        let rowSpan = 1;
        let i = index + 1;
        while (nextRecord && filteredData[i] && filteredData[i].topicName === record.topicName) {
          rowSpan++;
          i++;
        }

        return {
          children: (
            <label class="container">
            <input
              type="checkbox"
              checked={selectedTopics.some((item) => item.topicId === record.topicId)}
              value={record.id}
              onChange={(e) => onCheckboxChange(e, record)}
            />
              <div class="checkmark"></div>
            </label>
          ),
          props: { rowSpan },
        };
      },
    },
    {
      title: 'Content',
      dataIndex: 'contentName',
      key: 'contentName',
    },
    {
      title: 'Delivery Type',
      dataIndex: 'deliveryType',
      key: 'deliveryType',
    },
    {
      title: 'Training Format',
      dataIndex: 'trainingFormat',
      key: 'trainingFormat',
    },
    {
      title: 'Schedule Date',
      dataIndex: 'scheduleDate',
      key: 'scheduleDate',
      render: (text, record, index) => {
        const previousRecord = index > 0 ? filteredData[index - 1] : null;
        const nextRecord = index < filteredData.length - 1 ? filteredData[index + 1] : null;

        if (previousRecord && previousRecord.topicName === record.topicName) {
          return { props: { rowSpan: 0 } };
        }

        let rowSpan = 1;
        let i = index + 1;
        while (nextRecord && filteredData[i] && filteredData[i].topicName === record.topicName) {
          rowSpan++;
          i++;
        }

        return {
          children: <div>{dayjs(record.scheduleDate).format('DD/MM/YYYY')}</div>,
          props: { rowSpan },
        };
      },
    },
    {
      title: 'Schedule Duration (h)',
      dataIndex: 'scheduleDuration',
      key: 'scheduleDuration',
      render: (text, record, index) => {
        const previousRecord = index > 0 ? filteredData[index - 1] : null;
        const nextRecord = index < filteredData.length - 1 ? filteredData[index + 1] : null;

        if (previousRecord && previousRecord.topicName === record.topicName) {
          return { props: { rowSpan: 0 } };
        }

        let rowSpan = 1;
        let i = index + 1;
        while (nextRecord && filteredData[i] && filteredData[i].topicName === record.topicName) {
          rowSpan++;
          i++;
        }

        return {
          children: <div>{record.scheduleDuration}</div>,
          props: { rowSpan },
        };
      },
    },
  ];

  return (
    <div className="table-report-container">
      {loading ? (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table
            dataSource={filteredData} // Sử dụng dữ liệu đã được lọc
            columns={columns(handleCheckboxChange, selectedTopics)}
            pagination={false}
            bordered
            rowKey="id"
          />
          <Report
            selectedTopics={selectedTopics}
            selectedClass={selectedClass}
            selectedModule={selectedModule}
            onRemoveTopic={handleRemoveTopic}
            onReportSuccess={refreshTable}
          />
        </>
      )}
    </div>
  );
};

export default TrainingTable;
