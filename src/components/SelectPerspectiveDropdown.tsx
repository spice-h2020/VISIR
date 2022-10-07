/**
 * @fileoverview This file creates a dropdown that changes activates/disactives diferent perspectives from the allPerspectives prop.
 * This component's item states are externalized because the state is async based on functions that are not in this file
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ButtonState } from "../constants/viewOptions"
import { PerspectiveDetails } from '../constants/perspectivesTypes';
import { bStateArrayReducer, bStateArrayActionEnum, bStateArrayAction } from "../constants/auxTypes";
//Packages
import React, { Dispatch, useEffect, useReducer } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";
import RequestManager from "../managers/requestManager";

interface SelectPerspectiveProps {
    //tittle of the dropdown
    tittle: string;
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
    tittle,
    onClick,
    allPerspectives,
    requestManager,
}: SelectPerspectiveProps) => {

    //State of all items
    const [states, setStates] = useReducer(bStateArrayReducer, []);

    useEffect(() => {
        if (allPerspectives !== undefined)
            setStates({ action: bStateArrayActionEnum.reset, index: allPerspectives.length, newState: ButtonState.unactive });

    }, [allPerspectives]);

    if (allPerspectives === undefined || states.length === 0) {
        return (
            <Dropdown
                items={[]}
                content="No available perspectives"
                extraClassButton="primary down-arrow"
            />
        );
    }

    const perspectivesButtons: React.ReactNode[] = getButtons(allPerspectives, states, setStates, onClick, requestManager);

    return (
        <Dropdown
            items={perspectivesButtons}
            content={tittle}
            extraClassButton="primary down-arrow"
        />
    );
};

/**
 * Return all buttons/react components of the select perspective dropdown
 * @param allPerspectives all available perspective details
 * @param states current state of all buttons
 * @param setStates function to set the state of all buttons
 * @param onClick function executed when a button is clicked
 * @param requestManager object to request the diferent files once a button is clicked
 * @returns returns an array of react components
 */
function getButtons(allPerspectives: PerspectiveDetails[], states: ButtonState[],
    setStates: Dispatch<bStateArrayAction>, onClick: Function,
    requestManager: RequestManager): React.ReactNode[] {

    // const buttons = new Array<React.ReactNode>();

    // for (let i = 0; i < allPerspectives.length; i++) {
    //     const state: ButtonState = states[allPerspectives[i].localId];

    //     buttons.push(
    //         <Button
    //             key={allPerspectives[i].id}
    //             content={allPerspectives[i].name}
    //             state={state}
    //             onClick={() => {
    //                 requestManager.requestPerspectiveFIle(state, allPerspectives[i], setStates, onClick);
    //             }}
    //             extraClassName="btn-dropdown" />
    //     );
    // }
    // return buttons;
    return [<div></div>,<div></div>];
}



