import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { List, Typography, Button, Row, Col, Popconfirm, message } from 'antd';
import { CreditCardOutlined, ShoppingOutlined, DeleteOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './Cart.css'; // Import your custom CSS file here

const { Title } = Typography;

const Cart = () => {
    const location = useLocation()
    const [dat, setDat] = useState([])
    const [total, setTotal] = useState(0)
 const [arr,setArr]=useState([])
    const checkout = () => {
        var newArray = dat.map(function(item) {
            return {orderNumber:item.orderNumber}
          });
        fetch(`http://localhost:4000/ordernumbers/${location.state.email}/${total}`,{
    method:'POST',
    headers:{
      'content-type':'application/json'
    },
    body:JSON.stringify({
        newArray
    })
  }).then(res=>res.json()).catch(e=>console.log(e));
        const url = `http://localhost:4000/chg/${location.state.email}/${total}`;
        window.open(url);
         


 

    }
  

      

    const confirmDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/deleteOrder/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (result.success) {
                const updatedData = dat.filter((item) => item._id !== id);
                setDat(updatedData);
                message.success('Item removed successfully');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Failed to remove item');
        }
    }

    useEffect(() => {
        fetch(`http://localhost:4000/getorder/${location.state.email}`, { method: 'GET' }).then(res => res.json()).then(data => setDat(data))
    }, [location.state.email])

    useEffect(() => {
        const x = dat.reduce((sum, i) => sum + (i.quantity*i.price), 0) + location.state.deliveryprice
        setTotal(x)
    }, [dat, location.state.deliveryprice])

    return (
        <div className="cart-container">
            <Row justify="center">
                <Col xs={24} md={16} lg={12}>
                    <Title level={2}><ShoppingOutlined /> Cart</Title>
                    <List
                        itemLayout="horizontal"
                        dataSource={dat}
                        renderItem={item => (
                            <List.Item
                                actions={[
                                    <Popconfirm
                                        title="Are you sure you want to remove this item?"
                                        onConfirm={() => confirmDelete(item._id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button icon={<DeleteOutlined />} danger>
                                            Remove
                                        </Button>
                                    </Popconfirm>
                                ]}
                            >
                                <List.Item.Meta
                                    title={item.medname}
                                    description={`Quantity: ${item.quantity}`}
                                />
                                <div>Price: ₦{item.price}</div>
                            </List.Item>
                        )}
                    />
                    <Row justify="space-between" align="middle" className="checkout-section">
                        <div>
                            <Title level={4}>Delivery Price: ₦{location.state.deliveryprice}</Title>
                            <Title level={3}>Total: ₦{total}</Title>
                        </div>
                        <Button type="primary" size="large" icon={<CreditCardOutlined />} onClick={checkout}>Pay</Button>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default Cart
