
import * as XLSX from "xlsx";

export const readExcelFile = (file: File) => {
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
      };
      reader.onerror = (error) => {
        console.error("Error reading Excel file:", error);
        reject(error); 
      };
      reader.readAsBinaryString(file);
    })
  };

  
