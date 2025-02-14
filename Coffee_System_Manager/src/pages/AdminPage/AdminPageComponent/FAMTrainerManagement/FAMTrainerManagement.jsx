// import React, { useEffect, useState } from "react";
// import { Table, Tag, Input, Select, Button, Dropdown, Menu, Form, Modal, Space, Spin, Radio } from "antd";
// import { PlusOutlined, MinusCircleOutlined, MoreOutlined } from "@ant-design/icons";
// import { actData, delData, delData2, fetchData, fetchData2, postData, postData2, putData, putData2 } from "./ApiService/apiService";
// import { showInfoNotification, showSuccessNotification, showWarningNotification } from "../../../../components/Notifications/Notifications";
// import "./FAMTrainerManagement.css";

// const { Search } = Input;
// const { Option } = Select;

// const SkillManagement = () => {
//     const [showTable, setShowTable] = useState("skills");
//     const [isModalVisible, setIsModalVisible] = useState(false); // State để hiển thị Modal
//     const [selectedSkill, setSelectedSkill] = useState(null); // State để lưu skill được chọn
//     const [form] = Form.useForm();
//     const [addForm] = Form.useForm();
//     const [isModalVisible2, setIsModalVisible2] = useState(false); // State để hiển thị Modal
//     const [selectedSkill2, setSelectedSkill2] = useState(null);
//     const [isAddModalVisible, setIsAddModalVisible] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [data, setData] = useState([]);
//     const [data2, setData2] = useState([]);
//     const [searchText, setSearchText] = useState("");
//     const [selectedRole, setSelectedRole] = useState("All Roles");
//     const [selectedSkill3, setSelectedSkill3] = useState("All Skills"); // Lưu giá trị tìm kiếm

//     // Hàm lọc dữ liệu khi tìm kiếm
//     const handleSearch = (value) => {
//         setSearchText(value);
//     };


//     // Hàm lọc dữ liệu dựa trên tìm kiếm
//     const filteredData = (dataSource) => {
//         return dataSource.filter((item) => {
//             const searchTextMatches =
//                 item.role?.toLowerCase().includes(searchText.toLowerCase()); // Đối với roles

//             const statusMatches =
//                 selectedRole === 'All Roles' ||
//                 item.role?.toLowerCase() === selectedRole.toLowerCase(); // Đối với roles khi lọc role cụ thể

//             return statusMatches && searchTextMatches;
//         });
//     };

//     const filteredData2 = (dataSource) => {
//         return dataSource.filter((item) => {
//             const searchTextMatches =
//                 item.skillName?.toLowerCase().includes(searchText.toLowerCase()); // Đối với skills

//             const statusMatches =
//                 selectedSkill3 === 'All Skills' ||
//                 item.skillName?.toLowerCase() === selectedSkill3.toLowerCase(); // Đối với roles khi lọc role cụ thể

//             return statusMatches && searchTextMatches;
//         });
//     };

//     useEffect(() => {
//         loadEvents();
//     }, []);

//     const loadEvents = async () => {
//         try {
//             const response = await fetchData();
//             const response2 = await fetchData2();
//             const filteredData = (response.data || [])
//                 .map((item, index) => ({
//                     ...item,
//                     index: index + 1 // Thêm thuộc tính index tăng dần từ 1
//                 }));
//             const filteredData2 = (response2.data || [])
//                 .map((item, index) => ({
//                     ...item,
//                     index: index + 1 // Thêm thuộc tính index tăng dần từ 1
//                 }));;

//             setData(filteredData);
//             setData2(filteredData2);
//             setLoading(false);
//         } catch (error) {
//             //console.error("Error loading events:", error);
//             setLoading(false);
//         }
//     };

