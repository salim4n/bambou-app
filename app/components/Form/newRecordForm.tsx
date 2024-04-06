import React, { useEffect, useState } from 'react';
import { Input, Select, Switch, InputNumber, DatePicker, Flex, Button, message } from 'antd';
import dayjs from 'dayjs';
import { PlusIcon } from '@radix-ui/react-icons';
const { v4: uuidv4 } = require('uuid');

interface Props {
  dataKeys: string[];
  initialValues?: Record<string, any>;
}

enum Mode {
  Create,
  Update
}

const NewRecordForm: React.FC<Props> = ({ dataKeys, initialValues = {} }) => {
  const [values, setValues] = useState({ ...initialValues });
  const [dataTypes, setDataTypes] = useState<Record<string, string>>({});
  const [mode, setMode] = useState(Mode.Create);

  
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setMode(Mode.Update);
    } else {
      setMode(Mode.Create);
    }
  }, [initialValues]);

  useEffect(() => {
    setValues({ ...initialValues });
  }, [initialValues]);

  const handleTypeChange = (key: string, value: string) => {
    setDataTypes(prev => ({ ...prev, [key]: value }));
  };

  const handleValueChange = (key: string, value: any) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const createRecord = () => {
    const uuid = uuidv4();
    const valuesWithUuid = { ...values, uuid };
    const data = JSON.parse(sessionStorage.getItem("data") || "[]");
    data.push(valuesWithUuid);
    sessionStorage.setItem("data", JSON.stringify(data));
    message.success("Record created successfully");
    setMode(Mode.Create);
  };

  const updateRecord = () => {
    const data = JSON.parse(sessionStorage.getItem("data") || "[]");
    const index = data.findIndex((record: { uuid: any; }) => record.uuid === initialValues.uuid);
    if (index !== -1) {
      data[index] = values;
      sessionStorage.setItem("data", JSON.stringify(data));
      message.success("Record updated successfully");
    } else {
      message.error("Record not found");
    }
    setMode(Mode.Create);
  };
  
  const renderInputField = (key: string) => {
    const dataType = dataTypes[key];
    const value = values[key];

    switch (dataType) {
      case "string":
        return <Input type="text" value={value} onChange={e => handleValueChange(key, e.target.value)} />;
      case "number":
        return <InputNumber value={value} onChange={value => handleValueChange(key, value)} />;
      case "boolean":
        return <Switch checked={value} onChange={value => handleValueChange(key, value)} />;
      case "multiple":
        return <Select style={{ width: '100%' }}   mode="tags" value={value} onChange={value => handleValueChange(key, value)}   />;
      case "date":
        const isValidDate = dayjs(value).isValid();
        if (!isValidDate) {
          return <DatePicker onChange={date => handleValueChange(key, date ? date.toDate() : null)} />;
        }
        return <DatePicker value={dayjs(value)} onChange={date => handleValueChange(key, date ? date.toDate() : null)} />;
      default:
        return <Input type="text" value={value} onChange={e => handleValueChange(key, e.target.value)} />;
    }
  };

  return (
    <Flex vertical gap='small' style={{ width: '100%' }}>
      {Array.isArray(dataKeys) && dataKeys.map((key) => (
         key !== 'uuid' && (
        <div key={key} style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', color: 'black', display: 'block', marginBottom: '10px' }}>{key}</label>
          <Select style={{ width: '100%', marginBottom: '10px' }} onChange={value => handleTypeChange(key, value)} placeholder="Select data type">
            <Select.Option value="string">String</Select.Option>
            <Select.Option value="number">Number</Select.Option>
            <Select.Option value="boolean">Boolean</Select.Option>
            <Select.Option value="date">Date</Select.Option>
            <Select.Option value="multiple">Multiple</Select.Option>
          </Select>
          <div style={{ width: '100%' }}>
            {renderInputField(key)}
          </div>
        </div>
         )
      ))}
      {mode === Mode.Update ?(
        <Button 
          className="mr-2 bg-orange-400 text-white hover:bg-orange-500"
          onClick={updateRecord}
          icon={<PlusIcon />}
        >
          Update
        </Button>
      ) : (
        <Button 
          className="mr-2 bg-green-400 text-white hover:bg-green-500"
          onClick={createRecord}
          icon={<PlusIcon />}
        >
          Create
        </Button>
      )}
    </Flex>
  );
};


export default NewRecordForm;