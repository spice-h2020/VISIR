/**
 * @fileoverview This file creates a button that when activated, shows an extra menu. 
 * The main button can be activated by click or by hovering.
 * The extra menu can be hidden if the user clicks outside the extra menu or by clicking the main button.
 * The behaviour will depend on the properties
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { EButtonState } from '../constants/viewOptions';
//Packages
import React, { useState, useEffect } from "react";
//Local files
import { Button } from "./Button";

export enum EDropMenuDirection {
    right,
    down,
    left,
    up
}

const dropdownStyle: React.CSSProperties = {
    float: "left",
    overflow: "hidden",
    width: "100%",
    textAlign: "center"
}


const contentStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: "10",
    padding: "0.5rem 0.3rem",

    boxShadow: "0px 0.5rem 1.5rem 0px rgba(0, 0, 0, 0.2)",
    backgroundColor: "white",

    backgroundClip: "padding-box",
    border: "2px solid rgba(0, 0, 0, 0.15)",
    borderRadius: "0.25rem",

    maxHeight: "80vh",
    overflowY: "auto",
}

interface DropMenuProps {
    /**
     * Items inside the dropdown.
     */
    items: React.ReactNode[];
    /**
     * Content of the main dropdown button.
     */
    content: React.ReactNode;
    /**
     * Text that will be shown when hovering the main button of the dropdown
     */
    hoverText?: string;
    /**
     * Extra class to add to the main button.
     */
    extraClassButton?: string;
    /**
     * Extra class to add to the drop menu container.
     */
    extraClassContainer?: string;
    /**
     * Active close dropdown when outside click functionality.
     */
    closeWhenOutsideClick?: boolean;
    /**
     * State of the main button of the dropdown. Used to edit the state of the main button of the dropdown. If undefined,
     * the state will be equal to the shown state of the extra menu.
     */
    state?: EButtonState;
    /**
     * Drop direction of the extra menu.
     */
    menuDirection?: EDropMenuDirection;
    /**
     * When the main button is clicked, the extra menu will be shown regardless of the mousepointer location
     */
    buttonFixatesState?: boolean;
    /**
     * When the main button is hovered, the extra menu will be shown. If the hover ends, the menu will be closed.
     * buttonFixatesState has priority over this. If the main button is clicked, this property will be ignored.
     */
    hoverChangesState?: boolean;
    /**
     * Icon added to the end of the btn that toggles the dropdown
     */
    postIcon?: React.ReactNode;
}

export const DropMenu = ({
    items = [],
    content = "Dropdown",
    hoverText = "",
    extraClassButton = "down-arrow",
    extraClassContainer = "",
    closeWhenOutsideClick = true,
    state = undefined,
    menuDirection = EDropMenuDirection.down,
    buttonFixatesState = true,
    hoverChangesState = false,
    postIcon,

}: DropMenuProps) => {

    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    /**
     * If true, hover wont change the state of the extra menu
     */
    const [isShowFixated, setIsShowFixated] = useState<boolean>(false);

    //Close the dropdown when u click outside of it.
    const containerRef = React.useRef<HTMLDivElement>(null);
    useOutsideClick(showDropDown, containerRef, () => {
        setShowDropDown(false);
        setIsShowFixated(false);
    }, closeWhenOutsideClick);

    const onHover = (isHoverIn: boolean) => {
        if (hoverChangesState) {
            if (!isShowFixated) {
                setShowDropDown(isHoverIn);
            }
        }
    }

    if (items.length !== 0) {
        const mainButtonState = state === undefined ?
            showDropDown ? EButtonState.active : EButtonState.unactive
            : state;

        let mainBtn: React.ReactNode =
            <React.Fragment>
                <Button
                    key={-1}
                    content={content}
                    state={mainButtonState}
                    extraClassName={extraClassButton}
                    hoverText={hoverText}
                    postIcon={postIcon}
                    onClick={() => {
                        if (buttonFixatesState) {
                            if (showDropDown) {
                                if (isShowFixated) {
                                    setShowDropDown(false);
                                    setIsShowFixated(false);
                                } else {
                                    setShowDropDown(true);
                                    setIsShowFixated(true);
                                }
                            } else {
                                setShowDropDown(true);
                                setIsShowFixated(true);
                            }
                        }
                    }}
                />

                {<div key={0} style={getExtraMenuStyle(showDropDown, containerRef, menuDirection)}
                    onMouseEnter={() => { onHover(true) }} onMouseLeave={() => { onHover(false) }}
                >
                    {items}
                </div>}
            </React.Fragment>

        //Place the dropright content at the same height as the btn that activates it
        switch (menuDirection) {
            case EDropMenuDirection.right:
                mainBtn =
                    <div key={-2} className='row' onMouseEnter={() => { onHover(true) }} onMouseLeave={() => { onHover(false) }}>
                        {mainBtn}
                    </div>
                break;
            default: {
                break;
            }
        }

        return (
            <div key={-3} style={getMainMenuStyle(menuDirection)} className={extraClassContainer} ref={containerRef}>
                {mainBtn}
            </div>
        )


    } else {
        return (
            <div key={-5} style={getMainMenuStyle(menuDirection)}
                className={extraClassContainer}
                ref={containerRef}
            >
                <Button
                    key={-4}
                    content={content}
                    state={EButtonState.disabled}
                    extraClassName={extraClassButton}
                    postIcon={postIcon}
                />
            </div >
        );
    }
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


const getMainMenuStyle = (menuDirection: EDropMenuDirection) => {
    let newStyle: React.CSSProperties = (JSON.parse(JSON.stringify(dropdownStyle)));

    return newStyle;
}

function getExtraMenuStyle(currentState: Boolean, ref: React.RefObject<HTMLDivElement>,
    menuDirection: EDropMenuDirection): React.CSSProperties {
    let newStyle: React.CSSProperties = (JSON.parse(JSON.stringify(contentStyle)));

    if (currentState) {
        newStyle.display = "flex";
        newStyle.flexDirection = "column"
    } else {
        newStyle.display = "none";
    }

    switch (menuDirection) {
        case EDropMenuDirection.right:
            {
                newStyle.marginTop = "-0.5rem";
                newStyle.marginLeft = `${ref.current?.clientWidth}px`;
                break;
            }
    }

    return newStyle;
}



