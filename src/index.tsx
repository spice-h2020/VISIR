import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

/**
 * DEBUG: This is intended as testing to check the url parameters
 */
const myURL = new URL(window.location.href);

if (!myURL.searchParams.get("perspective1") && !myURL.searchParams.get("perspective2")) {
  window.location.href = `${window.location.href}?perspective1=5&perspective2=6`
}

root.render(
  <React.StrictMode>
    <App
      perspectiveId1={myURL.searchParams.get("perspective1")}
      perspectiveId2={myURL.searchParams.get("perspective2")}
    />
  </React.StrictMode>
);