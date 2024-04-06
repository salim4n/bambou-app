"use client";

import { Button, Spin, Upload, UploadProps, message } from "antd"
import { UploadOutlined } from '@ant-design/icons';
import {  getDataKeys,  readCsvFile,  readExcelFile } from "@/lib/helper";
import { useState } from "react"; 
import React from "react";

const { v4: uuidv4 } = require('uuid');

interface IProps {
  buttonText: string;
  type: "excel" | "csv";
}

export const HeaderInput : React.FC<IProps> = ({buttonText,type}) => {

    const [loading, setLoading] = useState(false);

    const props: UploadProps = {
        name: 'file',
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        headers: {
          authorization: 'authorization-text',
        },
        onChange(info) {
          if (info.file.status !== 'uploading') {
            message.loading('chargement en cours',1);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`).then(async () => {
              try {
                setLoading(true);
                let parsedMetadata: any;
                if (type === "excel") {
                  parsedMetadata = await readExcelFile(info.file.originFileObj as File);
                } else {
                  parsedMetadata = await readCsvFile(info.file.originFileObj as File);
                }
                console.table(parsedMetadata);
                parsedMetadata.forEach((record: any) => {
                  record.uuid = uuidv4();
                });
                sessionStorage.setItem("data", JSON.stringify(parsedMetadata));
                sessionStorage.setItem("dataKeys", JSON.stringify(getDataKeys(parsedMetadata[0])));
              } catch (e) {
                message.error("Erreur lors de la lecture du fichier");
                message.error((e as Error).message);
              } finally {
                setLoading(false);
              }
            });
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };
    
    return (
        <>
        <Upload {...props}>
          <Button ghost icon={<UploadOutlined />} children={buttonText} />
        </Upload>
        {loading && <Spin size="large" fullscreen={true} />}
        </>

    )
}

