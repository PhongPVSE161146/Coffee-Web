import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography, Button, Form, Input, message, Tooltip, Spin, Alert, Modal } from 'antd';
import { PlusCircleOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TraineeInformation, FileUploadQuestion, RatingQuestion, DateQuestion, MultipleChoice, Sorting, NPSQuestion, TextQuestion, LikertQuestion } from './QuestionType';
import TextArea from 'antd/es/input/TextArea';
import { addNewTemplate } from './addNewTemplate';
import { useNavigate } from 'react-router-dom';
import "./AddTemplate.css"
import {
    Row, Col,


    Space,




} from 'antd';

const { Text } = Typography;

const AddTemplate = () => {
    const [sections, setSections] = useState([{ id: '1', questions: [] }]);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const token = localStorage.getItem("token");
    const [titleStatus, setTitleStatus] = useState('');
    const [descriptionStatus, setDescriptionStatus] = useState('')
    const [titleHelp, setTitleHelp] = useState('');
    const [descriptionHelp, setDescriptionHelp] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showBackDialog, setShowBackDialog] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        handleSubmitTemplate(); // only submit when OK is pressed
        navigate("/DeliveryManagerPage/traineeManagement/classTemplate")
    };
    const handleBackClick = () => setShowBackDialog(true);
    const handleCloseBackDialog = () => setShowBackDialog(false);
    const handleConfirmBack = () => {
        //console.log('Back confirmed');
        setShowBackDialog(false);

        navigate('/DeliveryManagerPage/traineeManagement/classTemplate');
    };


    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const toggleOptions = () => {
        setIsOptionsVisible(!isOptionsVisible);
    };

    const handleQuestionChange = (questionId, value) => {
        setSections(prevSections => {
            return prevSections.map(section => ({
                ...section,
                questions: section.questions.map(question => {
                    if (question.id === questionId) {
                        return { ...question, question: value }; // Update the question text
                    }
                    return question;
                })
            }));
        });
    };

    const handleOptionChange = (questionId, optionIndex, value) => {
        setSections(prevSections => {
            return prevSections.map(section => ({
                ...section,
                questions: section.questions.map(question => {
                    if (question.id === questionId && question.type === 'Multiple Choice') {
                        const updatedOptions = question.options.map((option, index) =>
                            index === optionIndex ? { option: value } : option
                        );
                        return { ...question, options: updatedOptions };
                    }
                    return question;
                })
            }));
        });
    };

    const addOption = (questionId) => {
        setSections(prevSections => {
            return prevSections.map(section => ({
                ...section,
                questions: section.questions.map(question => {
                    if (question.id === questionId && question.type === 'Multiple Choice') {
                        const newOption = { option: '' };
                        return { ...question, options: [...question.options, newOption] };
                    }
                    return question;
                })
            }));
        });
    };

    const removeOption = (questionId, optionIndex) => {
        setSections(prevSections => {
            return prevSections.map(section => ({
                ...section,
                questions: section.questions.map(question => {
                    if (question.id === questionId && question.type === 'Multiple Choice') {
                        const updatedOptions = question.options.filter((_, idx) => idx !== optionIndex);
                        return { ...question, options: updatedOptions };
                    }
                    return question;
                })
            }));
        });
    };

    const addNewSection = (type) => {
        const newSection = {
            id: Date.now(),
            questions: [{
                type,
                id: Date.now(),
                options: [{ option: '' }] // Initialize with one empty option
            }]
        };
        setSections([...sections.slice(0, -1), newSection, { id: Date.now() + 1, questions: [] }]);
        setIsOptionsVisible(false);
        //console.log(sections)
    };

    const removeSection = (id) => {
        if (sections.length > 1 && id !== sections[sections.length - 1].id) {
            setSections(sections.filter((section) => section.id !== id));
        }
    };

    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination || source.index === sections.length - 1 || destination.index === sections.length - 1) {
            return;
        }

        const reorderedSections = Array.from(sections);
        const [movedSection] = reorderedSections.splice(source.index, 1);
        reorderedSections.splice(destination.index, 0, movedSection);

        setSections(reorderedSections);
    };

    const renderQuestionComponent = (question) => {
        switch (question.type) {
            case 'Trainee Information':
                return <TraineeInformation />;
            case 'Multiple Choice':
                return <MultipleChoice
                    question={question.question}
                    handleQuestionChange={handleQuestionChange}
                    questionId={question.id}
                    options={question.options}
                    handleOptionChange={handleOptionChange}
                    addOption={addOption}
                    removeOption={removeOption}
                />;
            case 'File Upload':
                return <FileUploadQuestion
                    questionId={question.id}
                    question={question.question}
                    handleQuestionChange={handleQuestionChange}
                />;
            case 'Rating':
                return <RatingQuestion
                    questionId={question.id}
                    question={question.question}
                    handleQuestionChange={handleQuestionChange}
                />;
            case 'Date':
                return <DateQuestion
                    questionId={question.id}
                    question={question.question}
                    handleQuestionChange={handleQuestionChange}
                />;
            case 'Net Promoter Score':
                return <NPSQuestion
                    questionId={question.id}
                    question={question.question}
                    handleQuestionChange={handleQuestionChange}
                />;
            case 'Sorting':
                return <Sorting
                    questionId={question.id}
                    question={question.question}
                    handleQuestionChange={handleQuestionChange}
                />;
            case 'Text':
                return <TextQuestion
                    questionId={question.id}
                    question={question.question}
                    handleQuestionChange={handleQuestionChange}
                />;
            case 'Likert':
                return <LikertQuestion
                    question={question.question}
                    handleQuestionChange={handleQuestionChange}
                    questionId={question.id}
                    options={question.options}
                    handleOptionChange={handleOptionChange}
                    addOption={addOption}
                    removeOption={removeOption}
                />;
            default:
                return <Text>No Component Found</Text>;
        }
    };


    const handleSubmitTemplate = async () => {
        let hasErrors = false;
        setLoading(true);

        if (title.trim()) {
            setTitleStatus('');
            setTitleHelp('');
        }
        if (description.trim()) {
            setDescriptionStatus('');
            setDescriptionHelp('');
        }
        if (!title.trim() && !description.trim()) {
            setTitleStatus('error');
            setTitleHelp('Title cannot be empty');
            setDescriptionStatus('error');
            setDescriptionHelp('Description cannot be empty');
            message.error('Title and Description cannot be empty');
            setLoading(false);
            return;
        }
        if (!title.trim()) {
            setTitleStatus('error');
            setTitleHelp('Title cannot be empty');
            message.error('Title cannot be empty');
            setLoading(false);
            return;
        }

        if (!description.trim()) {
            setDescriptionStatus('error');
            setDescriptionHelp('Description cannot be empty');
            message.error('Description cannot be empty');
            setLoading(false);
            return;
        }

        // Validate Sections
        if (sections.length <= 1) {
            message.error('Please Add Some Question');
            setLoading(false);
            return;
        }

        // Check if any question or option in MultipleChoice is empty
        const sectionsToSubmit = sections.slice(0, -1);  // excluding the last section
        sectionsToSubmit.forEach((section) => {
            section.questions.forEach((question) => {
                // Check if the question is empty
                if (!question.question) {
                    hasErrors = true;
                    message.error('Question cannot be empty');
                    setLoading(false);
                }

                if (question.type === 'Multiple Choice') {
                    // Check if any option is empty
                    question.options.forEach((option, index) => {
                        if (!option.option.trim()) {
                            hasErrors = true;
                            message.error(`Option ${index + 1} cannot be empty`);
                            setLoading(false);
                        }

                    });
                }
            });
        });

        // If there are any errors, stop submission
        if (hasErrors) {
            return;
        }
        const payload = {
            title,
            description,
            sessions: sectionsToSubmit.map((section) => ({
                name: `Trainee Information`,
                description: `In order to support you timely during the course, we would like to receive your feedback!`,
                questions: section.questions.map((question) => {
                    let questionPayload = {
                        isRequired: true,
                        feedbackQuestionType: question.type.toUpperCase().replace(/\s+/g, "_"),
                        content: question.question || `Question content for ${question.type}`,
                        maxRating: (question.type === 'Rating' || question.type === 'Net Promoter Score') ? 5 : undefined,
                        multipleChoiceOptionList: question.type === 'Multiple Choice' ? question.options : [],
                        likertQuestionList: question.type === 'Likert' ? question.likertQuestions : [],
                        likertAnswerList: question.type === 'Likert' ? question.likertAnswers : []
                    };
                    return questionPayload;
                })
            }))
        };

        try {
            const response = await addNewTemplate(payload, token);

            //console.log('Template created successfully:', response.data);
            //console.log('Payload:', JSON.stringify(payload, null, 2));
            message.success('Add Template Successfully')
            setLoading(false);
            setIsDisabled(true);
        } catch (error) {
            setLoading(false);
            //console.error('Error creating template:', error);
        }

    };
    return (

        <div className="p-4 relative">

            {loading && (
                <div className="fixed inset-0 z-50 bg-gray-200 bg-opacity-75 flex justify-center items-center">
                    <Spin size="large" tip="Loading..." />
                </div>
            )}
            <div className="min-h-screen flex justify-center p-6">
                {isDisabled && (
                    <div className="absolute inset-0 z-50 bg-gray-200 bg-opacity-75 flex justify-center items-center">
                        <Alert
                            message="Add Template Successfully"
                            description="The template was added successfully. 
                                     If you want to make any changes, you can edit it from your class template."
                            type="success"
                            showIcon
                        />
                    </div>
                )}
                <div className="feedback-form" style={{ paddingTop: 30 }}>
                    <Card className="bg-gray-200">
                        <div className="feedback-form__header-container" style={{ marginBottom: 40 }}>
                            <div className="feedback-form__header-bar" />

                            {/* Title input with Tooltip and validation */}
                            <Form.Item
                                validateStatus={titleStatus}
                                help={titleHelp}
                            >
                                {titleStatus === 'error' ? (
                                    <Tooltip title={titleHelp}>
                                        <Input
                                            status={titleStatus}
                                            placeholder="Title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="text-center mb-2 text-xl mt-4"
                                            style={{ paddingTop: 20 }}
                                        />
                                    </Tooltip>
                                ) : (
                                    <Input
                                        status={titleStatus}
                                        placeholder="Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="text-center mb-2 text-xl mt-4"
                                        style={{ marginTop: 20, padding: 10 }}
                                    />
                                )}
                            </Form.Item>

                            {/* Description input with Tooltip and validation */}
                            <Form.Item
                                validateStatus={descriptionStatus}
                                help={descriptionHelp}
                            >
                                {descriptionStatus === 'error' ? (
                                    <Tooltip title={descriptionHelp}>
                                        <TextArea
                                            status={descriptionStatus}
                                            help={descriptionHelp}
                                            placeholder="Description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            autoSize={{ minRows: 6 }}
                                            className="block mb-4 leading-relaxed"
                                        />
                                    </Tooltip>
                                ) : (
                                    <TextArea
                                        status={descriptionStatus}
                                        help={descriptionHelp}
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        autoSize={{ minRows: 6 }}
                                        className="block mb-4 leading-relaxed"
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </Card>
                    <br />

                    <div className="feedback-form__section" style={{ margin: 20 }}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="sections">

                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {sections.map((section, index) => (
                                            <Draggable key={section.id} draggableId={String(section.id)} index={index}>

                                                {(provided) => (

                                                    <Card
                                                        className="shadow-lg relative mb-4"
                                                        title={`Section ${index + 1}`}
                                                        extra={index !== sections.length - 1 && (
                                                            <CloseOutlined
                                                                onClick={() => removeSection(section.id)}
                                                                style={{ fontSize: '16px', color: 'red', cursor: 'pointer' }}
                                                            />
                                                        )}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        {section.questions.map((question) => (
                                                            <div key={question.id} className="mb-2">
                                                                {renderQuestionComponent(question)}
                                                            </div>
                                                        ))}

                                                        {index === sections.length - 1 && (
                                                            <Form layout="vertical">
                                                                <Form.Item>

                                                                    {!isOptionsVisible && (

                                                                        <Button
                                                                            icon={<PlusCircleOutlined />}
                                                                            onClick={toggleOptions}
                                                                            className="add-question-button"

                                                                        >
                                                                            Add new question
                                                                        </Button>

                                                                    )}
                                                                    {isOptionsVisible && (
                                                                        <>
                                                                            <Button
                                                                                className="cancel-button"
                                                                                type="text"
                                                                                onClick={toggleOptions}
                                                                                icon={<CloseCircleOutlined />}
                                                                            >
                                                                                Cancel

                                                                            </Button>
                                                                            <div className="p-4 border border-gray-300 rounded-md bg-white shadow mt-4">
                                                                                <div className="outer-container">
                                                                                    <Row gutter={[16, 16]} className="button-grid">
                                                                                        {["Multiple Choice", "Text", "Net Promoter Score", "Rating", "Date", "Sorting", "File Upload", "Likert"].map(
                                                                                            (type, index) => (
                                                                                                <Col span={8} key={index}>
                                                                                                    <Button
                                                                                                        className="button-options-addtemplates-btn option-button"
                                                                                                        onClick={() => addNewSection(type)}
                                                                                                    >
                                                                                                        {type}
                                                                                                    </Button>
                                                                                                </Col>
                                                                                            )
                                                                                        )}
                                                                                    </Row>
                                                                                </div>
                                                                            </div>

                                                                        </>
                                                                    )}
                                                                </Form.Item>
                                                            </Form>
                                                        )}
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                        </DragDropContext>
                    </div>
                </div>

                {/* footer */}
                <div className="fixed-footer">
                    <div className="footer-content">

                        <div className="feedback-back-template">
                            <Button onClick={handleBackClick} className="feed-blaback-button-template">
                                Back to Class Template
                            </Button>
                        </div>

                        <Button type="primary"
                            className="feed-blaback-save-button"
                            style={{ paddingLeft: 30 }}
                            onClick={showModal}
                            icon={loading ? <Spin /> : undefined}
                            disabled={loading || isDisabled}
                        >
                            {loading ? 'Saving...' : isDisabled ? 'Save Successfully' : 'Save'}
                        </Button>
                    </div>
                </div>


                <Modal
                    title={<div className="back-modal-title" style={{ marginRight: 250, color: 'white', fontSize: 17 }}>Back to Class Template</div>}
                    open={showBackDialog}
                    onCancel={handleCloseBackDialog}
                    footer={[
                        <Button key="cancel" onClick={handleCloseBackDialog} className="back-modal-cancel-button">
                            Cancel
                        </Button>,
                        <Button key="confirm" type="primary" onClick={handleConfirmBack} className="back-modal-confirm-button">
                            Yes
                        </Button>,
                    ]}
                    className="back-modal custom-modal"
                    closeIcon={<CloseOutlined className="modal-close-icon" />}
                    centered
                    style={{ bottom: '50%' }} // Ensures vertical centering
                >
                    <Text className="back-modal-text">There are unsaved changes. Are you sure you want to go back to the Class Template?</Text>
                </Modal>
                <Modal
                    title={<div className="save-modal-title" style={{ marginRight: 300, color: 'white', fontSize: 17 }}>Custom Template</div>}
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Confirm"
                    cancelText="Cancel"
                    footer={[
                        <Button key="cancel" onClick={handleCancel} className="save-modal-cancel-button">
                            Cancel
                        </Button>,
                        <Button key="confirm" type="primary" onClick={handleOk} className="save-modal-confirm-button">
                            Save
                        </Button>,
                    ]}
                    className="save-modal custom-modal"
                    closeIcon={<CloseOutlined className="modal-close-icon" />}
                    centered
                    style={{ bottom: '50%' }}
                >
                    <Text className="save-modal-text">Are you sure you want to save?</Text>
                </Modal>

            </div>
        </div>

    );

};

export default AddTemplate;
