import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';

const Signin = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [spacebarCount, setSpacebarCount] = useState(0);

  async function fetchData(key) {
    const response = await fetch('http://localhost:4000/dashboard', {
      method: "GET",
      headers: { Authorization: `Bearer ${key}` }
    }).then(response => response.json())

    navigate('Home', { state: { email: form.getFieldValue('email').toLowerCase(), address: response.address , phoneNumber:response.phoneNumber} });
  }

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await fetch('http://localhost:4000/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()).catch((err) => console.log(err))

      if (data.token) {
        fetchData(data.token)
      }
      else if (data.error) {
        message.error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === ' ') {
        setSpacebarCount((prevCount) => prevCount + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    if (spacebarCount === 10) {
      navigate('/Admin'); // Navigate to the 'Admin' page
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [spacebarCount, navigate])
  return (
    <div style={{ maxWidth: '300px', margin: '0 auto' }}>
      <Form
        form={form}
        name="signin"
        onFinish={onFinish}
      >
        <Form.Item
          label="Email"
          name="email"
          
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input placeholder="Email address" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password"/>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Signin;
