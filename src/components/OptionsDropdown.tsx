/**
 * @fileoverview This file creates a dropdown that changes some of the view options of the network
 * @package It requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ButtonState, initialOptions } from "../constants/viewOptions";
//Packages
import React, { useState } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";
import { TresholdSlider } from "./tresholdSlider";

interface OptionsDropdownProps {
    //On click handler for hide labels option
    onHideLabels: Function;
    //On click handler for hide edges option
    onHideEdges: Function;
    //On click handler for variable edge width option
    onEdgeWidth: Function;
    //On click handler for border option
    onBorder: Function;
    //On change handler for threshold option
    onThreshold: Function;
    //On change handler for delete edges option
    onDeleteEdges: Function;
}

/**
 * Dropdown component
 */
export const OptionsDropdown = ({
    onHideLabels,
    onHideEdges,
    onEdgeWidth,
    onBorder,
    onThreshold,
    onDeleteEdges: onDeleteEdges,
}: OptionsDropdownProps) => {

    const [itemsState, setItemsState] = useState<Array<ButtonState>>(initialState);

    const onClick = (index: number, realOnclick: Function) => {
        if (itemsState[index] !== ButtonState.loading) {

            const savedState = itemsState[index];

            //Update the state to loading
            const newSelected = Object.assign(new Array(), itemsState);
            newSelected[index] = ButtonState.loading;
            setItemsState(newSelected);

            //Once the real onClick function finish, it will return true if the button option was succesfuly executed
            if (realOnclick(savedState !== ButtonState.active)) {

                //Update the state to the oposite of what the saved state is, because the click worked
                const newSelected = Object.assign(new Array(), itemsState);
                newSelected[index] = savedState === ButtonState.active ? ButtonState.inactive : ButtonState.active;
                setItemsState(newSelected);

            } else {

                //Update the state to the the saved state, because the click didnt worked
                const newSelected = Object.assign(new Array(), itemsState);
                newSelected[index] = savedState === ButtonState.active ? ButtonState.inactive : ButtonState.active;
                setItemsState(newSelected);
            }
        }
    }

    const optionsButtons: React.ReactNode[] = [
        <Button
            content="Hide node labels"
            onClick={() => { onClick(0, onHideLabels); }}
            state={itemsState[0]}
            key={0} />,
        <Button
            content="Hide unselected Edges"
            onClick={() => { onClick(1, onHideEdges); }}
            state={itemsState[1]}
            key={1} />,
        <hr key={2} />,
        <TresholdSlider
            content="Minimum similarity:"
            onInput={onThreshold}
            key={3}
        />,
        <hr key={4} />,
        <TresholdSlider
            content="Remove % of edges:"
            contentUnit="%"
            minimum={0}
            maximum={100}
            step={10}
            onInput={onDeleteEdges}
            key={5}
        />,
        <hr key={6} />,
        <Button
            content="Make edge width variable"
            onClick={() => { onClick(2, onEdgeWidth); }}
            state={itemsState[2]}
            key={7} />,
        <hr key={8} />,
        <Button
            content="Activate nodes borders"
            onClick={() => { onClick(3, onBorder); }}
            state={itemsState[3]}
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
const initialState = new Array();
const init = () => {
    initialState.push(initialOptions.hideLabels);
    initialState.push(initialOptions.hideEdges);
    initialState.push(initialOptions.edgeWidth);
    initialState.push(initialOptions.border);
}
init();
/**
 * Returns the buttons-reactComponents of the option dropdown and link each one of them with their corresponding on click function
 * @param onClick 
 * @param onHideLabels 
 * @param onHideEdges 
 * @param onEdgeWidth 
 * @param onBorder 
 * @param selectedItems state of the buttons
 * @returns 
 */

