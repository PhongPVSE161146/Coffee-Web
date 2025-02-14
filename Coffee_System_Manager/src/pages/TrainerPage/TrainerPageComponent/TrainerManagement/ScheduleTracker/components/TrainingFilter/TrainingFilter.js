import React from "react";
import { DatePicker, Input, Select, Row, Col } from "antd";
import "./TrainingFilter.css";
import dayjs from 'dayjs'; // Import dayjs để xử lý ngày

const { Option } = Select;

const TrainingFilter = ({
    classes,
    modules,
    deliveryTypes, // Nhận Delivery Types từ props
    trainingFormats, // Nhận Training Formats từ props
    validScheduleDates, // Nhận các ngày hợp lệ từ props
    showModuleFilter,
    showOtherFilters,
    onClassChange,
    onModuleChange,
    onDeliveryTypeChange,
    onTrainingFormatChange,
    onDateChange,
    onSearchChange,
}) => {

    // Hàm để vô hiệu hóa các ngày không có trong dữ liệu
    const disabledDate = (current) => {
        if (validScheduleDates.length === 0) return false;
        return !validScheduleDates.some(date => dayjs(date).isSame(current, 'day'));
    };

    return (
        <div className="report-form-container">
            <Row gutter={16} style={{ width: "100%" }}>
                {/* Hiển thị filter Class */}
                <Col span={6}>
                    <div className="form-item">
                        <label className="form-label">Class</label>
                        <Select
                            placeholder="Select Class"
                            className="form-select"
                            onChange={onClassChange}
                        >
                            {classes.map((classItem) => (
                                <Option key={classItem.id} value={classItem.id}>
                                    {classItem.name}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </Col>

                {/* Hiển thị filter Module chỉ khi đã chọn Class */}
                {showModuleFilter && (
                    <Col span={6}>
                        <div className="form-item">
                            <label className="form-label">Module</label>
                            <Select
                                placeholder="Select Module"
                                className="form-select"
                                onChange={onModuleChange}
                            >
                                {modules.map((moduleItem) => (
                                    <Option key={moduleItem.id} value={moduleItem.id}>
                                        {moduleItem.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </Col>
                )}

                {/* Hiển thị các filter khác và thanh search sau khi chọn Module */}
                {showOtherFilters && (
                    <>
                        <Col span={4}>
                            <div className="form-item">
                                <label className="form-label">Delivery Type</label>
                                <Select className="form-select" onChange={onDeliveryTypeChange}>
                                    <Option value="">Select All</Option>
                                    {deliveryTypes.map((type, index) => (
                                        <Option key={index} value={type}>{type}</Option>
                                    ))}
                                </Select>
                            </div>
                        </Col>

                        <Col span={4}>
                            <div className="form-item">
                                <label className="form-label">Training Format</label>
                                <Select className="form-select" onChange={onTrainingFormatChange}>
                                    <Option value="">Select All</Option>
                                    {trainingFormats.map((format, index) => (
                                        <Option key={index} value={format}>{format}</Option>
                                    ))}
                                </Select>
                            </div>
                        </Col>

                        <Col span={4}>
                            <div className="form-item">
                                <label className="form-label">Schedule Date</label>
                                <DatePicker
                                    className="form-date-picker"
                                    format="DD/MM/YYYY"
                                    disabledDate={disabledDate} // Áp dụng logic vô hiệu hóa ngày
                                    onChange={onDateChange}
                                />
                            </div>
                        </Col>

                        <Col span={6}>
                            <div className="form-item" >
                                <label className="form-label">Search</label>
                                <Input
                                    placeholder="Enter class code, class name"
                                    className="form-input"
                                    onChange={(e) => onSearchChange(e.target.value)}
                                />
                            </div>
                        </Col>
                    </>
                )}
            </Row>
        </div>
    );
};

export default TrainingFilter;
