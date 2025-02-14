import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, ConfigProvider, notification } from 'antd';
import { PlusCircleOutlined, DeleteFilled, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import "./AddForm.css";
import { useNavigate } from 'react-router-dom';
import { fetchData, postData } from '../ApiService/apiService';
import { showErrorNotification, showInfoNotification } from '../../../../../components/Notifications/Notifications';

const { Option } = Select;

const AddForm = () => {
    const role = sessionStorage.getItem("selectedRole");
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [form] = Form.useForm();
    const [skills, setSkills] = useState([]);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const handleNavigateTotrainerManagement = () => {
        if (role === "admin")
            navigate("/adminPage/trainerList");
        if (role === "deliverymanager")
            navigate("/DeliveryManagerPage/trainerList");
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const response = await fetchData();
            setData(response.data || []);
        } catch (error) {
            //console.error("Error loading events:", error);
        }
    };

    const handleAddSkill = () => {
        const newSkill = {
            key: skills.length + 1,
            no: skills.length + 1,
            skill: '',
            level: 'STANDARD',
            note: '',
        };
        setSkills([...skills, newSkill]);
    };

    const handleDeleteSkill = (key) => {
        const updatedSkills = skills.filter(skill => skill.key !== key);
        setSkills(updatedSkills.map((skill, index) => ({ ...skill, no: index + 1 })));
        showInfoNotification('Delete skill successfully!')
    };

    const handleSkillChange = (key, field, value) => {
        const updatedSkills = skills.map(skill =>
            skill.key === key ? { ...skill, [field]: value } : skill
        );
        setSkills(updatedSkills);
    };

    const handleSaveData = async () => {
        try {
            // Validate tất cả các trường trong form
            const formData = await form.validateFields();

            const { account, name, email, phone, employeeId, nationalId } = formData;
            if (!account || !name || !email || !phone || !employeeId || !nationalId) {
                showErrorNotification(
                    'Please fill all required fields!'
                );
                return;
            }

            // Nếu tất cả hợp lệ, lưu dữ liệu
            const data = {
                account: formData.account || '',
                employeeId: formData.employeeId || '',
                nationalId: formData.nationalId || '',
                name: formData.name || '',
                email: formData.email || '',
                phone: formData.phone || '',
                type: formData.type || '',
                status: formData.status || '',
                site: formData.site || '',
                jobRank: formData.jobRank || '',
                trainerRank: formData.trainerRank || '',
                trainTheTrainerCert: formData.trainTheTrainerCert || '',
                professionalLevel: formData.professionalLevel || '',
                professionalIndex: parseInt(formData.professionalIndex, 10) || 0,
                note: formData.note || '',
                educatorContributionType: formData.educatorContributionType || '',
                trainingCompetencyIndex: parseInt(formData.trainingCompetencyIndex, 10) || 0,
                trainerSkills: skills.map(skill => ({
                    skillName: skill.skill || '',
                    level: skill.level || '',
                    note: skill.note || ''
                })),
            };

            try {
                await postData(data);
                form.resetFields();
                setSkills([]);
                if (role === "admin")
                    navigate("/adminPage/trainerList");
                if (role === "deliverymanager")
                    navigate("/DeliveryManagerPage/trainerList");

                showInfoNotification('Add trainer successfully!!!');
            } catch (error) {
                showInfoNotification(error.response.data.message);
                //console.error("Error saving general info:", error);
            }

            //console.log(data); // Xem dữ liệu đã lưu
        } catch (errorInfo) {
            //console.error('Validation Failed:', errorInfo);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setSkills([]);
        showInfoNotification('Cancel create info')
    };

    const skillsColumns = [
        {
            title: 'No.',
            render: (text, record, index) => index + 1,
            key: 'no',
            width: '5%',
        },
        {
            title: 'Skill',
            dataIndex: 'skill',
            key: 'skill',
            width: '20%',
            render: (_, record) => (
                <Select
                    style={{ width: '100%' }}
                    value={record.skill || undefined}
                    onChange={(value) => handleSkillChange(record.key, 'skill', value)}
                    placeholder='Select skill'
                >
                    {data
                        .filter((item) => !item.isDeleted)
                        .filter((item) => item.skillType === "PROFESSIONAL") // Chỉ lấy các skill chưa bị xóa
                        .filter((item) => !skills.some((skill) => skill.skill === item.skillName))
                        .map((item) => (
                            <Option key={item.id} value={item.skillName}>
                                {item.skillName}
                            </Option>
                        ))}
                </Select>
            ),
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            width: '20%',
            render: (_, record) => (
                <Select
                    style={{ width: '100%' }}
                    value={record.level || undefined}
                    onChange={(value) => handleSkillChange(record.key, 'level', value)}
                >
                    <Option value="STANDARD">STANDARD</Option>
                    <Option value="ADVANCED">ADVANCED</Option>
                    <Option value="EXPERT">EXPERT</Option>
                    <Option value="INTERMEDIATE">INTERMEDIATE</Option>
                    <Option value="LIMITED_EXPERIENCE">LIMITED_EXPERIENCE</Option>
                    <Option value="FUNDAMENTAL_AWARENESS">FUNDAMENTAL_AWARENESS</Option>
                </Select>
            ),
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
            width: '50%',
            render: (_, record) => (
                <Input
                    placeholder="Enter note"
                    value={record.note}
                    onChange={(e) => handleSkillChange(record.key, 'note', e.target.value)}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: '5%',
            align: 'center',
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteFilled />}
                    onClick={() => handleDeleteSkill(record.key)}
                />
            ),
        },
    ];
    return (
        <div className='add-trainer-content'>
            <div className="add-trainer-title">
                <h1 className="h1">Add Trainer Profile</h1>
            </div>
            <div className='form-content'>
                <div>
                    <div className="info-dropdown">
                        <div
                            className={`info-dropdown-header ${isOpen1 ? 'active' : ''}`}
                            onClick={() => setIsOpen1(!isOpen1)}
                        >
                            General Info
                            <span className="info-dropdown-arrow">
                                {isOpen1 ? <CaretUpOutlined style={{ color: "rgba(170, 170, 170, 1)" }} /> : <CaretDownOutlined style={{ color: "rgba(170, 170, 170, 1)" }} />}
                            </span>
                        </div>
                        {isOpen1 && (
                            <div className="add-dropdown-body">
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            marginXS: 0,
                                        },
                                        components: {
                                            Form: {
                                                itemMarginBottom: 0,
                                            },
                                        },
                                    }}
                                >
                                    <Form form={form}>
                                        <table className='info-table'>
                                            <thead>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className='form-tile'>Full Name</td>
                                                    <td><Form.Item
                                                        name="name"
                                                    >
                                                        <Input />
                                                    </Form.Item></td>
                                                    <td className='form-tile'>Account</td>
                                                    <td><Form.Item
                                                        name="account"
                                                    >
                                                        <Input />
                                                    </Form.Item></td>
                                                    <td className='form-tile'>Contact Email</td>
                                                    <td><Form.Item
                                                        name="email"
                                                    >
                                                        <Input />
                                                    </Form.Item></td>
                                                </tr>
                                                <tr>
                                                    <td className='form-tile'>Phone</td>
                                                    <td><Form.Item
                                                        name="phone"
                                                        rules={[
                                                            { required: true, message: 'Phone number is required' },
                                                            { pattern: /^(03|05|07|08|09)[0-9]{8}$/, message: 'Invalid Vietnamese phone number' }
                                                        ]}>
                                                        <Input placeholder="Enter phone number" />
                                                    </Form.Item></td>
                                                    <td className='form-tile'>Employee ID</td>
                                                    <td><Form.Item
                                                        name="employeeId"
                                                        rules={[{ required: true, message: 'Employee ID is required' }]}>
                                                        <Input />
                                                    </Form.Item></td>
                                                    <td className='form-tile'>National ID</td>
                                                    <td><Form.Item
                                                        name="nationalId"
                                                        rules={[
                                                            { required: true, message: 'National ID is required' },
                                                            { pattern: /^[0-9]{9}$|^[0-9]{12}$/, message: 'Invalid National ID (must be 9 or 12 digits)' }
                                                        ]}>
                                                        <Input />
                                                    </Form.Item></td>
                                                </tr>
                                                <tr>
                                                    <td className='form-tile'>Site</td>
                                                    <td><Form.Item
                                                        name="site"
                                                        rules={[{ required: true, message: 'Site is required' }]}>
                                                        <Input />
                                                    </Form.Item></td>
                                                    <td className='form-tile'>Trainer Type</td>
                                                    <td><Form.Item
                                                        name="type"
                                                        rules={[{ required: true, message: 'Trainer Type is required' }]}>
                                                        <Select>
                                                            <Option value="EXTERNAL">EXTERNAL</Option>
                                                            <Option value="INTERNAL">INTERNAL</Option>
                                                            <Option value="STAFF">STAFF</Option>
                                                        </Select>
                                                    </Form.Item></td>
                                                    <td className='form-tile'>Contribution Type</td>
                                                    <td><Form.Item
                                                        name="educatorContributionType"
                                                        rules={[{ required: true, message: 'Contribution Type is required' }]}>
                                                        <Select>
                                                            <Option value="TRAINER">TRAINER</Option>
                                                            <Option value="MENTOR">MENTOR</Option>
                                                            <Option value="AUDITOR">AUDITOR</Option>
                                                        </Select>
                                                    </Form.Item></td>
                                                </tr>
                                                <tr>
                                                    <td className='form-tile'>Trainer Rank</td>
                                                    <td><Form.Item
                                                        name="trainerRank"
                                                        rules={[{ required: true, message: 'Trainer Rank is required' }]}>
                                                        <Input />
                                                    </Form.Item></td>
                                                    <td className='form-tile'>Professional Level</td>
                                                    <td><Form.Item
                                                        name="professionalLevel"
                                                        rules={[{ required: true, message: 'Professional Level is required' }]}>
                                                        <Select>
                                                            <Option value="ADVANCE">ADVANCE</Option>
                                                            <Option value="EXPERT">EXPERT</Option>
                                                            <Option value="STANDARD">STANDARD</Option>
                                                        </Select>
                                                    </Form.Item></td>
                                                    <td className='form-tile'>Train The Trainer Certificate</td>
                                                    <td><Form.Item
                                                        name="trainTheTrainerCert"
                                                        rules={[{ required: true, message: 'Certificate is required' }]}>
                                                        <Select>
                                                            <Option value="ADVANCE">ADVANCE</Option>
                                                            <Option value="BASIC">BASIC</Option>
                                                            <Option value="NONE">NONE</Option>
                                                        </Select>
                                                    </Form.Item></td>
                                                </tr>
                                                <tr>
                                                    <td className='form-tile'>Job Rank</td>
                                                    <td><Form.Item
                                                        name="jobRank"
                                                        rules={[{ required: true, message: 'Job Rank is required' }]}>
                                                        <Input />
                                                    </Form.Item></td>
                                                    <td className='form-tile'>Professional Index</td>
                                                    <td><Form.Item
                                                        name="professionalIndex"
                                                        rules={[
                                                            { required: true, message: 'Professional Index is required' },
                                                            { pattern: /^\d+$/, message: 'Professional Index must be a number' }
                                                        ]}>
                                                        <Input />
                                                    </Form.Item></td>
                                                    <td className='form-tile'>Training Competency Index</td>
                                                    <td><Form.Item
                                                        name="trainingCompetencyIndex"
                                                        rules={[
                                                            { required: true, message: 'Training Competency Index is required' },
                                                            { pattern: /^\d+$/, message: 'Training Competency Index must be a number' }
                                                        ]}>
                                                        <Input />
                                                    </Form.Item></td>
                                                </tr>
                                                <tr>
                                                    <td className='form-tile'>Status</td>
                                                    <td><Form.Item
                                                        name="status"
                                                        rules={[{ required: true, message: 'Status is required' }]}>
                                                        <Select>
                                                            <Option value="AVAILABLE">AVAILABLE</Option>
                                                            <Option value="BUSY">BUSY</Option>
                                                            <Option value="OUT">OUT</Option>
                                                            <Option value="ONSITE">ONSITE</Option>
                                                        </Select>
                                                    </Form.Item></td>
                                                    <td className='form-tile'>Note</td>
                                                    <td colSpan="3"><Form.Item name="note">
                                                        <Input.TextArea rows={1} placeholder="Enter note" />
                                                    </Form.Item></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Form>
                                </ConfigProvider>
                            </div>
                        )}
                    </div>
                    <div className="skill-dropdown3">
                        <div
                            className={`skill-dropdown-header ${isOpen2 ? 'active' : ''}`}
                            onClick={() => setIsOpen2(!isOpen2)}
                        >
                            Professional Skills
                            <span className="skill-dropdown-arrow">
                                {isOpen2 ? <CaretUpOutlined style={{ color: "rgba(170, 170, 170, 1)" }} /> : <CaretDownOutlined style={{ color: "rgba(170, 170, 170, 1)" }} />}
                            </span>
                        </div>
                        {isOpen2 && (
                            <div className="skill-dropdown-body">
                                <Table
                                    columns={skillsColumns}
                                    dataSource={skills}
                                    pagination={false}
                                    size="small"
                                    bordered
                                />
                                <div className='add-button' onClick={handleAddSkill}>
                                    <PlusCircleOutlined style={{ color: '#5750DF', marginRight: '10px' }} />
                                    Add new skill
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='footer'>
                <div className="trainer-list-btn">
                    <a href="" className="trainer-list" onClick={handleNavigateTotrainerManagement}>
                        Back to Trainner List
                    </a>
                </div>
                <div className='option-add-btn'>
                    <div className='cancel-btn' onClick={handleCancel}>Cancel</div>
                    <div className='save-btn' onClick={handleSaveData}>Save</div>
                </div>
            </div>
        </div>

    )
}

export default AddForm;
