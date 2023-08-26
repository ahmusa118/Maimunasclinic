import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


const { TextArea } = Input;
const { Option } = Select;

const Load = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:4000/home');
      const jsonData = await response.json();
      setCategories(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please check the network connection.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryChange = (value) => {
    const selectedCategory = categories.find((category) => category.name === value);
    if (selectedCategory) {
      setSubcategories(selectedCategory.subCategory);
    } else {
      setSubcategories([]);
    }
  
    // Check if a subcategory is already selected
    const subcategoryValue = form.getFieldValue('subcategory');
    if (subcategoryValue && selectedCategory && selectedCategory.subCategory.every((subcategory) => subcategory.name !== subcategoryValue)) {
      // Reset the subcategory value if it doesn't exist in the new category
      form.setFieldsValue({ subcategory: undefined });
    }
  };
  

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('stock', values.stock);
    formData.append('category', values.category);
    formData.append('subcategory', values.subcategory);
    formData.append('price', values.price);
    fileList.forEach((file) => {
      formData.append('images', file.originFileObj);
    });
  
    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        // Request was successful
        message.success('Medicine data saved successfully');
        form.resetFields();
        setFileList([]);
      } else {
        // Request encountered an error
        message.error('Error saving medicine data');
        console.error('Error saving med data:', response.status, response.statusText);
      }
    } catch (error) {
      // Network error or other exceptions
      message.error('Error saving medicine data');
      console.error('Error saving med data:', error);
    }
  };
  

  const handleUploadChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-5); // Limit the number of uploaded files to 5
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(fileList);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG images!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter the name' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter the description' }]}>
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item label="Stock" name="stock" rules={[{ required: true, message: 'Please enter the stock quantity' }]}>
        <Input type="number" />
      </Form.Item>
      <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select the category' }]}>
        <Select onChange={handleCategoryChange}>
          {categories.map((category) => (
            <Option key={category.name} value={category.name}>
              {category.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {subcategories?.length > 0 && (
        <Form.Item label="Subcategory" name="subcategory" rules={[{ required: true, message: 'Please select the subcategory' }]}>
          <Select>
            {subcategories.map((subcategory) => (
              <Option key={subcategory.name} value={subcategory.name}>
                {subcategory.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please enter the price' }]}>
        <Input type="number" />
      </Form.Item>
      <Form.Item
        label="Images"
        name="images"
        valuePropName="fileList"
        getValueFromEvent={(e) => e.fileList}
        rules={[{ required: true, message: 'Please upload at least one image' }]}
      >
        
        <Upload
          beforeUpload={beforeUpload}
          onChange={handleUploadChange}
          fileList={fileList}
          maxCount={5}
          accept="image/jpeg,image/png"
        >
          <Button icon={<UploadOutlined />} disabled={fileList.length >= 5}>
            Upload Images
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Load
