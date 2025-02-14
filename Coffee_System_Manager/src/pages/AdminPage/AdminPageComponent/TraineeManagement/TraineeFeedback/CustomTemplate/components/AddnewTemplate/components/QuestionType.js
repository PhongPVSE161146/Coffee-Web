import React, { useEffect, useState } from 'react';
import { Form, Input, Radio, Select, Checkbox, Upload, Rate, DatePicker, Button, message, Typography } from 'antd';
import { CloseCircleOutlined, UploadOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
const { Text } = Typography;
const { Option } = Select;

// Component for Section 1: Trainee Information
export const TraineeInformation = () => (
    <Form layout="vertical">
        <Form.Item label="1. Your Name" name="name">
            <Input placeholder="Enter your answer" className="border-gray-300" />
        </Form.Item>
        <Form.Item label="2. Class Code for Internship" name="classCode">
            <Radio.Group>
                <Radio value="BA_01">BA_01</Radio>
                <Radio value="NET_14">NET_14</Radio>
            </Radio.Group>
        </Form.Item>
        <Form.Item label="3. Mentors of your class" name="mentor">
            <Select placeholder="Select your answer" className="border-gray-300">
                <Option value="mentor1">Mentor 1</Option>
                <Option value="mentor2">Mentor 2</Option>
                <Option value="mentor3">Mentor 3</Option>
            </Select>
        </Form.Item>
    </Form>
);


// Component for Section 3: Mutiple Choice

export const MultipleChoice = ({  
    question, 
    handleQuestionChange,
    toggleRequired, 
    isRequired,
    questionId, 
    options = [], 
    handleOptionChange, 
    addOption, 
    removeOption 
}) => {
    const [questionError, setQuestionError] = useState("");
    const [questionStatus, setQuestionStatus] = useState(""); // Question status (for error handling)
    const [optionErrors, setOptionErrors] = useState([]); // Array for option errors
    const [optionStatuses, setOptionStatuses] = useState([]); // Array for option statuses

    // Validate the question to make sure it's not empty
    const validateQuestion = () => {
        if (!question || !question.trim()) {
            setQuestionStatus('error');
            setQuestionError("Question cannot be empty");
        } else {
            setQuestionStatus(''); // Reset the status if the question is valid
            setQuestionError("");
        }
    };

    // Validate the options to make sure they're not empty
    const validateOptions = () => {
        const errors = [];
        const statuses = [];
        options.forEach((option, index) => {
            if (!option.option || !option.option.trim()) {
                errors[index] = "Option cannot be empty"; // Set error message for empty option
                statuses[index] = 'error'; // Mark option as error
            } else {
                errors[index] = ""; // Clear error message for valid option
                statuses[index] = ''; // Reset status for valid option
            }
        });

        setOptionErrors(errors); // Update option errors state
        setOptionStatuses(statuses); // Update option statuses state
    };

    // Trigger validation when the question or options change
    useEffect(() => {
        validateQuestion();
        validateOptions();
    }, [question, options]);

    return (
        <>
            <div className="flex justify-between items-center">
                <Form.Item className="w-full mb-0">
                    <Input 
                        status={questionStatus} // Show error if status is 'error'
                        placeholder="Question" 
                        value={question} 
                        onChange={(e) => handleQuestionChange(questionId, e.target.value)} 
                        className="border-gray-300" 
                        onBlur={validateQuestion} // Validate question on blur
                    />
                    {questionError && <div className="text-red-600 text-sm">{questionError}</div>}
                </Form.Item>
                <Checkbox checked={isRequired} onChange={toggleRequired} className="required-checkbox">
                    Required
                </Checkbox>
            </div>
            <br />
            {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                    <Checkbox disabled />
                    <Input
                        status={optionStatuses[index]} // Show error if status is 'error'
                        placeholder={`Option ${index + 1}`}
                        value={option.option}
                        onChange={(e) => handleOptionChange(questionId, index, e.target.value)}
                        className="border-gray-300 w-40"
                        onBlur={validateOptions} // Validate options on blur
                    />
                    {optionErrors[index] && <div className="text-red-600 text-sm">{optionErrors[index]}</div>}
                    {options.length > 1 && (
                        <Button
                            type="text"
                            icon={<CloseCircleOutlined className="text-red-600" />}
                            onClick={() => removeOption(questionId, index)}
                        />
                    )}
                </div>
            ))}
            <Button
                type="text"
                className="flex items-center text-blue-600 border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:bg-gray-200"
                icon={<PlusCircleOutlined className="mr-2 text-blue-600" />}
                onClick={() => addOption(questionId)}
            >
                Add option
            </Button>
        </>
    );
};





