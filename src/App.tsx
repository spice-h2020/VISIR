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
import { SelectPerspectiveDropdown, isAllPerspectivesValid, AllPerspectives } from './components/SelectPerspectiveDropdown';

const requestManager = new RequestManager();

function App() {

  const [availablePerspectives, setAvailablePerspectives] = useState<Object>({});
  const [fileSource, setFileSource] = useState<FileSource>(tbOptions.initialFileSource);

  useEffect(() => {
    requestManager.changeBaseURL(fileSource);

    requestManager.getAllPerspectives()
      .then((response) => {
        console.log("Perspectives Received");
        if (response.status === 200) {
          const allPerspectivesFile = JSON.parse(response.data);
          setAvailablePerspectives(allPerspectivesFile)
        } else {
          throw new Error(`All perspectives info was ${response.statusText}`);
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  }, [fileSource])


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
          <SelectPerspectiveDropdown
            onClick={(key: string) => console.log(`Seleccionado ${key}`)}
            perspectivesJSON={availablePerspectives as AllPerspectives}
            isValid={isAllPerspectivesValid(availablePerspectives)}
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
