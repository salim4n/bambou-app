import { DatePicker, Input, Select } from "antd";

export const generateInputSwitchType = (data: any) => {
        if (typeof data === "string") {
            return <Input type="text" value={data} />;
        }
        if (typeof data === "number") {
            return <Input type="number" value={data} />;
        }
        if (typeof data === "boolean") {
            return <Input type="checkbox" checked={data} />;
        }
        if(data instanceof Array){
            return <Select mode="tags" options={data.map(d => { 
                return { label: d, value: d };
            })} />;
        }
        if(data instanceof Date){
            return <DatePicker value={data} />;
        }
        if(data instanceof Object){
            return <Select options={Object.keys(data).map((key) => ({ label: key, value: key }))} />;
        }

};