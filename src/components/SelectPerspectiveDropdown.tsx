/**
 * @fileoverview This file creates a dropdown that activates/disactivate diferent perspectives from the visualization.
 * If a dropdown item is disabled, it means that perspective ownership is not in this dropdown and cant be edited.
 * 
 * - If an active item/button is clicked, its state will change to unactive and its visualization will be removed.
 * - If an unactive item/button is clicked, its state will change to loading while waiting for its data request. When
 * the request ends, if the data was correctly loaded, the old active perspective will be replaced with this new one.
 * otherwhise, the loading item will swap its state to inactive again.
 * - If a disabled item/button is clicked, as previously explained, will do nothing.
 * 
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { EButtonState } from "../constants/viewOptions"
import { bStateArrayReducer, EbuttonStateArrayAction, IbStateArrayAction } from "../constants/auxTypes";
//Packages
import React, { useEffect, useReducer, useState } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import RequestManager from "../managers/requestManager";
import { PerspectiveActiveState, IPerspectiveData, PerspectiveId } from "../constants/perspectivesTypes";
import { DropMenu, EDropMenuDirection } from "../basicComponents/DropMenu";
import { CTranslation, ITranslation } from "../managers/CTranslation";

interface SelectPerspectiveProps {
    //tittle of the dropdown.
    tittle: string;
    //Set all active perspectives for dropdown items visualization.
    setAllIds: Function;
    //Set the current active perspective of this side of the app.
    setActivePerspective: Function;
    //Object that contains the name of all perspectives availables.
    allIds: PerspectiveId[];
    //Id of the perspective active in this dropdown.
    isLeftDropdown: boolean,

    requestMan: RequestManager,
    translation: ITranslation | undefined;

    insideHamburger?: boolean,
}



/**
 * Dropdown component that holds the options to add/hide perspectives to the application.
 */
export const SelectPerspectiveDropdown = ({
    tittle,
    setAllIds,
    setActivePerspective,
    allIds,
    isLeftDropdown,
    requestMan,
    translation,
    insideHamburger = false,
}: SelectPerspectiveProps) => {

    const [states, setStates] = useReducer(bStateArrayReducer, []);
    const [mainBtnText, setMainBtnText] = useState<string>(tittle);


    /*Init all dropdown items to unactive except the active perspectives that will be active or disabled depending on
    their position and what position does this dropdown owns. */
    useEffect(() => {
        if (allIds !== undefined) {
            setStates({ action: EbuttonStateArrayAction.reset, index: allIds.length, newState: EButtonState.unactive });

            let hasPerspective = false;
            for (let i = 0; i < allIds.length; i++) {
                if (allIds[i].isActive !== PerspectiveActiveState.unactive) {

                    if (allIds[i].isActive === PerspectiveActiveState.left) {
                        if (isLeftDropdown) {
                            hasPerspective = true;
                            setMainBtnText(allIds[i].name);
                            setStates({ action: EbuttonStateArrayAction.changeOne, index: i, newState: EButtonState.active });
                        } else {
                            setStates({ action: EbuttonStateArrayAction.changeOne, index: i, newState: EButtonState.disabled });
                        }
                    } else if (allIds[i].isActive === PerspectiveActiveState.right) {
                        if (!isLeftDropdown) {
                            hasPerspective = true;
                            setMainBtnText(allIds[i].name);
                            setStates({ action: EbuttonStateArrayAction.changeOne, index: i, newState: EButtonState.active });
                        } else {
                            setStates({ action: EbuttonStateArrayAction.changeOne, index: i, newState: EButtonState.disabled });
                        }
                    }
                }
            }

            if (!hasPerspective) {
                setMainBtnText(tittle);
            }
        }
    }, [allIds, isLeftDropdown, tittle]);

    if (allIds === undefined || allIds.length === 0 || states.length === 0) {
        return (
            <DropMenu
                items={[]}
                content={translation?.toolbar.selectPerspective.noPerspectiveName}
                extraClassButton="transparent maximum-width"
                postIcon={<div className="down-arrow" />}
                hoverText="No available perspectives"
            />
        );
    }

    const perspectivesButtons: React.ReactNode[] = getButtons(allIds, states, setStates, setAllIds, setActivePerspective,
        isLeftDropdown, requestMan, translation);

    if (!insideHamburger) {
        return (
            <DropMenu
                items={perspectivesButtons}
                content={
                    <div className="btn-select-perspective">
                        {mainBtnText}
                    </div>}
                extraClassButton="primary blinkSizeAnim maximum-width"
                hoverText={mainBtnText}
                menuDirection={EDropMenuDirection.down}
                postIcon={<div className="down-arrow" />}
            />
        );
    } else {
        let hamburgerBtnStyle: React.CSSProperties = {};
        hamburgerBtnStyle.maxWidth = "10vw";

        return (
            <DropMenu
                items={perspectivesButtons}
                content={
                    <div style={hamburgerBtnStyle} className="btn-select-perspective">
                        {mainBtnText}
                    </div>}
                extraClassButton="primary maximum-width blinkSizeAnim btn-dropdown"
                hoverText={mainBtnText}
                menuDirection={EDropMenuDirection.right}
                postIcon={<div className="down-arrow" />}
            />
        );
    }
};

