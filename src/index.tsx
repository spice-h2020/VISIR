import ReactDOM from 'react-dom/client';
import { App } from './App';

import { faS, faFileArrowDown, faGear, faFloppyDisk, faArrowsRotate, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

library.add(faS, faFileArrowDown, faGear, faFloppyDisk, faArrowsRotate, faScrewdriverWrench);

library.add(faS, faFileArrowDown, faGear, faFloppyDisk, faArrowsRotate, faScrewdriverWrench);


const myURL = new URL(window.location.href);

/**
 * DEBUG: This is intended as testing to check the url parameters
 */
// if (!myURL.searchParams.get("perspective1") && !myURL.searchParams.get("perspective2")) {
//   window.location.href = `${window.location.href}?perspective1=5&perspective2=6`;
// }

const perspectiveA = myURL.searchParams.get("perspective1");
const perspectiveB = myURL.searchParams.get("perspective2");

root.render(
  //<React.StrictMode>
  <App
    perspectiveId1={perspectiveA}
    perspectiveId2={perspectiveB}
  />
  //</React.StrictMode>
);