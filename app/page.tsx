"use client";

import { Button, Spin, Table,message, Select,Modal, Descriptions, Tag } from "antd";
import { ColumnGroupType, ColumnType } from "antd/es/table";
import {  useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { EyeOpenIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { useRouter } from 'next/navigation'

type CustomColumnType<T> = ColumnType<T> | ColumnGroupType<T>;

  const Home =() => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [smsMessage, setSmsMessage] = useState<string>("hello world!");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recordData, setRecordData] = useState(null);
  const [isBordered, setIsBordered] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const parsedMetadata = JSON.parse(sessionStorage.getItem("data") || "[]");
    setData(parsedMetadata);
  }, []);

  const showModal = (record: any) => {
    setIsModalVisible(true);
    setRecordData(record);
  };


  const handleCancel = () => {
    setIsModalVisible(false);
  };


    const generateColumns = (data:any): CustomColumnType<any>[] => {
      const columns: CustomColumnType<any>[]= [];
      if (data && data.length > 0 && data[0]) {
        let maxKeysObj = data[0];
        let maxKeys = Object.keys(data[0]).length;
      
        data.forEach((obj: {}) => {
          const numKeys = Object.keys(obj).length;
          if (numKeys > maxKeys) {
          maxKeys = numKeys;
          maxKeysObj = obj;
          }
        });
      
        const headers = Object.keys(maxKeysObj);
        const action = {
          title: "Action",
          key: "action",
          fixed: "right",
          width: 100,
          render: (record: any) => (
            <>
            <Button 
              type="primary"
              shape="circle"
              onClick={() => showModal(record)}
              icon={<EyeOpenIcon />}
              className="mr-2 bg-blue-400 text-white hover:bg-blue-500"
            />
            <Button 
              type="text"
              className="mr-2 bg-orange-400 text-white hover:bg-orange-500"
              shape="circle"
              onClick={() => {
                sessionStorage.setItem("record", JSON.stringify(record));
                router.push("/statistic")
              } }
              icon={<Pencil1Icon />}
            />
            </>
          ),
        };
        headers.forEach((header) => {
          if (header !== 'uuid') {
            columns.push({
              title: header,
              dataIndex: header,
              key: header,
              width: 200,
              render: (text: any, record: any) => {
                let value = record[header];
                if (typeof value === 'string') {
                  if (value.includes('\r\n')) {
                    value = value.split('\r\n');
                  } else if (value.includes(',')) {
                    value = value.split(',');
                  }
                }
                if (Array.isArray(value)) {
                  return value.map((item: string) => <Tag>{item}</Tag>);
                }
                return value;
              }
            });
          }
        });
        //ts-ignore
        columns.push(action as any);
  
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
      scroll={{ x: 1327,y:800}} 
    />

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
    <Modal 
     open={isModalVisible}
     onCancel={handleCancel}
     width={2000} 
     footer={
      [
        <Button  type="primary" danger={isBordered?true:false} ghost onClick={()=>setIsBordered(!isBordered)}>
          Bordure ?
        </Button>
      ]
      }>
      <Descriptions bordered={isBordered}>
        {recordData && Object.keys(recordData).map(key => (
          key !== 'uuid' &&
          <Descriptions.Item label={key} key={key}>{recordData[key]}</Descriptions.Item>
        ))}
      </Descriptions>
    </Modal>
    {loading && <Spin size="large" fullscreen={true} />}
    </>
  );
}

export default Home;
  
