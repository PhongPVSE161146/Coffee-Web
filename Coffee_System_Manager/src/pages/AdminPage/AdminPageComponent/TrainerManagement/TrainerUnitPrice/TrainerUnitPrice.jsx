import React, { useState, useEffect } from "react";
import { Table, Button, Input, Spin } from "antd";
import "./TrainerUnitPrice.css";
import { deleteData, fetchData, updateData } from "./ApiService/ApiService";
import { DeleteFilled, PlusCircleOutlined } from "@ant-design/icons";
import { showInfoNotification, showSuccessNotification } from "../../../../../components/Notifications/Notifications";

const TrainerUnitPrice = () => {
  const [trainerData, setTrainerData] = useState([]);
  const [deleteUnit, setDeleteUnit] = useState([]);
  const [isUnitPricesOpen, setIsUnitPricesOpen] = useState(false);
  const [isEditingUnitPrice, setIsEditingUnitPrice] = useState(false);
  const [UnitPrices, setUnitPrices] = useState([]);
  const [lastAddedUnitPriceIds, setLastAddedUnitPriceIds] = useState([]);
  const [id, setId] = useState();
  const [loading, setLoading] = useState(true);


  const account = sessionStorage.getItem("accounttrainer");
  const admin = sessionStorage.getItem("username");

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
  //console.log('check role:', role)

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await fetchData(path);
      const unitPricesData = response.data.trainerUnitPrice || [];
      setTrainerData(Array.isArray(unitPricesData) ? unitPricesData : []);
      setUnitPrices(Array.isArray(unitPricesData) ? unitPricesData : []);
      setId(response.data.trainerInfo?.generalInfo?.id || null);

      //console.log('check unitprice data', response.data)
    } catch (error) {
      //console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUnitPrices = () => {
    setIsUnitPricesOpen(!isUnitPricesOpen);
  };

  const handleEditUnitPrice = () => {
    setIsEditingUnitPrice(true);
    showInfoNotification(`Edditing unitprice for ${account}`)
  };


  const UnitPricesEditColumns = [
    {
      title: 'No.',
      render: (text, record, index) => index + 1,
      key: 'no',
      width: '5%',
    },
    {
      title: "Unit Code",
      dataIndex: "unitCode",
      key: "unitCode",
      width: "10%",
      render: (_, record) => (
        <Input
          value={record.unitCode}
          onChange={(e) => handleEditUnitPriceChange(e.target.value, record.id, 'unitCode')}
          placeholder="Enter note"
        />
      ),
    },
    {
      title: "Last Modified Date",
      dataIndex: "lastModifiedDate",
      key: "lastModifiedDate",
      width: "10%",
    },
    {
      title: "Last Modified By",
      dataIndex: "lastModifiedBy",
      key: "lastModifiedBy",
      width: "10%",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "10%",
      render: (_, record) => (
        <Input
          value={record.price}
          onChange={(e) => handleEditUnitPriceChange(e.target.value, record.id, 'price')}
          placeholder="Enter note"
        />
      ),
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      width: '40%',
      render: (_, record) => (
        <Input
          value={record.note}
          onChange={(e) => handleEditUnitPriceChange(e.target.value, record.id, 'note')}
          placeholder="Enter note"
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
          onClick={() => handleDeleteUnitPrice(record.id)}
        />
      ),
    },
  ];

  const handleSaveUnitPrices = async () => {
    const updatedTrainerData = UnitPrices
      .filter(UnitPrice => UnitPrice.isEdited)
      .map(UnitPrice => ({
        trainerId: id,
        id: UnitPrice.id,
        lastModifiedBy: admin,
        lastModifiedDate: new Date().toISOString(),
        note: UnitPrice.note,
        price: UnitPrice.price,
        unitCode: UnitPrice.unitCode,
      }));
    try {
      if (updatedTrainerData.length > 0) {
        await updateData(updatedTrainerData);
        showSuccessNotification(`Update unitprice success!`)
      }
      if (deleteUnit.length > 0) {
        await deleteData(deleteUnit);

      }
      const response = await fetchData(path);
      setTrainerData(response.data.trainerUnitPrice || {});
      setUnitPrices(response.data.trainerUnitPrice || {});
      setIsEditingUnitPrice(false);
      showSuccessNotification(`Save unitprice success!`)
      setDeleteUnit([])
    } catch (error) {
      showInfoNotification(error.response.data.message);

      //console.error("Error saving UnitPrices:", error);
    }
    //console.log(updatedTrainerData)
  };

  const handleDeleteUnitPrice = (id) => {
    const updatedUnitPrices = UnitPrices.filter((UnitPrice) => UnitPrice.id !== id);
    setUnitPrices(updatedUnitPrices);
    if (!lastAddedUnitPriceIds.includes(id) && !deleteUnit.includes(id)) {
      setDeleteUnit((prevDelete) => [...prevDelete, id]);
    } showSuccessNotification(`Delete unitprice ! Save to update`)
  };


  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-GB', options).replace(/,/g, '');
    return formattedDate.split(' ').join('-');
  };

  const handleAddUnitPrice = () => {
    const newUnitPriceId = Date.now();
    const newUnitPrice = {
      id: newUnitPriceId,
      newId: 1,
      unitCode: '',
      lastModifiedDate: formatDate(new Date()),
      lastModifiedBy: admin,
      price: '',
      note: '',
    };

    setLastAddedUnitPriceIds((prevIds) => [...prevIds, newUnitPriceId]);
    setUnitPrices((prevState) => [
      ...(Array.isArray(prevState) ? prevState : Object.values(prevState)),
      newUnitPrice
    ]);
  };

  const UnitPricesColumns = [
    {
      title: "No.",
      render: (text, record, index) => index + 1,
      key: "no",
      width: "5%",
    },
    {
      title: "Unit Code",
      dataIndex: "unitCode",
      key: "unitCode",
      width: "10%",
    },
    {
      title: "Last Modified Date",
      dataIndex: "lastModifiedDate",
      key: "lastModifiedDate",
      width: "10%",
    },
    {
      title: "Last Modified By",
      dataIndex: "lastModifiedBy",
      key: "lastModifiedBy",
      width: "10%",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "10%",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      width: "45%",
    }
  ];



  const handleEditUnitPriceChange = (value, id, field) => {
    const updatedUnitPrices = UnitPrices.map((UnitPrice) => {
      if (UnitPrice.id === id) {
        return {
          ...UnitPrice,
          [field]: value,
          isEdited: true,
        };
      }
      return UnitPrice;
    });

    setUnitPrices(updatedUnitPrices);
  };

  return (
    <div className="confirm-cover">
      {loading ? (
        <div className="confirm-loading"><Spin tip="Loading..." /> </div>
      ) : (
        isEditingUnitPrice ? (
          <>
            <Table
              columns={UnitPricesEditColumns}
              dataSource={UnitPrices || []}
              pagination={false}
              size="small"
              rowKey="id"
              bordered
            />
            <div className="add-button" onClick={handleAddUnitPrice}>
              <span style={{ color: '#5750DF', marginRight: '10px', cursor: 'pointer' }}>
                <PlusCircleOutlined />
                &nbsp; Add new unit price
              </span>
            </div>
            <div className="option-btn">
              <div className="cancel-btn" onClick={() => {
                setIsEditingUnitPrice(false); setUnitPrices(trainerData); setDeleteUnit([]);
                showInfoNotification('Cancel edit unit')
              }}><strong>Cancel</strong></div>
              <Button type="primary" onClick={handleSaveUnitPrices}><strong>Save</strong></Button>
            </div>
          </>
        ) : (
          <>
            <Table
              columns={UnitPricesColumns}
              dataSource={trainerData}
              pagination={false}
              size="small"
              rowKey="id"
              bordered
            />
            {role === 'admin' && (
              <div className="information-edit-button-container">
                <Button type="primary" onClick={handleEditUnitPrice}><strong>Edit and Create</strong></Button>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default TrainerUnitPrice;
