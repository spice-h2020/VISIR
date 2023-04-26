import ReactDOM from 'react-dom/client';
import { App } from './App';

import { faS, faFileArrowDown, faGear, faFloppyDisk, faArrowsRotate, faScrewdriverWrench, faShare, faBars } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import config from './appConfig.json';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

library.add(faS, faFileArrowDown, faGear, faFloppyDisk, faArrowsRotate, faScrewdriverWrench, faShare, faBars);


const myURL = new URL(window.location.href);

const perspectiveA = myURL.searchParams.get("perspective1");
const perspectiveB = myURL.searchParams.get("perspective2");

root.render(
  //<React.StrictMode>
  <App
    perspectiveId1={perspectiveA}
    perspectiveId2={perspectiveB}
    apiURL={config.API_URI}
    apiUSER={config.API_USER}
    apiPASS={config.API_PASS}
  />
  //</React.StrictMode>
);