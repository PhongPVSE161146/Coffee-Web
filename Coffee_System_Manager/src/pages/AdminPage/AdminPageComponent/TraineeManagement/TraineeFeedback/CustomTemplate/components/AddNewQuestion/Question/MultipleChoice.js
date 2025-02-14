import React, { useState, useEffect } from 'react';
import { Input, Button, Checkbox, message } from 'antd';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { apiService } from '../../AddnewTemplate/ApiCreate/apiService'; // Path to API service

const MultipleChoiceQuestion = ({ id, onRemove }) => {
  const [isRequired, setIsRequired] = useState(false);
  const [question, setQuestion] = useState('');
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState(['']);

  // Load saved data from localStorage if any
  useEffect(() => {
    const savedQuestion = localStorage.getItem(`question_${id}`);
    const savedOptions = JSON.parse(localStorage.getItem(`options_${id}`)) || [''];
    const savedIsRequired = JSON.parse(localStorage.getItem(`isRequired_${id}`)) || false;

    if (savedQuestion) setQuestion(savedQuestion);
    if (savedOptions) setMultipleChoiceOptions(savedOptions);
    if (savedIsRequired !== undefined) setIsRequired(savedIsRequired);
  }, [id]);

  // Handle question change
  const handleQuestionChange = (e) => {
    const newQuestion = e.target.value;
    setQuestion(newQuestion);
    localStorage.setItem(`question_${id}`, newQuestion); // Save locally
  };

  // Handle required change
  const handleRequiredChange = (e) => {
    const newIsRequired = e.target.checked;
    setIsRequired(newIsRequired);
    localStorage.setItem(`isRequired_${id}`, JSON.stringify(newIsRequired)); // Save locally
  };

  // Handle option change
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...multipleChoiceOptions];
    updatedOptions[index] = value;
    setMultipleChoiceOptions(updatedOptions);
    localStorage.setItem(`options_${id}`, JSON.stringify(updatedOptions)); // Save locally
  };

  // Handle add option
  const handleAddOption = () => {
    const updatedOptions = [...multipleChoiceOptions, ''];
    setMultipleChoiceOptions(updatedOptions);
    localStorage.setItem(`options_${id}`, JSON.stringify(updatedOptions)); // Save locally
    //console.log('New option added:', updatedOptions); // Log the updated options to the console
  };

  // Handle delete option
  const handleDeleteOption = (index) => {
    const updatedOptions = multipleChoiceOptions.filter((_, i) => i !== index);
    setMultipleChoiceOptions(updatedOptions);
    localStorage.setItem(`options_${id}`, JSON.stringify(updatedOptions)); // Save locally
  };

  // Save question to the backend when clicking the Save button in footer
  const saveAllQuestions = async (allQuestions) => {
    try {
      await apiService.createTemplate({
        questions: allQuestions,
      });
      message.success('All questions saved successfully!');
    } catch (error) {
      //console.error('Error during save:', error);
      message.error('Failed to save all questions.');
    }
  };

  // Collect question data for saving
  const collectQuestionData = () => {
    return {
      content: question,
      isRequired,
      feedbackQuestionType: "MULTIPLE_CHOICE", // Fixed feedback type
      multipleChoiceOptionList: multipleChoiceOptions.map((option) => ({
        option,
      })),
    };
  };

  return (
    <div className="multiple-choice-container">
      <div className="modal-top-border" />
      <div className="modal-content" style={{ paddingTop: 20 }}>
        <div className="question-container">
          <span className="question-number">{id}.</span>
          <span >
            <Input
              placeholder="Question"
              value={question}
              onChange={handleQuestionChange}
              className="question-input"
            />Required
            <Checkbox
              checked={isRequired}
              onChange={handleRequiredChange}
              className="required-checkbox"
            />
          </span>

        </div>
        {multipleChoiceOptions.map((option, index) => (
          <div key={index} className="option-container">
            <input type="radio" disabled className="option-radio-template" />
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

export default MultipleChoiceQuestion;
