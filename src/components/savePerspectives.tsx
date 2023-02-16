/**
 * @fileoverview This file creates a button that can be clicked and will execute the onClick function prop.
 * The button can also be disabled to negate any interaction with it, or change its colors with the state : ButtonState
 * property.
 * If auto toggle parameter is true, the button will automaticaly change its state between active and 
 * unactive when clicked.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */

//Packages
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../basicComponents/Button";
import { PerspectiveId } from "../constants/perspectivesTypes";


const darkBackgroundStyle: React.CSSProperties = {
    background: "rgba(0, 0, 0, 0.3)",

    position: "fixed",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",

    zIndex: 100,
}

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

const TittleStyle: React.CSSProperties = {
    fontSize: "2rem",
    fontWeight: "bolder",
    color: "gray"
}

interface SavePerspectivesProps {
    isActive: boolean,
    setIsActive: Function,
    allPerspectivesIds: PerspectiveId[]
}
/**
 * UI component that executes a function when clicked.
 */
export const SavePerspective = ({
    isActive,
    setIsActive,
    allPerspectivesIds,
}: SavePerspectivesProps) => {


    const perspectiveRows = getPerspectivesInARow(allPerspectivesIds);
    return (
        <div style={darkBackgroundStyle} className={isActive ? "toVisibleAnim" : "toHiddenAnim"}>
            <div style={innerPanelStyle}>
                {/*Row with the buttons to exit the application and the tittle of this application*/}
                <div key={0} style={topButtonsStyle}>
                    <span />
                    <h3 key={1} style={TittleStyle}>
                        Save Perspectives
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
                            <input type="checkbox" id="SelectAll-cb" style={{ scale: "2" }}></input>
                            <label style={{ marginLeft: "5px" }} htmlFor="SelectAll-cb"> Toggle All</label>
                        </div>
                        <div style={{ margin: "10px 5px" }}>
                            <Button
                                content="Download perspectives"
                                extraClassName="primary"
                            />
                        </div>
                    </div>
                    {/*Panel with all perspectives to pick from*/}
                    <div style={{ border: "1px solid black", marginTop: "1%" }}>
                        {perspectiveRows}
                    </div>
                </div>
            </div>
        </div >
    );
};


function getPerspectivesInARow(allPerspectivesIds: PerspectiveId[]): React.ReactNode[] {
    const rows: React.ReactNode[] = [];

    for (let i = 0; i < allPerspectivesIds.length; i++) {
        let newRow =
            <div style={{ display: "flex", height: "1.5rem", alignItems: "center" }}>
                <input type="checkbox" id={`${allPerspectivesIds[i].id}-cb`} style={{ scale: "1.5" }}></input>
                <label style={{ marginLeft: "5px" }} htmlFor={`${allPerspectivesIds[i].id}-cb`}> {allPerspectivesIds[i].name}</label>
            </div>;

        rows.push(newRow);
    }

    return [rows];
}