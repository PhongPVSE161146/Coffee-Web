import React, { useState } from 'react';
import { Typography, Input, Button, Form, message } from 'antd';


export default function FeedBackEmail() {

  const { Title } = Typography;

  const ConfirmationPage = () => {
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpTimer, setOtpTimer] = useState(150);

    const handleSubmit = () => {

      //console.log('Gửi email:', email);


      startOtpTimer();


      message.success('Đã gửi mã OTP, vui lòng kiểm tra email của bạn.');
    };

    const startOtpTimer = () => {
      const timer = setInterval(() => {
        setOtpTimer((prevTimer) => prevTimer - 1);
        if (otpTimer === 0) {
          clearInterval(timer);
        }
      }, 1000);
    };

    const handleResendOtp = () => {

      //console.log('Gửi lại mã OTP');
      startOtpTimer();
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#F0F2F5' }}>
        <div style={{ width: '400px', padding: '40px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img src='../' alt="FPT Software" style={{ width: '160px' }} />
            <img src="https://fptacademy.com/assets/img/logo.svg" alt="FPT Software Academy" style={{ width: '160px', marginLeft: '16px' }} />
          </div>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>Enter email to confirm information</Title>
          <Form onFinish={handleSubmit}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
            >
              <Input placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Input
                  placeholder="Enter OTP code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  style={{ marginRight: '16px' }}
                />
                <Button type="link" onClick={handleResendOtp}>
                  {`Don't receive OTP code? Resend (${Math.floor(otpTimer / 60)}:${String(otpTimer % 60).padStart(2, '0')})`}
                </Button>
              </div>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                SUBMIT
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  };
}