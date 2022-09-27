/**
 * @fileoverview This file creates all the perspective views and broadcast the necesary options, like the node that is selected, all perspective views need that to update their
 * dataTables
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { PerspectiveInfo, PerspectivePair } from "../constants/perspectivesTypes";
import { AppLayout, initialOptions, ViewOptions } from "../constants/viewOptions"
import { Point, StateFunctions, TooltipInfo, tooltipInfoReducer } from "../constants/auxTypes";
//Packages
import React, { useEffect, useReducer, useState } from "react";
//Local files
import { PerspectiveView } from "./PerspectiveView";
import NodeDimensionStrategy from "../managers/dimensionStrategy";
import { Tooltip } from "../basicComponents/Tooltip";
import '../style/network.css';

//Current layout of the active perspectives.
const layout = initialOptions.layout;

interface PerspectivesGroupProps {
    leftPerspective?: PerspectiveInfo,
    rightPerspective?: PerspectiveInfo,

    collapsedState: collapsedState,
    //View options for all networks
    viewOptions: ViewOptions,
    //Function to setup the legend's data
    setLegendData: Function,
}

enum perspectiveState {
    unactive,
    activeSingle,
    activeBoth,
    activeBig,
    collapsed,
}

export enum collapsedState {
    unCollapsed,
    toTheLeft,
    toTheRight,
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

    const [selectedNodeId, setSelectedNodeId] = useState<number | undefined>();
    const [networkFocusID, setNetworkFocusID] = useState<number | undefined>();
    const [tooltip, setTooltip] = useReducer(tooltipInfoReducer, undefined);

    const sf: StateFunctions = {
        setSelectedNodeId: setSelectedNodeId,
        setTooltip: setTooltip,
        setLegendData: setLegendData,
        setDimensionStrategy: setDimensionStrategy,
        setNetworkFocusId: setNetworkFocusID
    }

    
    useEffect(() => {
        setTooltip({ action: "clear", newValue: undefined });
        setNetworkFocusID(undefined);
        setSelectedNodeId(undefined);

    }, [collapsedState]);

    useEffect(() => {
        if (leftPerspective === undefined && rightPerspective === undefined) {

            setTooltip({ action: "clear", newValue: undefined });
            setSelectedNodeId(undefined);
            setNetworkFocusID(undefined);
            setDimensionStrategy(undefined);
        }

    }, [leftPerspective, rightPerspective]);

    useEffect(() => {
        if (dimensionStrategy !== undefined)
            dimensionStrategy.toggleBorderStat(viewOptions.border);

    }, [viewOptions.border]);


    const { leftState, rightState } = calculatePerspectiveState(leftPerspective, rightPerspective, collapsedState);

    const leftComponent = leftPerspective === undefined ? "" :
        <PerspectiveView
            perspectiveInfo={leftPerspective}
            viewOptions={viewOptions}
            sf={sf}
            selectedNodeId={selectedNodeId}
            dimStrat={dimensionStrategy}
            networkFocusID={networkFocusID}
        />

    const rightComponent = rightPerspective === undefined ? "" :
        <PerspectiveView
            perspectiveInfo={rightPerspective}
            viewOptions={viewOptions}
            sf={sf}
            selectedNodeId={selectedNodeId}
            dimStrat={dimensionStrategy}
            networkFocusID={networkFocusID}
        />

    return (
        <div className="perspectives-containers">
            < Tooltip
                tooltipInfo={tooltip}
            />
            <div className={perspectiveState[leftState]}
                key={leftPerspective === undefined ? -1 : `first${leftPerspective.details.id}`}>
                {leftComponent}
            </div>

            <div className={perspectiveState[rightState]}
                key={rightPerspective === undefined ? -2 : `second${rightPerspective.details.id}`}>
                {rightComponent}
            </div>
        </div>
    );
};

function calculatePerspectiveState(leftPerspective: PerspectiveInfo | undefined, rightPerspective: PerspectiveInfo | undefined,
    collapsed: collapsedState) {

    let leftState: perspectiveState = perspectiveState.unactive;
    let rightState: perspectiveState = perspectiveState.unactive;

    switch (true) {
        case leftPerspective === undefined:
            leftState = perspectiveState.unactive;

            if (rightPerspective === undefined)
                rightState = perspectiveState.unactive;

            else
                rightState = perspectiveState.activeSingle;
            break;

        case rightPerspective === undefined:
            leftState = perspectiveState.activeSingle;
            rightState = perspectiveState.unactive;
            break;

        case collapsed === collapsedState.toTheLeft:
            leftState = perspectiveState.collapsed;
            rightState = perspectiveState.activeBig;

            break;

        case collapsed === collapsedState.toTheRight:
            leftState = perspectiveState.activeBig;
            rightState = perspectiveState.collapsed;

            break;

        case collapsed === collapsedState.unCollapsed:
            leftState = perspectiveState.activeBoth;
            rightState = perspectiveState.activeBoth;
            break;
    }
    return { leftState, rightState };
}