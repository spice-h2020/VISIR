import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
let render;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {

  render = <App />;

} else {
  render =
    <React.StrictMode>
      <App />
    </React.StrictMode>
}

root.render(
  render
);