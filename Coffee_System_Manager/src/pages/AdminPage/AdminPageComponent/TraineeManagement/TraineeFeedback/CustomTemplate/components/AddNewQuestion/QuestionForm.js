import React, { useState } from 'react';
import { Button, Row, Col, message } from 'antd';
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import MultipleChoiceQuestion from './Question/MultipleChoice';
import RatingQuestion from './Question/Rating';
import TextQuestion from './Question/Text';
import NetPromoterScoreQuestion from './Question/NetPromoterScore';
import DateQuestion from './Question/Date';
import SortingQuestion from './Question/Sorting';
import FileUploadQuestion from './Question/FileUpload';
import LikertQuestion from './Question/Likert';
import './QuestionForm.css';

const QuestionForm = () => {
  const [questions, setQuestions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  const handleAddQuestion = () => {
    setShowOptions(true);
  };

  const handleOpenModal = (type) => {
    const newQuestion = { id: questions.length + 1, type, isRequired: false, content: '' }; // Updated structure
    setQuestions((prev) => [...prev, newQuestion]);
    setShowOptions(false);
  };

  const handleRemoveQuestion = (id) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id));
  };

  const handleQuestionChange = (id, value) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, content: value } : q // Updated to use 'content'
    );
    setQuestions(updatedQuestions);
  };

  return (
    <div className="feedback-form__container">
      <Button
        icon={<PlusCircleOutlined />}
        onClick={handleAddQuestion}
        className="add-question-button"
      >
        Add new question
      </Button>

      {showOptions && (
        <div style={{ marginTop: 16 }}>
          <Button
            className="cancel-button"
            type="text"
            onClick={() => setShowOptions(false)}
            icon={<CloseCircleOutlined />}
          >
            Cancel
          </Button>
          <div className="outer-container">
            <Row gutter={[16, 16]} className="button-grid">
              <Col span={8}>
                <Button
                  className="option-button"
                  onClick={() => handleOpenModal('rating')}
                >
                  Rating
                </Button>
              </Col>
              <Col span={8}>
                <Button
                  className="option-button"
                  onClick={() => handleOpenModal('text')}
                >
                  Text
                </Button>
              </Col>
              <Col span={8}>
                <Button
                  className="option-button"
                  onClick={() => handleOpenModal('netPromoterScore')}
                >
                  Net Promoter Score®
                </Button>
              </Col>
              <Col span={8}>
                <Button
                  className="option-button"
                  onClick={() => handleOpenModal('multipleChoice')}
                >
                  Multiple Choice
                </Button>
              </Col>
              <Col span={8}>
                <Button
                  className="option-button"
                  onClick={() => handleOpenModal('date')}
                >
                  Date
                </Button>
              </Col>
              <Col span={8}>
                <Button
                  className="option-button"
                  onClick={() => handleOpenModal('sorting')}
                >
                  Sorting
                </Button>
              </Col>
              <Col span={8}>
                <Button
                  className="option-button"
                  onClick={() => handleOpenModal('fileUpload')}
                >
                  File Upload
                </Button>
              </Col>
              <Col span={8}>
                <Button
                  className="option-button"
                  onClick={() => handleOpenModal('likert')}
                >
                  Likert
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      )}
      <div style={{ marginTop: 15 }}>
        {questions.map((question) => {
          switch (question.type) {
            case 'multipleChoice':
              return (
                <MultipleChoiceQuestion
                  key={question.id}
                  id={question.id}
                  onRemove={handleRemoveQuestion}
                />
              );
            case 'rating':
              return (
                <RatingQuestion
                  key={question.id}
                  id={question.id}
                  onRemove={handleRemoveQuestion}
                />
              );
            case 'text':
              return (
                <TextQuestion
                  key={question.id}
                  id={question.id}
                  onRemove={handleRemoveQuestion}
                />
              );
            case 'netPromoterScore':
              return (
                <NetPromoterScoreQuestion
                  key={question.id}
                  id={question.id}
                  onRemove={handleRemoveQuestion}
                />
              );
            case 'date':
              return (
                <DateQuestion
                  key={question.id}
                  id={question.id}
                  onRemove={handleRemoveQuestion}
                />
              );
            case 'sorting':
              return (
                <SortingQuestion
                  key={question.id}
                  id={question.id}
                  onRemove={handleRemoveQuestion}
                />
              );
            case 'fileUpload':
              return (
                <FileUploadQuestion
                  key={question.id}
                  id={question.id}
                  onRemove={handleRemoveQuestion}
                />
              );
            case 'likert':
              return (
                <LikertQuestion
                  key={question.id}
                  id={question.id}
                  onRemove={handleRemoveQuestion}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default QuestionForm;