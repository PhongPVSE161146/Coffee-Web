import { message, Table } from "antd";
import React, { useEffect, useState } from "react";
import "./technicalTable.css";
import { fetchTechnicalGroupData } from "../apiService";
import GoodFbTable from "../goodFbTable/goodFbTable";
import BadFbTable from "../badFbTable/badFbTable";
import { CloseOutlined } from "@ant-design/icons";

function TechnicalTable({ classCode, trackValue }) {
  const [dataSource, setDataSource] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedTable, setSelectedTable] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTechnicalGroupData(classCode);
      setDataSource(Array.isArray(data.data) ? data.data : []);
      if (!Array.isArray(data.data) || data.data.length === 0) {
        message.error("This class doesn't have data");
      }
    };
    if (classCode) {
      fetchData();
    }
  }, [classCode]);

  const calculateRowSpan = (data, dataIndex) => {
    const rowSpanMap = {};

    data.forEach((item, index) => {
      if (index === 0 || item[dataIndex] !== data[index - 1][dataIndex]) {
        let spanCount = 1;
        for (let i = index + 1; i < data.length; i++) {
          if (data[i][dataIndex] === item[dataIndex]) {
            spanCount++;
          } else {
            break;
          }
        }
        rowSpanMap[index] = spanCount;
      } else {
        rowSpanMap[index] = 0;
      }
    });

    return rowSpanMap;
  };
  const rowSpanMap = calculateRowSpan(dataSource, "classAdmin");
  const rowSpanMap2 = calculateRowSpan(dataSource, "classCode");

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Class Code",
      dataIndex: "classCode",
      key: "classCode",
      render: (classCode, _, index) => ({
        children: <span>{classCode}</span>,
        props: {
          rowSpan: rowSpanMap2[index] || 0,
        },
      }),
    },
    {
      title: "Class Admin",
      dataIndex: "classAdmin",
      key: "classAdmin",
      render: (classAdmin, _, index) => ({
        children: <span>{classAdmin}</span>,
        props: {
          rowSpan: rowSpanMap[index] || 0,
        },
      }),
    },
    {
      title: "Module",
      dataIndex: "moduleName",
      key: "moduleName",
    },
    {
      title: "Good Feedbacks",
      dataIndex: "goodFeedbacks",
      key: "goodFeedbacks",
      render: (goodFeedbacks, record) => (
        <span
          style={{
            cursor: goodFeedbacks > 0 ? "pointer" : "default",
            color: goodFeedbacks > 0 ? "red" : "inherit",
            textDecoration: goodFeedbacks > 0 ? "underline" : "",
          }}
          onClick={() => {
            if (goodFeedbacks > 0) {
              setSelectedTable("goodFeedbacks");
              setSelectedModule(record.moduleName);
            } else {
              setSelectedTable("");
            }
          }}
        >
          {goodFeedbacks}
        </span>
      ),
    },
    {
      title: "Bad Feedbacks",
      dataIndex: "badFeedbacks",
      key: "badFeedbacks",
      render: (badFeedbacks, record) => (
        <span
          style={{
            cursor: badFeedbacks > 0 ? "pointer" : "default",
            color: badFeedbacks > 0 ? "red" : "inherit",
            textDecoration: badFeedbacks > 0 ? "underline" : "",
          }}
          onClick={() => {
            if (badFeedbacks > 0) {
              setSelectedTable("badFeedbacks");
              setSelectedModule(record.moduleName);
            } else {
              setSelectedTable("");
            }
          }}
        >
          {badFeedbacks}
        </span>
      ),
    },
    {
      title: "Average Feedbacks",
      dataIndex: "averageRating",
      key: "averageRating",
      render: (averageRating) => {
        return <span style={{ color: "green" }}>{averageRating}</span>;
      },
    },
  ];

  return (
    <div>
      <Table
        className="custom-table"
        size="small"
        dataSource={dataSource}
        columns={columns}
      />
      {selectedTable === "goodFeedbacks" && selectedModule !== "" ? (
        <div className="good-fb-table">
          <div className="table-icon" onClick={() => setSelectedTable("")}>
            <CloseOutlined />
          </div>
          <GoodFbTable
            classCode={classCode}
            moduleName={selectedModule}
            trackValue={trackValue}
          />
        </div>
      ) : selectedTable === "badFeedbacks" && selectedModule !== "" ? (
        <div className="bad-fb-table">
          <div className="table-icon" onClick={() => setSelectedTable("")}>
            <CloseOutlined />
          </div>
          <BadFbTable
            classCode={classCode}
            moduleName={selectedModule}
            trackValue={trackValue}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default TechnicalTable;
