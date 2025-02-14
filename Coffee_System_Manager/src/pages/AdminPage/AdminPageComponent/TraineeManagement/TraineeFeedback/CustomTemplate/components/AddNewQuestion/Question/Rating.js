import React, { useState } from 'react';
import { Input, Button, Checkbox, Rate, message } from 'antd';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { apiService } from '../../AddnewTemplate/ApiCreate/apiService'; // Import API service

const RatingQuestion = ({ id, onRemove }) => {
  const [isRequired, setIsRequired] = useState(false); // Trạng thái "Required"
  const [ratingQuestion, setRatingQuestion] = useState(''); // Nội dung câu hỏi
  const [ratingValue, setRatingValue] = useState(0); // Giá trị xếp hạng

  // Xử lý khi nội dung câu hỏi thay đổi
  const handleQuestionChange = (e) => setRatingQuestion(e.target.value);

  // Xử lý khi trạng thái "Required" thay đổi
  const handleRequiredChange = (e) => setIsRequired(e.target.checked);

  // Xử lý khi người dùng nhấn nút lưu câu hỏi
  const handleSaveQuestion = async () => {
    if (!ratingQuestion.trim()) {
      message.error('Question content is required!');
      return;
    }

    const payload = {
      content: ratingQuestion,
      isRequired,
      feedbackQuestionType: 'RATING',
      maxRating: 5, // Mặc định tối đa là 5 sao (Rate mặc định từ Ant Design)
    };

    try {
      await apiService.createQuestion(payload); // Gọi API để lưu câu hỏi
      message.success('Question saved successfully!');
    } catch (error) {
      //console.error('Error saving question:', error);
      message.error('Failed to save question. Please try again.');
    }
  };

  return (
    <div className="rating-question-container">
      <div className="modal-top-border" />
      <div className="modal-content" style={{ paddingTop: 20 }}>
        <div className="question-container">
          <span className="question-number">{id}.</span>
          <Input
            placeholder="Enter your rating question here"
            value={ratingQuestion}
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
        <div className="rating-container">
          <Rate
            value={ratingValue}
            onChange={(value) => setRatingValue(value)}
            className="star-rating"
          />
        </div>
        <div className="feedback-form__button-container">
          {/* <Button
            icon={<SaveOutlined />}
            type="primary"
            onClick={handleSaveQuestion}
            style={{ marginRight: 8 }}
          >
            Save Question
          </Button> */}
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => onRemove(id)}
            danger
            className="remove-question-button"
          >
            Remove Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RatingQuestion;
