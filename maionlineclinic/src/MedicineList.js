import React, { useEffect, useState } from 'react';
import { Table, InputNumber, Button } from 'antd';

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/medicinelist')
      .then((response) => response.json())
      .then((data) => setMedicines(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  const handlePriceChange = (value, medicine) => {
    const updatedMedicines = medicines.map((m) => {
      if (m._id === medicine._id) {
        return { ...m, price: value };
      }
      return m;
    });
    setMedicines(updatedMedicines);
    updateMedicine(medicine._id, { price: value });
  };

  const handleStockChange = (value, medicine) => {
    const updatedMedicines = medicines.map((m) => {
      if (m._id === medicine._id) {
        return { ...m, stock: value };
      }
      return m;
    });
    setMedicines(updatedMedicines);
    updateMedicine(medicine._id, { stock: value });
  };

  const updateMedicine = (id, data) => {
    fetch(`http://localhost:4000/medicines/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((error) => console.error('Error:', error));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (text, record) => (
        <InputNumber
          value={text}
          min={0}
          onChange={(value) => handleStockChange(value, record)}
        />
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Subcategory',
      dataIndex: 'subcategory',
      key: 'subcategory',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => (
        <InputNumber
          value={text}
          min={0}
          precision={2}
          step={0.01}
          onChange={(value) => handlePriceChange(value, record)}
        />
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={medicines} columns={columns} />
    </div>
  );
};

export default MedicineList;
