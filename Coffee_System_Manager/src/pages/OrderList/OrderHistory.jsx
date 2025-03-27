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
                "orders"
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
            width: 120,
            dataIndex: 'productCode',
            fixed: 'left',
        },
        {
            title: 'Tên sản phẩm',
            width: 130,
            dataIndex: 'productName',
        },

        {
            title: 'Giá sản phẩm',
            width: 130,
            dataIndex: 'price',
        },
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