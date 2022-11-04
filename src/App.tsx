/**
 * @fileoverview This file is the entry point of the application. Holds the states with all the info necesary for the application, creates the toolbar/navbar component,
 * creates the perspectives Groups component for the visualization and has the necesary managers to request files and load them.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { FileSource, ButtonState, ViewOptions, viewOptionsReducer, CollapsedState } from './constants/viewOptions';
import { PerspectiveActiveState, PerspectiveData, PerspectiveId } from './constants/perspectivesTypes';
import { DimAttribute } from './constants/nodes';
//Packages
import { useEffect, useReducer, useState } from 'react';
//Local files
import { Navbar } from './basicComponents/Navbar';
import { Button } from './basicComponents/Button';
import { FileSourceDropdown } from './components/FileSourceDropdown';
import { OptionsDropdown } from './components/OptionsDropdown';
import { PerspectivesGroups } from './components/PerspectivesGroup';
import { LegendComponent } from './components/LegendComponent';
import RequestManager from './managers/requestManager';

import './style/base.css';
import { SelectPerspectiveDropdown } from './components/SelectPerspectiveDropdown';

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
  const [requestManager] = useState<RequestManager>(new RequestManager());

  //Current options that change how the user view each perspective
  const [viewOptions, setViewOptions] = useReducer(viewOptionsReducer, new ViewOptions());

  //Current dimension attributes data to create the legend buttons/options
  const [legendData, setLegendData] = useState<DimAttribute[]>([]);

  //Current available perspectives for the dropdowns
  const [allPerspectivesIds, setAllPerspectivesIds] = useState<PerspectiveId[]>([]);

  //Current Active perspectives in the view group
  const [leftPerspective, setLeftPerspective] = useState<PerspectiveData>();
  const [rightPerspective, setRightPerspective] = useState<PerspectiveData>();

  //Current state of the perspectives collapse buttons
  const [collapseState, setCollapseState] = useReducer(collapseReducer, CollapsedState.unCollapsed);

  function initPerspectives(newIds: PerspectiveId[]) {
    setLeftPerspective(undefined);
    setRightPerspective(undefined);

    for (let i = 0; i < newIds.length; i++) {

      if (newIds[i].id === perspectiveId1) {
        newIds[i].isActive = PerspectiveActiveState.left;
        requestManager.requestPerspectiveFIle(perspectiveId1, newIds[i].name, setLeftPerspective);

      } else if (newIds[i].id === perspectiveId2 && perspectiveId2 !== perspectiveId1) {

        newIds[i].isActive = PerspectiveActiveState.right;
        requestManager.requestPerspectiveFIle(perspectiveId2, newIds[i].name, setRightPerspective);

      } else {

        newIds[i].isActive = PerspectiveActiveState.unactive;
      }
    }

    setAllPerspectivesIds(newIds);
  }

  useEffect(() => {
    console.log(allPerspectivesIds);
  }, [allPerspectivesIds]);

  useEffect(() => {
    console.log(leftPerspective);
  }, [leftPerspective]);

  useEffect(() => {
    console.log(rightPerspective);
  }, [rightPerspective]);

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
              requestManager.requestAllPerspectivesIds(initPerspectives);
            }}
          />,
          <OptionsDropdown
            setViewOptions={setViewOptions}
          />,
        ]}
        midAlignedItems={[
          <SelectPerspectiveDropdown
            tittle={'Select perspective A'}
            setAllIds={setAllPerspectivesIds}
            setActivePerspective={setLeftPerspective}
            allIds={allPerspectivesIds}
            isLeftDropdown={true}
            requestMan={requestManager}
          />,
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
          />,
          <SelectPerspectiveDropdown
            tittle={'Select perspective B'}
            setAllIds={setAllPerspectivesIds}
            setActivePerspective={setRightPerspective}
            allIds={allPerspectivesIds}
            isLeftDropdown={false}
            requestMan={requestManager}
          />,
        ]}
        rightAlignedItems={[
          <LegendComponent
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


