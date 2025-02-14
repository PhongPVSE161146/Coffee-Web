import React, { useState } from "react";
import { Input, Button, Checkbox, Radio } from "antd";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";

const LikertQuestion = ({ id, questionText, onRemove }) => {
  const [isRequired, setIsRequired] = useState(false);
  const [answerOptions, setAnswerOptions] = useState([
    "Answer 1",
    "Answer 2",
    "Answer 3",
  ]);
  const [question, setQuestion] = useState(questionText);

  const [questions, setQuestions] = useState([
    { id: 1, text: "Question 1", answers: ["Answer 1", "Answer 2", "Answer 3"] },
    { id: 2, text: "Question 2", answers: ["Answer 1", "Answer 2", "Answer 3"] },
  ]);

  const handleAddQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      text: `Question ${questions.length + 1}`,
      answers: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleQuestionChange = (id, value) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, text: value } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleRequiredChange = (e) => setIsRequired(e.target.checked);

  const handleAnswerChange = (index, e) => {
    const updatedAnswers = [...answerOptions];
    updatedAnswers[index] = e.target.value;
    setAnswerOptions(updatedAnswers);
  };

  const handleAddAnswer = () => {
    const newAnswerOptions = [
      ...answerOptions,
      `Answer ${answerOptions.length + 1}`,
    ];
    setAnswerOptions(newAnswerOptions);
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = answerOptions.filter((_, i) => i !== index);
    setAnswerOptions(updatedOptions);
  };

  const onDeleteAnswer = (questionId, answerIndex) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        const updatedAnswers = question.answers.filter(
          (_, i) => i !== answerIndex
        );
        return { ...question, answers: updatedAnswers };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  return (
    <div className="likert-question-container">
      <div className="modal-top-border" />
      <div className="modal-content" style={{ paddingTop: 20 }}>
        <div className="question-container">
          <span className="question-number">{id}.</span>
          <Input
            placeholder="Enter your question here"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
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

        <div className="likert-table">
          <div className="likert-table-header">
            <span></span>
            {answerOptions.map((answer, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  marginRight: 8,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Input
                  value={answer}
                  onChange={(e) => handleAnswerChange(index, e)}
                  style={{ width: "100%" }}
                  placeholder={`Answer ${index + 1}`}
                />
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  style={{ color: "red", marginLeft: 8 }}
                  onClick={() => handleDeleteOption(index)} // Correct delete handler
                />
              </div>
            ))}
            <span className="add-icon">
              <PlusCircleOutlined
                onClick={handleAddAnswer}
                style={{ fontSize: 24, cursor: "pointer", marginLeft: 8 }}
              />
            </span>
          </div>

          {questions.map((question) => (
            <div key={question.id} className="likert-table-row">
              <Input
                value={question.text}
                onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                placeholder={`Edit question ${question.id}`}
                style={{ width: "60%", marginBottom: 8 }}
              />
              <div className="radio-group-edit-template">
                {question.answers.map((_, i) => (
                  <Radio key={i} value={i + 1} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button
          type="link"
          icon={<PlusCircleOutlined />}
          onClick={handleAddQuestion}
          className="add-question-button"
        >
          Add question
        </Button>

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

export default LikertQuestion;
