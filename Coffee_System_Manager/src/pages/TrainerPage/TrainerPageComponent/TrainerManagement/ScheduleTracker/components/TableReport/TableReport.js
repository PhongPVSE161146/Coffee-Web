import React, { useEffect, useState } from 'react';
import { Table, Spin } from 'antd';
import dayjs from 'dayjs';
import ReportFilter from '../ReportFilter/ReportFilter';
import isBetween from 'dayjs/plugin/isBetween';


import { fetchReportData } from './Api/apiService'; // Correct path based on structure


import './TableReport.css';

dayjs.extend(isBetween);

const ReportTable = () => {
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    reportDate: [],
    search: '',
    classCode: '',
    module: '',
    startDate: null,
    endDate: null,
  });

  const [dynamicStartDate, setDynamicStartDate] = useState(null);
  const [dynamicEndDate, setDynamicEndDate] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchReportData();
      setReportData(data);
      setFilteredData(data);
      setLoading(false);
    };

    fetchData();
  }, []);



  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };

      if (newFilters.startDate) {
        setDynamicStartDate(newFilters.startDate);
      }
      if (newFilters.endDate) {
        setDynamicEndDate(newFilters.endDate);
      }

      return updatedFilters;
    });
  };

  useEffect(() => {
    const { reportDate, search, classCode, module, startDate, endDate } = filters;

    const newFilteredData = reportData.filter((item) => {
      const itemDate = dayjs(item.date);
      const isWithinDateRange =
        reportDate.length === 2
          ? itemDate.isBetween(reportDate[0], reportDate[1], null, '[]')
          : true;

      const isWithinStartEndDate =
        startDate && endDate
          ? itemDate.isBetween(startDate, endDate, null, '[]')
          : true;

      const matchesSearch = search
        ? Object.values(item).some((value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(search.toLowerCase())
          )
        : true;

      const matchesClassCode = classCode ? item.className === classCode : true;
      const matchesModule = module ? item.moduleName === module : true;

      return (
        isWithinDateRange &&
        isWithinStartEndDate &&
        matchesSearch &&
        matchesClassCode &&
        matchesModule
      );
    });

    setFilteredData(newFilteredData);
  }, [filters, reportData]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => dayjs(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Topics',
      dataIndex: 'topics',
      key: 'topics',
      align: 'center',
      render: (text) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {text}
        </div>
      ),
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
      title: 'Duration (h)',
      dataIndex: 'duration',
      key: 'duration',
      render: (text) => Number(text).toFixed(0),
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
  ];

  const isFilterApplied = !!filters.classCode && !!filters.module && filters.reportDate.length === 2;

  return (
    <div className="table-report-container">
      <ReportFilter filters={filters} onFilterChange={handleFilterChange} />

      {loading ? (
        <Spin />
      ) : (
        <div className="table-container">
          {isFilterApplied ? (
            <>
              {filteredData.length > 0 ? (
                <>
                  <div className="header-content">
                    <h2 className="module-title">
                      Module: <span className="lighter-text">{filters.module || ''}</span>
                    </h2>

                    <div className="date-info">
                      <span>
                        <strong>Start Date:</strong>{' '}
                        {dynamicStartDate ? dynamicStartDate.format('DD/MM/YYYY') : 'N/A'}
                      </span>
                      <span>
                        <strong>End Date:</strong>{' '}
                        {dynamicEndDate ? dynamicEndDate.format('DD/MM/YYYY') : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <Table
                    dataSource={filteredData}
                    columns={columns}
                    rowKey="classId"
                    pagination={false}
                  />

                  <div className="duration-total">
                    Duration Total: {filteredData.reduce((sum, record) => sum + Number(record.duration), 0).toFixed(0)}h
                  </div>
                </>
              ) : (
                <div className="no-data-message">
                  No Data
                </div>
              )}
            </>
          ) : (
            <div className="space-data"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportTable;