//     const columns1 = [
//         {
//             title: "No.",
//             dataIndex: "index",
//             key: "index",
//         },
//         {
//             title: "Skill",
//             dataIndex: "skillName",
//             key: "skillName",
//         },
//         {
//             title: "Type",
//             dataIndex: "skillType",
//             key: "skillType",
//             render: (skillType) => {
//                 const color = skillType === "PROFESSIONAL" ? "blue" : "green";
//                 return <Tag color={color}>{skillType}</Tag>;
//             },
//         },
//         {
//             title: "Status",
//             key: "status",
//             render: (text, record) => (
//                 <Tag color={record.isDeleted ? "red" : "green"}>
//                     {record.isDeleted ? "Inactive" : "Active"}
//                 </Tag>
//             ),
//         },
//         {
//             title: "Note",
//             dataIndex: "note",
//             key: "note",
//             render: (text) => text,
//         },
//         {
//             title: "Action",
//             key: "action",
//             render: (_, record) => {
//                 const menuItems = record.isDeleted
//                     ? [
//                         {
//                             key: "edit",
//                             label: "Edit",
//                             onClick: () => {
//                                 setSelectedSkill(record);
//                                 setIsModalVisible(true);
//                                 form.setFieldsValue({
//                                     skillName: record.skillName,
//                                     note: record.note,
//                                     levels: Array.isArray(record.levels)
//                                         ? record.levels.map((level) => level.id)
//                                         : [record.levels.id],
//                                     type: record.skillType,
//                                 });
//                             },
//                         },
//                         {
//                             key: "active",
//                             label: "Activate",
//                             onClick: async () => {
//                                 try {
//                                     // Gọi API để kích hoạt lại (Activate)
//                                     await actData(record.id); // Hàm API kích hoạt

//                                     // Cập nhật lại dữ liệu sau khi API thành công
//                                     const response2 = await fetchData();
//                                     const filteredData = (response2.data || []).map((item, index) => ({
//                                         ...item,
//                                         index: index + 1, // Thêm thuộc tính index tăng dần từ 1
//                                     }));
//                                     setData(filteredData);
//                                     showSuccessNotification(`Activated ${record.skillName} successfully!`);
//                                 } catch (error) {
//                                     //console.error("Error activating:", error);
//                                 }
//                             },
//                         },
//                     ]
//                     : [
//                         {
//                             key: "edit",
//                             label: "Edit",
//                             onClick: () => {
//                                 setSelectedSkill(record);
//                                 setIsModalVisible(true);
//                                 form.setFieldsValue({
//                                     skillName: record.skillName,
//                                     note: record.note,
//                                     levels: Array.isArray(record.levels)
//                                         ? record.levels.map((level) => level.id)
//                                         : [record.levels.id],
//                                     type: record.skillType,
//                                 });
//                             },
//                         },
//                         {
//                             key: "inactive",
//                             label: "Deactivate",
//                             onClick: async () => {
//                                 try {
//                                     // Gọi API để chuyển sang "Inactive"
//                                     await delData(record.id); // Hàm API hủy kích hoạt

//                                     // Cập nhật lại dữ liệu sau khi API thành công
//                                     const response2 = await fetchData();
//                                     const filteredData = (response2.data || []).map((item, index) => ({
//                                         ...item,
//                                         index: index + 1, // Thêm thuộc tính index tăng dần từ 1
//                                     }));
//                                     setData(filteredData);
//                                     showSuccessNotification(`Deactivated ${record.skillName} successfully!`);
//                                 } catch (error) {
//                                     //console.error("Error deactivating:", error);
//                                 }
//                             },
//                         },
//                     ];

//                 return (
//                     <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
//                         <Button type="text" icon={<span><MoreOutlined /></span>} />
//                     </Dropdown>
//                 );
//             },
//         }
//     ];

//     const handleOk = () => {
//         form.validateFields().then(async (values) => {
//             const newSkill = {
//                 skillName: values.skillName,
//                 note: values.note || "",
//                 levels: values.levels || [],
//                 skillType: values.type,
//             };
//             try {
//                 const response2 = await putData(newSkill, selectedSkill.id);
//                 const response = await fetchData();
//                 const filteredData = (response.data || [])
//                     .map((item, index) => ({
//                         ...item,
//                         index: index + 1 // Thêm thuộc tính index tăng dần từ 1
//                     }));
//                 setData(filteredData);
//                 form.resetFields();
//                 setIsModalVisible(false);
//                 showSuccessNotification('Update skill successfully!!!');
//             } catch (error) {
//                 showWarningNotification(error.response.data.message);
//                 //console.error("Error saving general info:", error.response.data.message);
//             }
//         }).catch((error) => {
//             // Xử lý lỗi ở đây (nếu có)
//             //console.log("Form validation failed:", error);
//         });
//     };

//     const handleCancel = () => {
//         form.resetFields();
//         setIsModalVisible(false); // Đóng Modal
//     };


