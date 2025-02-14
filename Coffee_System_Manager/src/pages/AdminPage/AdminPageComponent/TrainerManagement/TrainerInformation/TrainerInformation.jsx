import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Form, Input, Select, ConfigProvider } from "antd";
import "./TrainerInformation.css";
import { fetchData, fetchData1, updateData } from "./ApiService/apiService";
import { DeleteFilled, PlusCircleOutlined } from "@ant-design/icons";
import { showInfoNotification, showSuccessNotification } from "../../../../../components/Notifications/Notifications";

const { Option } = Select;

const TrainerTrainerInformation = () => {
  const [trainerData, setTrainerData] = useState({
    generalInfo: {},
    skills: [],
  });
  const [isGeneralInfoOpen, setIsGeneralInfoOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [form] = Form.useForm();
  const [isEditingSkill, setIsEditingSkill] = useState(false);
  const [isEditingGeneralInfo, setIsEditingGeneralInfo] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    loadEvents1();
  }, []);

  const loadEvents1 = async () => {
    try {
      const response = await fetchData1();
      setData(response.data || []);
    } catch (error) {
      //console.error("Error loading events:", error);
    }
  };

  const roleConfigs = {
    trainer: {
      path: sessionStorage.getItem("username"),
    },
    admin: {
      path: sessionStorage.getItem("accounttrainer"),
    },
    // Add more roles here in the future
  };
  const role = sessionStorage.getItem("selectedRole");
  const { path } = roleConfigs[role] || {};

  const account = path;
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await fetchData(path);
      setTrainerData(response.data.trainerInfo || {});
    } catch (error) {
      //console.error("Error loading events:", error);
    }
  };

  const toggleGeneralInfo = () => {
    setIsGeneralInfoOpen(!isGeneralInfoOpen);
  };

  const toggleSkills = () => {
    setIsSkillsOpen(!isSkillsOpen);
  };

  const handleEditSkill = () => {
    setIsEditingSkill(true);
    showInfoNotification('Edditing skill')
  };

  const handleEditGeneralInfo = () => {
    form.setFieldsValue({
      name: generalInfo.name,
      email: generalInfo.email,
      phone: generalInfo.phone,
      employeeId: generalInfo.employeeId,
      nationalId: generalInfo.nationalId,
      site: generalInfo.site,
      type: generalInfo.type,
      educatorContributionType: generalInfo.educatorContributionType,
      trainerRank: generalInfo.trainerRank,
      professionalLevel: generalInfo.professionalLevel,
      trainTheTrainerCert: generalInfo.trainTheTrainerCert,
      jobRank: generalInfo.jobRank,
      professionalIndex: generalInfo.professionalIndex,
      trainingCompetencyIndex: generalInfo.trainingCompetencyIndex,
      status: generalInfo.status,
      note: generalInfo.note,
    });
    setIsEditingGeneralInfo(true);
    showInfoNotification(`Edditing ${account}`)
  };

  const generalInfo = trainerData.generalInfo || {};
  const skills = trainerData.skills || [];

  const skillsEditColumns = [
    {
      title: 'No.',
      render: (text, record, index) => index + 1,
      key: 'no',
      width: '5%',
    },
    {
      title: 'Skills',
      dataIndex: 'skill',
      key: 'skill',
      width: '15%',
      render: (_, record) => (
        <Select
          value={record.skill}
          onChange={(value) => handleEditSkillChange(value, record.id, 'skill')}
          style={{ width: '100%' }}
        >
          {data
            .filter((item) => !item.isDeleted)
            .filter((item) => item.skillType === "PROFESSIONAL")
            .filter((item) => !trainerData.skills.some((skill) => skill.skill === item.skillName)) // Chỉ lấy các skill chưa bị xóa
            .map((item) => (
              <Option key={item.id} value={item.skillName}>
                {item.skillName}
              </Option>
            ))}
        </Select>
      ),
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      width: "20%",
      render: (_, record) => (
        <Select
          value={record.level}
          onChange={(value) => handleEditSkillChange(value, record.id, 'level')}
          style={{ width: '100%' }}
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
          value={record.note}
          onChange={(e) => handleEditSkillChange(e.target.value, record.id, 'note')}
          placeholder="Enter note"
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteFilled />}
          onClick={() => handleDeleteSkill(record.id)}
        />
      ),
    },
  ];

  const handleSaveSkills = async () => {

    const updatedTrainerData = {
      account: trainerData.generalInfo.account,
      educatorContributionType: trainerData.generalInfo.educatorContributionType,
      email: trainerData.generalInfo.email,
      employeeId: trainerData.generalInfo.employeeId,
      id: trainerData.generalInfo.id,
      jobRank: trainerData.generalInfo.jobRank,
      name: trainerData.generalInfo.name,
      nationalId: trainerData.generalInfo.nationalId,
      note: trainerData.generalInfo.note,
      phone: trainerData.generalInfo.phone,
      professionalIndex: trainerData.generalInfo.professionalIndex,
      professionalLevel: trainerData.generalInfo.professionalLevel,
      site: trainerData.generalInfo.site,
      status: trainerData.generalInfo.status,
      trainTheTrainerCert: trainerData.generalInfo.trainTheTrainerCert,
      trainerRank: trainerData.generalInfo.trainerRank,
      trainingCompetencyIndex: trainerData.generalInfo.trainingCompetencyIndex,
      type: trainerData.generalInfo.type,
      trainerSkills: trainerData.skills.map(skill => ({
        skillName: skill.skill,
        level: skill.level,
        note: skill.note,
      })),
    };
    try {
      await updateData(path, updatedTrainerData);
      setIsEditingSkill(false);
      const response = await fetchData(path);
      setTrainerData(response.data.trainerInfo || {});
      showSuccessNotification(`Save skill for ${account} successfully!`)
    } catch (error) {
      showInfoNotification(error.response.data.message);
      //console.error("Error saving skills:", error);
    }
  };

  const handleDeleteSkill = (id) => {
    const updatedSkills = skills.filter((skill) => skill.id !== id);
    setTrainerData({
      ...trainerData,
      skills: updatedSkills,
    });
  };

  const handleAddSkill = () => {
    const newSkill = {
      id: Date.now(),
      skill: '',
      level: 'STANDARD',
      note: '',
    };

    setTrainerData({
      ...trainerData,
      skills: [...skills, newSkill],
    });
  };

  const skillsColumns = [
    {
      title: "No.",
      render: (text, record, index) => index + 1,
      key: "no",
      width: "5%",
    },
    {
      title: "Skills",
      dataIndex: "skill",
      key: "skill",
      width: "15%",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      width: "20%",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      width: "50%",
    }
  ];

  const getTagColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "green";
      case "BUSY":
        return "yellow";
      case "OUT":
        return "red";
      case "ONSITE":
        return "gray";
      default:
        return "default";
    }
  };

  const handleEditSkillChange = (value, id, field) => {
    const updatedSkills = skills.map((skill) => {
      if (skill.id === id) {
        return {
          ...skill,
          [field]: value,
        };
      }
      return skill;
    });

    setTrainerData({
      ...trainerData,
      skills: updatedSkills,
    });
  };

  const handleSaveGeneralInfo = async (values) => {
    const updatedGeneralInfo = {
      ...generalInfo,
      ...values,
    };
    setTrainerData({
      ...trainerData,
      generalInfo: updatedGeneralInfo,
    });
    const updatedTrainerData = {
      account: updatedGeneralInfo.account,
      educatorContributionType: updatedGeneralInfo.educatorContributionType,
      email: updatedGeneralInfo.email,
      employeeId: updatedGeneralInfo.employeeId,
      id: updatedGeneralInfo.id,
      jobRank: updatedGeneralInfo.jobRank,
      name: updatedGeneralInfo.name,
      nationalId: updatedGeneralInfo.nationalId,
      note: updatedGeneralInfo.note,
      phone: updatedGeneralInfo.phone,
      professionalIndex: updatedGeneralInfo.professionalIndex,
      professionalLevel: updatedGeneralInfo.professionalLevel,
      site: updatedGeneralInfo.site,
      status: updatedGeneralInfo.status,
      trainTheTrainerCert: updatedGeneralInfo.trainTheTrainerCert,
      trainerRank: updatedGeneralInfo.trainerRank,
      trainingCompetencyIndex: updatedGeneralInfo.trainingCompetencyIndex,
      type: updatedGeneralInfo.type,
      trainerSkills: trainerData.skills.map(skill => ({
        skillName: skill.skill,
        level: skill.level,
        note: skill.note,
      })),
    };

    try {
      await updateData(path, updatedTrainerData);
      setIsEditingGeneralInfo(false);
      const response = await fetchData(path);
      setTrainerData(response.data.trainerInfo || {});
      showSuccessNotification(`Update data for ${account} successfully!`)
    } catch (error) {
      showInfoNotification(error.response.data.message);
      //console.error("Error saving general info:", error);
    }
  };

  return (
    <div className="information-cover">
      <div className="information-info-dropdown">
        <div
          className="information-info-dropdown-header"
          onClick={toggleGeneralInfo}
        >
          <button className="information-dropdown-button">General Info</button>
        </div>
        {isGeneralInfoOpen && (
          <div className="information-info-dropdown-body">
            {isEditingGeneralInfo ?
              (
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
                  <Form form={form} onFinish={handleSaveGeneralInfo}>
                    <table className='info-table'>
                      <tbody>
                        <tr>
                          <td className='information-form-tile'>Full Name</td>
                          <td>
                            <Form.Item
                              name="name"
                              rules={[{ required: true, message: 'Full Name is required' }]}>
                              <Input />
                            </Form.Item>
                          </td>
                          <td className='information-form-tile'>Account</td>
                          <td>
                            <Form.Item>
                              {generalInfo.account}
                            </Form.Item>
                          </td>
                          <td className='information-form-tile'>Contact Email</td>
                          <td>
                            <Form.Item
                              name="email"
                              rules={[{ required: true, message: 'Contact Email is required' }]}>
                              <Input />
                            </Form.Item>
                          </td>
                        </tr>
                        <tr>
                          <td className='information-form-tile'>Phone</td>
                          <td>
                            <Form.Item
                              name="phone"
                              rules={[
                                { required: true, message: 'Phone number is required' },
                                { pattern: /^(03|05|07|08|09)[0-9]{8}$/, message: 'Invalid Vietnamese phone number' }
                              ]}>
                              <Input placeholder="Enter phone number" />
                            </Form.Item>
                          </td>
                          <td className='information-form-tile'>Employee ID</td>
                          <td>
                            <Form.Item
                              name="employeeId"
                              rules={[{ required: true, message: 'Employee ID is required' }]}>
                              <Input />
                            </Form.Item>
                          </td>
                          <td className='information-form-tile'>National ID</td>
                          <td>
                            <Form.Item
                              name="nationalId"
                              rules={[
                                { required: true, message: 'National ID is required' },
                                { pattern: /^[0-9]{9}$|^[0-9]{12}$/, message: 'Invalid National ID (must be 9 or 12 digits)' }
                              ]}>
                              <Input />
                            </Form.Item>
                          </td>
                        </tr>
                        <tr>
                          <td className='information-form-tile'>Site</td>
                          <td>
                            <Form.Item
                              name="site"
                              rules={[{ required: true, message: 'Site is required' }]}>
                              <Input />
                            </Form.Item>
                          </td>
                          <td className='information-form-tile'>Trainer Type</td>
                          <td>
                            <Form.Item
                              name="type"
                              rules={[{ required: true, message: 'Trainer Type is required' }]}>
                              <Select>
                                <Option value="EXTERNAL">EXTERNAL</Option>
                                <Option value="INTERNAL">INTERNAL</Option>
                                <Option value="STAFF">STAFF</Option>
                              </Select>
                            </Form.Item>
                          </td>
                          <td className='information-form-tile'>Contribution Type</td>
                          <td>
                            <Form.Item
                              name="educatorContributionType"
                              rules={[{ required: true, message: 'Contribution Type is required' }]}>
                              <Select>
                                <Option value="TRAINER">TRAINER</Option>
                                <Option value="MENTER">MENTOR</Option>
                                <Option value="AUDITOR">AUDITOR</Option>
                              </Select>
                            </Form.Item>
                          </td>
                        </tr>
                        <tr>
                          <td className='information-form-tile'>Trainer Rank</td>
                          <td>
                            <Form.Item
                              name="trainerRank"
                              rules={[{ required: true, message: 'Trainer Rank is required' }]}>
                              <Input />
                            </Form.Item>
                          </td>
                          <td className='information-form-tile'>Professional Level</td>
                          <td>
                            <Form.Item
                              name="professionalLevel"
                              rules={[{ required: true, message: 'Professional Level is required' }]}>
                              <Select>
                                <Option value="ADVANCE">ADVANCE</Option>
                                <Option value="EXPERT">EXPERT</Option>
                                <Option value="STANDARD">STANDARD</Option>
                              </Select>
                            </Form.Item>
                          </td>
                          <td className='information-form-tile'>Train The Trainer Certificate</td>
                          <td>
                            <Form.Item
                              name="trainTheTrainerCert"
                              rules={[{ required: true, message: 'Certificate is required' }]}>
                              <Select>
                                <Option value="ADVANCE">ADVANCE</Option>
                                <Option value="BASIC">BASIC</Option>
                                <Option value="NONE">NONE</Option>
                              </Select>
                            </Form.Item>
                          </td>
                        </tr>
                        <tr>
                          <td className='information-form-tile'>Job Rank</td>
                          <td>
                            <Form.Item
                              name="jobRank"
                              rules={[{ required: true, message: 'Job Rank is required' }]}>
                              <Input />
                            </Form.Item>
                          </td>
                          <td className='information-form-tile'>Professional Index</td>
                          <td>
                            <Form.Item
                              name="professionalIndex"
                              rules={[
                                { required: true, message: 'Professional Index is required' },
                                { pattern: /^\d+$/, message: 'Professional Index must be a number' }
                              ]}>
                              <Input />
                            </Form.Item>
                          </td>
                          <td className='information-form-tile'>Training Competency Index</td>
                          <td>
                            <Form.Item
                              name="trainingCompetencyIndex"
                              rules={[
                                { required: true, message: 'Training Competency Index is required' },
                                { pattern: /^\d+$/, message: 'Training Competency Index must be a number' }
                              ]}>
                              <Input />
                            </Form.Item>
                          </td>
                        </tr>
                        <tr>
                          <td className='information-form-tile'>Status</td>
                          <td>
                            <Form.Item
                              name="status"
                              rules={[{ required: true, message: 'Status is required' }]}>
                              <Select>
                                <Option value="AVAILABLE">AVAILABLE</Option>
                                <Option value="BUSY">BUSY</Option>
                                <Option value="OUT">OUT</Option>
                                <Option value="ONSITE">ONSITE</Option>
                              </Select>
                            </Form.Item>
                          </td>
                          <td className='information-form-tile'>Note</td>
                          <td colSpan="3">
                            <Form.Item name="note">
                              <Input.TextArea rows={1} placeholder="Enter note" />
                            </Form.Item>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className='option-btn'>
                      <div className='cancel-btn' onClick={() => {
                        setIsEditingGeneralInfo(false)
                        showInfoNotification('Cancel edit info')
                      }}><strong>Cancel</strong></div>
                      <Form.Item>
                        <Button type="primary" htmlType="submit"><strong>Save</strong></Button>
                      </Form.Item>
                    </div>
                  </Form>

                </ConfigProvider>
              ) : (
                <>
                  <table className="information-info-table">
                    <thead>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="information-form-tile">Full Name</td>
                        <td>{generalInfo.name}</td>
                        <td className="information-form-tile">Account</td>
                        <td>{generalInfo.account}</td>
                        <td className="information-form-tile">Contact Email</td>
                        <td>{generalInfo.email}</td>
                      </tr>
                      <tr>
                        <td className="information-form-tile">Phone</td>
                        <td>{generalInfo.phone}</td>
                        <td className="information-form-tile">Employee ID</td>
                        <td>{generalInfo.employeeId}</td>
                        <td className="information-form-tile">National ID</td>
                        <td>{generalInfo.nationalId}</td>
                      </tr>
                      <tr>
                        <td className="information-form-tile">Site</td>
                        <td>{generalInfo.site}</td>
                        <td className="information-form-tile">Trainer Type</td>
                        <td>{generalInfo.type}</td>
                        <td className="information-form-tile">Contribution Type</td>
                        <td>{generalInfo.educatorContributionType}</td>
                      </tr>
                      <tr>
                        <td className="information-form-tile">Trainer Rank</td>
                        <td>{generalInfo.trainerRank}</td>
                        <td className="information-form-tile">Professional Level</td>
                        <td>{generalInfo.professionalLevel}</td>
                        <td className="information-form-tile">
                          Train The Trainer Certificate
                        </td>
                        <td>{generalInfo.trainTheTrainerCert}</td>
                      </tr>
                      <tr>
                        <td className="information-form-tile">Job Rank</td>
                        <td>{generalInfo.jobRank}</td>
                        <td className="information-form-tile">Professional Index</td>
                        <td>{generalInfo.professionalIndex}</td>
                        <td className="information-form-tile">
                          Training Competency Index
                        </td>
                        <td>{generalInfo.trainingCompetencyIndex}</td>
                      </tr>
                      <tr>
                        <td className="information-form-tile">Status</td>
                        <td>
                          <Tag color={getTagColor(generalInfo.status)}>
                            {generalInfo.status?.toUpperCase()}
                          </Tag>
                        </td>
                        <td className="information-form-tile">Note</td>
                        <td colSpan="3">{generalInfo.note}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="information-edit-button-container">
                    <Button type="primary" onClick={handleEditGeneralInfo}><strong>Edit General Info</strong></Button>
                  </div>
                </>
              )}
          </div>
        )}
      </div>

      <div className="information-skill-dropdown3">
        <div
          className="information-skill-dropdown-header"
          onClick={toggleSkills}
        >
          <button className="information-dropdown-button">
            Professional Skills
          </button>
        </div>
        {isSkillsOpen && (
          <div className="information-skill-dropdown-body">
            {isEditingSkill ? (
              <>
                <Table
                  columns={skillsEditColumns}
                  dataSource={trainerData.skills.map(skill => ({ ...skill, key: skill.id }))}
                  pagination={false}
                  size="small"
                  bordered
                />
                <div className="add-button" onClick={handleAddSkill}>
                  <PlusCircleOutlined style={{ color: '#5750DF', marginRight: '10px' }} />
                  Add new skill
                </div>
                <div className='option-btn'>
                  <div className='cancel-btn' onClick={() => {
                    setIsEditingSkill(false)
                    showInfoNotification('Cancel edit skill')
                  }}><strong>Cancel</strong></div>
                  <Button type="primary" onClick={handleSaveSkills}><strong>Save</strong></Button>
                </div>
              </>
            ) : (
              <>
                <Table
                  columns={skillsColumns}
                  dataSource={trainerData.skills.map(skill => ({ ...skill, key: skill.id }))}
                  pagination={false}
                  size="small"
                  bordered
                />
                <div className="information-edit-button-container">
                  <Button type="primary" onClick={handleEditSkill}><strong>Edit Skills</strong></Button>
                </div>
              </>
            )}


          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerTrainerInformation;
