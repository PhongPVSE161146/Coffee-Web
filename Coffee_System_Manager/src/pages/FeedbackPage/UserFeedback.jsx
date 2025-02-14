import React, { useState } from "react";
import "./FeedbackForm.css";
import {
  Typography,
  Button,
  Input,
  Radio,
  Select,
  Divider,
  Modal,
  Space,
  Form,
  Rate,
  message,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { CloseOutlined } from "@ant-design/icons";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import QuestionForm from "../AdminPage/AdminPageComponent/TraineeManagement/TraineeFeedback/CustomTemplate/components/AddNewQuestion/QuestionForm";
import { showSuccessNotification } from "../../components/Notifications/Notifications";

const { Title, Text } = Typography;
const { Option } = Select;

const UserFeedback = () => {
  const [showQuestionOptions, setShowQuestionOptions] = useState(false);
  const [showQuestionOptions1, setShowQuestionOptions1] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showBackDialog, setShowBackDialog] = useState(false);
  const [showAddButton1, setShowAddButton1] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false); // State for clear confirmation modal
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSectionHeaderClick = () => {
    setShowAddButton1(true); // Show the "Add New Question" button when section header is clicked
  };

  const handleSaveClick = () => {
    setShowSaveDialog(true);
  };

  const handleCloseSaveDialog = () => setShowSaveDialog(false);
  const handleSendForm = () => {
    navigate("../success");
  };

  const handleCloseBackDialog = () => setShowBackDialog(false);
  const handleConfirmBack = () => {
    setShowBackDialog(false);
    navigate("/adminPage/traineeManagement/customTemplate");
  };

  const handleAddQuestionClick = () => setShowQuestionOptions(true);
  const handleAddQuestionClick1 = () => setShowQuestionOptions1(true);
  const handleCancelQuestionClick = () => setShowQuestionOptions(false);

  const handleClearAnswers = () => {
    setShowClearDialog(true); // Show the confirmation modal
  };

  const handleCloseClearDialog = () => setShowClearDialog(false);
  const handleConfirmClear = () => {
    setShowClearDialog(false);
    form.resetFields(); // Reset all form fields
  };

  return (
    <div className="feedback-user-form">
      <div className="feedback-header-user">
        <h1>FEEDBACK FORM</h1>
      </div>
      <div className="feedback-header-diviner"></div>
      <div className="feedback-form" style={{ paddingTop: 20 }}>
        {/* Header */}
        <div className="feedback-form__header-container">
          <div className="feedback-form__header-bar" />
          <Title
            level={3}
            style={{
              color: "black",
              fontSize: 30,
              paddingBottom: 5,
              marginTop: 10,
            }}
          >
            Page này để tư vấn và lắng nghe
          </Title>
          <Text type="secondary" style={{ fontSize: 17 }}>
            16 June 2024
          </Text>
          <Text style={{ display: "block", fontSize: 17, marginBottom: 8 }}>
            First of all, thank you for choosing FPT Software Academy to study and
            enhance your knowledge and skills. In order to support you timely
            during the course, we would like to receive your feedback!
          </Text>
          <Text style={{ display: "block", fontSize: 17, marginBottom: 8 }}>
            The survey has 5 short parts, let's fill in now!
          </Text>
          <Text style={{ display: "block", fontSize: 17, marginBottom: 16 }}>
            Khảo sát có 5 phần ngắn gọn, mình cùng làm qua từng phần nhé! Khảo
            theo mức độ hài lòng nhất là 5 và thấp nhất là 1.
          </Text>
        </div>

        {/* Section 1: Trainee Information */}
        <Form form={form} className="feedback-form__section">
          <div
            className="feedback-form__section-header"
            onClick={handleSectionHeaderClick}
          >
            <Title level={4}>Section 1</Title>
          </div>
          <div
            className="feedback-form__section-content"
          >
            <Title level={5} style={{ fontSize: 25, marginTop: -5 }}>
              Trainee Information
            </Title>
            <Text type="secondary">
              In order to support you timely during the course, we would like to
              receive your feedback!
            </Text>

            <Form.Item
              name="name"
              label="1. Your Name"
              rules={[{ required: true, message: "Please enter your name!" }]}
            >
              <Input
                placeholder="Enter your answer"
                className="feedback-form__input-field"
              />
            </Form.Item>

            <Form.Item
              name="classCode"
              label="2. Class Code for Internship"
              rules={[
                { required: true, message: "Please select your class code!" },
              ]}
            >
              <Radio.Group className="feedback-form__radio-group">
                <Radio value="BA_01" style={{ gap: 15, paddingBottom: 10 }}>
                  BA_01
                </Radio>
                <br />
                <Radio value="NET_14" style={{ gap: 15 }}>
                  NET_14
                </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="mentor"
              label="3. Mentors of your class"
              rules={[{ required: true, message: "Please select your mentor!" }]}
            >
              <Select
                placeholder="Select your answer"
                className="feedback-form__select-field"
                style={{ width: "40%" }}
              >
                <Option value="mentor1">Mentor 1</Option>
                <Option value="mentor2">Mentor 2</Option>
              </Select>
            </Form.Item>

            {/* Conditionally render the "Add New Question" button */}
            {showAddButton1 && (
              <div className="feedback-form__button-container">
                <Button
                  icon={<PlusCircleOutlined />}
                  onClick={handleAddQuestionClick1}
                  className="add-question-button"
                >
                  Add new question
                </Button>
              </div>
            )}
          </div>
        </Form>

        {/* Section 2: Training Program */}
        <Divider className="feedback-form__divider" />
        <Form form={form} className="feedback-form__section">
          <div className="feedback-form__section-header">
            <Title level={4}>Section 2</Title>
          </div>
          <div
            className="feedback-form__section-content"

          >
            <Title level={5} style={{ fontSize: 25, marginTop: -5 }}>
              Training Program
            </Title>
            <Text type="secondary">
              In order to support you timely during the course, we would like to
              receive your feedback!
            </Text>

            {!showQuestionOptions && ( // Show "Add new question" button only if showQuestionOptions is false
              <div className="feedback-form__button-container">
                <Button
                  icon={<PlusCircleOutlined />}
                  onClick={handleAddQuestionClick}
                  className="add-question-button"
                >
                  Add new question
                </Button>
              </div>
            )}

            {showQuestionOptions && (
              <div style={{ marginTop: 16 }}>
                <Button
                  className="cancel-button"
                  type="text"
                  onClick={handleCancelQuestionClick}
                  icon={<CloseCircleOutlined />}
                >
                  Cancel
                </Button>
                <QuestionForm />
              </div>
            )}
          </div>
        </Form>

        {/* Footer Buttons */}
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <div className="clear-button-container">
            <Button onClick={handleClearAnswers} className="clear-button">
              DELETE ALL ANSWERS
            </Button>
          </div>
          <div className="save-button-container">
            <Button
              type="primary"
              onClick={handleSaveClick}
              className="save-button"
            >
              SEND
            </Button>
          </div>
        </Space>

        {/* Save Confirmation Modal */}
        <Modal
          title={
            <div
              className="save-modal-title"
              style={{ marginRight: 300, color: "white", fontSize: 17 }}
            >
              Custom Template
            </div>
          }
          open={showSaveDialog}
          onCancel={handleCloseSaveDialog}
          footer={[
            <Button
              key="cancel"
              onClick={handleCloseSaveDialog}
              className="save-modal-cancel-button"
            >
              Cancel
            </Button>,
            <Button
              key="confirm"
              type="primary"
              onClick={handleSendForm}
              className="save-modal-confirm-button"
            >
              SEND
            </Button>,
          ]}
          className="save-modal custom-modal"
          closeIcon={<CloseOutlined className="modal-close-icon" />}
          centered
          style={{ top: "20%" }}
        >
          <Text className="save-modal-text">Are you sure you want to save?</Text>
        </Modal>

        <Modal
          title={
            <div
              className="back-modal-title"
              style={{ marginRight: 250, color: "white", fontSize: 17 }}
            >
              Back to Class Template
            </div>
          }
          open={showBackDialog}
          onCancel={handleCloseBackDialog}
          footer={[
            <Button
              key="cancel"
              onClick={handleCloseBackDialog}
              className="back-modal-cancel-button"
            >
              Cancel
            </Button>,
            <Button
              key="confirm"
              type="primary"
              onClick={handleConfirmBack}
              className="back-modal-confirm-button"
            >
              Yes
            </Button>,
          ]}
          className="back-modal custom-modal"
          closeIcon={<CloseOutlined className="modal-close-icon" />}
          centered
          style={{ top: "20%" }} // Ensures vertical centering
        >
          <Text className="back-modal-text">
            There are unsaved changes. Are you sure you want to go back to the
            Class Template?
          </Text>
        </Modal>

        {/* Clear Confirmation Modal */}
        <div className="delete-all-answer">
          <Modal
            title={
              <div
                className="clear-modal-title"
                style={{ marginRight: 250, color: "white", fontSize: 17 }}
              >
                Clear Answers
              </div>
            }
            open={showClearDialog}
            onCancel={handleCloseClearDialog}
            footer={[
              <Button
                key="cancel"
                onClick={handleCloseClearDialog}
                className="clear-modal-cancel-button"
              >
                Cancel
              </Button>,
              <Button
                key="confirm"
                type="primary"
                onClick={handleConfirmClear}
                className="clear-modal-confirm-button"
              >
                Yes
              </Button>,
            ]}
            className="clear-modal custom-modal"
            closeIcon={<CloseOutlined className="modal-close-icon" />}
            centered
            style={{ top: "20%" }} // Ensures vertical centering
          >
            <Text className="clear-modal-text">
              This action will remove your answer from all questions. You will not be able to undo this action once you do it.
            </Text>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default UserFeedback;