/**
 * Return all buttons/react components of the select perspective dropdown.
 * @param allIds array with all the ids and names of all available perspectives.
 * @param states current state of all buttons.
 * @param setStates function to set the state of all buttons.
 * @param setAllIds function to set the allIds state in the app.js component.
 * @param setActivePerspective function to set the active perspective owned by this dropdown.
 * @param isLeft boolean that helps to know what position does this dropdown owns.
 * @param requestMan
 * @returns returns an array of react components
 */
function getButtons(allIds: PerspectiveId[], states: EButtonState[], setStates: React.Dispatch<IbStateArrayAction>,
    setAllIds: Function, setActivePerspective: Function, isLeft: boolean, requestMan: RequestManager, translation: ITranslation | undefined): React.ReactNode[] {

    const maxButtonNameLength = 85;
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
        const state: EButtonState = states[i];

        buttons.push(
            <Button
                key={allIdsToEdit[i].id}
                hoverText={allIdsToEdit[i].name}
                content={allIdsToEdit[i].name.substring(0, maxButtonNameLength)}
                state={state}
                onClick={() => {
                    if (state === EButtonState.active) {

                        //Turn this perspective unactive and remove it from visualization.
                        allIdsToEdit[i].isActive = PerspectiveActiveState.unactive;
                        setAllIds(allIdsToEdit);
                        setActivePerspective(undefined);

                    } else if (state === EButtonState.unactive) {

                        //Request the unactive perspective
                        setStates({ action: EbuttonStateArrayAction.changeOne, index: i, newState: EButtonState.loading });

                        requestMan.requestPerspectiveFIle(allIdsToEdit[i].id, allIdsToEdit[i].name,
                            /**
                             * Callback executed when the request and validation of the network data is finished.
                             * Update perspective states and data based on the data received.
                             * @param newPerspective requested perspective's data
                             */
                            (newPerspective: IPerspectiveData) => {

                                if (newPerspective) {
                                    allIdsToEdit[i].isActive = isLeft ? PerspectiveActiveState.left : PerspectiveActiveState.right;

                                    if (currentActivePerspective)
                                        currentActivePerspective.isActive = PerspectiveActiveState.unactive;

                                    setAllIds(allIdsToEdit);
                                    setActivePerspective(newPerspective);

                                } else {
                                    setStates({ action: EbuttonStateArrayAction.changeOne, index: i, newState: EButtonState.unactive });
                                }
                            });
                    }
                }}
                extraClassName="btn-dropdown" />
        );
    }
    return buttons;
}


