import { message, Table } from "antd";
import React, { useState, useEffect } from "react";
import "./classTable.css";
import { fetchModuleFeedbackData } from "../apiService";

function ClassTable({ moduleName }) {
  const [dataSource, setDataSource] = useState([]);

  const calculateRowSpan = (data, index) => {
    const currentModule = data[index].module;
    if (index === 0 || data[index - 1].module !== currentModule) {
      const count = data.filter((item) => item.module === currentModule).length;
      return count;
    }
    return 0;
  };

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const data = await fetchModuleFeedbackData(moduleName);
        if (data.success) {
          setDataSource(Array.isArray(data.data) ? data.data : []);
        } else {
          setDataSource([]);
          message.error("Can't not fetch data of this Module");
        }
      } catch (error) {
        //console.log(error);
      }
    };

    fetchClass();
  }, []);

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Module",
      dataIndex: "moduleName",
      key: "moduleName",
      width: 120,
      render: (_, __, index) => {
        const rowSpan = calculateRowSpan(dataSource, index);
        return {
          children: (
            <span
              style={{
                textAlign: "center",
                display: "block",
              }}
            >
              {moduleName}
            </span>
          ),
          props: { rowSpan },
        };
      },
    },
    {
      title: "Class",
      dataIndex: "className",
      key: "className",
      width: 80,
    },
    {
      title: "Trainer",
      dataIndex: "trainerName",
      key: "trainerName",
      width: 100,
    },
    {
      title: "Good Feedbacks",
      dataIndex: "goodFeedback",
      key: "goodFeedback",
      width: 90,
      render: (goodFeedback, record) => (
        <span
          style={{
            color: goodFeedback > 0 ? "blue" : "inherit",
          }}
        >
          {goodFeedback}
        </span>
      ),
    },
    {
      title: "Bad Feedbacks",
      dataIndex: "badFeedback",
      key: "badFeedback",
      width: 90,
      render: (badFeedback, record) => (
        <span
          style={{
            color: badFeedback > 0 ? "blue" : "inherit",
          }}
        >
          {badFeedback}
        </span>
      ),
    },
    {
      title: "Average",
      dataIndex: "averageRating",
      key: "averageRating",
      width: 70,
      render: (averageRating) => {
        return <span style={{ color: "green" }}>{averageRating}</span>;
      },
    },
  ];
  return (
    <div className="class-table">
      <Table
        size="small"
        columns={columns}
        dataSource={dataSource}
        className="custom-table"
        pagination={false}
        style={{
          border: "2px solid rgb(130, 130, 249)",
        }}
      />
    </div>
  );
}

export default ClassTable;
