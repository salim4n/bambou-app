import { DatePicker, Flex, Input, InputNumber, Select, Switch } from "antd";
import { useState } from "react";
import dayjs from 'dayjs';

interface FormGeneratorProps {
    data: any; 
  }
  
  const FormGenerator: React.FC<FormGeneratorProps> = ({ data }) => {
    const [dataType, setDataType] = useState<string | null>(data);
    const [value, setValue] = useState<any>(data);
  
    const handleTypeChange = (value: string | null) => {
        setDataType(value);
      };
    
      const handleValueChange = (newValue: any) => {
        setValue(newValue);
      };
  
    const renderInputField = () => {
        try{
            switch (dataType) {
                case "string":
                  return <Input type="text" value={value} onChange={e => handleValueChange(e.target.value)} />;
                case "number":
                  return <InputNumber value={value} onChange={handleValueChange} />;
                case "boolean":
                  return <Switch checked={value} onChange={handleValueChange} />;
                  case "date":
                    const isValidDate = dayjs(value).isValid();
                    if (!isValidDate) {
                      console.error(`Invalid date: ${value}`);
                      return <DatePicker  onChange={date => handleValueChange(date.toDate())} />;
                    }
                    return <DatePicker value={dayjs(value)} onChange={date => handleValueChange(date.toDate())} />;
                default:
                  return null;
              }
        }catch(e){
            console.log(e)
        }
      };
  
    return (
        <Flex vertical gap='small'>
        <Select onChange={handleTypeChange} placeholder="Select data type" >
          <Select.Option value="string">String</Select.Option>
          <Select.Option value="number">Number</Select.Option>
          <Select.Option value="boolean">Boolean</Select.Option>
          <Select.Option value="date">Date</Select.Option>
        </Select>
        {renderInputField()}
      </Flex>
    );
  };
  
  export default FormGenerator;