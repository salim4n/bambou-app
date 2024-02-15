"use client";
import { Button, Spin, Table,message, Upload, Select,Modal, Input } from "antd";
import { ColumnGroupType, ColumnType } from "antd/es/table";
import {  useEffect, useState } from "react";
import * as XLSX from "xlsx";
import type {  UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";

type CustomColumnType<T> = ColumnType<T> | ColumnGroupType<T>;

const authMessage = "bambou";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [smsMessage, setSmsMessage] = useState<string>("hello world!");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [storedPassword, setStoredPassword] = useState<string>("");
  const [canEnter, setCanEnter] = useState<boolean>(false);


  const storePassword = (password:string) => {
    localStorage.setItem("password",password);
    if(password === authMessage){
      message.success("Mot de passe enregistré avec succès");
      setCanEnter(true);
    } else{
      message.error("Mot de passe incorrect");
    }
  }


  if(!canEnter){
    
   return ( 
            <div className="text-center m-3 p-3">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Entrez le mot de passe
              </label>
              <Input className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              type="password"
              value={storedPassword}
              onChange={(e) => setStoredPassword(e.target.value)}
              />
              <Button onClick={() => storePassword(storedPassword)}>
                Valider
              </Button>
              </div>)
  }

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

    const sendSms = async (column:string,smsMessage:string) => {

          try {
            const selectedData = data.map((item: { [x: string]: any; }) => item[column]);
            setLoading(true);
            selectedData.forEach(async (phoneNumber: string) => {
              //verifier que le numero commence par 06 ou 07 ou +336 ou +337
              if (!phoneNumber.match(/^(06|07|\+336|\+337)/)) {
                message.error("Le numéro de téléphone doit commencer par 06, 07, +336 ou +337");
              }
              if(phoneNumber.match(/^(06|07|\+336|\+337)/)){
                const response = await fetch("/api/sms", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    message: smsMessage,
                    tel: phoneNumber.match(/^(06|07)/) ? `+33${phoneNumber.slice(1)}` : phoneNumber,
                  }),
                });
                if (response.ok) {
                  message.success("SMS envoyé avec succès");
                } else {
                  message.error("Erreur lors de l'envoi du SMS");
                }
              }
              
            });
          } catch (error) {
            console.error("Erreur lors de l'envoi du SMS", error);
            message.error("Erreur lors de l'envoi du SMS");
          } finally {
            setLoading(false);
          };
    }

  return  ( 
     <>
     <div className="text-center m-3 p-3">
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Telecharger Fichier Excel</Button>
    </Upload>
    </div>
    {data.length > 0 && (
      <div className="text-center m-3 p-3">
        <Button className=" bg-blue-400 text-white" onClick={() => sendSms(selectedColumn,smsMessage)} disabled={selectedColumn === ""}>
          Envoyer SMS
        </Button>
        <Select
          className="m-3"
          placeholder="Sélectionnez une colonne"
          options={Object.keys(data[0]).map((key) => ({ label: key, value: key }))}
          onChange={(value) => setSelectedColumn(value)}
          />
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
    <Button className="m-3" onClick={() => setModalOpen(true)}>
      Génerer un message
    </Button>
    <Modal
      title="Génerer un message"
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      footer={[
        <Button key="submit" type="default" onClick={() =>{
          message.success("Message généré avec succès");
          setModalOpen(false);
        }}>
          Valider
        </Button>
      ]}
    >
      <TextArea 
      rows={4} 
      value={smsMessage} 
      onChange={(e) => 
      setSmsMessage(e.target.value)} 
      />
    </Modal>
    {loading && <Spin size="large" fullscreen={true} />}
    </>
  );
     
}
  
