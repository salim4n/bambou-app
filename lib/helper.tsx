
import Papa from "papaparse";
import * as XLSX from "xlsx";

export const readExcelFile = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target?.result as string;
        const wb = XLSX.read(binaryStr,  { type: "binary", cellDates: true });
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

  export const readCsvFile = (file: File) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: function(results) {
          resolve(results.data);
        },
        header: true,
        error: function(err) {
          reject(err);
        }
      });
    });
  };

  export const getDataKeys = (data: Record<string, any>) => {
    return Object.keys(data);
  };

  export const createEmptyData = (data: Record<string, any>) => {
    const emptyData: Record<string, any> = {};
    Object.keys(data).forEach(key => {
      emptyData[key] = '';
    });
    return emptyData;
  };

  const checkEveryField = (item: any, filter: string): boolean => {
    try {
      return Object.keys(item).some((key) => {
        if (typeof item[key] === "string" && item[key].toLowerCase().includes(filter.toLowerCase())) 
        return true;
        if (typeof item[key] === "number" && item[key].toString().toLowerCase().includes(filter.toLowerCase())) return true;
        if (item[key] instanceof Date && item[key].toString().toLowerCase().includes(filter.toLowerCase())) return true;
        if (typeof item[key] === "object" && item[key] !== null) {
          return checkEveryField(item[key], filter);
        }
        return false;
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  
  export const filteredList = (list: any[], filter: string) => {
    try {
      return list.filter((item) => checkEveryField(item, filter));
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  
