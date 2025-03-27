import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { createStyles } from 'antd-style';
import { useForm } from "antd/es/form/Form";
import { axiosInstance } from "../../axios/Axios";


const useStyle = createStyles(({ css }) => ({
    centeredContainer: css`
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh; 
      width: 85vw; 
      flex-direction: column;
    `,
}));


const OrderHistory = () => {

    const [orderList, setOrderList] = useState([]);
    const { styles } = useStyle();

    async function fetchOrders() {
        try {
            const response = await axiosInstance.get(
                "orders?sortBy=OrderId&isAscending=true&page=1&pageSize=100"
            );
            const data = response?.data?.orders;
            if (Array.isArray(data)) {
                setOrderList(data);
            } else {
                console.warn("Dữ liệu không đúng dạng mảng:", data);
                setOrderList([]);
            }
        } catch (error) {
            console.error("Lỗi fetch đơn hàng:", error);
            setOrderList([]);
        }
    }


    useEffect(() => {
        fetchOrders();
    }, []);

    const columns = [
        {
            title: 'Mã Đơn Hàng',
            width: 150,
            dataIndex: 'orderCode',
            fixed: 'left',
        },
        {
            title: 'Mã Máy',
            width: 100,
            dataIndex: 'machineId',
        },
        {
            title: 'Mã Khách Hàng',
            width: 120,
            dataIndex: 'customerId',
        },
        {
            title: 'Ngày Đặt',
            width: 180,
            dataIndex: 'orderDate',
            render: (text) => new Date(text).toLocaleString("vi-VN"), // Định dạng ngày
        },
        {
            title: 'Tổng Tiền (VND)',
            width: 130,
            dataIndex: 'totalAmount',
            render: (amount) => amount.toLocaleString("vi-VN") + " VND", // Định dạng tiền tệ
        },
        {
            title: 'Mô Tả',
            width: 200,
            dataIndex: 'orderDescription',
        },
        {
            title: 'Trạng Thái',
            width: 150,
            dataIndex: 'status',
            render: (status) => status === 1 ? 'Đã Thanh Toán' : 'Đang Xử Lý',
        }
    ];
    

    return (
        <div>
            <div className={styles.centeredContainer}>
                <Table
                    bordered
                    columns={columns}
                    dataSource={orderList}
                    scroll={{
                        x: 'max-content',
                    }}
                    pagination={{ pageSize: 5 }}
                    style={{ width: "90%", maxWidth: "1200px" }}
                />
            </div>
        </div>

    );
};

export default OrderHistory;