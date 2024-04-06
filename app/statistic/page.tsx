"use client"

import { Button, Descriptions, Flex } from "antd";
import React, { useEffect, useState } from "react";
import NewRecordForm from "../components/Form/newRecordForm";

 const FormPage = () => {
    const [dataKeys, setDataKeys] = useState<string[]>([]);
    const [currentRecord, setCurrentRecord] = useState<any>({});
  
    useEffect(() => {
      const parsedMetadata = JSON.parse(sessionStorage.getItem("record") || "{}");
      const keys = JSON.parse(sessionStorage.getItem("dataKeys") || "[]");
      setDataKeys(keys);
      setCurrentRecord(parsedMetadata);
    }, []);
  

    return (
        <div>
        <Descriptions size="small" bordered extra={
          <Flex gap="small">
            <Button
              type="primary"
              danger
              onClick={() => {
                sessionStorage.removeItem("record");
                setCurrentRecord({});
              }}
              children="Remove Data"
              disabled={Object.keys(currentRecord).length === 0} 
            />
          </Flex>
        } >
          <Descriptions.Item  labelStyle={{fontWeight: 'bold',color: 'black'}} span={1}>
          <NewRecordForm dataKeys={dataKeys} initialValues={currentRecord} />
          </Descriptions.Item>
        </Descriptions>
      </div>
    ); 
};

export default FormPage;