// Component for Section 4: File Upload Question
export const FileUploadQuestion = ({  
    question, 
    handleQuestionChange,
    toggleRequired, 
    isRequired, 
    questionId
}) => {
    const [questionError, setQuestionError] = useState(""); // For storing error message
    const [questionStatus, setQuestionStatus] = useState(""); // For tracking input status (e.g., error)

    // Validate the question to make sure it's not empty
    const validateQuestion = () => {
        if (!question) {
            setQuestionStatus('error');
            setQuestionError("Question cannot be empty");
        } else {
            setQuestionStatus(''); // Reset the status if question is valid
            setQuestionError("");
        }
    };

    // Trigger validation on question change or blur
    useEffect(() => {
        validateQuestion();
    }, [question]);

    return (
        <>
            {/* Question Text and Required Checkbox */}
            <div className="flex justify-between items-center">
                <Form.Item className="w-full mb-0">
                    <Input 
                        status={questionStatus} // Apply error status to the input
                        placeholder="Question" 
                        value={question} 
                        onChange={(e) => handleQuestionChange(questionId, e.target.value)} 
                        className="border-gray-300"
                        onBlur={validateQuestion} // Trigger validation on blur
                    />
                    {questionError && <div className="text-red-600 text-sm">{questionError}</div>}
                </Form.Item>
                <Checkbox 
                    checked={isRequired} 
                    onChange={toggleRequired} 
                     className="required-checkbox"
                >
                    Required
                </Checkbox>
            </div>
            <br />

            {/* File Upload Section */}
            <Form.Item label="">
                <Upload.Dragger 
                    name="file" 
                    multiple={false} 
                    // You can add a custom upload function or remove the 'action' if not needed.
                    // action="/upload" 
                    beforeUpload={(file) => {
                        // Here you could validate the file type or size if needed
                        message.info(`${file.name} file uploaded successfully`);
                        return false; // Prevent automatic upload for now
                    }}
                >
                    <p className="ant-upload-drag-icon">
                        <UploadOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Drop your file or click to browse files
                    </p>
                </Upload.Dragger>
            </Form.Item>
        </>
    );
};


// Component for Section 5: Rating Question
export const RatingQuestion = ({  
    question, 
    handleQuestionChange, 
    toggleRequired, 
    isRequired, 
    questionId 
}) => {
    const [questionError, setQuestionError] = useState(""); // For storing error message
    const [questionStatus, setQuestionStatus] = useState(""); // For tracking input status (e.g., error)

    // Validate the question to make sure it's not empty
    const validateQuestion = () => {
        if (!question) {
            setQuestionStatus('error');
            setQuestionError("Question cannot be empty");
        } else {
            setQuestionStatus(''); // Reset the status if question is valid
            setQuestionError("");
        }
    };

    // Trigger validation on question change or blur
    useEffect(() => {
        validateQuestion();
    }, [question]);

    return (
        <>
            {/* Question Text and Required Checkbox */}
            <div className="flex justify-between items-center">
                <Form.Item className="w-full mb-0">
                    <Input 
                        status={questionStatus} // Apply error status to the input
                        placeholder="Question" 
                        value={question} 
                        onChange={(e) => handleQuestionChange(questionId, e.target.value)} 
                        className="border-gray-300"
                        onBlur={validateQuestion} // Trigger validation on blur
                    />
                    {questionError && <div className="text-red-600 text-sm">{questionError}</div>}
                </Form.Item>
                <Checkbox 
                    checked={isRequired} 
                    onChange={toggleRequired} 
                     className="required-checkbox"
                >
                    Required
                </Checkbox>
            </div>
            <br />

            {/* Rating Section */}
            <Form.Item>
                <Rate  className="star-rating" />
            </Form.Item>

            {/* Comment Input */}
            <div className="flex items-center">
                <Form.Item className="w-full mb-0">
                    <Input 
                        placeholder="Comment" 
                        className="border-gray-300"
                    />
                </Form.Item>
            </div>
        </>
    );
};



