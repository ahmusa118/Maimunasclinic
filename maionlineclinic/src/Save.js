import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './Admin.css';
const Save = () => {
   
   
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:4000/admin');
      const jsonData = await response.json();
      setData(jsonData);
     
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please check the network connection.');
    }
  };

  const handleDelivery = async (key) => {
    try {
      await fetch(`http://localhost:4000/deliver/${key}`, { method: 'PUT' });
      setCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error('Error updating delivery:', error);
      alert('Failed to update delivery. Please try again.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [count]);

  // Group items by customeremail and address
  const groupedData = data.reduce((groups, item) => {
    const { customeremail, address,phoneNumber } = item;
    const key = `${customeremail}-${address}-${phoneNumber}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});

  return (
    <div className="admin-container">
          
      <h1>Admin Page</h1>
      {Object.keys(groupedData).map((key) => {
        const items = groupedData[key];
        const { customeremail, address,phoneNumber } = items[0];

        return (
          <div key={key} className="admin-group">
            <div className="admin-group-header">
              <div className="admin-group-info">
                <div className="admin-group-email">{customeremail}</div>
                <div className="admin-group-address">{address}</div>
                <div className="admin-group-address">{phoneNumber}</div>
              </div>
              <FontAwesomeIcon icon={faCheckCircle} className="admin-group-icon" />
            </div>
            {items.map((item) => {
              const { _id, medname, quantity, category, subcategory } = item;

              return (
                <div key={_id} className="admin-item">
                  <div className="admin-item-details">
                    <div className="admin-item-medname"><b>Medicine Name:</b> {medname}</div>
                    <div className="admin-item-quantity"><b>Quantity:</b> {quantity}</div>
                    <div className="admin-item-category"><b>Category:</b> {category}</div>
                    <div className="admin-item-subcategory"><b>Sub Category:</b> {subcategory}</div>
                    <button className="admin-item-button" onClick={() => handleDelivery(_id)}>
                      Mark as Delivered
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
         
   
    </div>
  );
};
export default Save