import React from 'react';

interface Car {
  model: string;
  brand: string;
  horsepower: number;
}

const carData: Car[] = [
  { model: 'Civic', brand: 'Honda', horsepower: 150 },
  { model: 'Accord', brand: 'Honda', horsepower: 200 },
  { model: 'Mustang', brand: 'Ford', horsepower: 450 },
  { model: 'Camaro', brand: 'Chevrolet', horsepower: 500 },
  { model: 'Model 3', brand: 'Tesla', horsepower: 283 },
];

const CarTable: React.FC = () => {
  return (
    <div>
      <h2>Car Examples</h2>
      <table>
        <thead>
          <tr>
            <th>Model</th>
            <th>Brand</th>
            <th>Horsepower</th>
          </tr>
        </thead>
        <tbody>
          {carData.map((car, index) => (
            <tr key={index}>
              <td>{car.model}</td>
              <td>{car.brand}</td>
              <td>{car.horsepower}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CarTable;
