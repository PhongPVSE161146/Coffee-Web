import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Button, Space } from "antd";
import "./Success.css";
import SuccessLogo from "../../assets/feedbackemail-successlogo.png";

const { Title, Text } = Typography;

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="success-send-container">
      <div className="success-send-page">
        <Card className="success-card">
          <Space direction="vertical" size="large" className="success-space">

            <div className="title-container">
              <Title level={2} className="feedback-title">FEEDBACK FORM</Title>
            </div>

            <div className="icon-container-img">
              <img src={SuccessLogo} alt="FSA Logo" />
            </div>

            <div className="text-container">
              <Text className="feedback-text">Feedback has been sent</Text>
            </div>

            <div className="divider-container">
              <div className="divider-line" />
              <Text className="divider-text">You can do this</Text>
              <div className="divider-line" />
            </div>

            <div className="button-container">
              <Button className="button-save-my-answer" type="primary" onClick={handleBack}>
                Save my answer
              </Button>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default SuccessPage;
