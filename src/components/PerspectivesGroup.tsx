/**
 * @fileoverview This file creates all the perspective views and broadcast the necesary options, like the node that is selected, all perspective views need that to update their
 * dataTables
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { PerspectiveData, PerspectiveState } from "../constants/perspectivesTypes";
import { ViewOptions, CollapsedState } from "../constants/viewOptions"
import { SelectedObjectActionEnum, selectedObjectReducer, StateFunctions } from "../constants/auxTypes";
//Packages
import { useEffect, useReducer, useState } from "react";
//Local files
import { Tooltip } from "../basicComponents/Tooltip";
import { PerspectiveView } from "./PerspectiveView";
import NodeDimensionStrategy from "../managers/nodeDimensionStat";

const perspectiveContainers: React.CSSProperties = {
    display: "flex",
    marginBottom: "5vh",
    paddingBottom: "1vh",
}


const widthStyle: Map<PerspectiveState, React.CSSProperties> = new Map([
    [PerspectiveState.unactive, { width: "0%" }],
    [PerspectiveState.activeBoth, { width: "50%" }],
    [PerspectiveState.activeSingle, { width: "100%" }],
    [PerspectiveState.activeBig, { width: "80%" }],
    [PerspectiveState.collapsed, { width: "20%" }],
])


interface PerspectivesGroupProps {
    leftPerspective?: PerspectiveData,
    rightPerspective?: PerspectiveData,

    collapsedState: CollapsedState,
    //View options for all networks
    viewOptions: ViewOptions,
    //Function to setup the legend's data
    setLegendData: Function,
}

/**
 * Component that draws each active perspective
 */
export const PerspectivesGroups = ({
    leftPerspective,
    rightPerspective,
    collapsedState,
    viewOptions,
    setLegendData,
}: PerspectivesGroupProps) => {

    const [dimensionStrategy, setDimensionStrategy] = useState<NodeDimensionStrategy | undefined>();
    const [networkFocusID, setNetworkFocusID] = useState<string | undefined>();
    const [selectedObject, setSelectedObject] = useReducer(selectedObjectReducer, undefined);

    const sf: StateFunctions = {
        setLegendData: setLegendData,
        setDimensionStrategy: setDimensionStrategy,
        setNetworkFocusId: setNetworkFocusID,
        setSelectedObject: setSelectedObject,
    }

    useEffect(() => {
        setSelectedObject({ action: SelectedObjectActionEnum.clear, newValue: undefined, sourceID: "0" });
        setNetworkFocusID(undefined);
    }, [collapsedState]);

    useEffect(() => {
        if (leftPerspective === undefined && rightPerspective === undefined) {

            setSelectedObject({ action: SelectedObjectActionEnum.clear, newValue: undefined, sourceID: "0" });
            setNetworkFocusID(undefined);
            setDimensionStrategy(undefined);
        }
    }, [leftPerspective, rightPerspective]);

    useEffect(() => {
        if (dimensionStrategy !== undefined)
            dimensionStrategy.toggleBorderStat(viewOptions.border);

    }, [viewOptions.border, dimensionStrategy]);

    const { leftState, rightState } = calculatePerspectiveState(leftPerspective, rightPerspective, collapsedState);

    const leftComponent = leftPerspective === undefined ? "" :
        <PerspectiveView
            perspectiveData={leftPerspective}
            viewOptions={viewOptions}
            sf={sf}
            selectedObject={selectedObject}
            dimStrat={dimensionStrategy}
            networkFocusID={networkFocusID}
            perspectiveState={leftState}
        />

    const rightComponent = rightPerspective === undefined ? "" :
        <PerspectiveView
            perspectiveData={rightPerspective}
            viewOptions={viewOptions}
            sf={sf}
            selectedObject={selectedObject}
            dimStrat={dimensionStrategy}
            networkFocusID={networkFocusID}
            perspectiveState={rightState}
            mirror={true}
        />

    return (
        <div style={perspectiveContainers}>
            < Tooltip
                selectedObject={selectedObject}
                hideLabels={viewOptions.hideLabels}
            />
            <div style={widthStyle.get(leftState)}
                key={leftPerspective === undefined ? -1 : `first${leftPerspective.id}`}>
                {leftComponent}
            </div>

            <div style={widthStyle.get(rightState)}
                key={rightPerspective === undefined ? -2 : `second${rightPerspective.id}`}>
                {rightComponent}
            </div>
        </div>
    );
};

/**
 * Returns the state of both perspectives
 * @param leftPerspective 
 * @param rightPerspective 
 * @param collapsedState 
 * @returns returns two perspective states, {left, right}
 */
function calculatePerspectiveState(leftPerspective: PerspectiveData | undefined, rightPerspective: PerspectiveData | undefined,
    collapsedState: CollapsedState) {

    let leftState: PerspectiveState = PerspectiveState.unactive;
    let rightState: PerspectiveState = PerspectiveState.unactive;

    switch (true) {
        case leftPerspective === undefined:
            leftState = PerspectiveState.unactive;

            if (rightPerspective === undefined)
                rightState = PerspectiveState.unactive;

            else
                rightState = PerspectiveState.activeSingle;
            break;

        case rightPerspective === undefined:
            leftState = PerspectiveState.activeSingle;
            rightState = PerspectiveState.unactive;
            break;

        case collapsedState === CollapsedState.toTheLeft:
            leftState = PerspectiveState.collapsed;
            rightState = PerspectiveState.activeBig;

            break;

        case collapsedState === CollapsedState.toTheRight:
            leftState = PerspectiveState.activeBig;
            rightState = PerspectiveState.collapsed;

            break;

        case collapsedState === CollapsedState.unCollapsed:
            leftState = PerspectiveState.activeBoth;
            rightState = PerspectiveState.activeBoth;
            break;
    }
    return { leftState, rightState };
}


