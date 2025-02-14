import React, { useEffect, useState } from "react";
import { Table, Spin, Button, message, Input } from "antd";
import { EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import "./TrainingTable.css";
import Report from "./Report";
import dayjs from "dayjs";

const TrainingTable2 = ({
  data,
  selectedDeliveryType,
  selectedTrainingFormat,
  selectedDate,
  searchTerm,
  onDataUpdate,
}) => {
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const role = sessionStorage.getItem("selectedRole");
  const [editForm, setEditForm] = useState({
    duration: "",
    note: "",
    reason: "",
  });
  useEffect(() => {
    const filterData = () => {
      const filtered = data.filter((item) => {
        // Role-based delivery type filtering
        const restrictedDeliveryTypes = ['Test/Quiz', 'Audit', 'Exam'];
        if (role === 'admin') {
          // Admin only sees restricted content
          if (!restrictedDeliveryTypes.includes(item.deliveryType)) {
            return false;
          }
        } else if (role === 'trainer' || role === 'FAMadmin' || role === 'deliverymanager') {
          // Trainer and FAMadmin don't see restricted content
          if (restrictedDeliveryTypes.includes(item.deliveryType)) {
            return false;
          }
        }

        // Existing filters
        const matchesDeliveryType = selectedDeliveryType
          ? item.deliveryType === selectedDeliveryType
          : true;
        const matchesTrainingFormat = selectedTrainingFormat
          ? item.trainingFormat === selectedTrainingFormat
          : true;
        const matchesDate = selectedDate
          ? dayjs(item.scheduleDate).isSame(selectedDate, "day")
          : true;
        const matchesSearch = searchTerm
          ? item.topicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.contentName.toLowerCase().includes(searchTerm.toLowerCase())
          : true;

        return (
          matchesDeliveryType &&
          matchesTrainingFormat &&
          matchesDate &&
          matchesSearch
        );
      });
      setFilteredData(filtered);
    };

    filterData();
  }, [
    data,
    selectedDeliveryType,
    selectedTrainingFormat,
    selectedDate,
    searchTerm,
    role,
  ]);
  const handleTopicCheckboxChange = (topic) => {
    setSelectedTopics((prevSelected) => {
      const isTopicSelected = prevSelected.some(
        (t) => t.topicId === topic.topicId
      );

      if (isTopicSelected) {
        // Unselect topic if already selected
        return prevSelected.filter((t) => t.topicId !== topic.topicId);
      } else {
        // Get full information of each content
        const topicWithFullContent = {
          ...topic,
          contents: filteredData
            .filter((item) => item.topicId === topic.topicId)
            .map((item) => ({
              contentId: item.contentId,
              contentName: item.contentName,
              status: item.status,
              deliveryType: item.deliveryType,
            })),
        };
        return [...prevSelected, topicWithFullContent];
      }
    });
  };

  const getTopicRowSpan = (topicId) => {
    return filteredData.filter((item) => item.topicId === topicId).length;
  };

  const openReportModal = () => {
    if (selectedTopics.length === 0) {
      message.warning("Please select at least one topic.");
      return;
    }

    const filteredTopics = selectedTopics
      .map((topic) => {
        const validContents = topic.contents.filter((content) => {
          if (content.status === "Reported") {
            return false;
          }
          if (
            (role === "trainer" || role === "FAMadmin" || role === 'deliverymanager') &&
            ["Test/Quiz", "Audit", "Exam"].includes(content.deliveryType)
          ) {
            return false;
          }
          if (
            (role === "admin") &&
            !["Test/Quiz", "Audit", "Exam"].includes(content.deliveryType)
          ) {
            return false;
          }
          return true;
        });
        return { ...topic, contents: validContents };
      })
      .filter((topic) => topic.contents.length > 0);

    if (filteredTopics.length === 0) {
      message.error(
        "No valid topics available for reporting after applying the filters."
      );
      return;
    }

    // Xác nhận `selectedTopics` có dữ liệu đã lọc trước khi mở modal
    //console.log("Filtered topics for reporting:", filteredTopics);

    setSelectedTopics(filteredTopics);
    setIsReportModalOpen(true);
  };
  const handleEdit = (record) => {
    setEditingRow(record.reportId);
    setEditForm({
      duration: record.duration || "",
      note: record.note || "",
      reason: record.reason || "",
    });
  };

  const handleSave = async (record) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        message.error("Authentication token not found");
        return;
      }

      const response = await fetch(
        "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/reports/schedule-tracker",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
          body: JSON.stringify({
            reportId: record.reportId,
            newToDatetime: dayjs().toISOString(),
            reportDuration: Number(editForm.duration),
            reportNote: editForm.note,
            reportReason: editForm.reason,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        message.success(data.message || "Report updated successfully");
        setEditingRow(null);
        if (onDataUpdate) {
          await onDataUpdate();
        }
      } else {
        message.error(data.message || "Failed to update report");
      }
    } catch (error) {
      //console.error("Error updating report:", error);
      message.error("Error updating report: " + (error.message || "Unknown error"));
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditForm({
      actualDate: null,
      duration: "",
      note: "",
      reason: "",
    });
  };

  const getRowSpanByTopicAndReportId = (record, index) => {
    const firstOccurrenceIndex = filteredData.findIndex(
      (item) => item.reportId === record.reportId && item.topicId === record.topicId
    );
    return index === firstOccurrenceIndex
      ? filteredData.filter(
        (item) => item.reportId === record.reportId && item.topicId === record.topicId
      ).length
      : 0;
  };

  const columns = [
    {
      title: "Topics",
      dataIndex: "topicId",
      key: "topicId",
      fixed: "left",
      width: 150,
      render: (text, record, index) => {
        const firstOccurrenceIndex = filteredData.findIndex(
          (item) => item.topicId === text
        );
        const rowSpan =
          index === firstOccurrenceIndex ? getTopicRowSpan(text) : 0;

        return {
          children: index === firstOccurrenceIndex ? <div>{record.topicName}</div> : null,
          props: {
            rowSpan,
          },
        };
      },
    },
    {
      title: "", // Additional checkbox column next to "Topics"
      dataIndex: "topicCheckbox",
      key: "topicCheckbox",
      width: 50,
      render: (_, record, index) => {
        const firstOccurrenceIndex = filteredData.findIndex(
          (item) => item.topicId === record.topicId
        );
        const rowSpan =
          index === firstOccurrenceIndex
            ? getTopicRowSpan(record.topicId)
            : 0;

        return {
          children:
            index === firstOccurrenceIndex ? (
              <label className="container">
                <input
                  type="checkbox"
                  checked={selectedTopics.some(
                    (topic) => topic.topicId === record.topicId
                  )}
                  onChange={() => handleTopicCheckboxChange(record)}
                />
                <div className="checkmark"></div>
              </label>
            ) : null,
          props: { rowSpan },
        };
      },
    },
    {
      title: "Contents",
      dataIndex: "contentName",
      key: "contentName",
      width: 294,
    },
    { title: "Delivery Type", dataIndex: "deliveryType", key: "deliveryType" },
    {
      title: "Training Format",
      dataIndex: "trainingFormat",
      key: "trainingFormat",
    },
    {
      title: "Schedule Date",
      dataIndex: "scheduleDate",
      key: "scheduleDate",
      render: (date, record, index) => {
        const rowSpan = getRowSpanByTopicAndReportId(record, index);
        return {
          children: rowSpan > 0 ? (date ? dayjs(date).format("DD/MM/YYYY") : "-") : null,
          props: { rowSpan },
        };
      },
    },
    {
      title: "Actual Date",
      dataIndex: "actualDate",
      key: "actualDate",
      render: (date, record, index) => {
        const rowSpan = getRowSpanByTopicAndReportId(record, index);
        return {
          children: rowSpan > 0 ? (date ? dayjs(date).format("DD/MM/YYYY") : "-") : null,
          props: { rowSpan },
        };
      },
    },
    {
      title: "Duration (hour)",
      dataIndex: "duration",
      key: "duration",
      render: (duration, record, index) => {
        const rowSpan = getRowSpanByTopicAndReportId(record, index);
        return {
          children:
            rowSpan > 0
              ? editingRow === record.reportId && duration !== null ? (
                <Input
                  type="number"
                  value={editForm.duration || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, duration: e.target.value })
                  }
                />
              ) : duration !== null ? (
                duration
              ) : (
                "-"
              )
              : null,
          props: { rowSpan },
        };
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (note, record, index) => {
        const rowSpan = getRowSpanByTopicAndReportId(record, index);
        return {
          children:
            rowSpan > 0
              ? editingRow === record.reportId && note !== null ? (
                <Input
                  value={editForm.note || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, note: e.target.value })
                  }
                />
              ) : note !== null ? (
                note
              ) : (
                "-"
              )
              : null,
          props: { rowSpan },
        };
      },
    },
    {
      title: "Reason for mismatch - if any",
      dataIndex: "reason",
      key: "reason",
      render: (reason, record, index) => {
        const rowSpan = getRowSpanByTopicAndReportId(record, index);
        return {
          children:
            rowSpan > 0
              ? editingRow === record.reportId && reason !== null ? (
                <Input
                  value={editForm.reason || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, reason: e.target.value })
                  }
                />
              ) : reason !== null ? (
                reason
              ) : (
                "-"
              )
              : null,
          props: { rowSpan },
        };
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      width: 100,
      render: (status, record, index) => {
        const rowSpan = getRowSpanByTopicAndReportId(record, index);
        return {
          children: rowSpan > 0 ? status : null,
          props: { rowSpan },
        };
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 80,
      render: (_, record, index) => {
        const rowSpan = getRowSpanByTopicAndReportId(record, index);
        return {
          children: rowSpan > 0 ? (
            record.status === "Reported" ? (
              editingRow === record.reportId ? (
                <span>
                  <CheckOutlined
                    style={{
                      marginRight: 8,
                      color: "green",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSave(record)}
                  />
                  <CloseOutlined
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={handleCancel}
                  />
                </span>
              ) : (
                <EditOutlined onClick={() => handleEdit(record)} />
              )
            ) : null
          ) : null,
          props: { rowSpan },
        };
      },
    },
  ];

  return (
    <div className="table-report-container">
      <div style={{ position: "fixed", bottom: 10, right: 20, zIndex: 100 }}>
        <Button
          button
          className="report-animated-button"
          type="primary"
          onClick={openReportModal}
        >
          <span className="text">Report</span>
          <span className="circle"></span>
        </Button>
      </div>

      {filteredData.length === 0 ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          bordered
          rowKey="contentId"
          scroll={{ x: 2300 }}
        />
      )}
      <Report
        selectedTopics={selectedTopics}
        isVisible={isReportModalOpen}
        onRemoveTopic={setSelectedTopics}
        onReportSuccess={async () => {
          setIsReportModalOpen(false);
          setSelectedTopics([]);
          if (onDataUpdate) {
            await onDataUpdate();
          }
        }}
      />
    </div>
  );
};

export default TrainingTable2;