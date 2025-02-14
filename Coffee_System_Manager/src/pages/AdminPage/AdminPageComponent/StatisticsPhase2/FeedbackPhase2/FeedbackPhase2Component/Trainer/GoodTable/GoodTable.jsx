import React, { useEffect, useState } from "react";
import { Table } from "antd";
import "./GoodTable.css";

const GoodTable = ({ goodFeedbackData, trackBy }) => {
  const feedback = goodFeedbackData
    ? goodFeedbackData.goodFeedbackList.map((feedback, index) => (
        <span key={index}>
          {feedback}
          <br />
        </span>
      ))
    : "";

  const dataSource = goodFeedbackData
    ? [
        {
          key: 1,
          number: 1,
          name: goodFeedbackData.trainerName,
          code: goodFeedbackData.classCode,
          module: goodFeedbackData.moduleName,
          feedback: feedback,
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
      title: "Good Feedbacks",
      key: "feedback",
      dataIndex: "feedback",
    },
  ];

  return (
    <div className="good-feedback-table">
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

export default GoodTable;
