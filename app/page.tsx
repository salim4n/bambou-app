"use client";
import { Button, Spin, Table,message, Upload } from "antd";
import { ColumnGroupType, ColumnType } from "antd/es/table";
import { useState } from "react";
import * as XLSX from "xlsx";
import type {  UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

type CustomColumnType<T> = ColumnType<T> | ColumnGroupType<T>;

export default  function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);

  const props: UploadProps = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`).then(async () => {
          try {
            setLoading(true);
            const parsedMetadata: any = await readExcelFile(info.file.originFileObj as File);
            console.table(parsedMetadata);
            setData(parsedMetadata);
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

    const readExcelFile = (file: File) => {
      setLoading(true);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const binaryStr = e.target?.result as string;
          const wb = XLSX.read(binaryStr, { type: "binary" });
          const sheetNames = wb.SheetNames;
          const sheet = wb.Sheets[sheetNames[0]];
          const rawData = XLSX.utils.sheet_to_json(sheet);
          const updatedRawData = rawData.map((row: any) => {
            return row;
          });
          const filteredData = updatedRawData.filter((row: any) => !!row);
          console.log("Filtered Data:", filteredData);
          resolve(filteredData);
          setLoading(false); 
        };
        reader.onerror = (error) => {
          console.error("Error reading Excel file:", error);
          setLoading(false); 
          reject(error); 
        };
        reader.readAsBinaryString(file);
      })
    };
    
    const generateColumns = (data:any): CustomColumnType<any>[] => {
      const columns: CustomColumnType<any>[]= [];
      if (data && data.length > 0 && data[0]) {
        const headers = Object.keys(data[0]);
        headers.forEach((header) => {
          const columnData = data.map((item: { [x: string]: any; }) => item[header]);
          if (columnData.every((value: undefined) => value !== undefined)) {
            columns.push({
              title: header,
              dataIndex: header,
              key: header,
            });
          }
        });
      }
      return columns;
    };

    const sendSms = async (data:any) => {
          try {
            setLoading(true);
            const response = await fetch("/api/sms", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: "Bonjour, ceci est un test de message SMS depuis Bambou App. Merci de ne pas répondre à ce message."
              }),
            });
            console.log("Response:", response);
            if (response.ok) {
              message.success("SMS envoyé avec succès");
            } else {
              message.error("Erreur lors de l'envoi du SMS");
            }
          } catch (error) {
            console.error("Error sending SMS:", error);
          } finally {
            setLoading(false);
          }
    }
    
  return (
      <><div className="text-center m-3 p-3">
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Telecharger Fichier Excel</Button>
      </Upload>
      </div>
      {data.length > 0 && (
        <div className="text-center m-3 p-3">
          <Button className=" bg-blue-400 text-white" onClick={() => sendSms(data)}>
            Envoyer SMS
          </Button>
        </div>
      )}
      <Table
        className="m-3 p-3 divide-indigo-950"
        columns={generateColumns(data)}
        dataSource={data}
        size="small"
        scroll={{ x: 1327,y:300}} 
      />
      <Button className="m-3"  danger onClick={() => setData([])} disabled={data.length === 0}>
        Vider le tableau
      </Button>
      {loading && <Spin size="large" fullscreen={true} />}
    </>
  );
}
  
