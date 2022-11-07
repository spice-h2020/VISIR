/**
 * @fileoverview This file creates a NavBar. A menu at the top of the page to use as a toolbar that can hold any other 
 * react component, generaly buttons and dropdowns. Even if the user scrolls, this component will always be at the top.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Packages
import React from "react";

const navBarContainer: React.CSSProperties = {
    listStyleType: "none",
    overflow: "hidden",
    backgroundColor: "rgb(248, 249, 250)",
    boxSizing: "border-box",
    display: "flex",
    flexWrap: "wrap",
    paddingTop: "0.7rem",
    paddingBottom: "0.7rem",

    position: "fixed",
    top: "0",

    zIndex: "100",
    height: "70px",
    width: "100%",
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
}

/**
 * Navbar that holds diferents react components at the top of the webpage.
 */
export const Navbar = ({
    leftAlignedItems = [],
    midAlignedItems = [],
    rightAlignedItems = [],
}: NavbarProps) => {

    return (
        <div style={navBarContainer}>
            <div className="col-4"
                style={{ flexDirection: "row", display: "flex" }}
            >
                {leftAlignedItems.map((item: React.ReactNode, index: number): JSX.Element => {
                    return (<React.Fragment key={index}>{item}</React.Fragment>);
                })}
            </div>
            <div className="col-4"
                style={{ display: "contents" }}
            >
                {midAlignedItems.map((item: React.ReactNode, index: number): JSX.Element => {
                    return (<React.Fragment key={index}>{item}</React.Fragment>);
                })}
            </div>
            <div className="col-4"
                style={{ flexDirection: "row-reverse", display: "flex" }}
            >
                {rightAlignedItems.map((item: React.ReactNode, index: number): JSX.Element => {
                    return (<React.Fragment key={index}>{item}</React.Fragment>);
                })}
            </div>
        </div>
    );
};