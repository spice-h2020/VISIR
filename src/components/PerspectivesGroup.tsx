/**
 * @fileoverview This file creates all the perspective views and broadcast the necesary options, like the node that is selected, all perspective views need that to update their
 * dataTables
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { PerspectiveInfo, PerspectivePair } from "../constants/perspectivesTypes";
import { AppLayout, initialOptions, ViewOptions } from "../constants/viewOptions"
import { Point, StateFunctions, TooltipInfo } from "../constants/auxTypes";
//Packages
import React, { useEffect, useState } from "react";
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

enum collapsedState {
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
    viewOptions,
    setLegendData,
}: PerspectivesGroupProps) => {

    const [collapsed, setCollapsed] = useState<collapsedState>(collapsedState.unCollapsed);

    const [selectedNodeId, setSelectedNodeId] = useState<number | undefined>();

    const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | undefined>();
    const [tooltipState, setTooltipState] = useState<boolean>(true);
    const [tooltipPos, setTooltipPos] = useState<Point | undefined>();

    const [networkFocusID, setNetworkFocusID] = useState<number | undefined>();
    const [dimensionStrategy, setDimensionStrategy] = useState<NodeDimensionStrategy | undefined>();

    const sf: StateFunctions = {
        setSelectedNodeId: setSelectedNodeId,
        setTooltipInfo: setTooltipInfo,
        setTooltipPosition: setTooltipPos,
        setTooltipState: setTooltipState,
        setLegendData: setLegendData,
        setDimensionStrategy: setDimensionStrategy,
        setNetworkFocusId: setNetworkFocusID
    }

    // const perspectivesComponents: React.ReactNode[] = getActivePerspectivesComponents(perspectivePairs, viewOptions, layout, selectedNodeId, sf, dimensionStrategy, networkFocusID);

    // useEffect(() => {
    //     //Reset some states to default when we clear all the active perspectives
    //     if (nPerspectives === 0) {
    //         setViewActive(false);

    //         setSelectedNodeId(undefined);
    //         setNetworkFocusID(undefined);
    //         setDimensionStrategy(undefined);

    //     } else {
    //         setViewActive(true);
    //     }

    // }, [nPerspectives, setViewActive]);

    // useEffect(() => {
    //     if (dimensionStrategy !== undefined)
    //         dimensionStrategy.toggleBorderStat(viewOptions.border);

    // }, [viewOptions.border, dimensionStrategy]);


    const { leftState, rightState } = calculatePerspectiveState(leftPerspective, rightPerspective, collapsed);

    const leftComponent = leftPerspective === undefined ? "" :
        <PerspectiveView
            perspectiveInfo={leftPerspective}
            viewOptions={viewOptions}
            layout={layout}
            selectedNodeId={selectedNodeId}
            sf={sf}
            dimStrat={dimensionStrategy}
            networkFocusID={networkFocusID}
        />

    const rightComponent = rightPerspective === undefined ? "" :
        <PerspectiveView
            perspectiveInfo={rightPerspective}
            viewOptions={viewOptions}
            layout={layout}
            selectedNodeId={selectedNodeId}
            sf={sf}
            dimStrat={dimensionStrategy}
            networkFocusID={networkFocusID}
        />

    return (
        <div className="perspectives-containers">
            {/* {<Tooltip
                state={tooltipState}
                content={tooltipInfo}
                position={tooltipPos}
            />} */}
            <div className={perspectiveState[leftState]}
                key={leftPerspective === undefined ? -1 : leftPerspective.details.id}>
                {leftComponent}
            </div>

            <div className={perspectiveState[rightState]}
                key={rightPerspective === undefined ? -2 : rightPerspective.details.id}>
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

/**
 * Creates all active perspective components based on the perspective Pair parameter. Perspectives will have a diferent layour depending on if they are alone in a pair, 
 * and if there are two perspectives in a pair it will depend on the layout parameter
 * @param perspectivePairs Data of the active perspectives arranged in pairs
 * @param viewOptions ViewOptions for the perspectives
 * @param layout Layout options
 * @param selectedNodeId Id of the node that is currently selected between all perspectives
 * @param sf Object with all functions that change the state of a perspective
 * @param dimStrat Dimension strat that will be used for all perspectives
 * @param networkFocusID Id of the current network with the control of the tooltip
 * @returns An array with the react components created
 */
function getActivePerspectivesComponents(perspectivePairs: PerspectivePair[], viewOptions: ViewOptions, layout: AppLayout,
    selectedNodeId: undefined | number, sf: StateFunctions, dimStrat: NodeDimensionStrategy | undefined, networkFocusID: number | undefined): React.ReactNode[] {

    const perspectivesComponents = new Array<React.ReactNode>();

    for (let i = 0; i < perspectivePairs.length; i++) {

        if (perspectivePairs[i].hasEmptySpace()) {

            const perspective = perspectivePairs[i].getSingle();
            if (perspective !== undefined) {
                perspectivesComponents.push(
                    <div className="singleNetwork" key={perspective.details.id}>
                        <PerspectiveView
                            key={perspective.details.id}
                            perspectiveInfo={perspective}
                            viewOptions={viewOptions}
                            layout={layout}
                            selectedNodeId={selectedNodeId}
                            sf={sf}
                            dimStrat={dimStrat}
                            networkFocusID={networkFocusID}
                        />
                    </div>
                );
            }

        } else {
            const perspectiveA = perspectivePairs[i].perspectives[0];
            const perspectiveB = perspectivePairs[i].perspectives[1];

            if (perspectiveA !== undefined && perspectiveB !== undefined) {
                perspectivesComponents.push(
                    <div className={`pairNetwork ${AppLayout[layout]}`}
                        key={`${perspectiveA.details.id}:${perspectiveB.details.id}`}>
                        <PerspectiveView
                            key={perspectiveA.details.id}

                            perspectiveInfo={perspectiveA}
                            viewOptions={viewOptions}
                            layout={layout}
                            isFirstPerspective={true}
                            selectedNodeId={selectedNodeId}
                            sf={sf}
                            dimStrat={dimStrat}
                            networkFocusID={networkFocusID}
                        />
                        <PerspectiveView
                            key={perspectiveB.details.id}

                            perspectiveInfo={perspectiveB}
                            viewOptions={viewOptions}
                            layout={layout}
                            isFirstPerspective={false}
                            selectedNodeId={selectedNodeId}
                            sf={sf}
                            dimStrat={dimStrat}
                            networkFocusID={networkFocusID}
                        />
                    </div>
                );
            }
            ;
        }
    }

    return perspectivesComponents;
}

