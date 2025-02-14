import React, { useState } from 'react';
import { Input, Button, Checkbox, message } from 'antd';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { apiService } from '../../AddnewTemplate/ApiCreate/apiService'; // Import API service

// Component for a Text Question
const TextQuestion = ({ id, onRemove }) => {
  const [isRequired, setIsRequired] = useState(false); // Trạng thái "Required"
  const [question, setQuestion] = useState(''); // Nội dung câu hỏi

  // Xử lý khi nội dung câu hỏi thay đổi
  const handleQuestionChange = (e) => setQuestion(e.target.value);

  // Xử lý khi trạng thái "Required" thay đổi
  const handleRequiredChange = (e) => setIsRequired(e.target.checked);

  // Xử lý lưu câu hỏi qua API
  const handleSaveQuestion = async () => {
    if (!question.trim()) {
      message.error('Question content is required!');
      return;
    }

    const payload = {
      content: question,
      isRequired,
      feedbackQuestionType: 'TEXT', // Loại câu hỏi
    };

    try {
      await apiService.createQuestion(payload); // Gọi API để lưu câu hỏi
      message.success('Text question saved successfully!');
    } catch (error) {
      //console.error('Error saving question:', error);
      message.error('Failed to save text question. Please try again.');
    }
  };

  return (
    <div className="text-question-container">
      <div className="modal-top-border" />
      <div className="modal-content" style={{ paddingTop: 20 }}>
        <div className="question-container">
          <span className="question-number">{id}.</span>
          <Input
            placeholder="Enter your text question here"
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
        <Input.TextArea
          placeholder="User's answer will appear here"
          
          style={{
            width: '100%',
            height: '150px',
            padding: '8px',
            marginTop: '16px',
          }}
        />
        <div className="feedback-form__button-container" style={{ marginTop: '16px' }}>
          {/* <Button
            icon={<SaveOutlined />}
            type="primary"
            onClick={handleSaveQuestion}
            style={{ marginRight: 8 }}
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

export default TextQuestion;
