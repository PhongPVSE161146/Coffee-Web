import React, { useState } from 'react';
import { Input, Button, Checkbox, message } from 'antd';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { apiService } from '../../AddnewTemplate/ApiCreate/apiService';  // Đường dẫn tới file API service

// Component for a single Date Question
const DateQuestion = ({ id, onRemove }) => {
  const [isRequired, setIsRequired] = useState(false); // Trạng thái "Required"
  const [question, setQuestion] = useState(''); // Nội dung câu hỏi
  const [selectedDate, setSelectedDate] = useState(''); // Giá trị ngày được chọn

  // Xử lý khi nội dung câu hỏi thay đổi
  const handleQuestionChange = (e) => setQuestion(e.target.value);

  // Xử lý khi trạng thái "Required" thay đổi
  const handleRequiredChange = (e) => setIsRequired(e.target.checked);

  // Xử lý khi ngày được chọn
  const handleDateChange = (e) => setSelectedDate(e.target.value);

  // Xử lý khi nhấn nút Save Question
  const handleSaveQuestion = async () => {
    if (!question.trim()) {
      message.error('Question content is required!');
      return;
    }
    if (!selectedDate) {
      message.error('Date selection is required!');
      return;
    }

    const payload = {
      content: question,
      isRequired,
      feedbackQuestionType: 'DATE',
      selectedDate,
    };

    try {
      await apiService.addDateQuestion(payload); // Giả sử đây là hàm API cho câu hỏi ngày
      message.success('Question saved successfully!');
    } catch (error) {
      //console.error('Error saving question:', error);
      message.error('Failed to save question. Please try again.');
    }
  };

  return (
    <div className="date-question-container">
      <div className="modal-top-border" />
      <div className="modal-content" style={{ paddingTop: 20 }}>
        <div className="question-container">
          <span className="question-number">{id}.</span>
          <Input
            placeholder="Enter your date question here"
            value={question}
            onChange={handleQuestionChange}
            className="question-input"
          />
          <Checkbox
            checked={isRequired}
            onChange={handleRequiredChange}
            className="required-checkbox"
          >
            Required
          </Checkbox>
        </div>

        {/* Date Picker Input */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <Input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="date-picker-input"
          />
        </div>

        {/* Nút lưu câu hỏi và xóa câu hỏi */}
        <div className="feedback-form__button-container" style={{ marginTop: 16 }}>
          {/* <Button
            icon={<SaveOutlined />}
            type="primary"
            onClick={handleSaveQuestion}
            style={{ marginTop: 16 }}
          >
            Save Question
          </Button> */}
          <Button
            icon={<DeleteOutlined />}
            type="link"
            onClick={() => onRemove(id)}
            style={{ marginTop: 16, color: 'red' }}
          >
            Remove Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateQuestion;
