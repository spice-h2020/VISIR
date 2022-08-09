import React from "react";

import '../style/Navbar.css';

interface NavbarProps {
    /**
     * Components that will be aligned to the leftside of the navbar.
     */
    leftAlignedItems?: React.ReactNode[];
    /**
     * Components that will be aligned to the middle of the navbar.
     */
    midAlignedItems?: React.ReactNode[];
    /**
    * Components that will be aligned to the rightside of the navbar.
    */
    rightAlignedItems?: React.ReactNode[];
}

/**
 * Dropdown component
 */
export const Navbar = ({
    leftAlignedItems = [],
    midAlignedItems = [],
    rightAlignedItems = [],
}: NavbarProps) => {

    return (
        <div className="navbar">
            <div
                className="col-4"
                style={{
                    flexDirection: "row",
                    display: "flex"
                }}
            >
                {leftAlignedItems.map((item: React.ReactNode, index: number): JSX.Element => {
                    return (<React.Fragment key={index}>{item}</React.Fragment>);
                })}
            </div>
            <div
                className="col-4 align-center"
                style={{ display: "contents" }}
            >
                {midAlignedItems.map((item: React.ReactNode, index: number): JSX.Element => {
                    return (<React.Fragment key={index}>{item}</React.Fragment>);
                })}
            </div>
            <div
                className="col-4"
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