/**
 * @fileoverview This file creates a dropdown that changes some of the view options of the network.
 * @package Requires React package.
 * @author Marco Expósito Pérez
 */
//Constants
import { EButtonState, initialOptions, IViewOptionAction, ViewOptions } from "../constants/viewOptions";
import { bStateArrayReducer, EbuttonStateArrayAction } from "../constants/auxTypes";
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

    insideHamburger?: boolean;
}

/**
 * Dropdown component that holds diferent options that change some of the view options of the network.
 */
export const OptionsDropdown = ({
    setViewOptions,
    insideHamburger = false,
}: OptionsDropdownProps) => {

    const [states, setStates] = useReducer(bStateArrayReducer, init());

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
            content="Hide node labels"
            onClick={() => { onClick(0, "hideLabels"); }}
            state={states[0]}
            key={0}
            extraClassName={"btn-dropdown"} />,
        <Button
            content="Hide unselected Edges"
            onClick={() => { onClick(1, "hideEdges"); }}
            state={states[1]}
            key={1}
            extraClassName={"btn-dropdown"} />,
        <hr key={2} style={hrStyle} />,
        <Slider
            content="Minimum similarity:"
            onInput={(value: number) => { setViewOptions({ updateType: "edgeThreshold", newValue: value }); }}
            initialValue={initialOptions.edgeThreshold}
            key={3}
        />,
        <hr key={4} style={hrStyle} />,
        <Slider
            content="Remove % of edges:"
            contentUnit="%"
            minimum={0}
            maximum={100}
            step={10}
            initialValue={initialOptions.deleteEdges}
            onInput={(value: number) => { setViewOptions({ updateType: "deleteEdges", newValue: value }); }}
            key={5}
        />,
        <hr key={8} style={hrStyle} />,
        <Button
            content="Activate nodes borders"
            onClick={() => { onClick(3, "border"); }}
            state={states[3]}
            key={9}
            extraClassName={"btn-dropdown"} />
    ];

    if (!insideHamburger) {
        return (
            <DropMenu
                items={[optionsButtons]}
                content="Options"
                extraClassButton="transparent down-arrow"
                menuDirection={EDropMenuDirection.down}
            />
        );
    } else {
        return (
            <DropMenu
                items={[optionsButtons]}
                content="Options"
                extraClassButton="transparent down-arrow btn-dropdown"
                menuDirection={EDropMenuDirection.right}
            />
        );
    }

};

/**
 * Calculates the initial state of the dropdown.
 */
const init = (): EButtonState[] => {
    const initialState: EButtonState[] = [];

    initialState.push(initialOptions.hideLabels);
    initialState.push(initialOptions.hideEdges);
    initialState.push(initialOptions.border);

    return initialState;
}
