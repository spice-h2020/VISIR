/**
 * @fileoverview This file creates a dropdown that changes activates/disactives diferent perspectives from the allPerspectives prop.
 * This component's item states are externalized because the state is async based on functions that are not in this file
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ButtonState } from "../constants/viewOptions"
import { bStateArrayReducer, bStateArrayActionEnum, bStateArrayAction } from "../constants/auxTypes";
//Packages
import React, { Dispatch, useEffect, useReducer } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";
import RequestManager from "../managers/requestManager";
import { PerspectiveActiveState, PerspectiveData, PerspectiveId } from "../constants/perspectivesTypes";

interface SelectPerspectiveProps {
    //tittle of the dropdown
    tittle: string;
    //Set all active perspectives for dropdown items visualization
    setAllIds: Function;
    //Set the current active perspective of this side of the app
    setActivePerspective: Function;
    //Object that contains the name of all perspectives availables
    allIds: PerspectiveId[];
    //Id of the perspective active in this dropdown
    isLeftDropdown: boolean,

    requestMan: RequestManager,
}

/**
 * Dropdown component that holds the options to add/hide perspectives to the application
 */
export const SelectPerspectiveDropdown = ({
    tittle,
    setAllIds,
    setActivePerspective,
    allIds,
    isLeftDropdown,
    requestMan,
}: SelectPerspectiveProps) => {

    //State of all items
    const [states, setStates] = useReducer(bStateArrayReducer, []);

    useEffect(() => {
        if (allIds !== undefined) {
            setStates({ action: bStateArrayActionEnum.reset, index: allIds.length, newState: ButtonState.unactive });

            for (let i = 0; i < allIds.length; i++) {
                if (allIds[i].isActive !== PerspectiveActiveState.unactive) {

                    if (allIds[i].isActive === PerspectiveActiveState.left) {
                        if (isLeftDropdown)
                            setStates({ action: bStateArrayActionEnum.changeOne, index: i, newState: ButtonState.active });
                        else
                            setStates({ action: bStateArrayActionEnum.changeOne, index: i, newState: ButtonState.disabled });

                    } else if (allIds[i].isActive === PerspectiveActiveState.right) {
                        if (!isLeftDropdown)
                            setStates({ action: bStateArrayActionEnum.changeOne, index: i, newState: ButtonState.active });
                        else
                            setStates({ action: bStateArrayActionEnum.changeOne, index: i, newState: ButtonState.disabled });
                    }
                }
            }
        }
    }, [allIds, isLeftDropdown]);

    if (allIds === undefined || states.length === 0) {
        return (
            <Dropdown
                items={[]}
                content="No available perspectives"
                extraClassButton="primary down-arrow"
            />
        );
    }

    const perspectivesButtons: React.ReactNode[] = getButtons(allIds, states, setStates, setAllIds, setActivePerspective, isLeftDropdown, requestMan);

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
 * @param setAllIds function executed when a button is clicked
 * @param requestManager object to request the diferent files once a button is clicked
 * @returns returns an array of react components
 */
function getButtons(allIds: PerspectiveId[], states: ButtonState[], setStates: React.Dispatch<bStateArrayAction>,
    setAllIds: Function, setActivePerspective: Function, isLeft: boolean, requestMan: RequestManager): React.ReactNode[] {

    const buttons = new Array<React.ReactNode>();

    const allIdsToEdit: PerspectiveId[] = JSON.parse(JSON.stringify(allIds));
    const currentActivePerspective = allIdsToEdit.find((value) => {
        if (isLeft) {
            return value.isActive === PerspectiveActiveState.left;
        } else {
            return value.isActive === PerspectiveActiveState.right;
        }
    })

    for (let i = 0; i < allIdsToEdit.length; i++) {
        const state: ButtonState = states[i];

        buttons.push(
            <Button
                key={allIdsToEdit[i].id}
                content={allIdsToEdit[i].name}
                state={state}
                onClick={() => {
                    console.log(state);
                    if (state === ButtonState.active) {

                        allIdsToEdit[i].isActive = PerspectiveActiveState.unactive;
                        //Update all perspectiveIds
                        setAllIds(allIdsToEdit);
                        setActivePerspective(undefined);

                    } else if (state === ButtonState.unactive) {
                        //Request the unactive perspective
                        setStates({ action: bStateArrayActionEnum.changeOne, index: i, newState: ButtonState.loading });

                        requestMan.requestPerspectiveFIle(allIdsToEdit[i].id, allIdsToEdit[i].name,
                            (newPerspective: PerspectiveData) => {
                                if (newPerspective) {
                                    allIdsToEdit[i].isActive = isLeft ? PerspectiveActiveState.left : PerspectiveActiveState.right;

                                    if (currentActivePerspective)
                                        currentActivePerspective.isActive = PerspectiveActiveState.unactive;

                                    setAllIds(allIdsToEdit);
                                    setActivePerspective(newPerspective);

                                } else {
                                    setStates({ action: bStateArrayActionEnum.changeOne, index: i, newState: ButtonState.unactive });
                                }
                            });
                    }
                }}
                extraClassName="btn-dropdown" />
        );
    }
    return buttons;
}


