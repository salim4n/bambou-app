import React, { useState } from 'react';
import { Input, Select, Switch, InputNumber, DatePicker, Flex, Button, message } from 'antd';
import dayjs from 'dayjs';
import { PlusIcon } from '@radix-ui/react-icons';
const { v4: uuidv4 } = require('uuid');

interface Props {
  dataKeys: string[];
}

const dataFormGenerator: React.FC<Props> = ({ dataKeys }) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [dataTypes, setDataTypes] = useState<Record<string, string>>({});

  const handleTypeChange = (key: string, value: string) => {
    setDataTypes(prev => ({ ...prev, [key]: value }));
  };

  const handleValueChange = (key: string, value: any) => {
    setValues(prev => ({ ...prev, [key]: value }));
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

  function handleCreate() {
    const uuid = uuidv4();
    const valuesWithUuid = { ...values, uuid };
    message.success(JSON.stringify(valuesWithUuid));
    const data = JSON.parse(sessionStorage.getItem("data") || "[]");
    data.push(valuesWithUuid);
    sessionStorage.setItem("data", JSON.stringify(data));
    message.success("Record created successfully");
  }

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
      <Button 
        className="mr-2 bg-green-400 text-white hover:bg-green-500"
        onClick={() => handleCreate()}
        icon={<PlusIcon />}
        >Create
      </Button>
    </Flex>
  );
};

export default dataFormGenerator;