import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';

const MyComponent: React.FC = () => {
  const [serialData, setSerialData] = useState<string[]>([]);

  useEffect(() => {
    const fetchSerialData = async () => {
      try {
        // Send a request to the main process to get serial data
        const data = await ipcRenderer.invoke('getSerialData');
        setSerialData(data);
      } catch (error) {
        console.error('Error fetching serial data:', error);
      }
    };

    // Fetch serial data when the component mounts
    fetchSerialData();
  }, []);

  return (
    <div>
      <h2>Serial Data Table</h2>
      <table>
        <thead>
          <tr>
            <th>Serial Data</th>
          </tr>
        </thead>
        <tbody>
          {serialData.map((data, index) => (
            <tr key={index}>
              <td>{data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyComponent;
