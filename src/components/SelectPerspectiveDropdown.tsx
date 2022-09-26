/**
 * @fileoverview This file creates a dropdown that changes activates/disactives diferent perspectives from the allPerspectives prop.
 * This component's item states are externalized because the state is async based on functions that are not in this file
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ButtonState } from "../constants/viewOptions"
import { PerspectiveDetails } from '../constants/perspectivesTypes';
//Packages
import React, { Dispatch, useEffect, useReducer } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";
import RequestManager from "../managers/requestManager";
import { bStateArrayReducer, bStateArrayActionEnum, bStateArrayAction } from "../constants/auxTypes";

interface SelectPerspectiveProps {
    //On click handler
    onClick: Function;
    //Object that contains the name of all perspectives availables
    allPerspectives?: PerspectiveDetails[];
    //Request Manager
    requestManager: RequestManager;
}

/**
 * Dropdown component that holds the options to add/hide perspectives to the application
 */
export const SelectPerspectiveDropdown = ({
    onClick,
    allPerspectives,
    requestManager,
}: SelectPerspectiveProps) => {

    //State of all items
    const [states, setStates] = useReducer(bStateArrayReducer, []);

    useEffect(() => {
        if (allPerspectives !== undefined)
            setStates({ action: bStateArrayActionEnum.reset, index: allPerspectives.length, newState: ButtonState.inactive });

    }, [allPerspectives]);

    if (allPerspectives === undefined || states.length === 0) {
        return (
            <Dropdown
                items={[]}
                content="No available perspectives"
                extraClassName="dropdown-dark"
            />
        );
    }

    //Creates all perspective buttons components
    const perspectivesButtons: React.ReactNode[] = getButtons(allPerspectives, states, setStates, onClick, requestManager);

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
function getButtons(allPerspectives: PerspectiveDetails[], states: ButtonState[],
    setStates: Dispatch<bStateArrayAction>, onClick: Function,
    requestManager: RequestManager): React.ReactNode[] {

    const buttons = new Array<React.ReactNode>();

    for (let i = 0; i < allPerspectives.length; i++) {
        const state: ButtonState = states[allPerspectives[i].localId];

        buttons.push(
            <Button
                key={allPerspectives[i].id}
                content={allPerspectives[i].name}
                state={state}
                onClick={() => {
                    requestManager.selectPerspective(state, allPerspectives[i], setStates, onClick);
                }} />
        );
    }

    return buttons;
}



