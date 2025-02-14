import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { DatePicker, Radio } from 'antd';
import { showSuccessNotification, showErrorNotification, showInfoNotification } from '../../../../../components/Notifications/Notifications';
import { sendFeedback, fetchFeedbackInfo } from './ClassTemplate/ApiService/apiServices';

const Notification = ({ message, onClose }) => {
  return (
    <div className="notification">
      {message}
      <button onClick={onClose}><CloseOutlined /></button>
    </div>
  );
};

const SendFeedbackPopup = ({ onClose, options = [], feedbackTemplateId, classNames = [] }) => {
  //console.log('Class Names Prop:', classNames);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    yourName: "",
    classCode: "",
    mentors: "",
    className: "",
    expirationDate: "",
  });

  const [sendDate, setSendDate] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showSendDate, setShowSendDate] = useState(false);
  const [feedbackInfo, setFeedbackInfo] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsClassDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      classCode: value,
    }));
  };

  const handleClassSelect = (className) => {
    setFormData(prev => {
      const currentClasses = prev.className ? prev.className.split(',') : [];
      let newClasses;

      if (currentClasses.length === classNames.length) {
        newClasses = currentClasses.filter(c => c !== className);
      } else {
        if (currentClasses.includes(className)) {
          newClasses = currentClasses.filter(c => c !== className);
        } else {
          newClasses = [...currentClasses, className];
        }
      }

      return {
        ...prev,
        className: newClasses.join(',')
      };
    });
  };

  const handleSelectAllClasses = (checked) => {
    const newClassName = checked
      ? classNames.map(classItem => classItem.className).join(',')
      : '';
    setFormData(prev => ({
      ...prev,
      className: newClassName
    }));
  };

  const loadFeedbackInfo = async () => {
    try {
      const response = await fetchFeedbackInfo(feedbackTemplateId);
      setFeedbackInfo(response.data);
      //console.log('Fetched Feedback Info:', response.data);
    } catch (error) {
      //console.error('Error loading feedback info:', error);
      showErrorNotification('Failed to load feedback information. Please try again.');
    }
  };

  useEffect(() => {
    if (feedbackTemplateId) {
      loadFeedbackInfo();
    }
  }, [feedbackTemplateId]);

  const handleSend = async () => {
    //console.log('Selected Class Names:', formData.className);

    const classIds = formData.className.split(',').map(className => {
      const classItem = classNames.find(item => item.className === className.trim());
      return classItem ? classItem.classId : null;
    }).filter(id => id !== null);

    //console.log('Class IDs:', classIds);

    const expiredDate = dayjs(formData.expirationDate, 'DD/MM/YYYY').isValid()
      ? dayjs(formData.expirationDate, 'DD/MM/YYYY').toISOString()
      : null;

    const formattedSendDate = sendDate
      ? dayjs(sendDate, 'DD/MM/YYYY').isValid()
        ? dayjs(sendDate, 'DD/MM/YYYY').toISOString()
        : null
      : dayjs().toISOString();

    if (!feedbackTemplateId || !classIds.length || !expiredDate || !formattedSendDate) {
      showErrorNotification('Invalid input. Please ensure all fields are correctly filled.');
      return;
    }

    showInfoNotification('Sending Feedback', 'Please wait while we send your feedback...');

    const payload = {
      feedbackTemplateId: feedbackTemplateId,
      classIds: classIds,
      expiredDate: expiredDate,
      sendDate: formattedSendDate,
      linkFeedback: "http://52.194.10.147/feedback/verify-email",
    };
    try {
      const response = await sendFeedback(payload);
      //console.log('Feedback sent successfully:', response);
      showSuccessNotification('Feedback sent successfully!');
      navigate('../traineeFeedback', { replace: true });
      onClose();
    } catch (error) {
      //console.error('Error sending feedback:', error.response ? error.response.data : error.message);
      showErrorNotification('Failed to send feedback. Please try again.');
    }
  };

  const handleSendDateChange = (date, dateString) => {
    setSendDate(dateString);
  };

  const toggleSendDate = () => {
    setShowSendDate(prev => !prev); // Toggle the visibility
  };

  const optionItems = options.map(option => (
    <div key={option.id}>{option.label}</div>
  ));

  return (
    <div className="modal-overlay">
      <div className="modal-content send-feedback">
        <div className="modal-header">
          <div className="header-title">
            <h2>Send Feedback</h2>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="content-wrapper">
            <div className="preview-section">
              <div className="preview-form">
                <div className="orange-header">
                  <h3>{feedbackInfo.title || "None"}</h3>
                </div>
                <div className="form-content">
                  {/* <div className="date">30 June 2024</div> */}
                  <p className="intro-text">
                    {feedbackInfo.description || "None"}
                  </p>
                  {/* <div className="session">
                    <div className="session-header">Session 1</div>
                    <div className="session-content">
                      <h4>Trainee Information</h4>
                      <p>
                        In order to support you timely during the course, we
                        would like to receive your feedback!
                      </p>
                      <div className="form-field">
                        <label>1. Your Name</label>
                        <input
                          type="text"
                          name="yourName"
                          value={formData.yourName}
                          onChange={handleInputChange}
                          placeholder="Enter your answer"
                          className="input-active"
                        />
                      </div>
                      <div className="form-field">
                        <label>2. Class Code for Internship</label>
                        <div className="radio-group">
                          <label className="radio-label">
                            <input
                              type="radio"
                              name="classCode"
                              checked={formData.classCode === "BA.01"}
                              onChange={() => handleRadioChange("BA.01")}
                            />
                            <span>BA.01</span>
                          </label>
                          <label className="radio-label">
                            <input
                              type="radio"
                              name="classCode"
                              checked={formData.classCode === "NET.14"}
                              onChange={() => handleRadioChange("NET.14")}
                            />
                            <span>NET.14</span>
                          </label>
                        </div>
                      </div>
                      <div className="form-field">
                        <label>3. Mentors of your class</label>
                        <input
                          type="text"
                          name="mentors"
                          value={formData.mentors}
                          onChange={handleInputChange}
                          placeholder="Select your answer"
                          className="input-active"
                        />
                      </div>
                    </div>
                  </div> */}
                  {feedbackInfo.feedbackTemplateSectionResponseList && feedbackInfo.feedbackTemplateSectionResponseList.map((section, index) => (
                    <div className="session" key={section.id}>
                      <div className="session-header">
                        <h4>{`Session ${index + 1}: ${section.name}`}</h4> {/* Dynamic session header */}
                      </div>
                      <div className="session-content">
                        <p>{section.description || "No description available."}</p> {/* Dynamic session content */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-section">
              <div className="last-update">
                <span className="clock-icon">🕒</span>
                Last Update: 2024/10/15
              </div>
              <div className="form-group">
                <label>Class Name</label>
                <div className="custom-dropdown" ref={dropdownRef}>
                  <div
                    className="popup-dropdown-header"
                    onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                  >
                    {formData.className
                      ? `${formData.className.split(',').length} classes selected`
                      : 'Select Classes'}
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  {isClassDropdownOpen && (
                    <div className="popup-dropdown-content">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.className.split(',').length === classNames.length}
                          onChange={(e) => handleSelectAllClasses(e.target.checked)}
                        />
                        Select All
                      </label>
                      <div className="template-classname-overflow-x">
                        {classNames.map((classItem) => ( // Use classNames prop here
                          <label key={classItem.classId} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={formData.className.split(',').includes(classItem.className)}
                              onChange={() => handleClassSelect(classItem.className)}
                            />
                            {classItem.className}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Expiration Date</label>
                <div className="date-input-wrapper">
                  <DatePicker
                    name="expirationDate"
                    value={formData.expirationDate ? dayjs(formData.expirationDate, 'DD/MM/YYYY') : null}
                    format="DD/MM/YYYY"
                    onChange={(date, dateString) => handleInputChange({ target: { name: 'expirationDate', value: dateString } })}
                    placeholder="Select date"
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="send-date-container">
                  <span>Send Date</span>
                  <Radio onClick={toggleSendDate} />
                </div>
                {showSendDate && (
                  <div className="date-input-wrapper">
                    <DatePicker
                      name="sendDate"
                      value={sendDate ? dayjs(sendDate, 'DD/MM/YYYY') : null}
                      format="DD/MM/YYYY"
                      onChange={handleSendDateChange}
                      placeholder="Select send date"
                    />
                  </div>
                )}
              </div>
              <button className="send-btn" onClick={handleSend}>
                SEND
              </button>
            </div>
          </div>
        </div>
        {showNotification && (
          <Notification
            message="Feedback sent successfully!"
            onClose={() => setShowNotification(false)}
          />
        )}
      </div>
    </div>
  );
};

export default SendFeedbackPopup;