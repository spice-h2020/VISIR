/**
 * @fileoverview This file creates a NavBar. A menu at the top of the page to use as a toolbar that can hold any other 
 * react component, generaly buttons and dropdowns. Even if the user scrolls, this component will always be at the top.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Packages
import React from "react";

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
}

/**
 * Navbar that holds diferents react components at the top of the webpage.
 */
export const Navbar = ({
    leftAlignedItems = [],
    midAlignedItems = [],
    rightAlignedItems = []
}: NavbarProps) => {

    return (
        <div className="navbar-container">
            <div className="navBar-column">
                {leftAlignedItems.map((item: React.ReactNode, index: number): JSX.Element => {
                    return (<React.Fragment key={index}>{item}</React.Fragment>);
                })}
            </div>
            <div className="navBar-column" style={{ justifyContent: "center" }}>
                {midAlignedItems.map((item: React.ReactNode, index: number): JSX.Element => {
                    return (<React.Fragment key={index}>{item}</React.Fragment>);
                })}
            </div>
            <div className="navBar-column">
                {rightAlignedItems.map((item: React.ReactNode, index: number): JSX.Element => {
                    return (<React.Fragment key={index}>{item}</React.Fragment>);
                })}
            </div>
        </div>
    );
};
