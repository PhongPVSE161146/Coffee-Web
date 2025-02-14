import React, { useState } from 'react';
import { Input, Button, Checkbox, message } from 'antd';
import { UploadOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { apiService } from '../../AddnewTemplate/ApiCreate/apiService'; // Import API service

const FileUploadQuestion = ({ id, onRemove }) => {
  const [isRequired, setIsRequired] = useState(false); // Trạng thái "Required"
  const [question, setQuestion] = useState(''); // Nội dung câu hỏi
  const [uploadedFile, setUploadedFile] = useState(null); // Tệp được tải lên

  // Xử lý khi nội dung câu hỏi thay đổi
  const handleQuestionChange = (e) => setQuestion(e.target.value);

  // Xử lý khi trạng thái "Required" thay đổi
  const handleRequiredChange = (e) => setIsRequired(e.target.checked);

  // Xử lý khi người dùng click vào khu vực tải tệp
  const handleFileClick = () => {
    document.getElementById(`fileInput-${id}`).click(); // Gọi click trực tiếp vào input file
  };

  // Xử lý khi tệp được chọn
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file); // Lưu tệp đã chọn
    }
  };

  // Xử lý khi tệp bị xóa
  const handleRemoveFile = () => setUploadedFile(null);

  // Gọi API để lưu câu hỏi và tệp
  const handleSaveQuestion = async () => {
    if (!question.trim()) {
      message.error('Question content is required!');
      return;
    }
    if (!uploadedFile) {
      message.error('File upload is required!');
      return;
    }

    const formData = new FormData();
    formData.append('content', question);
    formData.append('isRequired', isRequired);
    formData.append('feedbackQuestionType', 'FILE_UPLOAD');
    formData.append('file', uploadedFile);

    try {
      await apiService.uploadFileQuestion(formData); // Giả sử đây là API upload file question
      message.success('Question saved successfully!');
    } catch (error) {
      //console.error('Error saving question:', error);
      message.error('Failed to save question. Please try again.');
    }
  };

  return (
    <div className="file-upload-question-container">
      <div className="modal-top-border" />
      <div className="modal-content" style={{ paddingTop: 20 }}>
        <div className="question-container">
          <span className="question-number">{id}.</span>
          <Input
            placeholder="Enter your file upload question here"
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

        <div className="upload-container">
          {!uploadedFile ? (
            <div className="upload-box" onClick={handleFileClick}>
              <UploadOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
              Drop your file or click to browse files
            </div>
          ) : (
            <div className="file-preview">
              <span>{uploadedFile.name}</span>
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={handleRemoveFile}
                className="remove-file-button"
              >
                Remove
              </Button>
            </div>
          )}
          {/* Hidden file input to trigger when clicking on the upload box */}
          <input
            type="file"
            id={`fileInput-${id}`}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        <div className="feedback-form__button-container">
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

export default FileUploadQuestion;
