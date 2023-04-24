/**
 * @fileoverview This file creates a panel with the list of available perspectives.
 * - The user can pick whatever perspectives they want to process them.
 * - Once some perspectives has been selected, the user can download all of them to save them for later use.
 * 
 * - There is a checkbox/toggle to easily select all perspectives or deselect all
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { PerspectiveId } from "../constants/perspectivesTypes";
import { EButtonState, EFileSource } from "../constants/viewOptions";
//Packages
import React, { useState } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { ITranslation } from "../managers/CTranslation";
import RequestManager from "../managers/requestManager";

const innerPanelStyle: React.CSSProperties = {
    width: "90vw",
    height: "90vh",

    //Center the panel in the view screen
    position: "fixed",
    top: "50%",
    left: "50%",
    marginTop: "-45vh",
    marginLeft: "-45vw",

    background: "var(--bodyBackground)",
    borderRadius: "15px",

    overflowY: "auto",
    border: "2px solid var(--primaryButtonColor)",
    borderLeft: "10px solid var(--primaryButtonColor)"
};

const topButtonsStyle: React.CSSProperties = {
    marginTop: "10px",
    height: "5vh",

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
}

interface SavePerspectivesProps {
    isActive: boolean,
    setIsActive: Function,
    allPerspectivesIds: PerspectiveId[],
    updateFileSource: (fileSource: EFileSource,
        changeItemState?: Function, apiURL?: string, apiUser?: string, apiPass?: string) => void;
    requestManager: RequestManager,
    translation: ITranslation | undefined,
}
/**
 * UI component that executes a function when clicked.
 */
export const SavePerspectives = ({
    isActive,
    setIsActive,
    allPerspectivesIds,
    updateFileSource,
    requestManager,
    translation
}: SavePerspectivesProps) => {

    const [states, setStates] = useState<Map<string, boolean>>(init(allPerspectivesIds));
    const [allToggle, setAllToggle] = useState<boolean>(false);

    const perspectiveRows = getPerspectivesInARow(allPerspectivesIds, states, setStates);
    return (
        <div className={isActive ? "toVisibleAnim dark-background" : "toHiddenAnim dark-background"}>
            <div style={innerPanelStyle}>
                {/*Row with the buttons to exit the application and the tittle of this application*/}
                <div key={0} style={topButtonsStyle}>
                    <span />
                    <h3 key={1} className="save-perspectives-tittle">
                        {translation?.savePerspectives.tittle}
                    </h3>
                    <span key={2} style={{ marginRight: "10px" }}>
                        <Button
                            key={1}
                            content=""
                            extraClassName="dark btn-close"
                            onClick={() => { setIsActive(false); }}
                            postIcon={<div className="icon-close"></div>}
                        />
                    </span>
                </div>
                <div style={{ margin: "10px 2% 0px 2%" }}>
                    {/*Row with a checkbox to auto toggle all, and the button to download all selected perspectives*/}
                    <div style={{
                        border: "1px solid black",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0px 2%"
                    }}>
                        <div>
                            <input type="checkbox" id="SelectAll-cb" style={{ scale: "2" }} checked={allToggle}
                                onChange={() => { }}
                                onClick={() => {
                                    const newMap: Map<string, boolean> = new Map<string, boolean>();

                                    for (let i = 0; i < allPerspectivesIds.length; i++) {
                                        newMap.set(allPerspectivesIds[i].id, !allToggle);
                                    }

                                    setStates(newMap);
                                    setAllToggle(!allToggle);
                                }}
                            />
                            <label style={{ marginLeft: "5px" }} htmlFor="SelectAll-cb"> {translation?.savePerspectives.toggleLabel}</label>
                        </div>
                        <div style={{ margin: "10px 5px" }}>
                            <Button
                                content={translation?.savePerspectives.deleteBtn}
                                extraClassName="dark"
                                onClick={() => {
                                    if (window.confirm(translation?.savePerspectives.areUSure)) {
                                        for (let i = 0; i < allPerspectivesIds.length; i++) {
                                            if (states.get(allPerspectivesIds[i].id)) {
                                                requestManager.deletePerspective(allPerspectivesIds[i].id);
                                            }
                                        }

                                        const updateFiles = () => {
                                            if (requestManager.usingAPI) {
                                                updateFileSource(EFileSource.Api, () => { }, requestManager.axios.defaults.baseURL,
                                                    requestManager.apiUsername, requestManager.apiPassword)
                                            } else {
                                                updateFileSource(EFileSource.Local)
                                            }
                                        }
                                        //Neccesary delay to give the CM a minimum time to remove the perspectives
                                        setTimeout(updateFiles, 150);

                                        setIsActive(false);
                                    }
                                }}
                            />
                        </div>
                        <div style={{ margin: "10px 5px" }}>
                            <Button
                                content={translation?.savePerspectives.downloadBtn}
                                extraClassName="primary"
                                onClick={() => {

                                    for (let i = 0; i < allPerspectivesIds.length; i++) {
                                        if (states.get(allPerspectivesIds[i].id)) {
                                            requestManager.requestPerspectiveConfig(allPerspectivesIds[i], () => { });
                                        }
                                    }

                                    setIsActive(false);
                                }}
                            />
                        </div>
                    </div>
                    {/*Panel with all perspectives to pick from*/}
                    {/* <div style={{ border: "1px solid black", marginTop: "1%", maxHeight: "65vh", overflow: "auto" }}>
                        {perspectiveRows}
                    </div> */}
                    <div style={{
                        border: "1px solid black", marginTop: "1%", maxHeight: "65vh", overflow: "auto",
                        display: "flex", flexDirection: "column"
                    }}>
                        {perspectiveRows}
                    </div>
                </div>
            </div>
        </div >
    );
};


function getPerspectivesInARow(allPerspectivesIds: PerspectiveId[], states: Map<string, boolean>, setStates: Function): React.ReactNode[] {
    const rows: React.ReactNode[] = [];

    for (let i = 0; i < allPerspectivesIds.length; i++) {
        let btnRow =
            <Button
                key={i}
                content={`${allPerspectivesIds[i].name}`}
                state={states.get(allPerspectivesIds[i].id) ? EButtonState.active : EButtonState.unactive}
                extraClassName="btn-dropdown"
                onClick={() => {
                    let newMap = new Map<string, boolean>(states);

                    newMap.set(allPerspectivesIds[i].id, states.get(allPerspectivesIds[i].id) ? false : true);
                    setStates(newMap);
                }}
            />

        rows.push(btnRow);
    }

    return [rows];
}

function init(allPerspectivesIds: PerspectiveId[]) {

    const initialState: Map<string, boolean> = new Map<string, boolean>();

    for (let i = 0; i < allPerspectivesIds.length; i++) {
        initialState.set(allPerspectivesIds[i].id, false);
    }

    return initialState;
}