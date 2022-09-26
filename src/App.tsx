/**
 * @fileoverview This file is the entry point of the application. Holds the states with all the info necesary for the application, creates the toolbar/navbar component,
 * creates the perspectives Groups component for the visualization and has the necesary managers to request files and load them.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { FileSource, initialOptions, ButtonState, ViewOptions, AppLayout, viewOptionsReducer } from './constants/viewOptions';
import { PerspectiveDetails, PerspectiveInfo } from './constants/perspectivesTypes';
import { DimAttribute } from './constants/nodes';
import { validateAllPerspectivesDetailsJSON, validatePerspectiveDataJSON } from './constants/ValidateFiles';
//Packages
import React, { Dispatch, useEffect, useReducer, useState } from 'react';
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
import { bStateArrayAction } from './constants/auxTypes';

const requestManager = new RequestManager();
const viewDataManager = new ViewDataManager();

export function App() {
  //All available perspectives that the user can select to view
  const [allPerspectives, setAllPerspectives] = useState<PerspectiveDetails[]>();

  //Current Active perspectives in the view group
  const [leftPerspective, setLeftPerspective] = useState<PerspectiveInfo>();
  const [rightPerspective, setRightPerspective] = useState<PerspectiveInfo>();

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

    setLeftPerspective(undefined);
    setRightPerspective(undefined);

  }, [allPerspectives])

  useEffect(() => {

    console.log("Left");

  }, [leftPerspective])


  useEffect(() => {

    console.log("right");

  }, [rightPerspective])

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
            setFileSource={(fileSource: FileSource, setFileSource: Dispatch<bStateArrayAction>) => {
              requestManager.requestAllPerspectivesDetails(fileSource, setFileSource, setAllPerspectives);
            }}
          />,
          <OptionsDropdown
            setViewOptions={setViewOptions}
          />,
        ]}
        midAlignedItems={[
          <SelectPerspectiveDropdown
            tittle='Left Perspective'
            onClick={setLeftPerspective}
            allPerspectives={allPerspectives}
            requestManager={requestManager}
          />,
          <SelectPerspectiveDropdown
            tittle='Right Perspective'
            onClick={setRightPerspective}
            allPerspectives={allPerspectives}
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

const singlePerspectiveSelected = (a: any) => {
  console.log(a);
}