//     const columns2 = [
//         {
//             title: "No.",
//             dataIndex: "index",
//             key: "index",
//         },
//         {
//             title: "Role",
//             dataIndex: "role",
//             key: "role",
//         },
//         {
//             title: "Level",
//             dataIndex: "level",
//             key: "level",
//         },
//         {
//             title: "Note",
//             dataIndex: "note",
//             key: "note",
//             render: (text) => (text),
//         },
//         {
//             title: "Status",
//             key: "status",
//             render: (text, record) => (
//                 <Tag color={record.deleted ? "red" : "green"}>
//                     {record.deleted ? "Inactive" : "Active"}
//                 </Tag>
//             ),
//         },
//         {
//             title: "Action",
//             key: "action",
//             render: (_, record) => {
//                 const menuItems = record.deleted
//                     ? [
//                         {
//                             key: "edit",
//                             label: "Edit",
//                             onClick: () => {
//                                 setSelectedSkill2(record); // Lưu thông tin skill được chọn
//                                 setIsModalVisible2(true); // Hiển thị Modal
//                                 form.setFieldsValue({
//                                     projectName: record.role, // Lấy giá trị role từ project đã chọn
//                                     note: record.note,         // Gán note của project
//                                     ranks: record.levels.map(level => level.name) || [],
//                                 });
//                             },
//                         },
//                         {
//                             key: "active",
//                             label: "Activate",
//                             onClick: async () => {
//                                 try {
//                                     // Gọi API để thay đổi trạng thái item sang "Inactive"
//                                     await delData2(record.id);

//                                     // Cập nhật lại dữ liệu sau khi API thành công
//                                     const response2 = await fetchData2();
//                                     const filteredData = (response2.data || [])
//                                         .map((item, index) => ({
//                                             ...item,
//                                             index: index + 1 // Thêm thuộc tính index tăng dần từ 1
//                                         }));
//                                     setData2(filteredData);
//                                     showSuccessNotification(`Set ${record.role} to Activate successfully!`);
//                                 } catch (error) {
//                                     //console.error("Error updating status to inactive:", error);
//                                 }
//                             },
//                         },
//                     ] : [
//                         {
//                             key: "edit",
//                             label: "Edit",
//                             onClick: () => {
//                                 setSelectedSkill2(record); // Lưu thông tin skill được chọn
//                                 setIsModalVisible2(true); // Hiển thị Modal
//                                 form.setFieldsValue({
//                                     projectName: record.role, // Lấy giá trị role từ project đã chọn
//                                     note: record.note,         // Gán note của project
//                                     ranks: record.levels.map(level => level.name) || [],
//                                 });
//                             },
//                         },
//                         {
//                             key: "inactive",
//                             label: "Deactivate",
//                             onClick: async () => {
//                                 try {
//                                     // Gọi API để thay đổi trạng thái item sang "Inactive"
//                                     await delData2(record.id);

//                                     // Cập nhật lại dữ liệu sau khi API thành công
//                                     const response2 = await fetchData2();
//                                     const filteredData = (response2.data || [])
//                                         .map((item, index) => ({
//                                             ...item,
//                                             index: index + 1 // Thêm thuộc tính index tăng dần từ 1
//                                         }));
//                                     setData2(filteredData);
//                                     showSuccessNotification(`Set ${record.role} to Deactivate successfully!`);
//                                 } catch (error) {
//                                     //console.error("Error updating status to inactive:", error);
//                                 }
//                             },
//                         },
//                     ];

//                 return (
//                     <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
//                         <Button type="text" icon={<span><MoreOutlined /></span>} />
//                     </Dropdown>
//                 );

//             },
//         }
//     ];

//     const handleOk2 = () => {
//         form.validateFields().then(async (values) => {

//             const newProject = {
//                 role: values.projectName,
//                 note: values.note || "",
//                 levels: values.ranks?.map((rank) => ({ name: rank })) || [],
//                 deleted: false,
//             };
//             try {
//                 await putData2(newProject, selectedSkill2.id);
//                 const response2 = await fetchData2();
//                 const filteredData = (response2.data || [])
//                     .map((item, index) => ({
//                         ...item,
//                         index: index + 1 // Thêm thuộc tính index tăng dần từ 1
//                     }));
//                 setData2(filteredData);
//                 form.resetFields();
//                 setIsModalVisible2(false);
//                 showSuccessNotification('Update role successfully!!!');
//             } catch (error) {
//                 showWarningNotification(error.response.data.message);
//                 //console.error("Error saving general info:", error);
//             }
//             //console.log("Added Project:", newProject);

