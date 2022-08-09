import React, { useEffect, useState } from 'react';
import './style/base.css';

import { Navbar } from './components/Navbar';
import { Dropdown } from './components/Dropdown';
import { Button } from './components/Button';
import { FileSourceDropdown } from './components/FileSourceDropdown';
import { LayoutDropdown } from './components/LayoutDropdown';
import { OptionsDropdown } from './components/OptionsDropdown';

import RequestManager from './managers/requestManager';
import { FileSource, tbOptions } from './constants/toolbarOptions';

const requestManager = new RequestManager();

function App() {

  const [availablePerspectives, setAvailablePerspectives] = useState<string[]>([""]);
  const [fileSource, setFileSource] = useState<FileSource>(tbOptions.initialFileSource);

  useEffect(() => {
    requestManager.changeBaseURL(fileSource);
  }, [fileSource])

  useEffect(() => {
    requestManager.getAllPerspectives()
      .then((response) => {
        console.log("Response received");
        console.log(response.data);
        // if (response.status === 200) {
        //     const file = response.data;
        //     this.allPerspectivesFile = JSON.parse(file).files;
        //     this.createEvents()
        // } else {
        //     throw new Error(`All perspectives info was ${response.statusText}`);
        // }
      })
      .catch((error) => {
        console.log("Error received");
        alert(error.message);
      });

  }, [fileSource]);

  return (
    <div>
      <Navbar
        leftAlignedItems={[
          <Button
            content="Visualization module"
            extraClassName="navBar-mainBtn"
            onClick={() => { window.location.reload() }}
          />,
          <FileSourceDropdown
            onClick={setFileSource}
          />,
          <LayoutDropdown />,
          <OptionsDropdown />,
        ]}
        midAlignedItems={[
          <Dropdown
            mainLabel='Select Perspective'
            itemsLabels={["1", "2", "3"]}
            extraClassName="dropdown-dark"
            selectBehaviour="selectDiferents"
          />,

        ]}
        rightAlignedItems={[
          <Button
            content={"Legend"}
          />,
        ]}
      />
      <h1> Communities Visualization</h1>

    </div>
  );
}

export default App;
