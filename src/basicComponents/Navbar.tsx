/**
 * @fileoverview This file creates a NavBar. A menu at the top of the page to use as a toolbar that can hold any other 
 * react component, generaly buttons and dropdowns. Even if the user scrolls, this component will always be at the top.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Packages
import React from "react";

const navBarContainer: React.CSSProperties = {
    backgroundColor: "rgb(248, 249, 250)",

    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",

    position: "fixed",
    top: "0",

    height: "4rem",
    width: "100%",
    zIndex: "100",


    display: "inline-flex",
    flexWrap: "nowrap",
    boxSizing: "border-box"
}

const colStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center"
}

export enum EScreenSize {
    normal,
    small,
    smallest,
}

interface NavbarProps {
    /**
     * Components aligned to the left of the navBar.
     */
    leftAlignedItems?: React.ReactNode[];
    /**
     * Components aligned to the middle of the navBar.
     */
    midAlignedItems?: React.ReactNode[];
    /**
     * Components aligned to the right of the navBar.
     */
    rightAlignedItems?: React.ReactNode[];

    screenSize: EScreenSize;
}

/**
 * Navbar that holds diferents react components at the top of the webpage.
 */
export const Navbar = ({
    leftAlignedItems = [],
    midAlignedItems = [],
    rightAlignedItems = [],
    screenSize = EScreenSize.normal
}: NavbarProps) => {

    return (
        <div style={navBarContainer}>
            <div style={getColStyle(0, screenSize)}>
                {leftAlignedItems.map((item: React.ReactNode, index: number): JSX.Element => {
                    return (<React.Fragment key={index}>{item}</React.Fragment>);
                })}
            </div>
            <div style={getColStyle(1, screenSize)}>
                {midAlignedItems.map((item: React.ReactNode, index: number): JSX.Element => {
                    return (<React.Fragment key={index}>{item}</React.Fragment>);
                })}
            </div>
            <div style={getColStyle(2, screenSize)}>
                {rightAlignedItems.map((item: React.ReactNode, index: number): JSX.Element => {
                    return (<React.Fragment key={index}>{item}</React.Fragment>);
                })}
            </div>
        </div>
    );
};

const showDebugColor = false;
function getColStyle(i: number, screenSize: EScreenSize) {

    const newStyle: React.CSSProperties = JSON.parse(JSON.stringify(colStyle));

    switch (i) {
        case 0: {
            if (showDebugColor) newStyle.backgroundColor = "rgba(255, 0, 0, 0.25)";
            switch (screenSize) {
                case EScreenSize.normal:
                    newStyle.width = "25vw";
                    break;
                default: {
                    newStyle.width = "10vw";
                }
            }

            break;
        }
        case 1: {
            if (showDebugColor) newStyle.backgroundColor = "rgba(255, 255, 0, 0.25)";
            switch (screenSize) {
                case EScreenSize.normal:
                    newStyle.width = "50vw";
                    break;
                case EScreenSize.small:
                    newStyle.width = "70vw";
                    break;
                case EScreenSize.smallest:
                    newStyle.width = "10vw";
            }
            newStyle.justifyContent = "center"
            break;
        }
        case 2: {
            if (showDebugColor) newStyle.backgroundColor = "rgba(255, 0, 255, 0.25)";
            switch (screenSize) {
                case EScreenSize.normal:
                    newStyle.width = "25vw";
                    break;
                case EScreenSize.small:
                    newStyle.width = "25vw";
                    break;
                case EScreenSize.smallest:
                    newStyle.width = "80vw";
            }

            break;
        }
    }

    return newStyle
}