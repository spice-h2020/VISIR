/**
 * @fileoverview This file is the entry point of the application. 
 * 
 * - Holds the states with all the info necesary for the application.
 * - Creates the toolbar/navbar component,
 * - Creates the perspectives Groups component for the visualization.
 * 
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { EFileSource, EButtonState, ViewOptions, viewOptionsReducer, EAppCollapsedState, collapseReducer } from './constants/viewOptions';
import { PerspectiveActiveState, IPerspectiveData, PerspectiveId } from './constants/perspectivesTypes';
import { ILegendData, legendDataReducer } from './constants/auxTypes';
//Packages
import { useReducer, useState } from 'react';
//Local files
import { Navbar } from './basicComponents/Navbar';
import { Button } from './basicComponents/Button';
import { FileSourceDropdown } from './components/FileSourceDropdown';
import { OptionsDropdown } from './components/OptionsDropdown';
import { PerspectivesGroups } from './components/PerspectivesGroup';
import { LegendComponent } from './components/LegendComponent';
import { SelectPerspectiveDropdown } from './components/SelectPerspectiveDropdown';
import RequestManager from './managers/requestManager';

import './style/base.css';
import { ILoadingState, LoadingFrontPanel } from './basicComponents/LoadingFrontPanel';

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
  const [legendData, setLegendData] = useReducer(legendDataReducer, { dims: [], anonymous: false, anonGroup: false } as ILegendData);

  //Current available perspectives for the dropdowns
  const [allPerspectivesIds, setAllPerspectivesIds] = useState<PerspectiveId[]>([]);

  //Current Active perspectives in the view group
  const [leftPerspective, setLeftPerspective] = useState<IPerspectiveData>();
  const [rightPerspective, setRightPerspective] = useState<IPerspectiveData>();

  //Current state of the perspectives collapse buttons
  const [collapseState, setCollapseState] = useReducer(collapseReducer, EAppCollapsedState.unCollapsed);

  //Parameters to activate/disactivate and edit the loading spinner.
  const [loadingState, SetLoadingState] = useState<ILoadingState>({ isActive: false })

  const updateFileSource = (fileSource: EFileSource, changeItemState?: Function, apiURL?: string,) => {
    requestManager.changeBaseURL(fileSource, apiURL);
    requestManager.requestAllPerspectivesIds(initPerspectives, changeItemState);
  }

  function initPerspectives(newIds: PerspectiveId[]) {
    setLeftPerspective(undefined);
    setRightPerspective(undefined);

    if (newIds) {
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
    } else {
      setAllPerspectivesIds([]);
    }
  }


  return (
    <div>
      <Navbar
        leftAlignedItems={[
          <div style={{ margin: "0px 5px" }}>
            <Button
              content={<div className='row' style={{ alignItems: "center" }}>
                <img style={{ height: "40px" }} src="./images/VISIR-red.png" alt="VISIR icon" />
                <div className="tittle" style={{ marginLeft: "10px" }}>VISIR</div>
              </div>}
              extraClassName="transparent tittle mainBtn"
              onClick={() => { window.location.reload() }}
            />
          </div>,
          <FileSourceDropdown
            setFileSource={updateFileSource}
            setLoadingState={SetLoadingState}
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
            setLoadingState={SetLoadingState}
          />,
          <Button
            content="<<"
            onClick={(state: EButtonState) => {
              if (state !== EButtonState.disabled) {
                setCollapseState(EAppCollapsedState.toTheLeft);
              }
            }}
            extraClassName={`first dark`}
            state={leftPerspective !== undefined && rightPerspective !== undefined ? EButtonState.unactive : EButtonState.disabled}
          />,
          <Button
            content=">>"
            extraClassName={`second dark`}
            onClick={(state: EButtonState) => {
              if (state !== EButtonState.disabled) {
                setCollapseState(EAppCollapsedState.toTheRight);
              }
            }}
            state={leftPerspective !== undefined && rightPerspective !== undefined ? EButtonState.unactive : EButtonState.disabled}
          />,
          <SelectPerspectiveDropdown
            tittle={'Select perspective B'}
            setAllIds={setAllPerspectivesIds}
            setActivePerspective={setRightPerspective}
            allIds={allPerspectivesIds}
            isLeftDropdown={false}
            requestMan={requestManager}
            setLoadingState={SetLoadingState}
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
        setLoadingState={SetLoadingState}
      />

      <LoadingFrontPanel
        state={loadingState}
      />
    </div>
  );
}


