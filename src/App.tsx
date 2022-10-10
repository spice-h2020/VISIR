/**
 * @fileoverview This file is the entry point of the application. Holds the states with all the info necesary for the application, creates the toolbar/navbar component,
 * creates the perspectives Groups component for the visualization and has the necesary managers to request files and load them.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { FileSource, ButtonState, ViewOptions, viewOptionsReducer, CollapsedState } from './constants/viewOptions';
import { PerspectiveData } from './constants/perspectivesTypes';
import { DimAttribute } from './constants/nodes';
//Packages
import { useReducer, useState } from 'react';
//Local files
import { Navbar } from './basicComponents/Navbar';
import { Button } from './basicComponents/Button';
import { FileSourceDropdown } from './components/FileSourceDropdown';
import { OptionsDropdown } from './components/OptionsDropdown';
import { PerspectivesGroups } from './components/PerspectivesGroup';
import { LegendTooltip } from './components/LegendTooltip';
import RequestManager from './managers/requestManager';

import './style/base.css';

const requestManager = new RequestManager();

function collapseReducer(state: CollapsedState, stateAction: CollapsedState) {
  if (state === CollapsedState.unCollapsed) {
    state = stateAction
  } else if ((state === CollapsedState.toTheLeft && stateAction === CollapsedState.toTheRight)
    || (state === CollapsedState.toTheRight && stateAction === CollapsedState.toTheLeft)) {

    state = CollapsedState.unCollapsed;
  }

  return state;
}

interface AppProps {
  perspectiveId1: string | null,
  perspectiveId2: string | null
}

export const App = ({
  perspectiveId1,
  perspectiveId2
}: AppProps) => {
  //Current options that change how the user view each perspective
  const [viewOptions, setViewOptions] = useReducer(viewOptionsReducer, new ViewOptions());

  //Current dimension attributes data to create the legend buttons/options
  const [legendData, setLegendData] = useState<DimAttribute[]>([]);

  //Current Active perspectives in the view group
  const [leftPerspective, setLeftPerspective] = useState<PerspectiveData>();
  const [rightPerspective, setRightPerspective] = useState<PerspectiveData>();

  //Current state of the perspectives collapse buttons
  const [collapseState, setCollapseState] = useReducer(collapseReducer, CollapsedState.unCollapsed);

  const updatePerspectives = (perspectiveId1: string | null, perspectiveId2: string | null) => {

    if (perspectiveId1 !== null)
      requestManager.requestPerspectiveFIle(perspectiveId1, setLeftPerspective);

    if (perspectiveId2 !== null && perspectiveId2 !== perspectiveId1)
      requestManager.requestPerspectiveFIle(perspectiveId2, setRightPerspective);
  }

  return (
    <div>
      <Navbar
        leftAlignedItems={[
          <Button
            content="Visualization module"
            extraClassName="transparent tittle"
            onClick={() => { window.location.reload() }}
          />,
          <FileSourceDropdown
            setFileSource={(fileSource: FileSource) => {
              requestManager.changeBaseURL(fileSource);
              updatePerspectives(perspectiveId1, perspectiveId2);
            }}
          />,
          <OptionsDropdown
            setViewOptions={setViewOptions}
          />,
        ]}
        midAlignedItems={[
          <Button
            content="<<"
            onClick={(state: ButtonState) => {
              if (state !== ButtonState.disabled) {
                setCollapseState(CollapsedState.toTheLeft);
              }
            }}
            extraClassName={`first dark`}
            state={leftPerspective !== undefined && rightPerspective !== undefined ? ButtonState.unactive : ButtonState.disabled}
          />,
          <Button
            content=">>"
            extraClassName={`second dark`}
            onClick={(state: ButtonState) => {
              if (state !== ButtonState.disabled) {
                setCollapseState(CollapsedState.toTheRight);
              }
            }}
            state={leftPerspective !== undefined && rightPerspective !== undefined ? ButtonState.unactive : ButtonState.disabled}
          />
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
      <span style={{ height: "75px", display: "flex" }}></span>
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


