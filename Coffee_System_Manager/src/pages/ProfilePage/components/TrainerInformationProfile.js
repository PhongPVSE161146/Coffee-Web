import React, { useEffect, useState } from "react";
import { fetchData, masterData, updateData, saveHistory, downloadData, SaveLinkCV } from "./ApiService/ApiService"; // Ensure updateData and saveHistory are imported
import Avatarimg from "../../../assets/image.png";
import { Spin, Input, Modal, Select, DatePicker } from "antd";
import {
    DownloadOutlined,
    LinkOutlined,
    PlusCircleOutlined,
    DeleteOutlined,
    PlusOutlined,
    CloseOutlined,
    LoadingOutlined,
    EyeOutlined
} from "@ant-design/icons";
import "./TrainerInformationProfile.css";
import { useLocation, useNavigate, } from "react-router-dom";
import { showErrorNotification, showInfoNotification, showSuccessNotification } from "../../../components/Notifications/Notifications";
import dayjs from "dayjs";
import { EmailRounded, FlagRounded, HomeRounded, LocalPhoneRounded, NoAccounts, Search } from "@mui/icons-material";
import TextArea from "antd/es/input/TextArea";

const TrainerInformationProfile = ({ isEditMode, toggleEditMode, isExporting, onAvatarUpload, onCertificateUpload }) => {
    const [trainerInfo, setTrainerInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editableInfo, setEditableInfo] = useState({});
    const [originalInfo, setOriginalInfo] = useState({});
    const [professionalSkills, setProfessionalSkills] = useState([]);
    const [softSkills, setSoftSkills] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [siteOptions, setSiteOptions] = useState([]);
    const [trainerTypeOption, setTrainerTypeOption] = useState([]);
    const [contributionTypeOption, setContributionTypeOption] = useState([]);
    const [professionalLevelOption, setProfessionalLevelOption] = useState([]);
    const [trainTheTrainerCertOption, setTrainTheTrainerCertOption] = useState([]);
    const [jobTitleOption, setJobTitleOption] = useState([]);
    const [jobRankOption, setJobRankOption] = useState([]);
    const [professionalSkillOption, setProfessionalSkillOption] = useState([]);
    const [softSkillOption, setSoftSkillOption] = useState([]);
    const [professionalSkillLevelOption, setProfessionalSkillLevelOption] = useState([]);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [isPopupDeleteSkillVisible, setIsPopupDeleteSkillVisible] = useState(false);
    const [isPopupDeleteCertidicateVisible, setIsPopupDeleteCertidicateVisible] = useState(false);
    const [deleteSkillIndex, setDeleteSkillIndex] = useState(null);
    const [deleteSkillType, setDeleteSkillType] = useState(null);
    const [deleteCertificateIndex, setDeleteCertificateIndex] = useState(null);

    const [originalProfessionalSkills, setOriginalProfessionalSkills] = useState([]);
    const [originalSoftSkills, setOriginalSoftSkills] = useState([]);
    const [originalCertificates, setOriginalCertificates] = useState([]);
    const [uploadingCertificateIndex, setUploadingCertificateIndex] = useState(null);
    const [availableJobRanks, setAvailableJobRanks] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [dropdownData, setDropdownData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    // Thêm hàm xử lý preview



    const roleConfigs = {
        trainer: {
            path: sessionStorage.getItem("username"),
        },
        admin: {
            path: location.pathname.includes('/trainerManagement/')
                ? sessionStorage.getItem("accounttrainer")
                : sessionStorage.getItem("username"),
        },
        trainermanager: {
            path: sessionStorage.getItem("username"),
        },
        FAMadmin: {
            path: sessionStorage.getItem("username"),
        },
        deliverymanager: {
            path: location.pathname.includes('/trainerManagement/')
                ? sessionStorage.getItem("accounttrainer")
                : sessionStorage.getItem("username"),
        }

    };

    const role = sessionStorage.getItem("selectedRole");
    const { path } = roleConfigs[role] || {};


    const handlePreview = (imageUrl) => {
        setPreviewImage(imageUrl);
        setIsPreviewVisible(true);
    };
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file && onAvatarUpload) {
            try {
                const response = await onAvatarUpload(file);

                if (response && response.success && response.data) {
                    setEditableInfo(prev => ({
                        ...prev,
                        avatar: response.data
                    }));
                    showSuccessNotification("Avatar uploaded successfully!");
                }
            } catch (error) {
                showInfoNotification("Failed to upload avatar.");
            }
        }
    };
    const handleCancelImage = () => {
        setEditableInfo(prev => ({
            ...prev,
            avatar: originalInfo.avatar || Avatarimg
        }));
    };

    const handleCertificateFileUpload = async (index, file) => {
        if (!file || !onCertificateUpload) return;

        try {
            setUploadingCertificateIndex(index);
            const response = await onCertificateUpload(file);


            if (response && response.success && response.data) {
                setCertificates(prevCertificates => {
                    const newCertificates = [...prevCertificates];
                    newCertificates[index] = {
                        ...newCertificates[index],
                        url: response.data,
                        file: file.name
                    };
                    return newCertificates;
                });
                showSuccessNotification("Certificate uploaded successfully!");
            }
        } catch (error) {

            showInfoNotification("Failed to upload certificate.");
        } finally {
            setUploadingCertificateIndex(null);
        }
    };

    const handleBackToMainPage = () => {
        if (role === "admin") navigate("/adminPage");
        else if (role === "trainer") navigate("/trainerPage");
        else if (role === "deliverymanager") navigate("/DeliveryManagerPage");
        else if (role === "trainermanager") navigate("/TrainermanagerPage");
        else if (role === "FAMadmin") navigate("/FAMAdminPage");
    };

    useEffect(() => {
        const fetchDataAndSetOptions = async () => {
            setLoading(true);

            try {
                const trainerData = await fetchData(path);
                const { trainerInfo } = trainerData.data;
                setTrainerInfo(trainerData.data.trainerInfo);
                setEditableInfo(trainerData.data.trainerInfo.generalInfo);
                setOriginalInfo(trainerData.data.trainerInfo.generalInfo);
                setProfessionalSkills(trainerData.data.trainerInfo.skills.filter(skill => skill.type === 'PROFESSIONAL'));
                setSoftSkills(trainerData.data.trainerInfo.skills.filter(skill => skill.type === 'SOFTSKILL'));
                setCertificates(trainerData.data.trainerInfo.certificate || []);
                setOriginalProfessionalSkills(trainerData.data.trainerInfo.skills.filter(skill => skill.type === 'PROFESSIONAL'));
                setOriginalSoftSkills(trainerData.data.trainerInfo.skills.filter(skill => skill.type === 'SOFTSKILL'));
                setOriginalCertificates(trainerData.data.trainerInfo.certificate || []);
                const formattedCertificates = trainerInfo?.certificate?.map(cert => ({
                    id: cert.id,
                    idcertificate: cert.id,
                    name: cert.name,
                    url: cert.url,
                    date: cert.date,
                    deleted: false
                })) || [];
                setTrainerInfo(trainerInfo);
                setCertificates(formattedCertificates);
                setOriginalCertificates(formattedCertificates);

                const dropdownData = await masterData();
                setDropdownData(dropdownData);
                const sites = dropdownData.data.sites.map((site) => ({ value: site, label: site }));
                setSiteOptions(sites);
                const trainerTypes = dropdownData.data.trainerTypes.map((trainerType) => ({ value: trainerType, label: trainerType }));
                setTrainerTypeOption(trainerTypes);
                const contributionTypes = dropdownData.data.contributionTypes.map((contributionType) => ({ value: contributionType, label: contributionType }));
                setContributionTypeOption(contributionTypes);
                const professionalLevels = dropdownData.data.professionalLevel.map((professionalLevel) => ({ value: professionalLevel, label: professionalLevel }));
                setProfessionalLevelOption(professionalLevels);
                const trainthetrainercerts = dropdownData.data.trainTheTrainerCert.map((trainTheTrainerCert) => ({ value: trainTheTrainerCert, label: trainTheTrainerCert }));
                setTrainTheTrainerCertOption(trainthetrainercerts);
                const jobTitles = dropdownData.data.jobTitles.map((jobTitle) => ({
                    value: jobTitle.name,
                    label: jobTitle.name,
                    ranks: jobTitle.jobRanks
                }));
                setJobTitleOption(jobTitles);
                const professionalskills = dropdownData.data.professionalSkill.map((professionalSkill) => ({ value: professionalSkill, label: professionalSkill }));
                setProfessionalSkillOption(professionalskills);
                const softskills = dropdownData.data.softSkill.map((softSkill) => ({ value: softSkill, label: softSkill }));
                setSoftSkillOption(softskills);
                const professionalskilllevels = dropdownData.data.professionalSkillLevel.map((professionalSkillLevel) => ({ value: professionalSkillLevel, label: professionalSkillLevel }));
                setProfessionalSkillLevelOption(professionalskilllevels);

            } catch (error) {

            } finally {
                setLoading(false);
            }
        };


        fetchDataAndSetOptions();
    }, [path, location.pathname]);

    const showCancelModal = () => {
        setIsCancelModalVisible(true);
    };

    const showPopupSkillDelete = (index, skillType) => {
        setDeleteSkillIndex(index);
        setDeleteSkillType(skillType);
        setIsPopupDeleteSkillVisible(true);
    };

    const showPopupDeleteCertificate = (index) => {
        setDeleteCertificateIndex(index);
        setIsPopupDeleteCertidicateVisible(true); // Reuse the same modal visibility state
    };

    const validateForm = () => {
        const errors = {};
        const requiredFields = {
            name: "Full Name",
            phone: "Phone Number",
            email: "Email",
            address: "Address",
            nationalId: "National ID",
            account: "Account",
            employeeId: "Employee ID",
            site: "Site",
            type: "Trainer Type",
            educatorContributionType: "Contribution Type"
        };

        // Check each required field
        Object.entries(requiredFields).forEach(([field, label]) => {
            if (!editableInfo[field]) {
                errors[field] = `${label} is required`;
            }
        });

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleSaveChange = async () => {
        if (!validateForm()) {
            showErrorNotification("Please fill in all required fields");
            return;
        }
        const dataToUpdate = {
            fullName: editableInfo.name || "",
            description: editableInfo.description || "",
            phone: editableInfo.phone || "",
            email: editableInfo.email || "",
            imageUrl: editableInfo.avatar || "",
            address: editableInfo.address || "",
            nationalID: editableInfo.nationalId || "",
            account: editableInfo.account || "",
            employeeId: editableInfo.employeeId || "",
            site: editableInfo.site || "",
            trainerType: editableInfo.type || "",
            contributionType: editableInfo.educatorContributionType || "",
            trainerRank: editableInfo.trainerRank || "",
            professionalLevel: editableInfo.professionalLevel || "",
            trainTheTrainerCert: editableInfo.trainTheTrainerCert || "",
            professionalIndex: editableInfo.professionalIndex?.toString() || "",
            trainingCompetencyIndex: editableInfo.trainingCompetencyIndex?.toString() || "",
            jobTitle: editableInfo.jobTitle || "",
            jobRank: editableInfo.jobRank || "",
            skills: professionalSkills.map(skill => ({
                name: skill.skill,
                level: skill.level
            })),
            softSkills: softSkills.map(skill => ({
                name: skill.skill
            })),
            certificates: certificates.map(cert => ({
                name: cert.name,
                link: cert.url,
                date: cert.date?.split('T')[0] || new Date().toISOString().split('T')[0]
            }))
        };

        try {
            setIsSaving(true);

            // First update the profile
            const response = await updateData(dataToUpdate);

            if (response) {
                // Generate CV and get the link
                try {
                    const cvResponse = await SaveLinkCV(dataToUpdate);
                    if (cvResponse && cvResponse.data) {
                        // Save to history with the CV link
                        await saveHistory({
                            trainerAccount: sessionStorage.getItem("username"),
                            action: "MODIFY",
                            linkCV: cvResponse.data // This is the CV link from the response
                        });
                    }
                } catch (cvError) {
                    showErrorNotification(`Error saving CV link`);
                }

                // Refresh the data
                const refreshedData = await fetchData(path);
                if (refreshedData && refreshedData.data) {
                    const { trainerInfo: newTrainerInfo } = refreshedData.data;

                    // Update states with new data
                    setTrainerInfo(newTrainerInfo);
                    setEditableInfo(newTrainerInfo.generalInfo);
                    setOriginalInfo(newTrainerInfo.generalInfo);

                    setProfessionalSkills(newTrainerInfo.skills.filter(skill => skill.type === 'PROFESSIONAL'));
                    setSoftSkills(newTrainerInfo.skills.filter(skill => skill.type === 'SOFTSKILL'));
                    setOriginalProfessionalSkills(newTrainerInfo.skills.filter(skill => skill.type === 'PROFESSIONAL'));
                    setOriginalSoftSkills(newTrainerInfo.skills.filter(skill => skill.type === 'SOFTSKILL'));

                    const formattedCertificates = newTrainerInfo.certificate.map(cert => ({
                        name: cert.name,
                        url: cert.url,
                        date: cert.date,
                    }));
                    setCertificates(formattedCertificates);
                    setOriginalCertificates(formattedCertificates);

                    toggleEditMode(false);
                    showSuccessNotification("Profile updated successfully!");
                }
            }
        } catch (error) {
            showInfoNotification("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };


    const handleCancelEdit = () => {
        setEditableInfo(originalInfo); // Reset editableInfo to originalInfo
        setProfessionalSkills(originalProfessionalSkills); // Reset professional skills
        setSoftSkills(originalSoftSkills); // Reset soft skills
        setCertificates(originalCertificates); // Reset certificates
        setIsCancelModalVisible(false);
        toggleEditMode(false); // Exits edit mode
        showInfoNotification("Cancel edit mode!");
    };

    const handleCancelModalClose = () => {
        setIsCancelModalVisible(false);
    };

    const showPopupDeleteSkillClose = () => {
        setIsPopupDeleteSkillVisible(false);
    };

    const showPopupDeleteCertidicateClose = () => {
        setIsPopupDeleteCertidicateVisible(false);
    };
    const confirmDeleteSkill = () => {
        if (deleteSkillType === 'PROFESSIONAL') {
            setProfessionalSkills((prevSkills) => prevSkills.filter((_, i) => i !== deleteSkillIndex));
            showSuccessNotification("Remove Professional Skill success!");
        } else if (deleteSkillType === 'SOFTSKILL') {
            setSoftSkills((prevSkills) => prevSkills.filter((_, i) => i !== deleteSkillIndex));
            showSuccessNotification("Remove Soft Skill success!");
        }
        setIsPopupDeleteSkillVisible(false);
    };

    const confirmDeleteCertificate = () => {
        setCertificates((prevCertificates) => prevCertificates.filter((_, i) => i !== deleteCertificateIndex));
        showSuccessNotification("Remove Certificate success!");
        setIsPopupDeleteCertidicateVisible(false); // Close the modal

    };
    const handleDownload = async (url) => {
        try {
            await downloadData(url);
        } catch (error) {
            showInfoNotification("Failed to download file.");
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    if (!trainerInfo) {
        return (
            <div className="loading-container">
                <NoAccounts style={{ transform: 'scale(4)', color: 'gray', marginRight: 40 }} /> <span style={{ fontSize: 24, fontWeight: 600, color: '#ccc' }}>Error Loading Profile</span>
                <Search style={{ color: 'lightgray', stroke: 'darkgray', strokeWidth: 0.5 }} className="findFailed" />
            </div>
        );
    }

    const handleSkillChange = (index, field, value, skillType) => {
        if (skillType === 'PROFESSIONAL') {
            setProfessionalSkills((prevSkills) =>
                prevSkills.map((skill, i) =>
                    i === index ? { ...skill, [field]: value } : skill
                )
            );
        } else if (skillType === 'SOFTSKILL') {
            setSoftSkills((prevSkills) =>
                prevSkills.map((skill, i) =>
                    i === index ? { ...skill, [field]: value } : skill
                )
            );
        }
    };



    const addNewCertificate = () => {
        setCertificates((prevCertificates) => [
            ...prevCertificates,
            {

                name: '',
                url: '',
                date: null,
                deleted: false
            }
        ]);
    };

    const handleDateChange = (index, date) => {
        setCertificates((prevCertificates) =>
            prevCertificates.map((cert, i) => (i === index ? { ...cert, date: date ? date.toISOString() : null } : cert))
        );
    };

    const handleCertificateChange = (index, field, value) => {
        setCertificates(prevCertificates => {
            const newCertificates = [...prevCertificates];
            newCertificates[index] = {
                ...newCertificates[index],
                [field]: value
            };
            // Log để debug
            return newCertificates;
        });
    };

    const handleFieldChange = (field, value) => {
        if (field === "jobTitle") {
            // Tìm jobRanks tương ứng từ data gốc
            const selectedJobTitle = dropdownData.data.jobTitles.find(
                job => job.name === value
            );

            // Cập nhật availableJobRanks
            if (selectedJobTitle) {
                const jobRanks = selectedJobTitle.jobRanks.map(rank => ({
                    value: rank,
                    label: rank
                }));
                setAvailableJobRanks(jobRanks);
            } else {
                setAvailableJobRanks([]);
            }

            // Cập nhật editableInfo và reset jobRank
            setEditableInfo(prev => ({
                ...prev,
                jobTitle: value,
                jobRank: null // Reset jobRank khi thay đổi jobTitle
            }));
        } else {
            setEditableInfo(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };
    const addNewProfessionalSkill = () => {
        setProfessionalSkills((prevSkills) => [
            ...prevSkills,
            { skill: 'Select skill', level: 'Select level', type: 'PROFESSIONAL' }, // New skill object
        ]);
    };

    const addNewSoftSkill = () => {
        setSoftSkills((prevSkills) => [
            ...prevSkills,
            { skill: 'Select skill', level: 'Select level', type: 'SOFTSKILL' }, // New skill object
        ]);
    };



    const { generalInfo } = trainerInfo;

    // Thêm hàm kiểm tra quyền edit
    const canEditField = (fieldName) => {
        const role = sessionStorage.getItem("selectedRole");
        const restrictedFields = [
            "trainerRank",
            "professionalLevel",
            "jobRank",
            "jobTitle",
            "professionalIndex",
            "trainTheTrainerCert",
            "trainingCompetencyIndex"
        ];

        return role !== "trainer" || !restrictedFields.includes(fieldName);
    };

    return (
        <div className="trainer-profile">
            <div className="view-profile-trainer">
                <div className="profile-avatar">
                    <div className="avatar-container">
                        <img src={editableInfo.avatar || generalInfo.avatar || Avatarimg} alt="Avatar" />
                        {isEditMode && (
                            <div className="avatar-controls">
                                <label className="avatar-upload-overlay">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                    <PlusOutlined className="upload-icon" />
                                </label>
                                {editableInfo.avatar !== (originalInfo.avatar || Avatarimg) && (
                                    <button
                                        className="avatar-cancel-button"
                                        onClick={handleCancelImage}
                                        title="Cancel image selection"
                                    >
                                        <CloseOutlined />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="profile-avatar">
                    <div className="profile-trainer-name-date" style={{ marginBottom: 10 }}>
                        {isEditMode ? (
                            <Input style={{
                                height: "40px",
                                fontSize: "24px",
                                fontWeight: 700,

                            }}
                                disabled={!isEditMode}
                                required
                                placeholder="Full Name *"
                                className="underlined-input"
                                value={editableInfo.name}
                                onChange={(e) => handleFieldChange("name", e.target.value)}
                            />
                        ) : (
                            <div className="profile-trainer-name">{generalInfo.name}</div>
                        )}
                    </div>
                    {!isEditMode && (<div className="profile-trainer-job-title-job-rank">{generalInfo.jobTitle} - {generalInfo.jobRank}</div>)}
                    <div>
                        {isEditMode ? (
                            <div className="details-profile">
                                <TextArea style={{ maxHeight: "76px" }}
                                    className="full-width-input"
                                    disabled={!isEditMode}
                                    value={editableInfo.description}
                                    placeholder="Description *"
                                    onChange={(e) => handleFieldChange("description", e.target.value)}
                                />
                            </div>
                        ) : (
                            <div className="details-profile">{generalInfo.description}</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="body-profile-information">
                <div className="body-profile-information-column1">
                    <div className="body-profile-information-header">PERSONAL INFORMATION</div>
                    <div className="item-profile-information">
                        <span className="item-profile-details"><LocalPhoneRounded /> Phone: {isEditMode ? (
                            <Input className="underlined-input" value={editableInfo.phone}
                                disabled={!isEditMode}
                                required
                                placeholder="Phone Number *"
                                onChange={(e) => handleFieldChange("phone", e.target.value)} />
                        ) : generalInfo.phone}</span>
                        <span className="item-profile-details"><EmailRounded /> Email: {isEditMode ? (
                            <Input className="underlined-input" value={editableInfo.email}
                                disabled={!isEditMode}
                                required
                                placeholder="Email *"
                                onChange={(e) => handleFieldChange("email", e.target.value)} />
                        ) : generalInfo.email}</span>
                        <span className="item-profile-details"><HomeRounded /> Address: {isEditMode ? (
                            <Input className="underlined-input" value={editableInfo.address}
                                disabled={!isEditMode}
                                required
                                placeholder="Address *"
                                onChange={(e) => handleFieldChange("address", e.target.value)} />
                        ) : generalInfo.address || "N/A"}</span>
                        <span className="item-profile-details"><FlagRounded /> National ID: {isEditMode ? (
                            <Input className="underlined-input" value={editableInfo.nationalId}
                                disabled={!isEditMode}
                                required
                                placeholder="National ID *"
                                onChange={(e) => handleFieldChange("nationalId", e.target.value)} />
                        ) : generalInfo.nationalId}</span>
                    </div>
                    <div className="body-profile-information-header">EMPLOYEE INFORMATION</div>
                    <div className="item-profile-information">
                        <span className="item-profile-details">Account: {isEditMode ? (
                            <Input className="underlined-input" value={editableInfo.account}
                                disabled={!isEditMode}
                                required
                                placeholder="Account *" onChange={(e) => handleFieldChange("account", e.target.value)} />
                        ) : generalInfo.account}</span>
                        <span className="item-profile-details">Employee ID: {isEditMode ? (
                            <Input className="underlined-input" value={editableInfo.employeeId}
                                disabled={!isEditMode}
                                required
                                placeholder="Employee ID *" onChange={(e) => handleFieldChange("employeeId", e.target.value)} />
                        ) : generalInfo.employeeId}</span>
                        <span className="item-profile-details">
                            Site: {isEditMode ? (
                                <Select
                                    className="dropdown-input-profile"
                                    value={editableInfo.site}
                                    onChange={(value) => handleFieldChange("site", value)}
                                    options={siteOptions}
                                />
                            ) : (
                                generalInfo.site
                            )}
                        </span >
                        <span className="item-profile-details">Trainer Type: {isEditMode ? (
                            <Select
                                className="dropdown-input-profile"
                                value={editableInfo.type}
                                onChange={(value) => handleFieldChange("type", value)}
                                options={trainerTypeOption}
                            />
                        ) : generalInfo.type}</span>
                        <span className="item-profile-details">Contribution Type: {isEditMode ? (
                            <Select
                                className="dropdown-input-profile"
                                value={editableInfo.educatorContributionType}
                                onChange={(value) => handleFieldChange("educatorContributionType", value)}
                                options={contributionTypeOption}
                            />
                        ) : generalInfo.educatorContributionType}</span>
                        <span className="item-profile-details">
                            Trainer Rank: {isEditMode && canEditField("trainerRank") ? (
                                <Input
                                    className="underlined-input"
                                    value={editableInfo.trainerRank}
                                    disabled={!isEditMode}
                                    required
                                    placeholder="Trainer Rank *"
                                    onChange={(e) => handleFieldChange("trainerRank", e.target.value)}
                                />
                            ) : generalInfo.trainerRank}
                        </span>
                        <span className="item-profile-details">
                            Professional Level: {isEditMode && canEditField("professionalLevel") ? (
                                <Select
                                    className="dropdown-input-profile"
                                    value={editableInfo.professionalLevel}
                                    onChange={(value) => handleFieldChange("professionalLevel", value)}
                                    options={professionalLevelOption}
                                />
                            ) : generalInfo.professionalLevel}
                        </span>
                        <span className="item-profile-details">
                            Train The Trainer Cert: {isEditMode && canEditField("trainTheTrainerCert") ? (
                                <Select
                                    className="dropdown-input-profile"
                                    value={editableInfo.trainTheTrainerCert}
                                    onChange={(value) => handleFieldChange("trainTheTrainerCert", value)}
                                    options={trainTheTrainerCertOption}
                                />
                            ) : generalInfo.trainTheTrainerCert}
                        </span>
                        <span className="item-profile-details">
                            Professional Index: {isEditMode && canEditField("professionalIndex") ? (
                                <Input
                                    className="underlined-input"
                                    value={editableInfo.professionalIndex}
                                    disabled={!isEditMode}
                                    required
                                    placeholder="professionalIndex *"
                                    onChange={(e) => handleFieldChange("professionalIndex", e.target.value)}
                                />
                            ) : generalInfo.professionalIndex}
                        </span>
                        <span className="item-profile-details">
                            Training Competency Index: {isEditMode && canEditField("trainingCompetencyIndex") ? (
                                <Input
                                    className="underlined-input"
                                    value={editableInfo.trainingCompetencyIndex}
                                    disabled={!isEditMode}
                                    required
                                    placeholder="trainingCompetencyIndex *"
                                    onChange={(e) => handleFieldChange("trainingCompetencyIndex", e.target.value)}
                                />
                            ) : generalInfo.trainingCompetencyIndex}
                        </span>
                        {isEditMode && canEditField("jobTitle") && (
                            <span className="item-profile-details">
                                Job Title:
                                <Select
                                    className="dropdown-input-profile"
                                    value={editableInfo.jobTitle}
                                    onChange={(value) => handleFieldChange("jobTitle", value)}
                                    options={jobTitleOption}
                                />
                            </span>
                        )}
                        {isEditMode && canEditField("jobRank") && editableInfo.jobTitle && (
                            <span className="item-profile-details">
                                Job Rank:
                                <Select
                                    className="dropdown-input-profile"
                                    value={editableInfo.jobRank}
                                    onChange={(value) => handleFieldChange("jobRank", value)}
                                    options={availableJobRanks}
                                    disabled={!editableInfo.jobTitle}
                                />
                            </span>
                        )}
                    </div>
                </div>

                {(isEditMode || isExporting) && (
                    <div className="column-devider"></div>
                )}

                <div className="body-profile-information-column2">
                    <>
                        <div className="body-profile-information-header">PROFESSIONAL SKILLS</div>
                        {isEditMode ? (
                            <div className="profile-body-skill-and-cert">
                                {professionalSkills.map((skill, index) => (
                                    <div className="skill-edit-location" key={index} style={{ marginBottom: 20 }}>
                                        <Select
                                            className="dropdown-input-profile"
                                            value={skill.skill}
                                            onChange={(value) => handleSkillChange(index, "skill", value, 'PROFESSIONAL')}
                                            options={professionalSkillOption}
                                        />
                                        <Select
                                            style={{ marginLeft: 20 }}
                                            className="dropdown-input-profile"
                                            value={skill.level}
                                            onChange={(value) => handleSkillChange(index, "level", value, 'PROFESSIONAL')}
                                            options={professionalSkillLevelOption}
                                        />
                                        <button className="delete-skill-profile" onClick={() => showPopupSkillDelete(index, 'PROFESSIONAL')}><DeleteOutlined /></button>
                                    </div>
                                ))}
                                <div className="add-new-skill-button">
                                    <button onClick={addNewProfessionalSkill}><PlusCircleOutlined /> Add New Skill</button>
                                </div>
                            </div>
                        ) : (
                            <div className="skill-type-item">
                                {professionalSkills.map((skill, index) => (
                                    <div key={`prof-skill-${index}`} className="item-profile-information">
                                        <span>{skill.skill} - {skill.level || 'N/A'}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="body-profile-information-header">SOFT SKILLS</div>
                        {isEditMode ? (
                            <div className="profile-body-skill-and-cert">
                                {softSkills.map((skill, index) => (
                                    <div className="skill-edit-location" key={index} style={{ marginBottom: 20 }}>
                                        <Select
                                            className="dropdown-input-profile"
                                            value={skill.skill}
                                            onChange={(value) => handleSkillChange(index, "skill", value, 'SOFTSKILL')}
                                            options={softSkillOption}
                                        />
                                        <button className="delete-skill-profile" onClick={() => showPopupSkillDelete(index, 'SOFTSKILL')}><DeleteOutlined /></button>
                                    </div>
                                ))}
                                <div className="add-new-skill-button">
                                    <button onClick={addNewSoftSkill}><PlusCircleOutlined /> Add New Skill</button>
                                </div>
                            </div>
                        ) : (
                            <div className="skill-type-item">
                                {softSkills.map((skill, index) => (
                                    <div key={`soft-skill-${index}`} className="item-profile-information">
                                        <span>{skill.skill}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>

                    <>
                        <div className="body-profile-information-header">CERTIFICATES</div>

                        {isEditMode ? (
                            <div className="profile-body-skill-and-cert">
                                {certificates.map((cert, index) => (
                                    <div key={`cert-edit-${index}`} className="certificate-item">

                                        <div className="cert-header">
                                            <div>
                                                <Input
                                                    className="underlined-input"
                                                    value={cert.name}
                                                    onChange={(e) => handleCertificateChange(index, 'name', e.target.value)}
                                                    placeholder="Certificate Name"
                                                />
                                            </div>

                                            <div>
                                                <DatePicker
                                                    className="cert-date-profile"
                                                    value={cert.date ? dayjs(cert.date) : null}
                                                    onChange={(date) => handleDateChange(index, date)}
                                                    placeholder="Select Date"
                                                />
                                            </div>
                                            <div>
                                                <button
                                                    className="delete-skill-profile"
                                                    onClick={() => showPopupDeleteCertificate(index)}
                                                >
                                                    <DeleteOutlined />
                                                </button>
                                            </div>
                                        </div>


                                        <div className="certificate-url-container">
                                            <div className="cert-input-url">
                                                <Input
                                                    className="underlined-input"
                                                    value={cert.url}
                                                    onChange={(e) => handleCertificateChange(index, 'url', e.target.value)}
                                                    placeholder="Certificate URL"
                                                />
                                            </div>
                                            <div>
                                                <label className={`upload-certificate-btn ${uploadingCertificateIndex === index ? 'loading' : ''}`}>
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                        onChange={(e) => {
                                                            if (e.target.files?.[0]) {
                                                                handleCertificateFileUpload(index, e.target.files[0]);
                                                            }
                                                        }}
                                                        style={{ display: 'none' }}
                                                    />
                                                    {uploadingCertificateIndex === index ? (
                                                        <LoadingOutlined style={{
                                                            border: '1px solid #d9d9d9',
                                                            borderRadius: 30,
                                                            padding: '5px'
                                                        }} />
                                                    ) : (
                                                        <PlusOutlined style={{
                                                            border: '1px solid #d9d9d9',
                                                            borderRadius: 30,
                                                            cursor: 'pointer',
                                                            padding: '5px'
                                                        }} />
                                                    )}
                                                </label>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                                <div className="add-new-skill-button">
                                    <button onClick={addNewCertificate}>
                                        <PlusCircleOutlined /> Add New Certificate
                                    </button>
                                </div>
                            </div>
                        ) : (
                            certificates.map(cert => (
                                <div key={cert.id || `cert-${cert.name}`} className="item-profile-information">
                                    <div className="certificate-item">
                                        <div className="cert-name-and-date">
                                            <div className="cert-name-profile">{cert.name}</div>
                                            <div className="cert-date-profile">
                                                {new Date(cert.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="link-and-download">
                                            <div className="certview-url">
                                                <a
                                                    className="cert-url"
                                                    href={cert.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title={cert.url} // Hiển thị chi tiết khi hover
                                                >
                                                    <LinkOutlined /> {cert.url}
                                                </a>

                                            </div>
                                            <div className="sort-icon-load-and-download">
                                                <div className="download-icon">
                                                    <a onClick={() => handlePreview(cert.url)}>
                                                        <EyeOutlined />
                                                    </a>
                                                </div>
                                                <div className="download-icon">
                                                    <a onClick={() => handleDownload(cert.url)}>
                                                        <DownloadOutlined />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                    </>
                </div>
            </div>

            {!isExporting && (
                <div className="fixed-footer">
                    <div className="footer-content">

                        {role !== 'admin' && !location.pathname.includes("/trainerManagement/") && (
                            <div className="back-to-mainpage-button">
                                <button onClick={() => handleBackToMainPage()}>
                                    Back to MainPage
                                </button>
                            </div>)}


                        {isEditMode && (
                            <div className="edit-actions">
                                <div className="option-cancel-button">
                                    <button onClick={showCancelModal}>Cancel</button>
                                </div>
                                <div className="option-save-button">
                                    <button
                                        onClick={handleSaveChange}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <span className="save-loading">
                                                <LoadingOutlined /> Saving...
                                            </span>
                                        ) : (
                                            "Save changes"
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Modal
                title="Confirm Delete Skill"
                visible={isPopupDeleteSkillVisible}
                onOk={confirmDeleteSkill}
                onCancel={showPopupDeleteSkillClose}
                okText="Yes, Delete"
                cancelText="No"
            >
                <p>Are you sure you want to delete this skill?</p>
            </Modal>

            <Modal
                title="Confirm Delete Certificate"
                visible={isPopupDeleteCertidicateVisible}
                onOk={confirmDeleteCertificate}
                onCancel={showPopupDeleteCertidicateClose}
                okText="Yes, Delete"
                cancelText="No"
            >
                <p>Are you sure you want to delete this certificate?</p>
            </Modal>

            <Modal
                title="Cancel Edit Mode"
                visible={isCancelModalVisible}
                onOk={handleCancelEdit}
                onCancel={handleCancelModalClose}
                okText="Yes, Cancel"
                cancelText="No"
            >
                <p>Are you sure you want to exit edit mode? Unsaved changes will be lost.</p>
            </Modal>
            <Modal
                title="Certificate Preview"
                visible={isPreviewVisible}
                onCancel={() => setIsPreviewVisible(false)}
                footer={null}
                width={800} // Có thể điều chỉnh kích thước
                style={{ top: 20 }}
            >
                <img
                    src={previewImage}
                    alt="Certificate Preview"
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '80vh',
                        objectFit: 'contain'
                    }}
                />
            </Modal>
        </div>
    );
};

export default TrainerInformationProfile;