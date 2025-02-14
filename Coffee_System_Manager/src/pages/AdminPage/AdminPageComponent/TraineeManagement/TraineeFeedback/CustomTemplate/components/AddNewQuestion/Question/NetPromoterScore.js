import React, { useState } from 'react';
import { Input, Button, Checkbox, message } from 'antd';
import { PlusCircleOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { apiService } from '../../AddnewTemplate/ApiCreate/apiService'; // Import API service

const NetPromoterScoreQuestion = ({ id, onRemove }) => {
  const [isRequired, setIsRequired] = useState(false); // Trạng thái "Required"
  const [question, setQuestion] = useState(''); // Nội dung câu hỏi
  const [ratingValue, setRatingValue] = useState(null); // Giá trị đánh giá được chọn
  const [maxRating, setMaxRating] = useState(10); // Giá trị tối đa cho thang đánh giá

  // Xử lý khi nội dung câu hỏi thay đổi
  const handleQuestionChange = (e) => setQuestion(e.target.value);

  // Xử lý khi trạng thái "Required" thay đổi
  const handleRequiredChange = (e) => setIsRequired(e.target.checked);

  // Xử lý khi người dùng nhấn nút lưu câu hỏi
  const handleSaveQuestion = async () => {
    if (!question.trim()) {
      message.error('Question content is required!');
      return;
    }

    const payload = {
      content: question,
      isRequired,
      feedbackQuestionType: 'NPS',
      maxRating,
    };

    try {
      await apiService.createQuestion(payload); // Giả sử đây là API tạo câu hỏi NPS
      message.success('Question saved successfully!');
    } catch (error) {
      //console.error('Error saving question:', error);
      message.error('Failed to save question. Please try again.');
    }
  };

  return (
    <div className="nps-question-container">
      <div className="modal-top-border" />
      <div className="modal-content" style={{ paddingTop: 20 }}>
        <div className="question-container">
          <span className="question-number">{id}.</span>
          <Input
            placeholder="How likely are you to recommend us?"
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

        {/* Lựa chọn giá trị đánh giá */}
        <div className="rating-options">
          {Array.from({ length: maxRating + 1 }, (_, i) => (
            <div
              key={i}
              className={`rating-box ${ratingValue === i ? 'selected' : ''}`}
              onClick={() => setRatingValue(i)}
            >
              {i}
            </div>
          ))}
        </div>

        {/* Cấu hình giá trị tối đa */}
        <div className="max-rating-row">
          <label className="max-rating-label">Max Rating</label>
          <Input
            type="number"
            placeholder="Number"
            value={maxRating}
            onChange={(e) => setMaxRating(Number(e.target.value))}
            className="max-rating-input"
            min={1}
            max={100}
          />
        </div>

        <div className="feedback-form__button-container">
         
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

export default NetPromoterScoreQuestion;
