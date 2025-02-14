import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  notification,
  Spin,
  Collapse,
  Input,
  Select,
  Modal,
  Radio,
  Row,
  Col,
  message,
  Upload,
  Space
} from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate
import {
  CloseCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  CloseOutlined
} from "@ant-design/icons"; // Import Delete icon
import {
  getTemplateById,
  updateTemplateById,
} from "./Q1";
import Likert from "./Laiker1";
import { AddCircleOutline } from "@mui/icons-material";
import "./FeedbackFormTemplate.css"
import { showInfoNotification } from "../../../../../../../../components/Notifications/Notifications";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const EditTemplate = ({ isEditMode }) => {
  const [sections, setSections] = useState([]);
  const [template, setTemplate] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState("TEXT");
  const [sectionIndexToAdd, setSectionIndexToAdd] = useState(null); // Track section index
  const navigate = useNavigate(); // Use navigate
  const { templateId } = useParams();
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratings, setRatings] = useState({});
  const role = sessionStorage.getItem("selectedRole");
  const [isTitleEditMode, setIsTitleEditMode] = useState(false);
  const [isDescriptionEditMode, setIsDescriptionEditMode] = useState(false);
  const [sectionIndexToEdit, setSectionIndexToEdit] = useState(null);
  const [sectionNameEditMode, setSectionNameEditMode] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getTemplateById(templateId);
      if (response.success) {
        setTemplate({
          title: response.data?.title || "Template Title",
          description: response.data?.description || "Template Description",
          isCloned: response.data?.isCloned, // Include isCloned from API
          isDeleted: response.data?.isDeleted, // Include isDeleted from API
          isSend: response.data?.isSend,
        });
        setSections(
          (response.data?.feedbackTemplateSectionResponseList || []).map(section => ({
            ...section,
            feedbackTemplateQuestionResponseList: section.feedbackTemplateQuestionResponseList || [] // Initialize as empty array if undefined
          })) || [] // Ensures sections is an array
        );
      } else {
        throw new Error(response.message || "Failed to fetch template data");
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch template data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validateTemplate()) return;

    Modal.confirm({
      title: "Confirm Save",
      content: "Are you sure you want to save?",
      okText: "Save",
      cancelText: "Cancel",
      onOk: async () => {
        const username = sessionStorage.getItem("username");
        const updatedTemplate = {
          ...template,
          lastModifiedDate: new Date().toISOString(),
          feedbackTemplateSectionResponseList: sections,
          createdBy: username,
        };


        try {
          const response = await updateTemplateById(templateId, updatedTemplate);

          if (response && response.success) {
            notification.success({
              message: "Template saved successfully!",
              description: response.message || "Your changes have been saved.",
            });

            // Navigate back to ClassTemplate
            if (role === "admin") {
              navigate("/adminPage/traineeManagement/customTemplate", { state: { refresh: true } });
            } else if (role === "deliverymanager") {
              navigate("/DeliveryManagerPage/traineeManagement/classTemplate", { state: { refresh: true } });
            }
          } else {
            throw new Error(response?.message || "Failed to save template");
          }
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || error.message || "An unknown error occurred.";
          notification.error({
            message: "Error",
            description: `Failed to save template: ${errorMessage}`,
          });
        }
      },
      onCancel: () => {
        showInfoNotification("Save canceled");
      },
    });
  };



  const handleBack = () => {
    Modal.confirm({
      title: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>BACK TO CLASS TEMPLATE</span>
          <span
            style={{
              cursor: "pointer",
              fontSize: "20px",
              fontWeight: "bold",
              padding: "0 8px",
            }}
            onClick={() => Modal.destroyAll()}
          >
            ×
          </span>
        </div>
      ),
      content:
        "There are unsaved changes. Are you sure you want to go back to Class Template?",
      okText: "Yes",
      cancelText: "Cancel",
      onOk: () => {
        if (role === 'admin') navigate('/adminPage/traineeManagement/customTemplate');
        if (role === 'deliverymanager') navigate('/DeliveryManagerPage/traineeManagement/classTemplate');


      },
      okButtonProps: {
        style: { backgroundColor: "red", color: "white" },
      },
      cancelButtonProps: {
        style: { color: "red" },
      },
      icon: <ExclamationCircleOutlined />,
    });
  };
  const validateTemplate = () => {
    for (const section of sections) {
      // Check if section.name is defined and not empty
      if (!section.name || !section.name.trim()) {
        notification.error({
          message: "Section name cannot be empty",
        });
        return false;
      }
  
      // Ensure feedbackTemplateQuestionResponseList is iterable
      const questions = Array.isArray(section.feedbackTemplateQuestionResponseList)
        ? section.feedbackTemplateQuestionResponseList
        : [];
  
      for (const question of questions) {
        // Check if question.content is defined and not empty
        if (!question.content || !question.content.trim()) {
          notification.error({
            message: `Question in section "${section.name}" cannot be empty.`,
          });
          return false;
        }
  
        if (
          question.feedbackQuestionType === "MULTIPLE_CHOICE" &&
          Array.isArray(question.multipleChoiceOptionResponseList) &&
          question.multipleChoiceOptionResponseList.some(
            (option) => !option.option || !option.option.trim() // Ensure option is not undefined and is trimmed
          )
        ) {
          notification.error({
            message: `Options in question "${question.content}" cannot be empty.`,
          });
          return false;
        }
      }
    }
    return true;
  };
  

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const reorderedSections = Array.from(sections);
    const [movedSection] = reorderedSections.splice(source.index, 1);
    reorderedSections.splice(destination.index, 0, movedSection);
    setSections(reorderedSections);
  };

  const handleAddQuestion = () => {
    if (sectionIndexToAdd === null || !sections[sectionIndexToAdd]) {
      notification.error({ message: "Invalid section" });
      return;
    }
    const newQuestion = {
      id: Math.floor(Math.random() * 1000000),
      content: "",
      feedbackQuestionType: selectedQuestionType,
      isRequired: false,
      multipleChoiceOptionResponseList:
        selectedQuestionType === "MULTIPLE_CHOICE" ? [] : null,
      likertQuestionResponseList: selectedQuestionType === "LIKERT" ? [] : null,
      likertAnswerResponseList: selectedQuestionType === "LIKERT" ? [] : null,
    };

    const updatedSections = [...sections];
    const section = updatedSections[sectionIndexToAdd];
    if (!section.feedbackTemplateQuestionResponseList) {
      section.feedbackTemplateQuestionResponseList = [];
    }

    section.feedbackTemplateQuestionResponseList.push(newQuestion);
    setSections(updatedSections);
    setIsModalVisible(false); // Close the modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal without saving
  };

  const handleInputChange = (sectionIndex, questionIndex, key, value) => {
    const updatedSections = [...sections];
    const question =
      updatedSections[sectionIndex].feedbackTemplateQuestionResponseList[
      questionIndex
      ];

    // Update question value
    question[key] = value;

    // Ensure multipleChoiceOptionResponseList is an array when switching to "MULTIPLE_CHOICE"
    if (
      question.feedbackQuestionType === "MULTIPLE_CHOICE" &&
      !Array.isArray(question.multipleChoiceOptionResponseList)
    ) {
      question.multipleChoiceOptionResponseList = [];
    }

    // Default rating scale with stars (empty and filled stars)
    if (question.feedbackQuestionType === "RATING" && !question.ratingOptions) {
      question.ratingOptions = ["☆", "☆", "☆", "☆", "☆"]; // Empty stars for default state
    }

    setSections(updatedSections);
  };

  const handleAddOption = (sectionIndex, questionIndex) => {
    const updatedSections = [...sections];
    const question =
      updatedSections[sectionIndex].feedbackTemplateQuestionResponseList[
      questionIndex
      ];

    // Ensure that multipleChoiceOptionResponseList exists and is an array
    if (!Array.isArray(question.multipleChoiceOptionResponseList)) {
      question.multipleChoiceOptionResponseList = [];
    }
    const newOption = {
      id: Math.floor(Math.random() * 1000000),
      option: "",
      isDeleted: false,
      feedbackTemplateQuestionId: question.id,
    };

    question.multipleChoiceOptionResponseList.push(newOption);
    setSections(updatedSections);
  };

  const handleRemoveOption = (sectionIndex, questionIndex, optionIndex) => {
    const updatedSections = [...sections];
    const question =
      updatedSections[sectionIndex].feedbackTemplateQuestionResponseList[
      questionIndex
      ];

    if (question && Array.isArray(question.multipleChoiceOptionResponseList)) {
      question.multipleChoiceOptionResponseList.splice(optionIndex, 1);
    }

    setSections(updatedSections);
  };
  const handleAddQuestionModal = (sectionIndex) => {
    setSectionIndexToAdd(sectionIndex);
    setIsModalVisible(true);
  };
  const handleOptionChange = (
    sectionIndex,
    questionIndex,
    optionIndex,
    value
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].feedbackTemplateQuestionResponseList[
      questionIndex
    ].multipleChoiceOptionResponseList[optionIndex].option = value;
    setSections(updatedSections);
  };

  // New method to handle question deletion
  const handleDeleteQuestion = (sectionIndex, questionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].feedbackTemplateQuestionResponseList.splice(
      questionIndex,
      1
    ); // Remove question
    setSections(updatedSections);
  };

  // Handle input changes for Likert questions and answers
  const handleLikertInputChange = (
    sectionIndex,
    questionIndex,
    listType,
    itemIndex,
    value
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].feedbackTemplateQuestionResponseList[
      questionIndex
    ][listType][itemIndex].content = value;
    setSections(updatedSections);
  };

  const handleAddLikertOption = (sectionIndex, questionIndex, listType) => {
    const newOption = {
      id: Math.floor(Math.random() * 1000000),
      content: "",
      isDeleted: false,
      feedbackTemplateQuestionId:
        sections[sectionIndex].feedbackTemplateQuestionResponseList[
          questionIndex
        ].id,
    };
    const updatedSections = [...sections];
    updatedSections[sectionIndex].feedbackTemplateQuestionResponseList[
      questionIndex
    ][listType].push(newOption);
    setSections(updatedSections);
  };

  const handleRemoveLikertOption = (
    sectionIndex,
    questionIndex,
    listType,
    itemIndex
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].feedbackTemplateQuestionResponseList[
      questionIndex
    ][listType].splice(itemIndex, 1);
    setSections(updatedSections);
  };

  const handleDoubleClickTitle = () => {
    setIsTitleEditMode(true);
  };

  const handleDoubleClickDescription = () => {
    setIsDescriptionEditMode(true);
  };

  const handleDoubleClickSectionName = (index) => {
    setSectionIndexToEdit(index);
    setSectionNameEditMode((prev) => ({ ...prev, [index]: true }));
  };

  const handleTitleChange = (e) => {
    setTemplate({ ...template, title: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setTemplate({ ...template, description: e.target.value });
  };

  const handleSectionNameChange = (index, value) => {
    const updatedSections = [...sections];
    updatedSections[index].name = value;
    setSections(updatedSections);
  };

  const handleBlurTitle = () => {
    setIsTitleEditMode(false);
  };

  const handleBlurDescription = () => {
    setIsDescriptionEditMode(false);
  };

  const handleBlurSectionName = (index) => {
    setSectionNameEditMode((prev) => ({ ...prev, [index]: false }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  const handleRating = (rating, questionIndex) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [questionIndex]: rating, // Cập nhật rating cho câu hỏi tương ứng
    }));
  };
  return (
    <div className="feedback-form" style={{ paddingTop: 90 }}>
      <div>
        <div
          className="feedback-form__header-container">

          <Card className="shadow-xl rounded-lg p-6">
            <div className="feedback-form__header-bar" />
            {isTitleEditMode ? (
              <Input
                className="input-title-template-edit"
                value={template.title}
                onChange={handleTitleChange}
                onBlur={handleBlurTitle}
                onPressEnter={handleBlurTitle} // Allow pressing Enter to save
              />
            ) : (
              <h2
                onDoubleClick={handleDoubleClickTitle}
                className="input-title-template"
              >
                {template.title}
              </h2>
            )}

            {isDescriptionEditMode ? (
              <Input.TextArea
                className="input-description-template-edit"
                value={template.description}
                onChange={handleDescriptionChange}
                onBlur={handleBlurDescription}
                onPressEnter={handleBlurDescription} // Allow pressing Enter to save

              />
            ) : (
              <Text
                onDoubleClick={handleDoubleClickDescription}
                className="input-description-template"
              >
                {template.description}
              </Text>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {sections.map((section, sectionIndex) => (
                      <Draggable
                        key={section.id}
                        draggableId={String(section.id)}
                        index={sectionIndex}
                      >
                        {(provided) => (
                          <Card
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            style={{
                              marginBottom: "1.5rem",
                              borderRadius: "10px",
                            }}
                            className="shadow-lg hover:shadow-2xl transition-shadow"
                          >
                            {sectionNameEditMode[sectionIndex] ? (
                              <Input
                                className="input-section-template-edit"
                                value={section.name}
                                onChange={(e) =>
                                  handleSectionNameChange(sectionIndex, e.target.value)
                                }
                                onBlur={() => handleBlurSectionName(sectionIndex)}
                                onPressEnter={() => handleBlurSectionName(sectionIndex)} // Allow pressing Enter to save
                                placeholder="Section Name"
                              />
                            ) : (
                              <Title
                                level={4}
                                className="input-section-template"
                                onDoubleClick={() => handleDoubleClickSectionName(sectionIndex)}
                              >
                                {section.name || "Section Name"}
                              </Title>
                            )}
                            <Collapse className="border-t-2">
                              <Panel header="Questions" key={section.id}>
                                {section.feedbackTemplateQuestionResponseList?.map(
                                  (question, questionIndex) => (
                                    <div key={question.id} className="mb-6">
                                      <div className="flex items-center mb-2">
                                        <Text
                                          strong
                                          className="mr-2 text-gray-800 text-sm"
                                        >
                                          {questionIndex + 1}.{" "}
                                        </Text>
                                        <Text className="mr-2 text-sm" style={{ marginRight: '5px' }}>
                                          Type:
                                        </Text>
                                        <span className="mr-2 text-gray-600 text-sm">
                                          {question.feedbackQuestionType}
                                        </span>
                                        <Button
                                          type="text"
                                          icon={<DeleteOutlined />}
                                          onClick={() =>
                                            handleDeleteQuestion(
                                              sectionIndex,
                                              questionIndex
                                            )
                                          }
                                          className="text-red-500 hover:text-red-700"
                                        />
                                      </div>

                                      <Input
                                        value={question.content}
                                        placeholder="Enter question"
                                        onChange={(e) =>
                                          handleInputChange(
                                            sectionIndex,
                                            questionIndex,
                                            "content",
                                            e.target.value
                                          )
                                        }
                                        className="mb-4"
                                        style={{
                                          fontWeight: "bold",
                                          fontStyle: "italic",
                                        }}
                                      />

                                      <div className="ml-6">
                                        {question.feedbackQuestionType ===
                                          "TEXT" && (
                                            <div className="ml-4">
                                              <Input
                                                disabled
                                                value={question.content}
                                                placeholder="Your question here"
                                                className="mb-4" style={{margin:20, marginLeft:10}}
                                              />
                                            </div>
                                          )}

                                      {question.feedbackQuestionType ===
                                        "MULTIPLE_CHOICE" && (
                                        <div className="ml-4 space-y-4">
                                          {question.multipleChoiceOptionResponseList?.map(
                                            (option, optionIndex) => (
                                              <div
                                                key={option.id}
                                                className="flex items-center space-x-3" 
                                              >
                                                <Input
                                                  value={option.option}
                                                  onChange={(e) =>
                                                    handleOptionChange(
                                                      sectionIndex,
                                                      questionIndex,
                                                      optionIndex,
                                                      e.target.value
                                                    )
                                                  }
                                                  placeholder="Option"
                                                  className="w-full" style={{margin:20, marginLeft:10}}
                                                />
                                                <Button
                                                  type="text"
                                                  icon={<CloseCircleOutlined />}
                                                  onClick={() =>
                                                    handleRemoveOption(
                                                      sectionIndex,
                                                      questionIndex,
                                                      optionIndex
                                                    )
                                                  }
                                                  style={{width: '80px', color: 'red', margin: '10px', boxShadow: '0px 4px 4px 0px #00000040' }}
                                                >
                                                  Cancel
                                                </Button>
                                              </div>
                                            )
                                          )}
                                          <Button
                                            type="dashed"
                                            icon={<PlusOutlined />}
                                            onClick={() =>
                                              handleAddOption(
                                                sectionIndex,
                                                questionIndex
                                              )
                                            }
                                            className="w-full text-blue-500 hover:text-blue-700" style={{margin: '5px 0 5px 0'}}
                                          >
                                            Add Option
                                          </Button>
                                        </div>
                                      )}

                                      {question.feedbackQuestionType ===
                                        "RATING" && (
                                        <div className="ml-4">
                                          <Text
                                            strong
                                            className="text-gray-700"
                                          >
                                            Rating
                                          </Text>
                                          <div className="flex">
                                            {question.ratingOptions?.map(
                                              (ratingOption, index) => (
                                                <div
                                                  key={index}
                                                  className="mr-2 cursor-pointer"
                                                  onClick={() =>
                                                    handleRating(
                                                      index + 1,
                                                      questionIndex
                                                    )
                                                  }
                                                >
                                                  <span
                                                    className={`text-3xl ${
                                                      index <
                                                      (ratings[questionIndex] ||
                                                        0)
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                    }`}
                                                    role="button"
                                                    aria-label={`Rating ${
                                                      index + 1
                                                    }`}
                                                  >
                                                    {index <
                                                    (ratings[questionIndex] ||
                                                      0)
                                                      ? "⭐"
                                                      : "☆"}
                                                  </span>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {question.feedbackQuestionType ===
                                        "NET_PROMOTER_SCORE" && (
                                        <div className="ml-4" style={{margin:20, marginLeft:10}}>
                                          <Text
                                            strong
                                            className="text-gray-700 " 
                                          >
                                            Net Promoter Score®
                                          </Text>
                                          <div className="flex gap-2" >
                                            {[1, 2, 3, 4, 5].map((score) => (
                                              <Button
                                                key={score}
                                                type="primary"
                                                className="text-gray-800" style={{margin:10}}
                                              >
                                                {score}
                                              </Button>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                        {question.feedbackQuestionType ===
                                          "DATE" && (
                                            <div className="ml-4">
                                              <Text
                                                strong
                                                className="text-gray-700"
                                              >
                                                Date
                                              </Text>
                                              <Input
                                                type="date"
                                                value={question.content}
                                                onChange={(e) =>
                                                  handleInputChange(
                                                    sectionIndex,
                                                    questionIndex,
                                                    "content",
                                                    e.target.value
                                                  )
                                                }
                                                className="mb-4"
                                              />
                                            </div>
                                          )}

                                      {question.feedbackQuestionType ===
                                        "SORTING" && (
                                        <div className="ml-4" style={{margin:20, marginLeft:10}}>
                                          <Text
                                            strong
                                            className="text-gray-700"
                                          >
                                            Sorting
                                          </Text>
                                          <Text className="text-gray-600" style={{ marginLeft:10}}>
                                            Drag and drop the options to sort
                                            them
                                          </Text>
                                        </div>
                                      )}

                                        {question.feedbackQuestionType ===
                                          "FILE_UPLOAD" && (
                                            <div className="ml-4">
                                              <Text
                                                strong
                                                className="text-gray-700"
                                              >
                                                File Upload
                                              </Text>
                                              <div className="mt-2">
                                                <Upload
                                                  accept=".jpg,.jpeg,.png,.pdf,.docx"
                                                  showUploadList={false}
                                                  beforeUpload={(file) => {
                                                    if (
                                                      file.size / 1024 / 1024 >
                                                      5
                                                    ) {
                                                      message.error(
                                                        "File must be smaller than 5MB."
                                                      );
                                                      return false;
                                                    }
                                                    return true;
                                                  }}
                                                  onChange={(info) => {
                                                    if (info.fileList.length > 0) {
                                                      handleInputChange(
                                                        sectionIndex,
                                                        questionIndex,
                                                        "content",
                                                        info.fileList[0]
                                                          .originFileObj
                                                      );
                                                    }
                                                  }}
                                                >
                                                  <Button
                                                    icon={<UploadOutlined />}
                                                    type="dashed"
                                                    className="w-full text-blue-500 hover:text-blue-700"
                                                  >
                                                    Click or Drag file to upload
                                                  </Button>
                                                </Upload>
                                              </div>
                                              <Text className="text-sm text-gray-500">
                                                Supported formats: .jpg, .jpeg,
                                                .png, .pdf, .docx (max 5MB)
                                              </Text>
                                            </div>
                                          )}

                                        {question.feedbackQuestionType ===
                                          "LIKERT" && (
                                            <div className="overflow-x-auto max-w-full">
                                              <Likert
                                                question={question}
                                                sectionIndex={sectionIndex}
                                                questionIndex={questionIndex}
                                                handleLikertInputChange={
                                                  handleLikertInputChange
                                                }
                                                handleRemoveLikertOption={
                                                  handleRemoveLikertOption
                                                }
                                                handleAddLikertOption={
                                                  handleAddLikertOption
                                                }
                                              />
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  )
                                )}

                                <Button
                                  type="primary"
                                  icon={<AddCircleOutline />}
                                  onClick={() =>
                                    handleAddQuestionModal(sectionIndex)
                                  }
                                  className="mt-4 w-full" style={{ margin: '5px 0 5px 0', backgroundColor: '#ffff', color: '#1E2BB6F5', boxShadow: '0px 4px 4px 0px #00000040' }}
                                >
                                  Add New Question
                                </Button>
                              </Panel>
                            </Collapse>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  </div>
                )}
              </Droppable>
            </DragDropContext>


          </Card>

          <Modal
            title="Select Question Type"
            open={isModalVisible}
            onOk={handleAddQuestion}
            onCancel={handleCancel}
            className="rounded-lg"
          >
            <Row gutter={[16, 16]}>
              {[
                "TEXT",
                "RATING",
                "MULTIPLE_CHOICE",
                "NET_PROMOTER_SCORE",
                "DATE",
                "SORTING",
                "LIKERT",
              ].map((type) => (
                <Col span={8} key={type}>
                  <Button
                    block
                    onClick={() => setSelectedQuestionType(type)}
                    className={`${selectedQuestionType === type
                      ? "border-blue-500 text-blue-500"
                      : "border-gray-300"
                      } border-2 rounded-lg py-2`}
                  >
                    {type.replace("_", " ")}
                  </Button>
                </Col>
              ))}
            </Row>
          </Modal>
        </div>

      </div>

      <div className="fixed-footer">
        <div className="footer-content">
          <div className="feedback-back-template">
            <Button onClick={handleBack} className="feed-blaback-button-template">
              Back to Class Template
            </Button>
          </div>
          <div className="save-button-container">
            <Button type="primary" onClick={handleSave} className="feed-blaback-save-button">
              Save
            </Button>
          </div>
        </div>
      </div>


      {/* Save Confirmation Modal */}


    </div>
  );
};

export default EditTemplate;
