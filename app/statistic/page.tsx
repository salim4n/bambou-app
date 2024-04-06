"use client"

import { generateInputSwitchType } from "@/lib/formGenerator";
import { FontBoldIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Button, Card, Descriptions, Row, message } from "antd";
import React, { useState } from "react";

 const FormPage = () => {

    const [data, setData] = useState<any>([]);

    React.useEffect(() => {
        const parsedMetadata = JSON.parse(sessionStorage.getItem("record") || "[]");
        setData(parsedMetadata);

        return () => {
            setData([]);
        };
    }, []);
    return (
        <div>

            <Descriptions size="small" bordered extra={<Button type="default" onClick={()=> message.success("done!")} children="Sauvegarder" />} >
            {Object.keys(data).map((key: string, index: number) => (
                   <Descriptions.Item key={index} label={key} labelStyle={{fontWeight: 'bold',color: 'black'}} span={1}>
                       {generateInputSwitchType(data[key])}
                    </Descriptions.Item>
                ))}
            </Descriptions>
        </div>
    );
};

export default FormPage;