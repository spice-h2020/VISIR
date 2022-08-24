/**
 * @fileoverview This file creates a dropdown that changes some of the view options of the network
 * @package It requires React package. 
 * @author Marco Expósito Pérez
 */
//Namespaces
import { ButtonState, initialOptions } from "../namespaces/ViewOptions";
//Packages
import React, { useState, useEffect } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";

interface OptionsDropdownProps {
    //On click handler for hide labels option
    onHideLabels: (newValue: boolean) => boolean;
    //On click handler for hide edges option
    onHideEdges: (newValue: boolean) => boolean;
    //On click handler for variable edge width option
    onEdgeWidth: (newValue: boolean) => boolean;
    //On click handler for border option
    onBorder: (newValue: boolean) => boolean;
}


/**
 * Dropdown component
 */
export const OptionsDropdown = ({
    onHideLabels,
    onHideEdges,
    onEdgeWidth,
    onBorder,
}: OptionsDropdownProps) => {

    const [selectedItems, setSelectedOptions] = useState<Array<ButtonState>>(initialState);

    //TODO Check this
    const onClick = (index: number, realOnclick: Function) => {
        if (selectedItems[index] !== ButtonState.loading) {
            const savedState = selectedItems[index];

            const newSelected = Object.assign(new Array(), selectedItems);
            newSelected[index] = ButtonState.loading;
            setSelectedOptions(newSelected);

            if (realOnclick(savedState !== ButtonState.active)) {
                const newSelected = Object.assign(new Array(), selectedItems);
                newSelected[index] = savedState === ButtonState.active ? ButtonState.inactive : ButtonState.active;
                setSelectedOptions(newSelected);
            } else {
                const newSelected = Object.assign(new Array(), selectedItems);
                newSelected[index] = savedState === ButtonState.active ? ButtonState.inactive : ButtonState.active;
                setSelectedOptions(newSelected);
            }
        }
    }

    const optionsButtons: React.ReactNode[] = getButtons(onClick, onHideLabels, onHideEdges, onEdgeWidth, onBorder, selectedItems)

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
function getButtons(onClick: (index: number, realOnclick: Function) => void, onHideLabels: (newValue: boolean) => boolean, onHideEdges: (newValue: boolean) => boolean,
    onEdgeWidth: (newValue: boolean) => boolean, onBorder: (newValue: boolean) => boolean, selectedItems: ButtonState[]): React.ReactNode[] {

    return [
        <Button
            content="Hide node labels"
            onClick={() => { onClick(0, onHideLabels); }}
            state={selectedItems[0]}
            key={0} />,
        <Button
            content="Hide unselected Edges"
            onClick={() => { onClick(1, onHideEdges); }}
            state={selectedItems[1]}
            key={1} />,
        <hr key={2} />,
        //TODO Add the threshold slider
        <hr key={3} />,
        <Button
            content="Make edge width variable"
            onClick={() => { onClick(2, onEdgeWidth); }}
            state={selectedItems[2]}
            key={4} />,
        <hr key={5} />,
        <Button
            content="Activate nodes borders"
            onClick={() => { onClick(3, onBorder); }}
            state={selectedItems[3]}
            key={6} />
    ];
}
