/**
 * @fileoverview This file is the entry point of the application. Holds the states with all the info necesary for the application, creates the toolbar/navbar component,
 * creates the perspectives Groups component for the visualization and has the necesary managers to request files and load them.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { FileSource, initialOptions, ButtonState, ViewOptions, AppLayout, viewOptionsReducer } from './constants/viewOptions';
import { PerspectiveDetails } from './constants/perspectivesTypes';
import { DimAttribute } from './constants/nodes';
import { validateAllPerspectivesDetailsJSON, validatePerspectiveDataJSON } from './constants/ValidateFiles';
//Packages
import React, { useEffect, useReducer, useState } from 'react';
//Local files
import { Navbar } from './basicComponents/Navbar';
import { Button } from './basicComponents/Button';
import { FileSourceDropdown } from './components/FileSourceDropdown';
import { LayoutDropdown } from './components/LayoutDropdown';
import { OptionsDropdown } from './components/OptionsDropdown';
import RequestManager from './managers/requestManager';
import { SelectPerspectiveDropdown } from './components/SelectPerspectiveDropdown';
import { PerspectivesGroups } from './components/PerspectivesGroup';
import ViewDataManager from './managers/viewDataManager';
import { LegendTooltip } from './components/LegendTooltip';
import './style/base.css';

const requestManager = new RequestManager();
const viewDataManager = new ViewDataManager();

export function App() {
  //State that mantains what perspectives are active, loading or inactive
  const [perspectivesState, setPerspectivesState] = useState(new Map<number, ButtonState>());
  //Holds the details of all available perspectives 
  const [availablePerspectives, setAvailablePerspectives] = useState<PerspectiveDetails[]>();
  //Current file source option of all GET requests
  const [fileSource, setFileSource] = useState<FileSource>(initialOptions.fileSource);
  //Current options that change how the user view each perspective
  const [viewOptions, setViewOptions] = useReducer(viewOptionsReducer, new ViewOptions());
  //Current layout of the active perspectives
  const layout = initialOptions.layout;
  //Current dimension attributes data to create the legend buttons/options
  const [legendData, setLegendData] = useState<DimAttribute[]>([]);
  //Tracks if there is any perspective active in the view area
  const [viewActive, setViewActive] = useState<boolean>(false);

  const updateLegendConfig = (newConfig: Map<string, boolean>) => {
    // if (viewOptions !== undefined) {
    //   const newViewOptions = (JSON.parse(JSON.stringify(viewOptions))) as ViewOptions;

    //   newViewOptions.legendConfig = newConfig
    //   setViewOptions(newViewOptions);
    // }
  }

  useEffect(() => {
    updateAllAvailablePerspectives(fileSource, setPerspectivesState, setAvailablePerspectives);
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
            setFileSource={setFileSource}
          />,
          <OptionsDropdown
            setViewOptions={setViewOptions}
          />,
        ]}
        midAlignedItems={[
          <SelectPerspectiveDropdown
            onClick={singlePerspectiveSelected}
            allPerspectives={availablePerspectives}
            requestManager={requestManager}
          />,

        ]}
        rightAlignedItems={[
          <LegendTooltip
            legendData={legendData}
            activeState={viewActive}
            updateLegendConfig={updateLegendConfig}
          />,
        ]}
      />
      <h1> Communities Visualization</h1>
      <PerspectivesGroups
        perspectivePairs={viewDataManager.activePerspectivePairs}
        nPerspectives={viewDataManager.getNumberOfPerspectives()}
        layout={layout}
        viewOptions={viewOptions}
        setLegendData={setLegendData}
        setViewActive={setViewActive}
      />
    </div>
  );
}

/**
 * Request a new all available perspectives based on the fileSource state and update the state with all available perspectives if the requested file validation was succesfull
 * @param fileSource FileSource of allPerspectives file
 * @param setPerspectivesState Function to set the state of all new perspectives
 * @param setAvailablePerspectives Function to set the state of all available perspectives details
 */
function updateAllAvailablePerspectives(fileSource: FileSource, setPerspectivesState: React.Dispatch<React.SetStateAction<Map<number, ButtonState>>>, setAvailablePerspectives: React.Dispatch<React.SetStateAction<PerspectiveDetails[] | undefined>>) {
  requestManager.changeBaseURL(fileSource);
  viewDataManager.clearPerspectives();

  requestManager.getAllPerspectives()
    .then((response) => {
      if (response.status === 200) {
        const allPerspectivesFile = validateAllPerspectivesDetailsJSON(JSON.parse(response.data));

        const newPerspectivesState = new Map<number, ButtonState>();
        for (let i = 0; i < allPerspectivesFile.length; i++) {
          newPerspectivesState.set(allPerspectivesFile[i].id, ButtonState.inactive);
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
}

const singlePerspectiveSelected = (a: any) => {
  console.log(a);
}
