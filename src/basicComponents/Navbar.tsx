/**
 * @fileoverview This file creates a NavBar. A menu at the top of the page to use as toolbar that can hold any other react item, generaly buttons and dropdowns.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Packages
import React from "react";
//Local files
import '../style/Navbar.css';

interface NavbarProps {
    //Components aligned to the left of the navBar
    leftAlignedItems?: React.ReactNode[];
    //Components aligned to the middle of the navBar
    midAlignedItems?: React.ReactNode[];
    //Components aligned to the right of the navBar
    rightAlignedItems?: React.ReactNode[];
}

/**
 * Navbar that holds diferents react components at the top of the webpage in the form of a toolbar
 */
export const Navbar = ({
    leftAlignedItems = [],
    midAlignedItems = [],
    rightAlignedItems = [],
}: NavbarProps) => {

    return (
        <div className="navbar">
            <div className="col-4"
                style={{
                    flexDirection: "row",
                    display: "flex"
                }}
            >
                {leftAlignedItems.map((item: React.ReactNode, index: number): JSX.Element => {
                    return (<React.Fragment key={index}>{item}</React.Fragment>);
                })}
            </div>
            <div className="col-4 align-center"
                style={{ display: "contents" }}
            >
                {midAlignedItems.map((item: React.ReactNode, index: number): JSX.Element => {
                    return (<React.Fragment key={index}>{item}</React.Fragment>);
                })}
            </div>
            <div className="col-4"
                style={{
                    flexDirection: "row-reverse",
                    display: "flex"
                }}
            >
                {rightAlignedItems.map((item: React.ReactNode, index: number): JSX.Element => {
                    return (<React.Fragment key={index}>{item}</React.Fragment>);
                })}
            </div>
        </div>
    );
};