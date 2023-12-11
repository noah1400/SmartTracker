import React, { FC } from 'react';
import SerialComp from './SerialComp';

interface App {
  name: string;
}

function App(){
  return (
    <div>
      <h1>Hello World,</h1>
      <p>This is a simple TypeScript React component.</p>
      <SerialComp/>
    </div>
  );
};

export default App;