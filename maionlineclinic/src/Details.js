import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css'
import './details-container.css'
import { Button, Modal, Typography, Badge,message } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css' 

const { Title, Paragraph, Text } = Typography;


const Details = () => {
    const numPart = Math.floor(1000 + Math.random() * 9000); // generates a 4 digit random number
    const charPart = Array(4).fill(1).map(() => String.fromCharCode(Math.floor(Math.random() * (26)) + 97)).join(''); // generates a 4 character random string
   
    const navigate=useNavigate()
    const [data, setData] = useState([]);
    const [modal,setModal]=useState(false)
    const location = useLocation();
    const [price,setPrice]=useState('')
    const [medname,setMedname]=useState('')
    const [quantity,setQuantity]=useState(0)
    const [category,setCategory]=useState('')
    const [subcategory,setSubcategory]=useState('')
    const [amount,setAmount]=useState(0)
    const [customeraddress,setCustomeraddress]=useState('')
    const [email,setEmail]=useState('')
    const [count,setCount]=useState(0)
    const [counter,setCounter]=useState(0)
    const [orderNumber,setOrderNumber]=useState('')
    const [phoneNumber,setPhoneNumber]=useState('')
    const [stock,setStock]=useState(0)
  
    const updateData = (updatedData) => {
        setData(updatedData);


    }
const increment=()=>{
    setQuantity(quantity+1)
}
const decrement=()=>{
    setQuantity(quantity-1)
}
const toggleModal = (key, stock, medname, subcategory, price, category) => {
    setMedname(medname);
    setCategory(category);
    setSubcategory(subcategory);
    setPrice(price);
    setPhoneNumber(location.state.phoneNumber);
    setStock(stock);
    setEmail(location.state.email);
    setCustomeraddress(location.state.address);
    setOrderNumber(numPart.toString() + charPart);
    setModal(!modal);
  };
  
  const MyModal = ({ children, visible, onCancel, onClose }) => {
    return (
        <Modal
            title="Product Details"
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                  Return
                </Button>,
                <Button key="submit" type="primary" onClick={onClose}>
                  Add to Cart
                </Button>,
            ]}
        >
            {children}
        </Modal>
)
  
  };
  
              useEffect(() => {
                setAmount((price * quantity));
            }, [quantity, price])
            
     
    const sub=(key)=>{
        const updatedData = data.map((item) => {
            if (item._id === key ) {
                return { ...item, page: item.page - 1 };
            }
            return item;
        });
        updateData(updatedData);
    }

    const handleclick = async () => {
        try {
          const response = await fetch('http://localhost:4000/order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              medname,
              category,
              subcategory,
              amount,
              email,
              customeraddress,
              quantity,
              orderNumber,
              phoneNumber,
              price
            }),
          });
  
          const data = await response.json();
if(data.error){
         message.error(data.error)
          
          }
          else{
            message.success('success')
            setCounter(counter+1)}
        } catch (error) {
          console.error('Error:', error);
        }
        
      };
      
    const add = (key) => {
        const updatedData = data.map((item) => {
            if (item._id === key) {
                return { ...item, page: item.page + 1 };
            }
            return item;
        });
        updateData(updatedData);
    }
   const cart=()=>{
    navigate('/cart',{ state: { email: location.state.email, deliveryprice:totalAmount } })
   }
   useEffect(() => {
    if (Array.isArray(location.state.detail)) {
      const fetchData = async () => {
        try {
          const response = await Promise.all(
            location.state.detail.map((item) =>
              fetch(`http://localhost:4000/data/${item._id}`).then((res) => res.json())
            )
          );
          setData(response);
        } catch (error) {
          console.error('Error:', error);
        }
      };
  
      fetchData();
    }
  }, [location.state]);
  
  // Set this to your actual price
    const address = location.state.address;  // Set this to your actual address
    const [totalAmount, setTotalAmount] = useState(0);
  
    useEffect(() => {
      fetch(`http://localhost:4000/distance?address=${encodeURIComponent(address)}`)
        .then(response => response.json())
        .then(data => setTotalAmount(data.totalAmount))
        .catch((error) => {
          console.error('Error:', error);
        });
    }, [address]);
    useEffect(()=>{
        fetch(`http://localhost:4000/ordercount/${location.state.email}`,{method:'GET'}).then(res=>res.json()).then(data=>setCount(data.count))
        
        
    },[counter])
    return (
        <div className="details-container">
        <div className="header">
            {location.state.email}
            <Badge count={count} style={{ backgroundColor: '#52c41a' }}>
                <ShoppingCartOutlined  onClick={cart}  style={{ fontSize: '1.5rem' }}/>
            </Badge>
        </div>
        <MyModal visible={modal} onCancel={() => setModal(false)} onClose={handleclick}>
    <Title>{medname}</Title>
            <Paragraph>Category: {category}</Paragraph>
            <Paragraph>Sub Category: {subcategory}</Paragraph>
            <Paragraph>Amount: {price}</Paragraph>
            <Paragraph>Email: {email}</Paragraph>
            <Paragraph>Customer Address: {customeraddress}</Paragraph>
            <Paragraph>Quantity: {quantity}</Paragraph>
            <Paragraph>Stock: {stock}</Paragraph>
            <Paragraph><strong>Total: {amount}</strong></Paragraph>
            {quantity > 0 && <Button icon={<MinusOutlined />} onClick={decrement} />}
            {stock > quantity && <Button icon={<PlusOutlined />} onClick={increment} />}
        </MyModal>
        {Array.isArray(data) && data.map((i) => {
            return (
                <div key={i._id} className="details-item">
                    <img className="item-image"
                        src={`http://localhost:4000/ind/${i.images[i.page].replace('uploads/', '')}`}
                        alt="Item"
                    />
                    <div className="item-text">
                        <Text>{i.name}</Text>
                        <Text>{i.price}</Text>
                       
                        <div className="item-buttons">
                            {i.page > 0 && <Button icon={<MinusOutlined />} onClick={() => sub(i._id)} />}
                            {i.page < 4 && <Button icon={<PlusOutlined />} onClick={() => add(i._id)} />}
                        </div>
                        <Button type="primary" onClick={() => toggleModal(i._id,i.stock,i.name,i.subcategory,i.price,i.category)}>Buy</Button>
                    </div>
                </div>
            )
        })}
    </div>
 
    );
};

export default Details;
