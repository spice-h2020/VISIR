/**
 * @fileoverview This file creates a dropdown that changes some of the view options of the network
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ButtonState, initialOptions, ViewOptionAction, ViewOptions } from "../constants/viewOptions";
//Packages
import React, { Dispatch, useEffect, useReducer, useState } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";
import { Slider } from "../basicComponents/Slider";
import { bStateArrayReducer, bStateArrayActionEnum } from "../constants/auxTypes";

interface OptionsDropdownProps {
    setViewOptions: Dispatch<ViewOptionAction>;
}

/**
 * Dropdown component
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

    const onSlide = (updateType: keyof ViewOptions, newValue: number) => {
        setViewOptions({ updateType: updateType, newValue: newValue })
    }

    const optionsButtons: React.ReactNode[] = [
        <Button
            content="Hide node labels"
            onClick={() => { onClick(0, "hideLabels"); }}
            state={states[0]}
            key={0} />,
        <Button
            content="Hide unselected Edges"
            onClick={() => { onClick(1, "hideEdges"); }}
            state={states[1]}
            key={1} />,
        <hr key={2} />,
        <Slider
            content="Minimum similarity:"
            onInput={(value: number) => { setViewOptions({ updateType: "edgeThreshold", newValue: value }); }}
            initialValue={initialOptions.edgeThreshold}
            key={3}
        />,
        <hr key={4} />,
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
        <hr key={6} />,
        <Button
            content="Make edge width variable"
            onClick={() => { onClick(2, "edgeWidth"); }}
            state={states[2]}
            key={7} />,
        <hr key={8} />,
        <Button
            content="Activate nodes borders"
            onClick={() => { onClick(3, "border"); }}
            state={states[3]}
            key={9} />
    ];

    return (
        <Dropdown
            items={[optionsButtons]}
            content="Options"
            extraClassName="dropdown-light"
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
    initialState.push(initialOptions.edgeWidth);
    initialState.push(initialOptions.border);

    return initialState;
}
