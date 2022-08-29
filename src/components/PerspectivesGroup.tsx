/**
 * @fileoverview This file creates all the perspective views and broadcast the necesary options, like the node that is selected, all perspective views need that to update their
 * dataTables
 * @package It requires React package. 
 * @author Marco Expósito Pérez
 */
//Namespaces
import { PerspectivePair, UserData } from "../namespaces/perspectivesTypes";
import { AppLayout, ViewOptions } from "../namespaces/ViewOptions"
import { Tooltip, TooltipInfo } from "../basicComponents/Tooltip";

//Packages
import React, { useEffect, useState } from "react";
//Local files
import { PerspectiveView } from "./PerspectiveView";
import { Point } from "../controllers/nodeVisuals";
import { StateFunctions } from "../controllers/networkController";
import NodeDimensionStrategy from "../managers/dimensionStrategy";

interface PerspectivesGroupProps {
    //Pairs of networks that wil be active and interactuable
    perspectivePairs: PerspectivePair[],
    //Type of the layout of the pair networks
    layout: AppLayout,
    //View options for all networks
    viewOptions: ViewOptions,
    //Function to setup the legend's data
    setLegendData: Function,
    //Function to change the application to inactive when theres no active perspectives
    setViewActive: Function
}

/**
 * Component that draws each active perspective
 */
export const PerspectivesGroups = ({
    perspectivePairs,
    layout,
    viewOptions,
    setLegendData,
    setViewActive,
}: PerspectivesGroupProps) => {

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
        setNetowkrFocusId: setNetworkFocusID
    }
    const perspectivesComponents: React.ReactNode[] = getActivePerspectivesComponents(perspectivePairs, viewOptions, layout, selectedNodeId, sf, dimensionStrategy, networkFocusID);

    useEffect(() => {
        //Reset the selectedNode to default when we clear all the active perspectives
        if (perspectivePairs.length === 0) {
            setViewActive(false);

            if (selectedNodeId !== undefined) {
                setSelectedNodeId(undefined);
            }

            setNetworkFocusID(undefined);
            setDimensionStrategy(undefined);
        } else {
            setViewActive(true);
        }

    }, [perspectivePairs.length]);

    return (
        <div className="perspectives-containers">
            {<Tooltip
                state={tooltipState}
                content={tooltipInfo}
                position={tooltipPos}
            />}

            {perspectivesComponents.map((item: React.ReactNode, index: number): JSX.Element => {
                return (<React.Fragment key={index}>{item}</React.Fragment>);
            })}
        </div>
    );
};

/**
 * Creates all active perspective components based on the perspective Pair parameter. Perspectives will have a diferent layour depending on if they are alone in a pair, 
 * and if there are two perspectives in a pair it will depend on the layout parameter
 * @param perspectivePairs Data of the active perspectives arranged in pairs
 * @param viewOptions ViewOptions for the perspectives
 * @param layout Layout options
 * @param selectedNodeId Id of the node that is currently selected between all perspectives
 * @param sf Object with all functions that change the state of a perspective
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
                    <div className="singleNetwork">
                        <PerspectiveView
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
                    <div className={`pairNetwork ${AppLayout[layout]}`}>
                        <PerspectiveView
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
