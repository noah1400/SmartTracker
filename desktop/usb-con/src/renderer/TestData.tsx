import React, { useEffect, useState } from 'react';

const SerialPortComponent: React.FC = () => {
  const [data, setData] = useState<any>(null);
  
  const fetchDataFromMain = async () => {
    try {
      const result = await window.electron.ipcRenderer.on('data', (event, arg) => {
        console.log(arg);
        setData(result);
      }); 
    } catch (error) {
      console.error('Error fetching data from main process:', error);
    }
  };
  
  useEffect(() => {
    // Call the function to fetch data
    fetchDataFromMain();
  }, []);

  return (
    <div>
      <h2>Data from Main Process:</h2>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default SerialPortComponent;
