//WIP component
import React, { useEffect, useState } from 'react';
import './style/Base.css';

import { Navbar } from './basicComponents/Navbar';
import { Button } from './basicComponents/Button';
import { FileSourceDropdown } from './components/FileSourceDropdown';
import { LayoutDropdown } from './components/LayoutDropdown';
import { OptionsDropdown } from './components/OptionsDropdown';

import RequestManager from './managers/requestManager';
import { FileSource, tbOptions, ButtonState, ViewOptions } from './constants/toolbarOptions';
import { Layouts, AllPerspectives, PerspectiveInfo } from './constants/perspectivesTypes';
import { SelectPerspectiveDropdown } from './components/SelectPerspectiveDropdown';
import { PerspectivesGroups } from './components/PerspectivesGroup';
import ViewDataManager from './managers/viewDataManager';
import {validateAllPerspectivesJSON, validatePerspectiveJSON } from './constants/perspectiveValidation';

const requestManager = new RequestManager();
const viewDataManager = new ViewDataManager();

function App() {

  const [perspectivesState, setPerspectivesState] = useState(new Map<number, ButtonState>());
  const [availablePerspectives, setAvailablePerspectives] = useState<AllPerspectives>();
  const [fileSource, setFileSource] = useState<FileSource>(tbOptions.initialFileSource);
  const [viewOptions, setViewOptions] = useState<ViewOptions>(new ViewOptions());
  const [layout, setLayout] = useState<Layouts>(tbOptions.initialLayout);

  const onHideLabels = (newValue: boolean) => {
    const newViewOptions = Object.assign({}, viewOptions);
    newViewOptions.HideLabels = newValue;
    setViewOptions(newViewOptions);
    return true;
  }

  const onHideEdges = (newValue: boolean) => {
    const newViewOptions = Object.assign({}, viewOptions);
    newViewOptions.HideEdges = newValue;
    setViewOptions(newViewOptions);
    return true;
  }

  const onEdgeWidth = (newValue: boolean) => {
    const newViewOptions = Object.assign({}, viewOptions);
    newViewOptions.EdgeWidth = newValue;
    setViewOptions(newViewOptions);
    return true;
  }

  const onBorder = (newValue: boolean) => {
    const newViewOptions = Object.assign({}, viewOptions);
    newViewOptions.Border = newValue;
    setViewOptions(newViewOptions);
    return true;
  }

  const perspectiveSelected = (perspectiveId: number) => {
    const state = perspectivesState.get(perspectiveId);

    if (state === ButtonState.inactive) {

      setPerspectivesState(new Map(perspectivesState.set(perspectiveId, ButtonState.loading)));

      requestManager.getPerspective(`${perspectiveId}.json`)
        .then((response) => {
          if (response.status === 200) {

            const perspectiveJson = validatePerspectiveJSON(JSON.parse(response.data));
            const perspectiveInfo = availablePerspectives?.files.find((element: PerspectiveInfo) => { return element.id === perspectiveId })

            if (perspectiveInfo) {
              viewDataManager.addPerspective(perspectiveInfo, perspectiveJson);
              setPerspectivesState(new Map(perspectivesState.set(perspectiveId, ButtonState.active)));
            }
            else
              throw new Error(`Perspective info of perspective: ${perspectiveId} was not found`);

          } else {
            throw new Error(`Perspective ${perspectiveId} was ${response.statusText}`);
          }
        })
        .catch((error) => {
          setPerspectivesState(new Map(perspectivesState.set(perspectiveId, ButtonState.inactive)));

          console.log(error);
          alert(error.message);
        });

    } else if (state === ButtonState.active) {
      viewDataManager.removePerspective(perspectiveId);
      setPerspectivesState(new Map(perspectivesState.set(perspectiveId, ButtonState.inactive)));
    }
  }

  //Update all available perspectives when the source file changes
  useEffect(() => {
    requestManager.changeBaseURL(fileSource);
    viewDataManager.clearPerspectives();

    requestManager.getAllPerspectives()
      .then((response) => {
        if (response.status === 200) {

          const allPerspectivesFile = validateAllPerspectivesJSON(JSON.parse(response.data));

          const newPerspectivesState = new Map<number, ButtonState>();
          for (let i = 0; i < allPerspectivesFile.files.length; i++) {
            newPerspectivesState.set(allPerspectivesFile.files[i].id, ButtonState.inactive);
          }

          setPerspectivesState(newPerspectivesState);
          setAvailablePerspectives(allPerspectivesFile);

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
          <OptionsDropdown
            onHideLabels={onHideLabels}
            onHideEdges={onHideEdges}
            onEdgeWidth={onEdgeWidth}
            onBorder={onBorder}
          />,
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
        perspectivePairs={viewDataManager.activePerspectivePairs}
        layout={layout}
        viewOptions={viewOptions}
      />
    </div>
  );
}

export default App;
