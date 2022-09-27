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
import { collapsedState, PerspectivesGroups } from './components/PerspectivesGroup';
import ViewDataManager from './managers/viewDataManager';
import { LegendTooltip } from './components/LegendTooltip';
import './style/base.css';
import { bStateArrayAction } from './constants/auxTypes';

const requestManager = new RequestManager();

function collapseReducer(state: collapsedState, stateAction: collapsedState) {
  if (state === collapsedState.unCollapsed) {
    state = stateAction
  } else if ((state === collapsedState.toTheLeft && stateAction === collapsedState.toTheRight)
    || (state === collapsedState.toTheRight && stateAction === collapsedState.toTheLeft)) {

    state = collapsedState.unCollapsed;
  }

  return state;
}

export function App() {
  //Current options that change how the user view each perspective
  const [viewOptions, setViewOptions] = useReducer(viewOptionsReducer, new ViewOptions());

  //Current dimension attributes data to create the legend buttons/options
  const [legendData, setLegendData] = useState<DimAttribute[]>([]);

  //All available perspectives that the user can select to view
  const [allPerspectives, setAllPerspectives] = useState<PerspectiveDetails[]>();

  //Current Active perspectives in the view group
  const [leftPerspective, setLeftPerspective] = useState<PerspectiveInfo>();
  const [rightPerspective, setRightPerspective] = useState<PerspectiveInfo>();

  //Current state of the perspectives collapse buttons
  const [collapseState, setCollapseState] = useReducer(collapseReducer, collapsedState.unCollapsed);

  useEffect(() => {

    setLeftPerspective(undefined);
    setRightPerspective(undefined);

  }, [allPerspectives])

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
            tittle='Select A'
            onClick={setLeftPerspective}
            allPerspectives={allPerspectives}
            requestManager={requestManager}
          />,
          <Button
            content="<<"
            onClick={(state: ButtonState) => {
              if (state !== ButtonState.disabled) {
                setCollapseState(collapsedState.toTheLeft);
              }
            }}
            extraClassName={`first dropdown-dark`}
            state={leftPerspective !== undefined && rightPerspective !== undefined ? ButtonState.unactive : ButtonState.disabled}
          />,
          <Button
            content=">>"
            extraClassName={`second dropdown-dark`}
            onClick={(state: ButtonState) => {
              if (state !== ButtonState.disabled) {
                setCollapseState(collapsedState.toTheRight);
              }
            }}
            state={leftPerspective !== undefined && rightPerspective !== undefined ? ButtonState.unactive : ButtonState.disabled}
          />,
          <SelectPerspectiveDropdown
            tittle='Select B'
            onClick={setRightPerspective}
            allPerspectives={allPerspectives}
            requestManager={requestManager}
          />,

        ]}
        rightAlignedItems={[
          <LegendTooltip
            legendData={legendData}
            legendConf={viewOptions.legendConfig}
            onLegendClick={(newMap: Map<string, boolean>) => {
              setViewOptions({ updateType: "legendConfig", newValue: newMap, });
            }}
          />,
        ]}
      />
      <h1> Communities Visualization</h1>
      <PerspectivesGroups
        leftPerspective={leftPerspective}
        rightPerspective={rightPerspective}
        collapsedState={collapseState}
        viewOptions={viewOptions}
        setLegendData={setLegendData}
      />
    </div>
  );
}