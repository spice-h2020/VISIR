/**
 * @fileoverview This file is the entry point of the application. Holds the states with all the info necesary for the application, creates the toolbar/navbar component,
 * creates the perspectives Groups component for the visualization and has the necesary managers to request files and load them.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { FileSource, initialOptions, ButtonState, ViewOptions, AppLayout } from './constants/viewOptions';
import { PerspectiveDetails } from './constants/perspectivesTypes';
import { DimAttribute } from './constants/nodes';
import { validateAllPerspectivesDetailsJSON, validatePerspectiveDataJSON } from './constants/ValidateFiles';
//Packages
import React, { useEffect, useState } from 'react';
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
  const [viewOptions, setViewOptions] = useState<ViewOptions>(new ViewOptions());
  //Current layout of the active perspectives
  const [layout, setLayout] = useState<AppLayout>(initialOptions.layout);
  //Current dimension attributes data to create the legend buttons/options
  const [legendData, setLegendData] = useState<DimAttribute[]>([]);
  //Tracks if there is any perspective active in the view area
  const [viewActive, setViewActive] = useState<boolean>(false);

  //All options dropdown on click functions
  const { onHideLabels, onHideEdges, onEdgeWidth, onBorder, onThreshold, onDeleteEdges } = optionsOnClick(viewOptions, setViewOptions);

  const perspectiveSelected: Function = singlePerspectiveSelected(perspectivesState, setPerspectivesState, availablePerspectives);

  const updateLegendConfig = (newConfig: Map<string, boolean>) =>{
    if (viewOptions !== undefined) {
      const newViewOptions = (JSON.parse(JSON.stringify(viewOptions))) as ViewOptions;

      newViewOptions.legendConfig = newConfig
      setViewOptions(newViewOptions);
    }
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
          <LayoutDropdown
            setLayout={setLayout}
          />,
          <OptionsDropdown
            onHideLabels={onHideLabels}
            onHideEdges={onHideEdges}
            onEdgeWidth={onEdgeWidth}
            onBorder={onBorder}
            onThreshold={onThreshold}
            onDeleteEdges={onDeleteEdges}
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

/**
 * Returns a function executed when a perspective from the select perspective dropdown is clicked
 * @param perspectivesState The state of all active/disabled perspectives
 * @param setPerspectivesState Function to set the state of the previous parameter
 * @param availablePerspectives State with the details of all available perspectives
 * @returns a function that request the perspective, validate the perspective data and make its state active
 */
function singlePerspectiveSelected(perspectivesState: Map<number, ButtonState>, setPerspectivesState: React.Dispatch<React.SetStateAction<Map<number, ButtonState>>>,
  availablePerspectives: PerspectiveDetails[] | undefined) {

  return (perspectiveId: number) => {
    const state = perspectivesState.get(perspectiveId);

    if (state === ButtonState.inactive) {

      setPerspectivesState(new Map(perspectivesState.set(perspectiveId, ButtonState.loading)));

      requestManager.getPerspective(perspectiveId)
        .then((response) => {
          if (response.status === 200) {

            const perspectiveJson = validatePerspectiveDataJSON(JSON.parse(response.data));
            const perspectiveInfo = availablePerspectives?.find((element: PerspectiveDetails) => { return element.id === perspectiveId; });

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
  };
}

/**
 * Returns the functions for each of the onClick options of the options dropdown
 * @param viewOptions Object with the viewoptions
 * @param setViewOptions Function to set viewOptions react state
 * @returns all functions in this order { onHideLabels, onHideEdges, onEdgeWidth, onBorder, onThreshold, onDeleteEdges }
 */
function optionsOnClick(viewOptions: ViewOptions, setViewOptions: React.Dispatch<React.SetStateAction<ViewOptions>>) {
  const onHideLabels = (newValue: boolean) => {
    const newViewOptions = Object.assign({}, viewOptions);
    newViewOptions.hideLabels = newValue;
    setViewOptions(newViewOptions);
    return true;
  };

  const onHideEdges = (newValue: boolean) => {
    const newViewOptions = Object.assign({}, viewOptions);
    newViewOptions.hideEdges = newValue;
    setViewOptions(newViewOptions);
    return true;
  };

  const onEdgeWidth = (newValue: boolean) => {
    const newViewOptions = Object.assign({}, viewOptions);
    newViewOptions.edgeWidth = newValue;
    setViewOptions(newViewOptions);
    return true;
  };

  const onBorder = (newValue: boolean) => {
    const newViewOptions = Object.assign({}, viewOptions);
    newViewOptions.border = newValue;
    setViewOptions(newViewOptions);
    return true;
  };

  const onThreshold = (newValue: number) => {
    const newViewOptions = Object.assign({}, viewOptions);
    newViewOptions.edgeThreshold = newValue;
    setViewOptions(newViewOptions);
  };

  const onDeleteEdges = (newValue: number) => {
    const newViewOptions = Object.assign({}, viewOptions);
    newViewOptions.deleteEdges = newValue;
    setViewOptions(newViewOptions);
  };
  return { onHideLabels, onHideEdges, onEdgeWidth, onBorder, onThreshold, onDeleteEdges };
}

