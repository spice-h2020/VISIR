/**
 * @fileoverview This file creates the perspective view component and broadcast the necesary options, 
 * like what node is currently selected.
 * This component also holds and resets the controllers shared by the perspectives, like the dimensions strategy.
 * 
 * The first perspective view created has the responsability of creating the dimensions strategy.
 * 
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { IPerspectiveData, EPerspectiveVisState } from "../constants/perspectivesTypes";
import { ViewOptions, EAppCollapsedState } from "../constants/viewOptions"
import { ESelectedObjectAction, selectedObjectReducer, IStateFunctions, ILegendDataAction, CTranslation } from "../constants/auxTypes";
//Packages
import { useEffect, useReducer, useState } from "react";
//Local files
import { Tooltip } from "../basicComponents/Tooltip";
import { PerspectiveView } from "./PerspectiveView";
import NodeDimensionStrategy from "../managers/nodeDimensionStrat";
import { ILoadingState } from "../basicComponents/LoadingFrontPanel";

const perspectiveContainers: React.CSSProperties = {
    display: "flex",
    marginBottom: "5vh",
    paddingBottom: "1vh",
}

const widthStyle: Map<EPerspectiveVisState, React.CSSProperties> = new Map([
    [EPerspectiveVisState.unactive, { width: "0%" }],
    [EPerspectiveVisState.activeBoth, { width: "50%" }],
    [EPerspectiveVisState.activeSingle, { width: "100%" }],
    [EPerspectiveVisState.activeBig, { width: "80%" }],
    [EPerspectiveVisState.collapsed, { width: "20%" }],
])

interface PerspectivesGroupProps {
    leftPerspective?: IPerspectiveData,
    rightPerspective?: IPerspectiveData,

    collapsedState: EAppCollapsedState,
    /**
     * View options for all networks.
     */
    viewOptions: ViewOptions,
    /**
     * Function to setup the legend's data.
     */
    setLegendData: React.Dispatch<ILegendDataAction>,

    setLoadingState: React.Dispatch<React.SetStateAction<ILoadingState>>,

    translationClass: CTranslation,
}

/**
 * Component that draws both perspective, holds mutual components and broadcast information between pespectives.
 */
export const PerspectivesGroups = ({
    leftPerspective,
    rightPerspective,
    collapsedState,
    viewOptions,
    setLegendData,
    setLoadingState,
    translationClass: tClass,
}: PerspectivesGroupProps) => {

    const [dimensionStrategy, setDimensionStrategy] = useState<NodeDimensionStrategy | undefined>();
    const [networkFocusID, setNetworkFocusID] = useState<string | undefined>();
    const [selectedObject, setSelectedObject] = useReducer(selectedObjectReducer, undefined);

    const sf: IStateFunctions = {
        setLegendData: setLegendData,
        setDimensionStrategy: setDimensionStrategy,
        setNetworkFocusId: setNetworkFocusID,
        setSelectedObject: setSelectedObject,
    }

    //When the collapsed state changes, we clear both datatables
    useEffect(() => {
        setSelectedObject({ action: ESelectedObjectAction.clear, newValue: undefined, sourceID: "0" });
        setNetworkFocusID(undefined);
    }, [collapsedState]);

    //When a new perspective is loaded, we clear all configuration
    useEffect(() => {
        if (leftPerspective === undefined && rightPerspective === undefined) {

            setLegendData({ type: "reset", newData: false });
            setSelectedObject({ action: ESelectedObjectAction.clear, newValue: undefined, sourceID: "0" });
            setNetworkFocusID(undefined);
            setDimensionStrategy(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            setLoadingState={setLoadingState}
            unique={rightPerspective === undefined}
            translationClass={tClass}
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
            setLoadingState={setLoadingState}
            unique={leftPerspective === undefined}
            translationClass={tClass}
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
 * Calculates the Perspective state based on the application collapsed state. If only one perspective is defined,
 * the other perspective will be singleActive no matter the collapsed state value.
 * @param leftPerspective data of the left perspective.
 * @param rightPerspective data of the right perspective.
 * @param collapsedState collapsed state of the application.
 * @returns returns two perspective states, {left, right}
 */
function calculatePerspectiveState(leftPerspective: IPerspectiveData | undefined, rightPerspective: IPerspectiveData | undefined,
    collapsedState: EAppCollapsedState) {

    let leftState: EPerspectiveVisState = EPerspectiveVisState.unactive;
    let rightState: EPerspectiveVisState = EPerspectiveVisState.unactive;

    switch (true) {
        case leftPerspective === undefined:
            leftState = EPerspectiveVisState.unactive;

            if (rightPerspective === undefined)
                rightState = EPerspectiveVisState.unactive;

            else
                rightState = EPerspectiveVisState.activeSingle;
            break;

        case rightPerspective === undefined:
            leftState = EPerspectiveVisState.activeSingle;
            rightState = EPerspectiveVisState.unactive;
            break;

        case collapsedState === EAppCollapsedState.toTheLeft:
            leftState = EPerspectiveVisState.collapsed;
            rightState = EPerspectiveVisState.activeBig;

            break;

        case collapsedState === EAppCollapsedState.toTheRight:
            leftState = EPerspectiveVisState.activeBig;
            rightState = EPerspectiveVisState.collapsed;

            break;

        case collapsedState === EAppCollapsedState.unCollapsed:
            leftState = EPerspectiveVisState.activeBoth;
            rightState = EPerspectiveVisState.activeBoth;
            break;
    }
    return { leftState, rightState };
}