// Component for Section 6: Date Picker Question
export const DateQuestion = ({  
    question, 
    handleQuestionChange, 
    toggleRequired, 
    isRequired, 
    questionId 
}) => {
    const [questionError, setQuestionError] = useState(""); // For storing error message
    const [questionStatus, setQuestionStatus] = useState(""); // For tracking input status (e.g., error)

    // Validate the question to make sure it's not empty
    const validateQuestion = () => {
        if (!question || !question.trim()) {
            setQuestionStatus('error');
            setQuestionError("Question cannot be empty");
        } else {
            setQuestionStatus(''); // Reset the status if question is valid
            setQuestionError("");
        }
    };

    // Trigger validation on question change or blur
    useEffect(() => {
        validateQuestion();
    }, [question]);

    return (
        <>
            {/* Question Text and Required Checkbox */}
            <div className="flex justify-between items-center">
                <Form.Item className="w-full mb-0">
                    <Input 
                        status={questionStatus} // Apply error status to the input
                        placeholder="Question" 
                        value={question} 
                        onChange={(e) => handleQuestionChange(questionId, e.target.value)} 
                        className="border-gray-300"
                        onBlur={validateQuestion} // Trigger validation on blur
                    />
                    {questionError && <div className="text-red-600 text-sm">{questionError}</div>}
                </Form.Item>
                <Checkbox 
                    checked={isRequired} 
                    onChange={toggleRequired} 
                  className="required-checkbox"
                >
                    Required
                </Checkbox>
            </div>
            <br />

            {/* Date Picker Section */}
            <Form.Item>
                <DatePicker 
                    format="DD/MM/YYYY" 
                    placeholder="dd/mm/yyyy" 
                    className="border-gray-300 w-auto"
                />
            </Form.Item>
        </>
    );
};


// Component for Section 7: Sorting Question
export const Sorting = ({  
    question, 
    handleQuestionChange,
    toggleRequired, 
    isRequired,
    questionId, 
    options = [], 
    handleOptionChange, 
    addOption, 
    removeOption 
}) => {
    const [questionError, setQuestionError] = useState("");
    const [questionStatus, setQuestionStatus] = useState(""); // Question status (for error handling)
    const [optionErrors, setOptionErrors] = useState([]); // Array for option errors
    const [optionStatuses, setOptionStatuses] = useState([]); // Array for option statuses

    // Validate the question to make sure it's not empty
    const validateQuestion = () => {
        if (!question) {
            setQuestionStatus('error');
            setQuestionError("Question cannot be empty");
        } else {
            setQuestionStatus(''); // Reset the status if the question is valid
            setQuestionError("");
        }
    };

    // Validate the options to make sure they're not empty
    const validateOptions = () => {
        const errors = [];
        const statuses = [];
        options.forEach((option, index) => {
            if (!option.option || !option.option.trim()) {
                errors[index] = "Option cannot be empty"; // Set error message for empty option
                statuses[index] = 'error'; // Mark option as error
            } else {
                errors[index] = ""; // Clear error message for valid option
                statuses[index] = ''; // Reset status for valid option
            }
        });

        setOptionErrors(errors); // Update option errors state
        setOptionStatuses(statuses); // Update option statuses state
    };

    // Trigger validation when the question or options change
    useEffect(() => {
        validateQuestion();
        validateOptions();
    }, [question, options]);

    return (
        <>
            <div className="flex justify-between items-center">
                <Form.Item className="w-full mb-0">
                    <Input 
                        status={questionStatus} // Show error if status is 'error'
                        placeholder="Question" 
                        value={question} 
                        onChange={(e) => handleQuestionChange(questionId, e.target.value)} 
                        className="border-gray-300" 
                        onBlur={validateQuestion} // Validate question on blur
                    />
                    {questionError && <div className="text-red-600 text-sm">{questionError}</div>}
                </Form.Item>
                <Checkbox checked={isRequired} onChange={toggleRequired}  className="required-checkbox">
                    Required
                </Checkbox>
            </div>
            <br />
            {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                    <Checkbox disabled />
                    <Input
                        status={optionStatuses[index]} // Show error if status is 'error'
                        placeholder={`Option ${index + 1}`}
                        value={option.option}
                        onChange={(e) => handleOptionChange(questionId, index, e.target.value)}
                        className="border-gray-300 w-40"
                        onBlur={validateOptions} // Validate options on blur
                    />
                    {optionErrors[index] && <div className="text-red-600 text-sm">{optionErrors[index]}</div>}
                    {options.length > 1 && (
                        <Button
                            type="text"
                            icon={<CloseCircleOutlined className="text-red-600" />}
                            onClick={() => removeOption(questionId, index)}
                        />
                    )}
                </div>
            ))}
            <Button
                type="text"
                className="flex items-center text-blue-600 border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:bg-gray-200"
                icon={<PlusCircleOutlined className="mr-2 text-blue-600" />}
                onClick={() => addOption(questionId)}
            >
                Add option
            </Button>
        </>
    );
};


