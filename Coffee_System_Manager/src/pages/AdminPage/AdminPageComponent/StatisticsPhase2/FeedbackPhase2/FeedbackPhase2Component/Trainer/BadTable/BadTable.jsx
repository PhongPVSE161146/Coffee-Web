import React, { useEffect, useState } from "react";
import { Table } from "antd";
import "./BadTable.css";

const BadTable = ({ badFeedbackData }) => {
  const reason = badFeedbackData
    ? badFeedbackData.badFeedbackList.map((feedback, index) => (
        <span key={index}>
          {feedback}
          <br />
        </span>
      ))
    : "";

  const dataSource = badFeedbackData
    ? [
        {
          key: 1,
          number: 1,
          name: badFeedbackData.trainerName,
          code: badFeedbackData.classCode,
          module: badFeedbackData.moduleName,
          reason: reason,
        },
      ]
    : [];

  const columns = [
    {
      title: "No.",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Trainer Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Class Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
    },
    {
      title: "Reason For Bad Feedbacks",
      key: "reason",
      dataIndex: "reason",
    },
  ];

  return (
    <div className="bad-feedback-table">
      <Table
        className="custom-table"
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        style={{
          border: "2px solid rgb(130, 130, 249)",
        }}
        scroll={{ x: "max-content" }} 
      />
    </div>
  );
};

export default BadTable;
