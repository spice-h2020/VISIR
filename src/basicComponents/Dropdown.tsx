/**
 * @fileoverview This file creates a dropdown menu. A main button button that can be clicked and will show additional 
 * items to interact with. All additional items will be hidden if the user clicks outside the menu or the main button.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { EButtonState } from '../constants/viewOptions';
//Packages
import React, { useState, useEffect } from "react";
//Local files
import { Button } from "./Button";

const dropdownStyle: React.CSSProperties = {
    float: "left",
    overflow: "hidden",
    marginLeft: "10px",
    marginRight: "10px",
}

const contentStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: "10",
    padding: "0.5rem 0",

    minWidth: "160px",
    boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
    backgroundColor: "white",

    backgroundClip: "padding-box",
    border: "2px solid rgba(0, 0, 0, 0.15)",
    borderRadius: "0.25rem",

    maxHeight: "80vh",
    overflowY: "auto",
}

interface DropdownProps {
    /**
     * Items inside the dropdown.
     */
    items?: React.ReactNode[];
    /**
     * Content of the main dropdown button.
     */
    content?: React.ReactNode;
    /**
     * Active close dropdown when outside click functionality.
     */
    closeWhenOutsideClick?: boolean;
    /**
     * Extra class name to add to the dropdown button.
     */
    extraClassButton?: string;
    /**
     * 
     */
    hoverText?: string;
    /**
     * 
     */
    maxWidth?: string;
}

/**
 * Group of elements creating a Dropdown Menu that toggle items visibility when the main button is clicked. 
 * The items are closed if u click outside the dropdown or if u click the button again. 
 */
export const Dropdown = ({
    items = [],
    content = "Dropdown",
    extraClassButton = "down-arrow",
    closeWhenOutsideClick = true,
    hoverText = "",
}: DropdownProps) => {

    const [showDropDown, setShowDropDown] = useState<boolean>(false);

    //Close the dropdown when u click outside of it.
    const ref = React.useRef<HTMLDivElement>(null);
    useOutsideClick(showDropDown, ref, () => {
        setShowDropDown(false);
    }, closeWhenOutsideClick);

    if (items.length !== 0)
        return (
            <div style={dropdownStyle}
                ref={ref}
            >
                <Button
                    key={-1}
                    content={content}
                    state={showDropDown ? EButtonState.active : EButtonState.unactive}
                    onClick={() => {
                        setShowDropDown(!showDropDown);
                    }}
                    extraClassName={extraClassButton}
                    hoverText={hoverText}
                />
                <div style={getContentStyle(showDropDown)}>
                    {items}
                </div>
            </div >
        );
    else
        return (
            <div style={dropdownStyle}
                ref={ref}
            >
                <Button
                    content={content}
                    state={EButtonState.disabled}
                    extraClassName={extraClassButton}
                />
            </div >
        );
};


/**
 * Aux function that execute a callback function when u click outside of the ref component.
 * @param state State that will add/delete the events based on its value.
 * @param ref Reference of the html object of the component to detect a click outside it.
 * @param callback Function executed when the user clicks outside the ref component.
 */
const useOutsideClick = (state: boolean, ref: React.RefObject<HTMLDivElement>, callback: Function, closeWhenOutsideClick: boolean) => {

    useEffect(() => {
        const handleClick = (ev: Event) => {
            if (ref.current && !ref.current.contains(ev.target as Node)) {
                callback();
            }
        };

        if (closeWhenOutsideClick) {
            if (state) {
                document.addEventListener("click", handleClick);

            } else {
                document.removeEventListener("click", handleClick);
            }


            return () => {
                document.removeEventListener("click", handleClick);
            };
        }

    }, [state, closeWhenOutsideClick, ref, callback]);
};


function getContentStyle(currentState: Boolean): React.CSSProperties {
    let newStyle: React.CSSProperties = (JSON.parse(JSON.stringify(contentStyle)));

    if (currentState) {
        newStyle.display = "block";
    } else {
        newStyle.display = "none";
    }

    return newStyle;
}