//         }).catch((error) => {
//             // Xử lý lỗi ở đây (nếu có)
//             //console.log("Form validation failed:", error);
//         });
//     };

//     const handleCancel2 = () => {
//         setIsModalVisible2(false);
//         form.resetFields();// Đóng Modal
//     };

//     const handleAdd = () => {
//         addForm.validateFields().then(async (values) => {
//             if (showTable === "skills") {
//                 const newProject = {
//                     role: values.projectName,
//                     note: values.note || "",
//                     levels: values.ranks?.map((rank) => ({ name: rank })) || [],
//                     deleted: false,
//                 };
//                 try {
//                     await postData2(newProject);
//                     const response2 = await fetchData2();
//                     const filteredData = (response2.data || [])
//                         .map((item, index) => ({
//                             ...item,
//                             index: index + 1 // Thêm thuộc tính index tăng dần từ 1
//                         }));
//                     setData2(filteredData);
//                     addForm.resetFields();
//                     setIsAddModalVisible(false);
//                     showSuccessNotification('Add role successfully!!!');
//                 } catch (error) {
//                     showWarningNotification(error.response.data.message);
//                     //console.error("Error saving general info:", error);
//                 }
//             } else {
//                 const newSkill = {
//                     skillName: values.skillName,
//                     note: values.note || "",
//                     skillType: values.type,
//                     levels: [1, 2],
//                 };
//                 try {
//                     await postData(newSkill);
//                     const response = await fetchData();
//                     const filteredData = (response.data || [])
//                         .map((item, index) => ({
//                             ...item,
//                             index: index + 1 // Thêm thuộc tính index tăng dần từ 1
//                         }));
//                     setData(filteredData);
//                     addForm.resetFields();
//                     setIsAddModalVisible(false);
//                     showSuccessNotification('Add skill successfully!!!');
//                 } catch (error) {
//                     showWarningNotification(error.response.data.message);
//                     //console.error("Error saving general info:", error);
//                 }

//             }
//         }).catch((error) => {
//             // Xử lý lỗi ở đây (nếu có)
//             //console.log("Form validation failed:", error);
//         });
//     };


//     const handleCancelAdd = () => {
//         setIsAddModalVisible(false);
//         addForm.resetFields();
//     };
//     return (
//         <div>
//             {loading ? (
//                 <div style={{ textAlign: 'center', marginTop: '50px' }}>
//                     <Spin size="large" />
//                     <p>Loading...</p>
//                 </div>
//             ) : (
//                 <div >
//                     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: " 0 10px" }}>
//                         <h4>Trainer Management</h4>
//                         <div className="tm-add-btn" style={{ marginLeft: 8 }} onClick={() => setIsAddModalVisible(true)}>
//                             Add
//                         </div>
//                     </div>

//                     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgb(165, 165, 165)", padding: "15px" }}>
//                         <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//                             <div
//                                 className={`tm-sl-btn ${showTable === 'skills' ? 'active' : ''}`}
//                                 onClick={() => {
//                                     setShowTable('skills');
//                                     setSearchText("");
//                                 }}
//                             >
//                                 Role Management
//                             </div>
//                             <div
//                                 className={`tm-sl-btn ${showTable === 'projects' ? 'active' : ''}`}
//                                 onClick={() => {
//                                     setShowTable('projects');
//                                     setSearchText("");
//                                 }}
//                                 style={{ marginLeft: 15 }}
//                             >
//                                 Skill Management
//                             </div>
//                         </div>

//                     </div>
//                     <div style={{ padding: 24, paddingTop: 0, width: "auto" }}>

//                         {/* Nút chuyển đổi */}


