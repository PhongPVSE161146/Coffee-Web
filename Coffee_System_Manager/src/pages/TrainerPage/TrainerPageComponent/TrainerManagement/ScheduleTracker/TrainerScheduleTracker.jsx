import React, { useState, useEffect } from "react";
import TableReport from "./components/TableReport/TableReport";
import TrainingFilter from "./components/TrainingFilter/TrainingFilter";
import TrainingTable from "./components/TrainingTable/TrainingTable";
import './TrainerScheduleTracker.css';
import { axiosInstance } from "../../../../../axios/Axios";

export default function TrainerScheduleTracker() {
    const [selected, setSelected] = useState('tracker');
    const [scheduleTrackerSelected, setScheduleTrackerSelected] = useState('training');

    // State cho dữ liệu filter
    const [classes, setClasses] = useState([]);
    const [modules, setModules] = useState([]);
    const [deliveryTypes, setDeliveryTypes] = useState([]); // State cho Delivery Type
    const [trainingFormats, setTrainingFormats] = useState([]); // State cho Training Format
    const [validScheduleDates, setValidScheduleDates] = useState([]); // State cho các ngày hợp lệ của Schedule Date
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [showModuleFilter, setShowModuleFilter] = useState(false);
    const [showOtherFilters, setShowOtherFilters] = useState(false);

    const [selectedDeliveryType, setSelectedDeliveryType] = useState("");
    const [selectedTrainingFormat, setSelectedTrainingFormat] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchClassesAndModules = async () => {
            const token = sessionStorage.getItem('accessToken');
            if (!token) {
                //console.error('Token not found');
                return;
            }
            try {
                const response = await axiosInstance.get('/trainers/trainer-report/get-schedule-non-report');
                const { data } = response.data;

                const classes = data.map(item => ({
                    id: item.classId,
                    name: item.className,
                    modules: item.modules.map(module => ({
                        id: module.moduleId,
                        name: module.moduleName
                    }))
                }));
                setClasses(classes);

                // Lấy các giá trị duy nhất cho Delivery Type, Training Format, và Schedule Date
                const uniqueDeliveryTypes = new Set();
                const uniqueTrainingFormats = new Set();
                const uniqueScheduleDates = new Set();

                data.forEach(classItem => {
                    classItem.modules.forEach(moduleItem => {
                        moduleItem.topics.forEach(topic => {
                            topic.contents.forEach(content => {
                                if (content.deliveryType) {
                                    uniqueDeliveryTypes.add(content.deliveryType);
                                }
                                if (content.trainingFormat) {
                                    uniqueTrainingFormats.add(content.trainingFormat);
                                }
                                if (topic.date) {
                                    uniqueScheduleDates.add(topic.date);
                                }
                            });
                        });
                    });
                });

                // Cập nhật state với các giá trị duy nhất
                setDeliveryTypes([...uniqueDeliveryTypes]);
                setTrainingFormats([...uniqueTrainingFormats]);
                setValidScheduleDates([...uniqueScheduleDates]);

            } catch (error) {
                //console.error("Error fetching data:", error);
            }
        };
        fetchClassesAndModules();
    }, []);

    const handleClassChange = (classId) => {
        const selectedClass = classes.find(c => c.id === classId);
        setSelectedClass(selectedClass);
        setModules(selectedClass.modules);
        setShowModuleFilter(true); // Hiển thị filter module sau khi chọn class
        setShowOtherFilters(false); // Ẩn bảng và filter khác trước khi chọn Module
    };

    const handleModuleChange = (moduleId) => {
        setSelectedModule(moduleId);
        setShowOtherFilters(true); // Hiển thị bảng và các filter nhỏ sau khi chọn Module
    };

    const handleScheduleTrackerClick = (item) => {
        setScheduleTrackerSelected(item);
    };

    return (
        <div className="TrainerScheduleTrackerPage">
            {selected === 'tracker' && (
                <div className="options">
                    <a
                        className={scheduleTrackerSelected === 'training' ? 'selected' : ''}
                        onClick={() => handleScheduleTrackerClick('training')}
                    >
                        Training
                    </a>

                    <a
                        className={scheduleTrackerSelected === 'report' ? 'selected' : ''}
                        onClick={() => handleScheduleTrackerClick('report')}
                    >
                        Report
                    </a>
                </div>
            )}

            {scheduleTrackerSelected === 'report' && (
                <div>
                    <TableReport />
                </div>
            )}

            {scheduleTrackerSelected === 'training' && (
                <div>
                    <TrainingFilter
                        classes={classes}
                        modules={modules}
                        deliveryTypes={deliveryTypes} // Truyền Delivery Types từ API
                        trainingFormats={trainingFormats} // Truyền Training Formats từ API
                        validScheduleDates={validScheduleDates} // Truyền validScheduleDates từ API
                        showModuleFilter={showModuleFilter}
                        showOtherFilters={showOtherFilters}
                        onClassChange={handleClassChange}
                        onModuleChange={handleModuleChange}
                        onDeliveryTypeChange={setSelectedDeliveryType}
                        onTrainingFormatChange={setSelectedTrainingFormat}
                        onDateChange={setSelectedDate}
                        onSearchChange={setSearchTerm}
                    />
                    {showOtherFilters && (
                        <TrainingTable
                            // selectedClass={selectedClass}
                            selectedModule={selectedModule}
                            selectedDeliveryType={selectedDeliveryType}
                            selectedTrainingFormat={selectedTrainingFormat}
                            selectedDate={selectedDate}
                            searchTerm={searchTerm}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
