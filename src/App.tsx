//WIP component
import React, { useEffect, useState } from 'react';
import './style/Base.css';

import { Navbar } from './basicComponents/Navbar';
import { Button } from './basicComponents/Button';
import { FileSourceDropdown } from './components/FileSourceDropdown';
import { LayoutDropdown } from './components/LayoutDropdown';
import { OptionsDropdown } from './components/OptionsDropdown';

import RequestManager from './managers/requestManager';
import { FileSource, initialOptions, ButtonState, ViewOptions, AppLayout } from './constants/viewOptions';
import { PerspectiveDetails } from './constants/perspectivesTypes';
import { SelectPerspectiveDropdown } from './components/SelectPerspectiveDropdown';
import { PerspectivesGroups } from './components/PerspectivesGroup';
import ViewDataManager from './managers/viewDataManager';
import { validateAllPerspectivesDetailsJSON, validatePerspectiveDataJSON } from './constants/perspectiveValidation';
import { LegendTooltip } from './components/LegendTooltip';
import { DimAttribute } from './constants/nodes';

const requestManager = new RequestManager();
const viewDataManager = new ViewDataManager();

function App() {

  const [perspectivesState, setPerspectivesState] = useState(new Map<number, ButtonState>());
  const [availablePerspectives, setAvailablePerspectives] = useState<PerspectiveDetails[]>();
  const [fileSource, setFileSource] = useState<FileSource>(initialOptions.fileSource);
  const [viewOptions, setViewOptions] = useState<ViewOptions>(new ViewOptions());
  const [layout, setLayout] = useState<AppLayout>(initialOptions.layout);
  const [legendData, setLegendData] = useState<DimAttribute[]>([]);
  const [viewActive, setViewActive] = useState<boolean>(false);
  const [legendConfig, setLegendConfig] = useState(new Map<string, boolean>());

  useEffect(() => {
    if (viewOptions !== undefined) {
      const newViewOptions = (JSON.parse(JSON.stringify(viewOptions))) as ViewOptions;
      ;
      newViewOptions.legendConfig = legendConfig
      setViewOptions(newViewOptions);
    }

  }, [legendConfig]);

  const onHideLabels = (newValue: boolean) => {
    const newViewOptions = Object.assign({}, viewOptions);
    newViewOptions.hideLabels = newValue;
    setViewOptions(newViewOptions);
    return true;
  }

  const onHideEdges = (newValue: boolean) => {
    const newViewOptions = Object.assign({}, viewOptions);
    newViewOptions.hideEdges = newValue;
    setViewOptions(newViewOptions);
    return true;
  }

  const onEdgeWidth = (newValue: boolean) => {
    const newViewOptions = Object.assign({}, viewOptions);
    newViewOptions.edgeWidth = newValue;
    setViewOptions(newViewOptions);
    return true;
  }

  const onBorder = (newValue: boolean) => {
    const newViewOptions = Object.assign({}, viewOptions);
    newViewOptions.border = newValue;
    setViewOptions(newViewOptions);
    return true;
  }

  const onThreshold = (newValue: number) => {
    const newViewOptions = Object.assign({}, viewOptions);
    newViewOptions.edgeThreshold = newValue;
    setViewOptions(newViewOptions);
  }

  const onDeleteEdges = () => {
    console.log("On delete");
  }

  const perspectiveSelected = (perspectiveId: number) => {
    const state = perspectivesState.get(perspectiveId);

    if (state === ButtonState.inactive) {

      setPerspectivesState(new Map(perspectivesState.set(perspectiveId, ButtonState.loading)));

      requestManager.getPerspective(perspectiveId)
        .then((response) => {
          if (response.status === 200) {

            const perspectiveJson = validatePerspectiveDataJSON(JSON.parse(response.data));
            const perspectiveInfo = availablePerspectives?.find((element: PerspectiveDetails) => { return element.id === perspectiveId })

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
            state={viewActive}
            updateLegendConfig={setLegendConfig}
          />,
        ]}
      />
      <h1> Communities Visualization</h1>
      <PerspectivesGroups
        perspectivePairs={viewDataManager.activePerspectivePairs}
        layout={layout}
        viewOptions={viewOptions}
        setLegendData={setLegendData}
        setViewActive={setViewActive}
      />
    </div>
  );
}

export default App;
