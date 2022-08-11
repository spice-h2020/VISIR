//WIP component
import React, { useEffect, useState } from 'react';
import './style/base.css';

import { Navbar } from './basicComponents/Navbar';
import { Button } from './basicComponents/Button';
import { FileSourceDropdown } from './components/FileSourceDropdown';
import { LayoutDropdown } from './components/LayoutDropdown';
import { OptionsDropdown } from './components/OptionsDropdown';

import RequestManager from './managers/requestManager';
import { FileSource, tbOptions, AllPerspectives, isAllPerspectivesValid, ButtonState } from './constants/toolbarOptions';
import { Layouts } from './constants/perspectivesTypes';
import { SelectPerspectiveDropdown } from './components/SelectPerspectiveDropdown';
import { PerspectivesGroups } from './components/PerspectivesGroup';
import ViewManager from './managers/viewManager';


const requestManager = new RequestManager();
const layoutManager = new ViewManager();

function App() {

  const [perspectivesState, setPerspectivesState] = useState(new Map<string, ButtonState>());
  const [availablePerspectives, setAvailablePerspectives] = useState<AllPerspectives>();
  const [fileSource, setFileSource] = useState<FileSource>(tbOptions.initialFileSource);

  const [layout, setLayout] = useState<Layouts>(tbOptions.initialLayout);

  const perspectiveSelected = (perspectiveKey: string) => {
    const state = perspectivesState.get(perspectiveKey);

    if (state === ButtonState.inactive) {

      setPerspectivesState(new Map(perspectivesState.set(perspectiveKey, ButtonState.loading)));

      requestManager.getPerspective(`${perspectiveKey}.json`)
        .then((response) => {
          if (response.status === 200) {


            ///TODO: Validate that response.data has the correct format of a perspective


            layoutManager.addPerspective(perspectiveKey, response.data);

            setPerspectivesState(new Map(perspectivesState.set(perspectiveKey, ButtonState.active)));

          } else {
            throw new Error(`Perspective ${perspectiveKey} was ${response.statusText}`);
          }
        })
        .catch((error) => {
          setPerspectivesState(new Map(perspectivesState.set(perspectiveKey, ButtonState.inactive)));
          console.log(error);
          alert(error.message);
        });

    } else if (state === ButtonState.active) {
      layoutManager.removePerspective(perspectiveKey);
      setPerspectivesState(new Map(perspectivesState.set(perspectiveKey, ButtonState.inactive)));
    }
  }

  //Update all available perspectives when the source file changes
  useEffect(() => {
    requestManager.changeBaseURL(fileSource);
    layoutManager.clearPerspectives();

    requestManager.getAllPerspectives()
      .then((response) => {
        if (response.status === 200) {
          const allPerspectivesFile = JSON.parse(response.data);

          if (isAllPerspectivesValid(allPerspectivesFile)) {

            const newPerspectivesState = new Map<string, ButtonState>();
            for (let i = 0; i < allPerspectivesFile.names.length; i++) {
              newPerspectivesState.set(allPerspectivesFile.names[i], ButtonState.inactive);
            }

            setPerspectivesState(newPerspectivesState);
            setAvailablePerspectives(allPerspectivesFile);

          } else {
            throw new Error(`The format of all perspectives is incorrect`);
          }

        } else {
          throw new Error(`All perspectives info was ${response.statusText}`);
        }
      })
      .catch((error) => {
        setAvailablePerspectives(undefined);
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
          <LayoutDropdown
            onClick={setLayout}
          />,
          <OptionsDropdown />,
        ]}
        midAlignedItems={[
          <SelectPerspectiveDropdown
            onClick={perspectiveSelected}
            allPerspectives={availablePerspectives}
            itemsState={perspectivesState}
          />,

        ]}
        rightAlignedItems={[
          <Button
            content={"Legend"}
          />,
        ]}
      />
      <h1> Communities Visualization</h1>
      <PerspectivesGroups
        perspectivePairs={layoutManager.activePerspectivePairs}
        layout={layout}
      />
    </div>
  );
}

export default App;
