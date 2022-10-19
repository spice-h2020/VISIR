/**
 * @fileoverview This file creates a dropdown that changes some of the view options of the network
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ButtonState, initialOptions, ViewOptionAction, ViewOptions } from "../constants/viewOptions";
import { bStateArrayReducer, bStateArrayActionEnum } from "../constants/auxTypes";
//Packages
import React, { Dispatch, useReducer } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";
import { Slider } from "../basicComponents/Slider";

const hrStyle: React.CSSProperties = {
    margin: "0.1rem 0",
    borderBottom: "1px",
    borderColor: "black",
}

interface OptionsDropdownProps {
    setViewOptions: Dispatch<ViewOptionAction>;
}

/**
 * Dropdown component that holds diferent options that changes some of the view options of the network
 */
export const OptionsDropdown = ({
    setViewOptions
}: OptionsDropdownProps) => {

    //State of all items
    const [states, setStates] = useReducer(bStateArrayReducer, init());

    const onClick = (index: number, updateType: keyof ViewOptions) => {
        if (states[index] !== ButtonState.loading) {

            const savedState = states[index];
            setStates({ action: bStateArrayActionEnum.changeOne, index: index, newState: ButtonState.loading });

            try {
                setViewOptions({ updateType: updateType })
                setStates({ action: bStateArrayActionEnum.changeOne, index: index, newState: savedState === ButtonState.active ? ButtonState.unactive : ButtonState.active });

            } catch (e: any) {
                setStates({ action: bStateArrayActionEnum.changeOne, index: index, newState: savedState });
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

    return (
        <Dropdown
            items={[optionsButtons]}
            content="Options"
            extraClassButton="transparent down-arrow"
        />
    );
};

/**
 * Calculates the initial state of the dropdown
 */
const init = (): ButtonState[] => {
    const initialState: ButtonState[] = [];

    initialState.push(initialOptions.hideLabels);
    initialState.push(initialOptions.hideEdges);
    initialState.push(initialOptions.border);

    return initialState;
}
