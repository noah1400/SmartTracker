import React, { FC } from 'react';

interface MyComponentProps {
  name: string;
}

function MyComponent(){
  return (
    <div>
      <h1>Hello World,</h1>
      <p>This is a simple TypeScript React component.</p>
    </div>
  );
};

export default MyComponent;
