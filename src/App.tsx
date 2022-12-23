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
import { CTranslation, ILegendData, ITranslation, legendDataReducer } from './constants/auxTypes';
//Packages
import React, { useEffect, useReducer, useState } from 'react';
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
import { DropMenu, EDropMenuDirection } from './basicComponents/DropMenu';
import { ConfigurationTool } from './components/ConfigurationTool';

import config from './appConfig.json';

interface AppProps {
  perspectiveId1: string | null,
  perspectiveId2: string | null
}



export const App = ({

  perspectiveId1,
  perspectiveId2

}: AppProps) => {

  const [currentLanguage, setCurrentLanguage] = useState<CTranslation>(new CTranslation(undefined))

  useEffect(() => {
    fetch(`localization/${config.LANG}.json`
      , {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (language) {
        setCurrentLanguage(new CTranslation(language));
      });
  }, [])

  //Parameters to activate/disactivate and edit the loading spinner.
  const [loadingState, SetLoadingState] = useState<ILoadingState>({ isActive: false })

  const [requestManager] = useState<RequestManager>(new RequestManager(SetLoadingState, currentLanguage));

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

  const [windowWidth, setWindowWidth] = useState<number>(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0));

  const [isConfigToolActive, setIsConfigToolActive] = useState<boolean>(false);


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

  //Re-render the component when the windows is resized
  useEffect(() => {
    function onWindowResize() {
      setWindowWidth(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0));
    }

    window.addEventListener('resize', onWindowResize)
  })

  //Remove components from the navBar and add them to the hamburger btn based on the viewport width
  let small = windowWidth < 1100;
  let tooSmall = windowWidth < 600;

  const mainBtn = small === false ?
    <div style={{ margin: "0px 5px" }}>
      <Button
        content={<div className='row' style={{ alignItems: "center" }}>
          <img style={{ height: "40px" }} src="./images/VISIR-red.png" alt="VISIR icon" />
          <div className="tittle" style={{ marginLeft: "10px" }}>VISIR</div>
        </div>}
        extraClassName="transparent tittle mainBtn"
        onClick={() => { window.location.reload() }}
      />
    </div> : <React.Fragment />;

  const fileSourceDrop =
    <FileSourceDropdown
      key={0}
      setFileSource={updateFileSource}
      setLoadingState={SetLoadingState}
      insideHamburger={small}
      translationClass={currentLanguage}
    />;

  const optionsDrop =
    <OptionsDropdown
      key={1}
      setViewOptions={setViewOptions}
      insideHamburger={small}
      translationClass={currentLanguage}
    />

  const selectLeft =
    <SelectPerspectiveDropdown
      tittle={`${currentLanguage.t.toolbar.selectPerspective.defaultName} A`}
      setAllIds={setAllPerspectivesIds}
      setActivePerspective={setLeftPerspective}
      allIds={allPerspectivesIds}
      isLeftDropdown={true}
      requestMan={requestManager}
      setLoadingState={SetLoadingState}
      insideHamburger={tooSmall}
      translationClass={currentLanguage}
    />

  const selectRight =
    <SelectPerspectiveDropdown
      tittle={`${currentLanguage.t.toolbar.selectPerspective.defaultName} B`}
      setAllIds={setAllPerspectivesIds}
      setActivePerspective={setRightPerspective}
      allIds={allPerspectivesIds}
      isLeftDropdown={false}
      requestMan={requestManager}
      setLoadingState={SetLoadingState}
      insideHamburger={tooSmall}
      translationClass={currentLanguage}
    />

  const collapseLeft =
    <Button
      content="<<"
      onClick={(state: EButtonState) => {
        if (state !== EButtonState.disabled) {
          setCollapseState(EAppCollapsedState.toTheLeft);
        }
      }}
      extraClassName={`first dark`}
      state={leftPerspective !== undefined && rightPerspective !== undefined ? EButtonState.unactive : EButtonState.disabled}
    />

  const collapseRight =
    <Button
      content=">>"
      extraClassName={`second dark`}
      onClick={(state: EButtonState) => {
        if (state !== EButtonState.disabled) {
          setCollapseState(EAppCollapsedState.toTheRight);
        }
      }}
      state={leftPerspective !== undefined && rightPerspective !== undefined ? EButtonState.unactive : EButtonState.disabled}
    />

  const legendDrop =
    <LegendComponent
      legendData={legendData}
      legendConf={viewOptions.legendConfig}
      onLegendClick={(newMap: Map<string, boolean>) => {
        setViewOptions({ updateType: "legendConfig", newValue: newMap, });
      }}
      translationClass={currentLanguage}
    />


  const toggleConfTool =
    <Button
      content="OpenConfTool"
      extraClassName={`dark`}
      onClick={(state: EButtonState) => {
        if (state !== EButtonState.disabled) {
          setIsConfigToolActive(!isConfigToolActive);
        }
      }}
      state={isConfigToolActive ? EButtonState.active : EButtonState.unactive}
    />

  const hamburgerContent = [];
  let navBar: React.ReactNode;

  if (tooSmall) {
    hamburgerContent.push(fileSourceDrop);
    hamburgerContent.push(optionsDrop);
    hamburgerContent.push(selectLeft);
    hamburgerContent.push(selectRight);

    const hamburgerBtn =
      <DropMenu
        key={0}
        content={
          <div className='row' style={{ alignItems: "center" }}>
            <img style={{ height: "40px" }} src="./images/hamburgerBtn.svg" alt="VISIR icon" />
          </div>}
        extraClassButton="transparent mainBtn"
        menuDirection={EDropMenuDirection.down}

        items={hamburgerContent}
      />

    navBar =
      <Navbar
        leftAlignedItems={[
          hamburgerBtn,
        ]}
        midAlignedItems={[
          collapseLeft,
          collapseRight,
        ]}
        rightAlignedItems={[
          legendDrop,
        ]}
      />
  } else if (small) {
    hamburgerContent.push(fileSourceDrop);
    hamburgerContent.push(optionsDrop);

    const hamburgerBtn =
      <DropMenu
        key={0}
        content={
          <div className='row' style={{ alignItems: "center" }}>
            <img style={{ height: "40px" }} src="./images/hamburgerBtn.svg" alt="VISIR icon" />
          </div>}
        extraClassButton="transparent mainBtn"
        menuDirection={EDropMenuDirection.down}

        items={hamburgerContent}
      />

    navBar =
      <Navbar
        leftAlignedItems={[
          hamburgerBtn,
        ]}
        midAlignedItems={[
          selectLeft,
          collapseLeft,
          collapseRight,
          selectRight,
        ]}
        rightAlignedItems={[
          legendDrop,
        ]}
      />
  } else {
    navBar =
      <Navbar
        leftAlignedItems={[
          mainBtn,
          fileSourceDrop,
          optionsDrop,
        ]}
        midAlignedItems={[
          selectLeft,
          collapseLeft,
          collapseRight,
          selectRight,
        ]}
        rightAlignedItems={[
          legendDrop,
          toggleConfTool
        ]}
      />
  }



  return (
    <div>
      {navBar}
      <span style={{ height: "75px", display: "flex" }}></span>
      <PerspectivesGroups
        leftPerspective={leftPerspective}
        rightPerspective={rightPerspective}
        collapsedState={collapseState}
        viewOptions={viewOptions}
        setLegendData={setLegendData}
        setLoadingState={SetLoadingState}
        translationClass={currentLanguage}
      />

      <ConfigurationTool
        requestManager={requestManager}
        isActive={isConfigToolActive}
        setLoadingState={SetLoadingState}
        setIsActive={setIsConfigToolActive}
      />
      <LoadingFrontPanel
        state={loadingState}
      />
    </div>
  );
}


