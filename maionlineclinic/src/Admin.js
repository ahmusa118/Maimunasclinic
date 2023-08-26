import React, { useState, useEffect } from 'react';

import './Admin.css';
import Load from './Load'
import { Tabs } from 'antd';
import 'antd/dist/reset.css';
import Save from './Save'
import MedicineList from './MedicineList'
const Admin = () => {
    const { TabPane } = Tabs;
    const [activeTab, setActiveTab] = useState('admin');
  
  const handleTabChange = (key) => {
    setActiveTab(key);
  }
 

  return (
    <div className="admin-container">
           <Tabs activeKey={activeTab} onChange={handleTabChange}>
      <TabPane tab="Orders" key="admin">
     <Save />
          </TabPane>
          <TabPane tab="Load Meds" key="load">
        <Load />
      </TabPane>
      <TabPane tab="Update Meds" key="medicinelist">
      <MedicineList />
      </TabPane>
    </Tabs>
    </div>
  );
};

export default Admin;