// Component for Section 8: Net Promoter Score Question
export const NPSQuestion = ({  
    question, 
    handleQuestionChange, 
    toggleRequired, 
    isRequired, 
    questionId 
}) => {
    const [selectedScore, setSelectedScore] = useState(null);
    const [questionError, setQuestionError] = useState(""); // For storing error message
    const [questionStatus, setQuestionStatus] = useState(""); // For tracking input status (e.g., error)

    // Validate the question to make sure it's not empty
    const validateQuestion = () => {
        if (!question || !question.trim()) {
            setQuestionStatus('error');
            setQuestionError("Question cannot be empty");
        } else {
            setQuestionStatus(''); // Reset the status if question is valid
            setQuestionError("");
        }
    };

    // Trigger validation when the question changes
    useEffect(() => {
        validateQuestion();
    }, [question]);

    const handleBoxClick = (score) => {
        setSelectedScore(score);
    };

    return (
        <>
            {/* Question Text and Required Checkbox */}
            <div className="flex justify-between items-center">
                <Form.Item className="w-full mb-0">
                    <Input 
                        status={questionStatus} // Apply error status to the input
                        placeholder="Question" 
                        value={question} 
                        onChange={(e) => handleQuestionChange(questionId, e.target.value)} 
                        className="border-gray-300"
                        onBlur={validateQuestion} // Trigger validation on blur
                    />
                    {questionError && <div className="text-red-600 text-sm">{questionError}</div>}
                </Form.Item>
                <Checkbox 
                    checked={isRequired} 
                    onChange={toggleRequired} 
                     className="required-checkbox"
                >
                    Required
                </Checkbox>
            </div>
            <br />

            {/* NPS Score Selection */}
            <div className="flex justify-between items-center flex-wrap gap-1">
            <div className="rating-options">
                    {[...Array(11).keys()].map((scoreValue) => (
                         <div
                         key={scoreValue}
                           className={`rating-box ${selectedScore === scoreValue ? 'selected' : ''}`}
                           onClick={() => handleBoxClick(scoreValue)}
                         >
                            <span className="text-black">{scoreValue}</span>
                        </div>
                    ))}
                </div>
            </div>
            <br />

            {/* Comment Input */}
            <div className="flex items-center">
                <span className="mr-2 text-sm">Max Rating:</span>
                <Form.Item className="w-full max-w-52 mb-0">
                    <Input 
                        placeholder="Number" 
                        className="border-gray-300 p-2"
                    />
                </Form.Item>
            </div>
        </>
    );
};


// Component for Section 9:Text Question
export const TextQuestion = ({  
    question, 
    handleQuestionChange, 
    toggleRequired, 
    isRequired, 
    text, 
    handleTextChange, 
    questionId 
}) => {
    const [questionError, setQuestionError] = useState(""); // Error message for question
    const [questionStatus, setQuestionStatus] = useState(""); // To track input status (e.g., error)

    // Validate the question to make sure it's not empty
    const validateQuestion = () => {
        if (!question || !question.trim()) {
            setQuestionStatus('error');
            setQuestionError("Question cannot be empty");
        } else {
            setQuestionStatus('');
            setQuestionError("");
        }
    };

    // Trigger validation when the question changes
    useEffect(() => {
        validateQuestion();
    }, [question]);

    return (
        <>
            {/* Question Text and Required Checkbox */}
            <div className="flex justify-between items-center">
                <Form.Item className="w-full mb-0">
                    <Input 
                        status={questionStatus} // Apply error status to the input
                        placeholder="Question" 
                        value={question} 
                        onChange={(e) => handleQuestionChange(questionId, e.target.value)} 
                        className="border-gray-300"
                        onBlur={validateQuestion} // Trigger validation on blur
                    />
                    {questionError && <div className="text-red-600 text-sm">{questionError}</div>}
                </Form.Item>
                <Checkbox 
                    checked={isRequired} 
                    onChange={toggleRequired} 
                   className="required-checkbox"
                >
                    Required
                </Checkbox>
            </div>
            <br />

            {/* Text Input (TextArea) */}
            <Form.Item label="">
                <TextArea 
                disabled
                    placeholder="Input Text" 
                    autoSize={{ minRows: 6 }} 
                    value={text} 
                    onChange={(e) => handleTextChange(questionId, e.target.value)} 
                    className="border-gray-300"
                />
            </Form.Item>
        </>
    );
};

