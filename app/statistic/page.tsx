"use client"

import FormGenerator from "@/app/components/Form/formGenerator";
import { createEmptyData } from "@/lib/helper";
import { Button, Descriptions, Flex, message } from "antd";
import React, { useEffect, useState } from "react";
import NewRecordForm from "../components/Form/newRecordForm";

 const FormPage = () => {

    const [data, setData] = useState<any>([]);
    const [newData, setNewData] = useState<any>({}); 
    const [isCreateMode, setIsCreateMode] = useState(false);


    useEffect(() => {
        const parsedMetadata = JSON.parse(sessionStorage.getItem("record") || "[]");
        setData(parsedMetadata);
        const dataKeys = JSON.parse(sessionStorage.getItem("dataKeys") || "[]");
        setNewData(dataKeys);

    }, []);

    return (
        <div>
            <Descriptions size="small" bordered extra={
            <Flex gap="small">
            <Button
                    type="default"
                    onClick={() => message.success("done!")}
                    children="Save Data"
                    disabled={data.length === 0} 
            />
            <Button
                    type="primary"
                    danger
                    onClick={() => {
                        sessionStorage.removeItem("record");
                        setData([])
                    }}
                    children="Remove Data"
                    disabled={data.length === 0} 
            />
            <Button
                    type="default"
                    ghost
                    onClick={() => setIsCreateMode(true)}
                    children="Create New Record"
                    disabled={data.length !== 0} 
            />
            </Flex>
            } >
                {!isCreateMode && Object.keys(data).map((key: string, index: number) => (
                    <Descriptions.Item key={index} label={key} labelStyle={{fontWeight: 'bold',color: 'black'}} span={1}>
                    <FormGenerator data={data[key]} />
                    </Descriptions.Item>
                ))}
                {isCreateMode && (
                    <Descriptions.Item label="New Record" labelStyle={{fontWeight: 'bold',color: 'black'}} span={1}>
                         <NewRecordForm dataKeys={newData} />
                    </Descriptions.Item>
                )}
                </Descriptions>
        </div>
    ); 
};

export default FormPage;