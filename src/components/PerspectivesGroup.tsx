/**
 * @fileoverview This file creates all the perspective views and broadcast the necesary options, like the node that is selected, all perspective views need that to update their
 * dataTables
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { PerspectiveInfo, PerspectiveState } from "../constants/perspectivesTypes";
import { ViewOptions, CollapsedState } from "../constants/viewOptions"
import { SelectedObjectActionEnum, selectedObjectReducer, StateFunctions } from "../constants/auxTypes";
//Packages
import { useEffect, useReducer, useState } from "react";
//Local files
import { Tooltip } from "../basicComponents/Tooltip";
import { PerspectiveView } from "./PerspectiveView";
import NodeDimensionStrategy from "../managers/dimensionStrategy";

interface PerspectivesGroupProps {
    leftPerspective?: PerspectiveInfo,
    rightPerspective?: PerspectiveInfo,

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
    const [networkFocusID, setNetworkFocusID] = useState<number | undefined>();
    const [selectedObject, setSelectedObject] = useReducer(selectedObjectReducer, undefined);

    const sf: StateFunctions = {
        setLegendData: setLegendData,
        setDimensionStrategy: setDimensionStrategy,
        setNetworkFocusId: setNetworkFocusID,
        setSelectedObject: setSelectedObject,
    }

    useEffect(() => {
        setSelectedObject({ action: SelectedObjectActionEnum.clear, newValue: undefined, sourceID: 0 });
        setNetworkFocusID(undefined);
    }, [collapsedState]);

    useEffect(() => {
        if (leftPerspective === undefined && rightPerspective === undefined) {

            setSelectedObject({ action: SelectedObjectActionEnum.clear, newValue: undefined, sourceID: 0 });
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
            perspectiveInfo={leftPerspective}
            viewOptions={viewOptions}
            sf={sf}
            selectedObject={selectedObject}
            dimStrat={dimensionStrategy}
            networkFocusID={networkFocusID}
            perspectiveState={leftState}
        />

    const rightComponent = rightPerspective === undefined ? "" :
        <PerspectiveView
            perspectiveInfo={rightPerspective}
            viewOptions={viewOptions}
            sf={sf}
            selectedObject={selectedObject}
            dimStrat={dimensionStrategy}
            networkFocusID={networkFocusID}
            perspectiveState={rightState}
        />

    return (
        <div className="perspectives-containers">
            < Tooltip
                selectedObject={selectedObject}
                hideLabels={viewOptions.hideLabels}
            />
            <div className={PerspectiveState[leftState]}
                key={leftPerspective === undefined ? -1 : `first${leftPerspective.details.id}`}>
                {leftComponent}
            </div>

            <div className={PerspectiveState[rightState]}
                key={rightPerspective === undefined ? -2 : `second${rightPerspective.details.id}`}>
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
function calculatePerspectiveState(leftPerspective: PerspectiveInfo | undefined, rightPerspective: PerspectiveInfo | undefined,
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


