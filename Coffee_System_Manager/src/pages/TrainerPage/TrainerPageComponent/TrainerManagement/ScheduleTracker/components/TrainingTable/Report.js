import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, DatePicker, Table, message } from "antd";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { axiosInstance } from "../../../../../../../axios/Axios";
import { useParams } from "react-router-dom";
import "./Report.css";

const Report = ({
  selectedTopics = [],
  isVisible,
  onRemoveTopic,
  onReportSuccess,
}) => {
  const { id: classId } = useParams(); // Use classId from useParams
  const [form] = Form.useForm();
  const [showReason, setShowReason] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trainerId, setTrainerId] = useState(null);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      message.error("Access token not found!");
      return;
    }

    try {
      const decodedToken = jwtDecode(accessToken);
      setTrainerId(decodedToken.sub);
    } catch (error) {
      //console.error("Error decoding token:", error);
      message.error("Invalid access token!");
    }
  }, []);

  const handleCancel = () => {
    if (onReportSuccess) {
      onReportSuccess();
    }
    form.resetFields();
    setShowReason(false);
  };

  const handleDateChange = (date) => {
    const selectedDate = dayjs(date).format("DD/MM/YYYY");
    const topicDate = dayjs(selectedTopics[0]?.scheduleDate).format(
      "DD/MM/YYYY"
    );

    if (selectedDate !== topicDate) {
      setShowReason(true);
    } else {
      setShowReason(false);
    }
  };

  const handleFormSubmit = async (values) => {
    if (!trainerId) {
      message.error("Trainer ID not found");
      return;
    }

    const requestData = {
      faClassId: classId,
      moduleId: selectedTopics[0]?.moduleId || 0,
      trainerId,
      duration: values.duration,
      dateTime: dayjs(values.date).toISOString(),
      reason: values.reason || " ",
      note: values.note,
      dailyReportCreateTopicDTOS: selectedTopics.map((topic) => ({
        id: topic.topicId,
        dailyReportCreateContentDTOS: (topic.contents || []).map((content) => ({
          id: content.contentId,
        })),
      })),
    };
    //console.log(requestData);

    setLoading(true);

    try {
      await axiosInstance.post("/trainers/reports", requestData);
      message.success("Report submitted successfully");
      handleCancel();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error submitting report";
      message.error(errorMessage);
      //console.error("Error submitting report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveContent = (topicIndex, contentIndex) => {
    const newTopics = [...selectedTopics];
    const topic = newTopics[topicIndex];

    if (topic.contents.length > 0) {
      topic.contents.splice(contentIndex, 1);

      if (topic.contents.length === 0) {
        newTopics.splice(topicIndex, 1);
      }

      onRemoveTopic(newTopics);

      if (newTopics.length === 0) {
        handleCancel();
      }
    }
  };
  const getTopicRowSpan = (topicName) => {
    return dataSource.filter((item) => item.topicName === topicName).length;
  };

  const columns = [
    {
      title: "Topic",
      dataIndex: "topicName",
      key: "topicName",
      width: 180,
      render: (text, record, index) => {
        // Tìm chỉ số xuất hiện đầu tiên của topic
        const firstOccurrenceIndex = dataSource.findIndex(
          (item) => item.topicName === text
        );

        // Tính toán số hàng cần gộp (rowSpan)
        const rowSpan =
          index === firstOccurrenceIndex ? getTopicRowSpan(text) : 0;

        return {
          children: index === firstOccurrenceIndex ? <div>{text}</div> : null,
          props: {
            rowSpan,
          },
        };
      },
    },
    {
      title: "Content",
      dataIndex: "contentName",
      key: "content",
      width: 380,
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (text, record, index) => {
        // Hiển thị nút "X" chỉ ở dòng cuối cùng
        const isLastContent = index === dataSource.length - 1;
        return isLastContent ? (
          <Button
            type="link"
            onClick={() =>
              handleRemoveContent(record.topicIndex, record.contentIndex)
            }
            style={{ color: "red" }}
          >
            X
          </Button>
        ) : null;
      },
    },
  ];

  const dataSource = selectedTopics.flatMap((topic, topicIndex) =>
    topic.contents.map((content, contentIndex) => ({
      key: `${topic.topicId}-${content.contentId}`,
      topicName: topic.topicName,
      contentName: content.contentName,
      topicIndex,
      contentIndex,
    }))
  );

  return (
    <Modal
      title="DAILY REPORT"
      visible={isVisible}
      onCancel={handleCancel}
      footer={null}
      width="55%"
    >
      <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Form.Item
            style={{ width: "45%" }}
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker
              style={{ width: " 100%" }}
              format="DD/MM/YYYY"
              onChange={handleDateChange}
            />
          </Form.Item>

          <Form.Item
            style={{ width: "45%" }}
            label="Duration"
            name="duration"
            rules={[{ required: true, message: "Duration is required!" }]}
          >
            <Input type="number" placeholder="Enter duration" />
          </Form.Item>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
          style={{ marginBottom: "20px" }}
        />

        {showReason && (
          <Form.Item
            label="Reason"
            name="reason"
            rules={[
              {
                required: true,
                message: "Reason is required when changing the date!",
              },
            ]}
          >
            <Input.TextArea placeholder="Enter the reason" />
          </Form.Item>
        )}

        <Form.Item
          label="Note"
          name="note"
          rules={[{ required: true, message: "Please enter a note!" }]}
        >
          <Input.TextArea placeholder="Enter your note" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ marginRight: "8px" }}
        >
          Submit
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </Form>
    </Modal>
  );
};

export default Report;
