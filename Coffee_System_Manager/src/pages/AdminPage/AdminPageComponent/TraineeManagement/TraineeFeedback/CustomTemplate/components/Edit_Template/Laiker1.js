import React, { useState } from "react";
import { Button, Input, Radio, Typography } from "antd";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const Likert = ({
  question,
  sectionIndex,
  questionIndex,
  handleLikertInputChange,
  handleRemoveLikertOption,
  handleAddLikertOption,
}) => {
  // State to manage the selected answers for each question
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const addLikertQuestion = () =>
    handleAddLikertOption(sectionIndex, questionIndex, "likertQuestionResponseList");

  const addLikertAnswer = () =>
    handleAddLikertOption(sectionIndex, questionIndex, "likertAnswerResponseList");

  // Function to handle answer selection
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
            {(question.likertAnswerResponseList ?? []).map((likertAnswer, index) => (
              <th
                key={likertAnswer.id}
                className="border border-gray-300 px-6 py-3 text-center text-sm font-medium"
                style={{ whiteSpace: 'nowrap', paddingRight: '8px', paddingLeft: '8px' }} // Optional padding tweak
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
                  style={{
                    width: '30%',  // Reduce width to make the input smaller
                    minWidth: '120px',  // Set minimum width to keep consistency
                    textAlign: 'center',  // Centers the text inside the input
                    fontWeight: 'normal',  // Normal weight, for a more natural feel
                    fontSize: '14px',  // Make font size smaller
                    fontStyle: 'normal',  // Regular style for a clean look
                    fontFamily: 'Arial, sans-serif',  // A clean and modern sans-serif font
                    fontWeight: "bold",

                  }}


                />



                <Button
                  type="text"
                  icon={<CloseCircleOutlined style={{ fontSize: '20px', color: '#FF4D4F' }} />}
                  onClick={() =>
                    handleRemoveLikertOption(
                      sectionIndex,
                      questionIndex,
                      "likertAnswerResponseList",
                      index
                    )
                  }
                  className="hover:bg-red-100 rounded-full p-1"
                  style={{ borderRadius: '50%' }}
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
          {(question.likertQuestionResponseList ?? []).map((likertQuestion, index) => (
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
                  style={{
                    width: '100%',  // Ensures it fills the width of the container
                    minWidth: '200px',  // Minimum width for consistency
                    fontSize: '14px',  // Smaller font size for a cleaner look
                    fontWeight: 'normal',  // Normal weight for readability
                    textAlign: 'left',  // Align text to the left for natural reading
                    padding: '8px',  // Adds padding to make the input feel spacious
                    borderRadius: '4px',  // Slightly rounded corners for a soft look
                    border: '1px solid #ccc',  // Light border for separation
                    backgroundColor: '#f9f9f9',  // Light background color for better contrast
                    boxSizing: 'border-box',  // Ensures padding doesn't affect the width
                  }}
                />

                <Button
                  type="text"
                  icon={<CloseCircleOutlined style={{ fontSize: '18px', color: '#FF4D4F' }} />}
                  onClick={() =>
                    handleRemoveLikertOption(
                      sectionIndex,
                      questionIndex,
                      "likertQuestionResponseList",
                      index
                    )
                  }
                  className="hover:bg-red-100 rounded-full p-1"
                  style={{ borderRadius: '50%' }}
                />
              </td>
              {(question.likertAnswerResponseList ?? []).map((likertAnswer) => (
                <td
                  key={`${likertQuestion.id}-${likertAnswer.id}`}
                  className="border border-gray-300 text-center px-4 py-2"
                >
                  <Radio.Group
                    value={selectedAnswers[likertQuestion.id]}
                    onChange={(e) =>
                      handleRadioChange(likertQuestion.id, e.target.value)
                    }
                  >
                    <Radio value={likertAnswer.content}></Radio>
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
            <td colSpan={(question.likertAnswerResponseList ?? []).length + 1}></td>
          </tr>
        </tbody>
      </table>
    </div>

  );
};

export default Likert;