//                         {/* Hiển thị bảng dựa vào trạng thái */}
//                         {showTable === "skills" ? (
//                             <>
//                                 <div style={{ marginBottom: 16 }}>
//                                     {/* <Select
//                                         value={selectedRole}
//                                         onChange={setSelectedRole}
//                                         style={{ width: 200, marginRight: 8 }}
//                                     >
//                                         <Option key={'all'} value="All Roles">All Roles</Option>
//                                         {data2.map((item) => (
//                                             <Option key={item.id} value={item.role}>
//                                                 {item.role}
//                                             </Option>
//                                         ))}
//                                     </Select> */}
//                                     <Search
//                                         placeholder="Enter keyword"
//                                         style={{ width: 200 }}
//                                         value={searchText}
//                                         onChange={(e) => handleSearch(e.target.value)} // Gọi handleSearch khi thay đổi
//                                     />
//                                 </div>
//                                 <Table
//                                     bordered={false}
//                                     dataSource={filteredData(data2)}
//                                     columns={columns2}
//                                     pagination={{
//                                         showSizeChanger: true,
//                                         pageSizeOptions: ["5", "10", "20", "30", "50"],
//                                         defaultPageSize: 5,
//                                         showQuickJumper: true,
//                                     }}
//                                     rowKey="id"
//                                 />
//                                 <Modal
//                                     title="Edit Role"
//                                     open={isModalVisible2}
//                                     onCancel={handleCancel2}
//                                     footer={[
//                                         <div style={{ display: "flex", alignItems: 'center', justifyContent: 'flex-end' }}>
//                                             <div className="tm-cancel-btn" onClick={handleCancel2}>
//                                                 Cancel
//                                             </div>
//                                             <div className="tm-save-btn" onClick={handleOk2}>
//                                                 Save
//                                             </div>
//                                         </div>
//                                     ]}
//                                 >
//                                     <Form form={form} layout="vertical" initialValues={{
//                                         projectName: selectedSkill2?.role, // Lấy giá trị role từ project đã chọn
//                                         note: selectedSkill2?.note,         // Gán note của project
//                                         ranks: selectedSkill2?.levels?.map(level => level.name) || [], // Gán ranks từ levels
//                                     }}>
//                                         <Form.Item
//                                             name="projectName"
//                                             label="Role"
//                                             rules={[{ message: "Please enter project name!" }]}
//                                         >
//                                             <Input />
//                                         </Form.Item>

//                                         <Form.Item
//                                             name="rank"
//                                             label="Rank"
//                                         >
//                                             <Form.List name="ranks">
//                                                 {(fields, { add, remove }) => (
//                                                     <>
//                                                         {fields.map(({ key, name, fieldKey, ...restField }) => (
//                                                             <Space key={key} align="baseline" style={{ width: "100%", display: "flex" }}>
//                                                                 <Form.Item
//                                                                     {...restField}
//                                                                     name={[name]}
//                                                                     fieldKey={[fieldKey]}
//                                                                     rules={[{ required: true, message: "Please enter rank!" }]}
//                                                                     style={{ width: "450px" }}
//                                                                 >
//                                                                     <Input placeholder={`Rank ${name + 1}`} />
//                                                                 </Form.Item>
//                                                                 <MinusCircleOutlined onClick={() => remove(name)} />
//                                                             </Space>
//                                                         ))}
//                                                         <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
//                                                             Add Rank
//                                                         </Button>
//                                                     </>
//                                                 )}
//                                             </Form.List>
//                                         </Form.Item>

//                                         <Form.Item name="note" label="Note">
//                                             <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
//                                         </Form.Item>
//                                     </Form>
//                                 </Modal>
//                             </>
//                         ) : (
//                             <>
//                                 <div style={{ marginBottom: 16 }}>
//                                     {/* <Select
//                                         value={selectedSkill3}
//                                         onChange={setSelectedSkill3}
//                                         style={{ width: 200, marginRight: 8 }}
//                                     >
//                                         <Option key={'all'} value="All Skills">All Skills</Option>
//                                         {data.map((item) => (
//                                             <Option key={item.id} value={item.skillName}>
//                                                 {item.skillName}
//                                             </Option>
//                                         ))}
//                                     </Select> */}
//                                     <Search
//                                         placeholder="Enter keyword"
//                                         style={{ width: 200 }}
//                                         value={searchText}
//                                         onChange={(e) => handleSearch(e.target.value)} // Gọi handleSearch khi thay đổi
//                                     />
//                                 </div>
//                                 <Table
//                                     bordered={false}
//                                     dataSource={filteredData2(data)}
//                                     columns={columns1}
//                                     pagination={{
//                                         showSizeChanger: true,
//                                         pageSizeOptions: ["5", "10", "20", "30", "50"],
//                                         defaultPageSize: 5,
//                                         showQuickJumper: true,
//                                     }}
//                                     rowKey="id"
//                                 />
//                                 <Modal
//                                     title="Edit Skill"
//                                     open={isModalVisible}
//                                     onCancel={handleCancel}
//                                     footer={[
//                                         <div style={{ display: "flex", alignItems: 'center', justifyContent: 'flex-end' }}>
//                                             <div className="tm-cancel-btn" onClick={handleCancel}>
//                                                 Cancel
//                                             </div>
//                                             <div className="tm-save-btn" onClick={handleOk}>
//                                                 Save
//                                             </div>
//                                         </div>
//                                     ]}
//                                 >
//                                     <Form form={form} layout="vertical">
//                                         <Form.Item
//                                             name="skillName"
//                                             label="Skill"
//                                             rules={[{ required: true, message: "Please enter skill name!" }]}
//                                         >
//                                             <Input />
//                                         </Form.Item>
//                                         <Form.Item
//                                             name="type"
//                                             label="Skill type"
//                                         >
//                                             <Radio.Group>
//                                                 <Radio value="PROFESSIONAL"> PROFESSIONAL </Radio>
//                                                 <Radio value="SOFTSKILL"> SOFTSKILL </Radio>
//                                             </Radio.Group>
//                                         </Form.Item>
//                                         <Form.Item
//                                             name="note"
//                                             label="Note"
//                                         >
//                                             <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
//                                         </Form.Item>
//                                         <Form.Item
//                                             name="levels"
//                                         >
//                                         </Form.Item>
//                                     </Form>
//                                 </Modal>

