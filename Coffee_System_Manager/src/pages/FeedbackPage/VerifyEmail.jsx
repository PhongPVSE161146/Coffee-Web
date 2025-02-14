import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import { useNavigate } from "react-router-dom";
import './VerifyEmail.css';
import FPTlogo from "../../assets/feedbackemail-flogo.png";
import FPTAcademy from "../../assets/feedbackemail-falogo.png";
import { AccessAlarmRounded } from "@mui/icons-material";
import axios from "axios";

const EmailForm = () => {
  const [email, setEmail] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const startCountdown = () => {
    let timerInterval;
    setCountdown(180); // Set countdown to 180 seconds (3 minutes)
    
    timerInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 0) return prev - 1;
        clearInterval(timerInterval); // Stop the timer when it reaches 0
        return 0;
      });
    }, 1000);
    
    return () => clearInterval(timerInterval);
  };
  
  // Format the timer display to 0:00 format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const onFinish = async (values) => {
    try {
      const token = "eyJraWQiOiI1MWE4NWQyNi00NGY4LTQ4NTMtOTg4Mi1mY2NiZmQwOGJjZDgiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJQaHVvbmdEUF90ZXN0IiwiZXhwIjoxNzMyMjYxMDg2LCJkZXBhcnRtZW50IjoiRlNBLkhOIiwiaWF0IjoxNzMyMDg4Mjg2LCJhdXRob3JpdGllcyI6IlJPTEVfVFJBSU5FUixST0xFX0ZBTVNfQURNSU4iLCJlbWFpbCI6IlBodW9uZ0RQX3Rlc3RAZnB0LmNvbSJ9.N0ATrEqwxWYnEFPh4JgYfHkPjVYXpFDGqGugHzR06e47UQNFWQaSVb0o8gCMOLmnkXxqefzLiUdMVNNkP_2Xi-ZXt45uHGldnbUNdQlmsLRUJuPygHsEmen-huaB3HSqpR88iZ_Foqw9dXL_HWdYLmobQWSEFaXC_t7zqkxClv4r18P4fcMyLVdAcawLuUQtI1qdTHBMQHQiQV2wFNi5ZK8ng-dxmz_cHOZaeovd5Yo6CgWIv7MgU5kpjUpGGMp2DuwlZHpO4FeBIo-3nDUoM1zFJwjFrUVlVxIg10TRv3od5LWwHSA_l464xTCVczeSEcL4DLgIy1CtiY_3SbClmQ";
      const response = await axios.post(
        `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/otp/send`,
        null, // no body needed
        {
          params: { email: values.email },
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*"
          }
        }
      );

      if (response.data.success) {
        setEmail(values.email);
        setShowOtpForm(true);
        message.success("OTP sent successfully!");
      } else {
        message.error("Failed to send OTP");
      }
    } catch (error) {
      //console.error("Error sending OTP:", error);
      message.error("Failed to send OTP: " + error.message);
    }
  };

  useEffect(() => {
    if (showOtpForm) {
      // Start countdown when OTP form is displayed
      const startTimer = startCountdown();

      // Clean up countdown and animation intervals when component unmounts
      return () => startTimer();
    }
  }, [showOtpForm]);

  const handleOtpSubmit = async () => {
    const otpCode = otp.join("");
    try {
      const token = "eyJraWQiOiI1MWE4NWQyNi00NGY4LTQ4NTMtOTg4Mi1mY2NiZmQwOGJjZDgiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJQaHVvbmdEUF90ZXN0IiwiZXhwIjoxNzMyMjYxMDg2LCJkZXBhcnRtZW50IjoiRlNBLkhOIiwiaWF0IjoxNzMyMDg4Mjg2LCJhdXRob3JpdGllcyI6IlJPTEVfVFJBSU5FUixST0xFX0ZBTVNfQURNSU4iLCJlbWFpbCI6IlBodW9uZ0RQX3Rlc3RAZnB0LmNvbSJ9.N0ATrEqwxWYnEFPh4JgYfHkPjVYXpFDGqGugHzR06e47UQNFWQaSVb0o8gCMOLmnkXxqefzLiUdMVNNkP_2Xi-ZXt45uHGldnbUNdQlmsLRUJuPygHsEmen-huaB3HSqpR88iZ_Foqw9dXL_HWdYLmobQWSEFaXC_t7zqkxClv4r18P4fcMyLVdAcawLuUQtI1qdTHBMQHQiQV2wFNi5ZK8ng-dxmz_cHOZaeovd5Yo6CgWIv7MgU5kpjUpGGMp2DuwlZHpO4FeBIo-3nDUoM1zFJwjFrUVlVxIg10TRv3od5LWwHSA_l464xTCVczeSEcL4DLgIy1CtiY_3SbClmQ";
      const response = await axios.post(
        `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/otp/verify`,
        null,
        {
          params: { 
            email: email,
            otp: otpCode 
          },
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*"
          }
        }
      );

      if (response.data.success) {
        message.success("OTP verified successfully!");
        navigate("../form");
      } else {
        message.error("Invalid OTP!");
      }
    } catch (error) {
      //console.error("Error verifying OTP:", error);
      message.error("Failed to verify OTP: " + error.message);
    }
  };

  const onResendOtp = async () => {
    try {
      const token = "eyJraWQiOiI1MWE4NWQyNi00NGY4LTQ4NTMtOTg4Mi1mY2NiZmQwOGJjZDgiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJQaHVvbmdEUF90ZXN0IiwiZXhwIjoxNzMyMjYxMDg2LCJkZXBhcnRtZW50IjoiRlNBLkhOIiwiaWF0IjoxNzMyMDg4Mjg2LCJhdXRob3JpdGllcyI6IlJPTEVfVFJBSU5FUixST0xFX0ZBTVNfQURNSU4iLCJlbWFpbCI6IlBodW9uZ0RQX3Rlc3RAZnB0LmNvbSJ9.N0ATrEqwxWYnEFPh4JgYfHkPjVYXpFDGqGugHzR06e47UQNFWQaSVb0o8gCMOLmnkXxqefzLiUdMVNNkP_2Xi-ZXt45uHGldnbUNdQlmsLRUJuPygHsEmen-huaB3HSqpR88iZ_Foqw9dXL_HWdYLmobQWSEFaXC_t7zqkxClv4r18P4fcMyLVdAcawLuUQtI1qdTHBMQHQiQV2wFNi5ZK8ng-dxmz_cHOZaeovd5Yo6CgWIv7MgU5kpjUpGGMp2DuwlZHpO4FeBIo-3nDUoM1zFJwjFrUVlVxIg10TRv3od5LWwHSA_l464xTCVczeSEcL4DLgIy1CtiY_3SbClmQ";
      const response = await axios.post(
        `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/otp/send`,
        null,
        {
          params: { email },
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );
  
      if (response.data.success) {
        message.success("OTP resent successfully!");
        setCountdown(180); // Reset timer
        setOtp(["", "", "", "", "", ""]); // Clear OTP
        startCountdown(); // Restart countdown
      } else {
        message.error("Failed to resend OTP");
      }
    } catch (error) {
      //console.error("Error resending OTP:", error);
      message.error("Failed to resend OTP: " + error.message);
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Limit to one character
    setOtp(newOtp);
  
    if (value && index < otp.length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && index > 0 && !otp[index]) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  const handlePaste = (event) => {
    const pasteData = event.clipboardData.getData("text").slice(0, otp.length); // Get the pasted string, limit to OTP length
    const newOtp = pasteData.split(""); // Convert to array of characters
    setOtp((prevOtp) => newOtp.concat(prevOtp.slice(pasteData.length))); // Combine pasted values with remaining blanks
  
    // Focus the first empty input after the paste
    const firstEmptyIndex = newOtp.length;
    if (inputRefs.current[firstEmptyIndex]) {
      inputRefs.current[firstEmptyIndex].focus();
    }
  };
  
  useEffect(() => {
    if (otp.every((digit) => digit === "") && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [otp]);

  return (
    <div className="email-form-container">
      {showOtpForm ? (
        <Card style={{ width: 1000, height: 600 }}>
          <div className="logo-email-img">
            <div className="email-logo">
              <img src={FPTlogo} alt="FSA Logo" />
            </div>
            <div className="diviner-img"></div>
            <div className="email-logo">
              <img src={FPTAcademy} alt="FSA Logo" />
            </div>
          </div>

          <div className="h1-text-email">
            <h1>Enter OTP to confirm your email</h1>
          </div>
          <div className="email-diviner"></div>
          <div className="mail-text-head">Mail</div>

          <Form onFinish={handleOtpSubmit} initialValues={{ email }} className="email-form">
            <Form.Item name="email" className="email-form-require">
              <Input type="email" value={email} disabled style={{ width: 350 }} />
            </Form.Item>

            <div className='otp-input-container' style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: "40px", paddingBottom: "5px"}}>
              <div style={{ display: "flex",justifyContent: "center", alignContent: "center", marginBottom: "10px"}}>
              {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="otp-input"
                    value={digit}
                    maxLength={1}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined} // Attach paste handler to the first input
                    style={{
                      width: "50px",
                      margin: "0 5px",
                      textAlign: "center",
                      fontSize: "20px",
                    }}
                    disabled={countdown === 0} // Disable input if timer reaches 0
                  />
                ))}
                {countdown > 0 ? (
                  <>
                    <AccessAlarmRounded className={`${countdown > 0 && countdown <= 10 ? 'animate' : ''}`} />
                    <div className={`timer ${countdown > 0 && countdown <= 10 ? 'animate' : ''}`}>{formatTime(countdown)}</div>
                  </>
                ) : (
                  <Button
                    type="link"
                    onClick={onResendOtp}
                    style={{
                      width: "80px",
                      margin: "0 5px",
                      textAlign: "center",
                      fontSize: "16px",
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '2px solid #ccc',
                      borderRadius: '8px',
                    }}
                  >
                    Resend?
                  </Button>
                )}
              </div>
              {countdown > 0 && <span className={`timeoutBar ${countdown>=0 && countdown<=10 ? 'animate' : ''}`}></span>}
            </div>

            <Form.Item>
              <div className="send-form-button">
                <Button type="primary" htmlType="submit" style={{ width: 250 }}>
                  Submit
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <div>
          <Card style={{ width: 1000, height: 600 }}>
            <div className="logo-email-img">
              <div className="email-logo">
                <img src={FPTlogo} alt="FSA Logo" />
              </div>
              <div className="diviner-img"></div>
              <div className="email-logo">
                <img src={FPTAcademy} alt="FSA Logo" />
              </div>
            </div>

            <div className="h1-text-email">
              <h1>Enter email to confirm information</h1>
            </div>
            <div className="email-diviner"></div>
            <div className="mail-text-head">Mail</div>

            <Form onFinish={onFinish} className="email-form">
              <Form.Item
                name="email"
                className="email-form-require"
                rules={[{ required: true, message: "Please enter your email!" }]}
              >
                <Input type="email" placeholder="Enter your email" style={{ width: 350 }} />
              </Form.Item>
              <Form.Item>
                <div className="send-form-button">
                  <Button type="primary" htmlType="submit" style={{ width: 250 }}>
                    Send
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EmailForm; 