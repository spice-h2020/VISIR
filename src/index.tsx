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

const perspectiveA = myURL.searchParams.get("perspective1");
const perspectiveB = myURL.searchParams.get("perspective2");

console.log(perspectiveA);
console.log(perspectiveB);
root.render(
  //<React.StrictMode>
    <App
      perspectiveId1={perspectiveA}
      perspectiveId2={perspectiveB}
    />
  //</React.StrictMode>
);