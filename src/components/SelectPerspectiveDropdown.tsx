/**
 * @fileoverview This file creates a dropdown that changes activates/disactives diferent perspectives from the allPerspectives prop.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ButtonState } from "../constants/viewOptions"
import { PerspectiveDetails } from '../constants/perspectivesTypes';
//Packages
import React, { useState, useEffect } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";

interface SelectPerspectiveProps {
    //On click handler
    onClick: Function;
    //Object that contains the name of all perspectives availables
    allPerspectives?: PerspectiveDetails[];
    //Map that contains the relation between the name of a perspective and their visual state.
    itemsState: Map<number, ButtonState>;
}

/**
 * Dropdown component that holds the options to add/hide perspectives to the application
 */
export const SelectPerspectiveDropdown = ({
    onClick,
    allPerspectives,
    itemsState: states,
}: SelectPerspectiveProps) => {

    const [itemsState, setItemsState] = useState(states);

    useEffect(() => {
        setItemsState(states);
    }, [states]);

    if (allPerspectives === undefined) {
        return (
            <Dropdown
                items={[]}
                content="No available perspectives"
                extraClassName="dropdown-dark"
            />
        );
    }

    //Creates all perspective buttons components
    const perspectivesButtons: React.ReactNode[] = getButtons(allPerspectives, states, onClick);


    return (
        <Dropdown
            items={perspectivesButtons}
            content="Select Perspective"
            extraClassName="dropdown-dark"
        />
    );
};

/**
 * Returns the buttons-reactComponents of the Select perspective dropdown
 * @param allPerspectives Array that contains all perspectiveDetails available to the user
 * @param itemsState Active/disabled state of all items
 * @param onClick Function executed when any button is clicked
 * @returns returns an array of React components
 */
function getButtons(allPerspectives: PerspectiveDetails[], itemsState: Map<number, ButtonState>, onClick: Function): React.ReactNode[] {
    const buttons = new Array<React.ReactNode>();

    for (let i = 0; i < allPerspectives.length; i++) {
        buttons.push(
            <Button
                content={allPerspectives[i].name}
                state={itemsState.get(allPerspectives[i].id)}
                onClick={() => {
                    onClick(allPerspectives[i].id);
                }} />
        );
    }

    return buttons;
}

