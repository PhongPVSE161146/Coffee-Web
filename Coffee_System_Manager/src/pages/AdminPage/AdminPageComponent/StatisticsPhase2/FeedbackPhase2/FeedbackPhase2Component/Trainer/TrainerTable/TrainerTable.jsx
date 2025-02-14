import React from "react";
import { Table } from "antd";
import "./TrainerTable.css";
import dayjs from "dayjs";

const columns = (onBadFeedbackClick, onGoodFeedbackClick, trackBy) => [
  {
    title: "No.",
    dataIndex: "number",
    key: "number",
    render: (text, record, index) => index + 1,
  },
  ...(trackBy !== "statistics"
    ? [
        {
          title: "Trainer Name",
          dataIndex: "trainerName",
          key: "trainerName",
        },
      ]
    : []),
  {
    title: "Class Code",
    dataIndex: "classCode",
    key: "classCode",
  },
  {
    title: "Module",
    dataIndex: "moduleName",
    key: "moduleName",
  },
  {
    title: "Good Feedbacks",
    key: "goodFeedbacks",
    dataIndex: "goodFeedbacks",
    className: "good-feedback",
    render: (text, record) => (
      <span
        style={{
          textDecoration: "underline",
        }}
        onClick={() => onGoodFeedbackClick(record)}
      >
        {text}
      </span>
    ),
  },
  {
    title: "Bad Feedbacks",
    key: "badFeedbacks",
    dataIndex: "badFeedbacks",
    className: "bad-feedback",
    render: (text, record) => (
      <span
        style={{
          textDecoration: "underline",
        }}
        onClick={() => onBadFeedbackClick(record)}
      >
        {text}
      </span>
    ),
  },
  {
    title: "Average by Module",
    key: "averageRating",
    dataIndex: "averageRating",
  },
];

const TrainerTable = ({
  data,
  onBadFeedbackClick,
  onGoodFeedbackClick,
  trackBy,
}) => {
  return (
    <Table
      className="trainer-table"
      align="center"
      bordered
      pagination={{
        pageSize: 5,
      }}
      columns={columns(onBadFeedbackClick, onGoodFeedbackClick, trackBy)}
      dataSource={data}
      rowKey="id"
      scroll={{ x: "max-content" }}
    />
  );
};

export default TrainerTable;
