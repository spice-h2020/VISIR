/**
 * @fileoverview This file creates a dropdown that changes some of the view options of the network.
 * @package Requires React package.
 * @author Marco Expósito Pérez
 */
//Constants
import { EButtonState, IViewOptionAction, ViewOptions } from "../constants/viewOptions";
import { bStateArrayReducer, CTranslation, EbuttonStateArrayAction } from "../constants/auxTypes";
//Packages
import React, { Dispatch, useReducer } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { Slider } from "../basicComponents/Slider";
import { DropMenu, EDropMenuDirection } from "../basicComponents/DropMenu";

const hrStyle: React.CSSProperties = {
    margin: "0.1rem 0",
    borderBottom: "1px",
    borderColor: "black",
}

interface OptionsDropdownProps {
    setViewOptions: Dispatch<IViewOptionAction>;
    translationClass: CTranslation;

    insideHamburger?: boolean;
    viewOptions: ViewOptions;
}

/**
 * Dropdown component that holds diferent options that change some of the view options of the network.
 */
export const OptionsDropdown = ({
    setViewOptions,
    translationClass: tClass,
    insideHamburger = false,
    viewOptions,
}: OptionsDropdownProps) => {

    const [states, setStates] = useReducer(bStateArrayReducer, init(viewOptions));

    const onClick = (index: number, updateType: keyof ViewOptions) => {
        if (states[index] !== EButtonState.loading) {

            const savedState = states[index];
            setStates({ action: EbuttonStateArrayAction.changeOne, index: index, newState: EButtonState.loading });

            try {
                setViewOptions({ updateType: updateType })
                setStates({ action: EbuttonStateArrayAction.changeOne, index: index, newState: savedState === EButtonState.active ? EButtonState.unactive : EButtonState.active });

            } catch (e: any) {
                setStates({ action: EbuttonStateArrayAction.changeOne, index: index, newState: savedState });
            }
        }
    }

    const optionsButtons: React.ReactNode[] = [
        <Button
            content={tClass.t.toolbar.optionsDrop.hideLabels}
            onClick={() => { onClick(0, "hideLabels"); }}
            state={states[0]}
            key={0}
            extraClassName={"btn-dropdown"} />,
        <Button
            content={tClass.t.toolbar.optionsDrop.hideEdges}
            onClick={() => { onClick(1, "hideEdges"); }}
            state={states[1]}
            key={1}
            extraClassName={"btn-dropdown"} />,
        <hr key={2} style={hrStyle} />,
        <Slider
            content={tClass.t.toolbar.optionsDrop.minSimilarity}
            onInput={(value: number) => { setViewOptions({ updateType: "edgeThreshold", newValue: value }); }}
            initialValue={viewOptions.edgeThreshold}
            key={3}
        />,
        // <hr key={4} style={hrStyle} />,
        // <Slider
        //     content={tClass.t.toolbar.optionsDrop.removeEdges}
        //     contentUnit="%"
        //     minimum={0}
        //     maximum={100}
        //     step={10}
        //     initialValue={viewOptions.deleteEdges}
        //     onInput={(value: number) => { setViewOptions({ updateType: "deleteEdges", newValue: value }); }}
        //     key={5}
        // />
        <hr key={6} style={hrStyle} />,
        <Slider
            content={"Number of relevant artworks"}
            minimum={0}
            maximum={10}
            step={1}
            initialValue={viewOptions.nRelevantCommArtworks}
            onInput={(value: number) => { setViewOptions({ updateType: "nRelevantCommArtworks", newValue: value }); }}
            key={7}
        />
    ];

    if (!insideHamburger) {
        return (
            <DropMenu
                items={[optionsButtons]}
                content={tClass.t.toolbar.optionsDrop.name}
                extraClassButton="transparent down-arrow"
                menuDirection={EDropMenuDirection.down}
            />
        );
    } else {
        return (
            <DropMenu
                items={[optionsButtons]}
                content={tClass.t.toolbar.optionsDrop.name}
                extraClassButton="transparent down-arrow btn-dropdown"
                menuDirection={EDropMenuDirection.right}
            />
        );
    }

};

/**
 * Calculates the initial state of the dropdown.
 */
const init = (viewOptions: ViewOptions): EButtonState[] => {
    const initialState: EButtonState[] = [];

    initialState.push(viewOptions.hideLabels ? EButtonState.active : EButtonState.unactive);
    initialState.push(viewOptions.hideEdges ? EButtonState.active : EButtonState.unactive);

    return initialState;
}
