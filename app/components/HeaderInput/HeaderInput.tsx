"use client";


import { Button, Spin, Upload, UploadProps, message } from "antd"
import { UploadOutlined } from '@ant-design/icons';
import {  getDataKeys, readExcelFile } from "@/lib/helper";
import { useState } from "react"; 
const { v4: uuidv4 } = require('uuid');

export const HeaderInput = () => {

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
                const parsedMetadata: any = await readExcelFile(info.file.originFileObj as File);
                console.table(parsedMetadata);
                //ici ajout uuid avec la bibliotheque uuid
                parsedMetadata.forEach((record: any) => {
                  record.uuid = uuidv4();
                });
                sessionStorage.setItem("data", JSON.stringify(parsedMetadata));
                sessionStorage.setItem("dataKeys", JSON.stringify(getDataKeys(parsedMetadata[0])));
              } catch (e) {
                console.error("Erreur lors de la lecture du fichier", e);
                message.error("Erreur lors de la lecture du fichier");
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
          <Button ghost icon={<UploadOutlined />}>Telecharger Fichier Excel</Button>
        </Upload>
        {loading && <Spin size="large" fullscreen={true} />}
        </>

    )
}