// Component for Section 10:Likert Question





export const LikertQuestion = ({
  question = { likertAnswerResponseList: [], likertQuestionResponseList: [] },
  sectionIndex,
  questionIndex,
  handleLikertInputChange,
  handleRemoveLikertOption,
  handleAddLikertOption,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const addLikertQuestion = () => {
    if (handleAddLikertOption) {
      handleAddLikertOption(sectionIndex, questionIndex, "likertQuestionResponseList");
    }
  };

  const addLikertAnswer = () => {
    if (handleAddLikertOption) {
      handleAddLikertOption(sectionIndex, questionIndex, "likertAnswerResponseList");
    }
  };

  const handleRadioChange = (questionId, answer) => {
    setSelectedAnswers((prevState) => ({
      ...prevState,
      [questionId]: answer,
    }));
  };

  return (
    <div className="ml-4">
      <div className="flex justify-between items-center mb-6">
        <Text strong className="text-lg">Likert Questions & Answers</Text>
      </div>

      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-6 py-3 text-left text-sm font-medium">Questions</th>
            {question.likertAnswerResponseList.map((likertAnswer, index) => (
              <th
                key={likertAnswer.id}
                className="border border-gray-300 px-6 py-3 text-center text-sm font-medium"
                style={{ whiteSpace: "nowrap" }}
              >
                <Input
                  value={likertAnswer.content}
                  placeholder={`Option ${index + 1}`}
                  onChange={(e) =>
                    handleLikertInputChange(
                      sectionIndex,
                      questionIndex,
                      "likertAnswerResponseList",
                      index,
                      e.target.value
                    )
                  }
                  style={{ width: "120px", textAlign: "center" }}
                />
                <Button
                  type="text"
                  icon={<CloseCircleOutlined style={{ fontSize: "20px", color: "#FF4D4F" }} />}
                  onClick={() =>
                    handleRemoveLikertOption(
                      sectionIndex,
                      questionIndex,
                      "likertAnswerResponseList",
                      index
                    )
                  }
                />
              </th>
            ))}
            <th className="border border-gray-300 px-6 py-3 text-center">
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={addLikertAnswer}
                className="w-full text-sm"
              >
                Add Option
              </Button>
            </th>
          </tr>
        </thead>

        <tbody>
          {question.likertQuestionResponseList.map((likertQuestion, index) => (
            <tr key={likertQuestion.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-6 py-3">
                <Input
                  value={likertQuestion.content}
                  placeholder={`Question ${index + 1}`}
                  onChange={(e) =>
                    handleLikertInputChange(
                      sectionIndex,
                      questionIndex,
                      "likertQuestionResponseList",
                      index,
                      e.target.value
                    )
                  }
                  style={{ width: "100%" }}
                />
                <Button
                  type="text"
                  icon={<CloseCircleOutlined style={{ fontSize: "18px", color: "#FF4D4F" }} />}
                  onClick={() =>
                    handleRemoveLikertOption(
                      sectionIndex,
                      questionIndex,
                      "likertQuestionResponseList",
                      index
                    )
                  }
                />
              </td>
              {question.likertAnswerResponseList.map((likertAnswer) => (
                <td key={`${likertQuestion.id}-${likertAnswer.id}`} className="border border-gray-300 text-center">
                  <Radio.Group
                    value={selectedAnswers[likertQuestion.id]}
                    onChange={(e) => handleRadioChange(likertQuestion.id, e.target.value)}
                  >
                    <Radio value={likertAnswer.content} />
                  </Radio.Group>
                </td>
              ))}
              <td className="border border-gray-300"></td>
            </tr>
          ))}

          <tr>
            <td className="border border-gray-300 px-6 py-3 text-center">
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={addLikertQuestion}
                className="w-full text-sm"
              >
                Add Question
              </Button>
            </td>
            <td colSpan={question.likertAnswerResponseList.length + 1}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};