//                             </>
//                         )}
//                         <Modal
//                             title={`Add ${showTable === "skills" ? "Role" : "Skill"}`}
//                             open={isAddModalVisible}
//                             onCancel={handleCancelAdd}
//                             footer={[
//                                 <div style={{ display: "flex", alignItems: 'center', justifyContent: 'flex-end' }}>
//                                     <div className="tm-cancel-btn" onClick={handleCancelAdd}>
//                                         Cancel
//                                     </div>
//                                     <div className="tm-save-btn" onClick={handleAdd}>
//                                         Save
//                                     </div>
//                                 </div>
//                             ]}
//                         >

//                             {showTable === "skills" ? (
//                                 <>
//                                     <Form form={addForm} layout="vertical">
//                                         <Form.Item
//                                             name="projectName"
//                                             label="Role"
//                                             rules={[{ required: true, message: "Please enter role name!" }]}
//                                         >
//                                             <Input />
//                                         </Form.Item>
//                                         <Form.Item
//                                             name="rank"
//                                             label="Rank"
//                                         >
//                                             <Form.List name="ranks">
//                                                 {(fields, { add, remove }) => (
//                                                     <>
//                                                         {fields.map(({ key, name, fieldKey, ...restField }) => (
//                                                             <Space key={key} align="baseline" style={{ width: "100%", display: "flex" }}>
//                                                                 <Form.Item
//                                                                     {...restField}
//                                                                     name={[name]}
//                                                                     fieldKey={[fieldKey]}
//                                                                     rules={[{ required: true, message: "Please enter rank!" }]}
//                                                                     style={{ width: "450px" }}
//                                                                 >
//                                                                     <Input placeholder={`Rank ${name + 1}`} />
//                                                                 </Form.Item>
//                                                                 <MinusCircleOutlined onClick={() => remove(name)} />
//                                                             </Space>
//                                                         ))}
//                                                         <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
//                                                             Add Rank
//                                                         </Button>
//                                                     </>
//                                                 )}
//                                             </Form.List>
//                                         </Form.Item>
//                                         <Form.Item name="note" label="Note">
//                                             <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
//                                         </Form.Item>
//                                     </Form>
//                                 </>
//                             ) : (
//                                 <>
//                                     <Form form={addForm} layout="vertical">
//                                         <Form.Item
//                                             name="skillName"
//                                             label="Skill"
//                                             rules={[{ required: true, message: "Please enter skill name!" }]}
//                                         >
//                                             <Input />
//                                         </Form.Item>
//                                         <Form.Item
//                                             name="type"
//                                             label="Skill type"
//                                         >
//                                             <Radio.Group>
//                                                 <Radio value="PROFESSIONAL"> PROFESSIONAL </Radio>
//                                                 <Radio value="SOFTSKILL"> SOFTSKILL </Radio>
//                                             </Radio.Group>
//                                         </Form.Item>
//                                         <Form.Item
//                                             name="note"
//                                             label="Note"
//                                         >
//                                             <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
//                                         </Form.Item>
//                                     </Form>
//                                 </>

//                             )}

//                         </Modal>
//                     </div>
//                 </div>
//             )}
//         </div>

//     );
// };

// export default SkillManagement;
