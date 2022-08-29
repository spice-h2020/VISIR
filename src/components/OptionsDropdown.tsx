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

    /**
     * Returns the buttons-reactComponents of the options dropdown
     * @param onClick On click function for the buttons. Will receive the index of the component and a function as arguments
     * @returns returns an array of React components
     */
    const getButtons = (onClick: Function): React.ReactNode[] => {
        return [
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
            //TODO Add the threshold slider or similar option
            <hr key={3} />,
            <Button
                content="Make edge width variable"
                onClick={() => { onClick(2, onEdgeWidth); }}
                state={itemsState[2]}
                key={4} />,
            <hr key={5} />,
            <Button
                content="Activate nodes borders"
                onClick={() => { onClick(3, onBorder); }}
                state={itemsState[3]}
                key={6} />
        ];
    }

    const optionsButtons: React.ReactNode[] = getButtons(onClick);

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

