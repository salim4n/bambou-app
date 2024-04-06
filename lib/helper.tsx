
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {loadJsonFile} from 'load-json-file';

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
