import React, { useState } from 'react';
import { Input, Button, Checkbox, message } from 'antd';
import { PlusCircleOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { apiService } from '../../AddnewTemplate/ApiCreate/apiService'; // Import API service

const SortingQuestion = ({ id, onRemove }) => {
  const [isRequired, setIsRequired] = useState(false);
  const [question, setQuestion] = useState('');
  const [sortingOptions, setSortingOptions] = useState(['']);

  const handleQuestionChange = (e) => setQuestion(e.target.value);
  const handleRequiredChange = (e) => setIsRequired(e.target.checked);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...sortingOptions];
    updatedOptions[index] = value;
    setSortingOptions(updatedOptions);
  };

  const handleAddOption = () => setSortingOptions([...sortingOptions, '']);
  const handleDeleteOption = (index) => {
    const updatedOptions = sortingOptions.filter((_, i) => i !== index);
    setSortingOptions(updatedOptions);
  };

  const handleSaveQuestion = async () => {
    if (!question.trim()) {
      message.error('Question content is required!');
      return;
    }

    if (sortingOptions.some((option) => !option.trim())) {
      message.error('All sorting options must be filled!');
      return;
    }

    const payload = {
      content: question,
      isRequired,
      feedbackQuestionType: 'SORTING',
      sortingOptions, // Danh sách các lựa chọn sắp xếp
    };

    try {
      await apiService.createQuestion(payload); // Gọi API để lưu câu hỏi
      message.success('Sorting question saved successfully!');
    } catch (error) {
      //console.error('Error saving question:', error);
      message.error('Failed to save sorting question. Please try again.');
    }
  };

  return (
    <div className="sorting-question-container">
      <div className="modal-top-border" />
      <div className="modal-content" style={{ paddingTop: 20 }}>
        <div className="question-container">
          <span className="question-number">{id}.</span>
          <Input
            placeholder="Enter your sorting question here"
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

        {sortingOptions.map((option, index) => (
          <div key={index} className="option-container">
            <Input
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="option-input-template"
            />
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteOption(index)}
              className="delete-option-button"
            />
          </div>
        ))}

        <div className="feedback-form__button-container">
          <Button
            icon={<PlusCircleOutlined />}
            onClick={handleAddOption}
            className="add-question-button"
          >
            Add option
          </Button>
          {/* <Button
            icon={<SaveOutlined />}
            type="primary"
            onClick={handleSaveQuestion}
            style={{ marginLeft: 8 }}
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

export default SortingQuestion;
